// seq_model.js — sequence data for kbSequencer (build step 2).
// Pure data + (de)serialisation. No Max/Live globals, so it can be tested
// outside Max. ES5 so it runs in [js] and [v8]. Loaded with require("seq_model").

var STEPS_PER_PAGE = 32;
var PAGES = 16;
var NUM_STEPS = STEPS_PER_PAGE * PAGES; // 512 per lane
var KICK = 0, BASS = 1;
var LANE_NAMES = ["kick", "bass"];
var CC_SLOTS = 8;

// Units: 24 ticks per step (one 1/16). Length and microtime use ticks.
var TICKS_PER_STEP = 24;

var CONDITIONS = ["always", "1st", "!1st", "pre", "!pre",
	"1:2", "2:2", "1:3", "2:3", "3:3", "1:4", "2:4", "3:4", "4:4",
	"1:8", "2:8", "3:8", "4:8", "5:8", "6:8", "7:8", "8:8"];
// ---- retrig (ported from retrig-m4l, see its REQUIREMENTS.md) ----
// RATE: time between repeats, 1/N of a whole note (17 values, Elektron list).
var RETRIG_RATES = ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/8", "1/10", "1/12",
	"1/16", "1/20", "1/24", "1/32", "1/40", "1/48", "1/64", "1/80"];
var RETRIG_DIV = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80];
function rateSteps(idx) { return 16 / RETRIG_DIV[idx]; } // interval in 1/16 steps
// LEN: burst length in steps. 0.125–2 by 1/16 step, then by 0.125 to 4,
// 0.25 to 8, 0.5 to 16, 1 to 32, 2 to 64, 4 to 128, then INF (last entry).
var RETRIG_LENS = (function () {
	var out = [], v;
	for (v = 0.125; v <= 2 + 1e-9; v += 0.0625) out.push(Math.round(v * 10000) / 10000);
	var runs = [[0.125, 4], [0.25, 8], [0.5, 16], [1, 32], [2, 64], [4, 128]];
	for (var r = 0; r < runs.length; r++)
		for (v = out[out.length - 1] + runs[r][0]; v <= runs[r][1] + 1e-9; v += runs[r][0]) out.push(Math.round(v * 10000) / 10000);
	out.push(Infinity);
	return out;
})();
var LEN_NOTES = { 0.25: "1/64", 0.5: "1/32", 1: "1/16", 2: "1/8", 4: "1/4", 8: "1/2", 16: "1/1" };
var RETRIG_LEN_LABELS = RETRIG_LENS.map(function (v) {
	if (v === Infinity) return "INF";
	if (LEN_NOTES[v]) return LEN_NOTES[v];
	var d = v >= 100 ? 0 : v >= 10 ? 1 : v >= 1 ? 2 : 3; // 3 significant digits
	return String(Math.round(v * Math.pow(10, d) + 1e-9) / Math.pow(10, d));
});
var RETRIG_PMODES = ["Repeats", "Burst", "Note"];
var RETRIG_VOICES = ["Mono", "2", "3", "4", "5", "6", "7", "8"];
var RETRIG_HIT_CAP = 256; // with TRATE on and a finite LEN (as retrig-m4l)
var RETRIG_LOOKBACK = 256; // steps searched back for bursts still running

// Lockable step parameters. The id (array index) is the save format:
// APPEND ONLY, never reorder or remove.
// def: lane default used when a step has no lock. -1 on a CC = send nothing.
// lanes: which lanes the parameter applies to.
var PARAMS = [
	{ key: "velocity",    min: 0,   max: 127, def: 100, lanes: [1, 1] },
	// Legacy gate length in ticks (save format v1). Replaced by "length" below;
	// decode converts v1 locks and defaults. Not shown or played.
	{ key: "gateTicks",   min: 1,   max: TICKS_PER_STEP * 16, def: 12, lanes: [1, 1] },
	{ key: "microtime",   min: -12, max: 12,  def: 0,   lanes: [1, 1] },
	{ key: "probability", min: 0,   max: 100, def: 100, lanes: [1, 1] },
	{ key: "condition",   min: 0,   max: CONDITIONS.length - 1, def: 0, lanes: [1, 1] },
	{ key: "accent",      min: 0,   max: 1,   def: 0,   lanes: [1, 1] },
	{ key: "slide",       min: 0,   max: 1,   def: 0,   lanes: [0, 1] },
	{ key: "tie",         min: 0,   max: 1,   def: 0,   lanes: [1, 1] },
	{ key: "retrig",      min: 0,   max: 1,   def: 0,   lanes: [1, 1] },
	{ key: "retrigRate",  min: 0,   max: RETRIG_RATES.length - 1, def: 9, lanes: [1, 1] }, // 1/16
	{ key: "retrigFade",  min: -100, max: 100, def: 0,  lanes: [1, 1] },  // VFAD %
	{ key: "fill",        min: 0,   max: 1,   def: 0,   lanes: [1, 1] }
];
for (var _c = 0; _c < CC_SLOTS; _c++)
	PARAMS.push({ key: "cc" + (_c + 1), min: 0, max: 127, def: -1, lanes: [1, 1], cc: _c });

// Retrig, appended after the CC slots (ids are the save format).
PARAMS.push(
	// Length (index into RETRIG_LENS): a plain note's gate and a retrig burst's
	// length, one value (merged). Default 1/32 (half a step), as before.
	{ key: "length",       min: 0, max: RETRIG_LENS.length - 1, def: RETRIG_LENS.indexOf(0.5), lanes: [1, 1] },
	{ key: "retrigCurve",  min: 0, max: 100, def: 0,   lanes: [1, 1] },  // CRV %
	{ key: "retrigProb",   min: 0, max: 100, def: 100, lanes: [1, 1] },  // PROB %
	{ key: "retrigLock",   min: 0, max: 1,   def: 0,   lanes: [1, 1] },  // LOCK: ignore PROB
	{ key: "retrigPMode",  min: 0, max: RETRIG_PMODES.length - 1, def: 0, lanes: [1, 1] },
	{ key: "retrigTRate",  min: 0, max: RETRIG_RATES.length, def: 0, lanes: [1, 1] }, // 0 Off, else RATE idx + 1
	{ key: "retrigGlide",  min: 0, max: 512, def: 16,  lanes: [1, 1] },  // quarter steps (0–128 steps)
	{ key: "retrigVoices", min: 0, max: RETRIG_VOICES.length - 1, def: 0, lanes: [1, 1] }
);

var PARAM_ID = {};
for (var _p = 0; _p < PARAMS.length; _p++) PARAM_ID[PARAMS[_p].key] = _p;

// Device-wide settings (not lockable). Order is the save format: APPEND ONLY.
var SETTINGS = [
	{ key: "kickChannel", min: 1, max: 16,  def: 1 },
	{ key: "bassChannel", min: 1, max: 16,  def: 2 },
	{ key: "kickNote",    min: 0, max: 127, def: 36 },
	{ key: "bendRange",   min: 1, max: 48,  def: 24 },
	{ key: "scaleFollow", min: 0, max: 1,   def: 1 },
	{ key: "swing",       min: 50, max: 75, def: 50 }
];

var DEFAULT_CC = [[20, 21, 22, 23, 24, 25, 26, 27], [70, 71, 72, 73, 74, 75, 76, 77]];
var DEFAULT_BASS_NOTE = 36;

// v2: step length is an index into RETRIG_LENS (v1: gate ticks, param 1).
var MAGIC = 7101, VERSION = 2;

// Nearest LEN entry (by ratio) to a length in steps.
function nearestLen(steps) {
	var best = 0, bd = Infinity;
	for (var i = 0; i < RETRIG_LENS.length - 1; i++) {
		var d = Math.abs(Math.log(RETRIG_LENS[i]) - Math.log(Math.max(steps, 0.01)));
		if (d < bd) { bd = d; best = i; }
	}
	return best;
}

function clamp(v, lo, hi) { v = Math.round(Number(v)); if (isNaN(v)) v = lo; return v < lo ? lo : v > hi ? hi : v; }

// ---------- Model ----------
function Model() { this.clear(); }

Model.prototype.clear = function () {
	this.settings = {};
	for (var i = 0; i < SETTINGS.length; i++) this.settings[SETTINGS[i].key] = SETTINGS[i].def;
	this.loopStart = 0; // pages, inclusive
	this.loopEnd = 0;
	this.lanes = [];
	for (var l = 0; l < 2; l++) {
		var defs = [];
		for (var p = 0; p < PARAMS.length; p++) defs.push(PARAMS[p].def);
		var steps = [];
		for (var s = 0; s < NUM_STEPS; s++) steps.push(null);
		this.lanes.push({ steps: steps, defaults: defs, ccNums: DEFAULT_CC[l].slice() });
	}
	this.changed();
};

// Called on every edit; the device hooks this to schedule a save.
Model.prototype.onChange = null;
Model.prototype.changed = function () { if (this.onChange) this.onChange(); };

Model.prototype.step = function (lane, i) { return this.lanes[lane].steps[i]; };
Model.prototype.hasTrig = function (lane, i) { return this.lanes[lane].steps[i] !== null; };

// Creates a trig. Bass takes a note; kick ignores it (uses settings.kickNote).
Model.prototype.addTrig = function (lane, i, note) {
	var st = this.lanes[lane].steps[i];
	if (st) return st;
	st = { muted: false, note: lane === BASS ? clamp(note === undefined ? DEFAULT_BASS_NOTE : note, 0, 127) : -1, locks: {} };
	this.lanes[lane].steps[i] = st;
	this.changed();
	return st;
};

Model.prototype.setMuted = function (lane, i, muted) {
	var st = this.lanes[lane].steps[i];
	if (!st || st.muted === !!muted) return;
	st.muted = !!muted;
	this.changed();
};

Model.prototype.setNote = function (lane, i, note) {
	var st = this.lanes[lane].steps[i];
	if (!st || lane !== BASS) return;
	st.note = clamp(note, 0, 127);
	this.changed();
};

// Delete: wipes trig, note, flags and all p-locks.
Model.prototype.wipe = function (lane, i) {
	if (this.lanes[lane].steps[i] === null) return;
	this.lanes[lane].steps[i] = null;
	this.changed();
};

// Copy / paste. copySteps returns detached copies (null = empty step) of
// len steps from `from`; pasteSteps writes them at `at`, empty source steps
// included (a paste replaces the range exactly), stopping at the last step.
function cloneStep(st) {
	if (!st) return null;
	var locks = {};
	for (var k in st.locks) locks[k] = st.locks[k];
	return { muted: st.muted, note: st.note, locks: locks };
}
Model.prototype.copySteps = function (lane, from, len) {
	var out = [];
	for (var i = from; i < from + len && i < NUM_STEPS; i++) out.push(cloneStep(this.lanes[lane].steps[i]));
	return out;
};
Model.prototype.pasteSteps = function (lane, at, clip) {
	var steps = this.lanes[lane].steps, n = 0;
	for (var k = 0; k < clip.length && at + k < NUM_STEPS; k++) {
		if (at + k < 0) continue;
		steps[at + k] = cloneStep(clip[k]);
		n++;
	}
	if (n) this.changed();
	return n;
};

Model.prototype.setLock = function (lane, i, pid, value) {
	var st = this.lanes[lane].steps[i], P = PARAMS[pid];
	if (!st || !P || !P.lanes[lane]) return;
	st.locks[pid] = clamp(value, P.min, P.max);
	this.changed();
};

Model.prototype.clearLock = function (lane, i, pid) {
	var st = this.lanes[lane].steps[i];
	if (!st || !(pid in st.locks)) return;
	delete st.locks[pid];
	this.changed();
};

Model.prototype.isLocked = function (lane, i, pid) {
	var st = this.lanes[lane].steps[i];
	return !!st && (pid in st.locks);
};

Model.prototype.hasLocks = function (lane, i) {
	var st = this.lanes[lane].steps[i];
	if (!st) return false;
	for (var k in st.locks) return true;
	return false;
};

// Effective value: the step's lock, else the lane default.
Model.prototype.value = function (lane, i, pid) {
	var st = this.lanes[lane].steps[i];
	if (st && (pid in st.locks)) return st.locks[pid];
	return this.lanes[lane].defaults[pid];
};

Model.prototype.pageHasTrigs = function (lane, page) {
	var steps = this.lanes[lane].steps, base = page * STEPS_PER_PAGE;
	for (var i = base; i < base + STEPS_PER_PAGE; i++) if (steps[i]) return true;
	return false;
};

Model.prototype.setSetting = function (key, value) {
	for (var i = 0; i < SETTINGS.length; i++) {
		if (SETTINGS[i].key === key) {
			this.settings[key] = clamp(value, SETTINGS[i].min, SETTINGS[i].max);
			this.changed();
			return;
		}
	}
};

Model.prototype.setLoop = function (startPage, endPage) {
	var a = clamp(startPage, 0, PAGES - 1), b = clamp(endPage, 0, PAGES - 1);
	this.loopStart = Math.min(a, b);
	this.loopEnd = Math.max(a, b);
	this.changed();
};

Model.prototype.setCcNumber = function (lane, slot, cc) {
	this.lanes[lane].ccNums[clamp(slot, 0, CC_SLOTS - 1)] = clamp(cc, 0, 127);
	this.changed();
};

Model.prototype.countTrigs = function (lane) {
	var n = 0, steps = this.lanes[lane].steps;
	for (var i = 0; i < NUM_STEPS; i++) if (steps[i]) n++;
	return n;
};

// ---------- playback ----------
// absStep: 1/16 steps since song start (from Live's transport).
// Maps it into the loop range (whole pages), so the pattern stays locked to
// the song position.
Model.prototype.loopLength = function () {
	return (this.loopEnd - this.loopStart + 1) * STEPS_PER_PAGE;
};
Model.prototype.seqIndexFor = function (absStep) {
	var len = this.loopLength();
	var m = absStep % len;
	if (m < 0) m += len;
	return this.loopStart * STEPS_PER_PAGE + m;
};

// Deterministic 0..1 noise per (absStep, lane, seed): refilling the same
// step gives the same probability roll, so the lookahead can recompute freely.
function chance(absStep, lane, seed) {
	var x = Math.sin(absStep * 12.9898 + lane * 78.233 + seed * 37.719) * 43758.5453;
	return x - Math.floor(x);
}

// One lane's note at absStep, or null (no trig, muted, probability or a
// PMODE Note roll failed). Carries the step's retrig settings.
Model.prototype.noteAt = function (l, absStep, stepMs, seed) {
	var idx = this.seqIndexFor(absStep), st = this.lanes[l].steps[idx];
	if (!st || st.muted) return null;
	var self = this, v = function (key) { return self.value(l, idx, PARAM_ID[key]); };
	var prob = v("probability");
	if (prob < 100 && chance(absStep, l, seed || 0) * 100 >= prob) return null;
	var n = {
		lane: l, abs: absStep,
		pitch: l === KICK ? this.settings.kickNote : st.note,
		velocity: Math.max(1, v("velocity")),
		lenSteps: RETRIG_LENS[v("length")],
		channel: l === KICK ? this.settings.kickChannel : this.settings.bassChannel,
		retrig: v("retrig") === 1,
		voices: v("retrigVoices") + 1
	};
	if (!n.retrig) return n;
	n.rate = rateSteps(v("retrigRate"));
	n.len = n.lenSteps;
	n.fade = v("retrigFade") / 100;
	n.curve = v("retrigCurve") / 100;
	n.lock = v("retrigLock") === 1;
	n.pmode = v("retrigPMode");
	n.rprob = v("retrigProb");
	var tr = v("retrigTRate");
	n.trate = tr > 0 ? rateSteps(tr - 1) : 0;
	n.glide = v("retrigGlide") / 4;
	var pass = function (k) { return n.lock || chance(absStep * 1.0 + k * 1000.37, l + 10, seed || 0) * 100 < n.rprob; };
	if (n.pmode === 2 && !pass(-1)) return null; // Note: dropped before anything happens
	n.burstOk = n.pmode !== 1 || pass(-2);       // Burst: one roll for all repeats
	n.pass = pass;
	return n;
};

// A note's hits: [{t (steps from its start), iv (steps to the next hit), vel, play}],
// up to `until` steps for INF. Plain notes are one hit. Timing, fade, curve,
// chance and speed fade follow retrig-m4l.
function burstHits(n, until) {
	if (!n.retrig) return { hits: [{ t: 0, iv: n.lenSteps, vel: n.velocity, play: true, plain: true }], span: n.lenSteps };
	var hits = [], t = 0, finite = n.len !== Infinity;
	var cap = n.trate && finite ? RETRIG_HIT_CAP : 100000;
	var interval = function (t) {
		if (!n.trate) return n.rate;
		if (n.glide <= 0) return n.trate;
		return t < n.glide ? n.rate * Math.pow(n.trate / n.rate, t / n.glide) : n.trate;
	};
	while (hits.length < cap) {
		if (finite ? t >= n.len - 1e-9 : t >= until) break;
		var iv = interval(t);
		hits.push({ t: t, iv: iv });
		t += iv;
	}
	var last = hits.length ? hits[hits.length - 1] : null;
	var v0 = n.velocity, f = n.fade;
	var ve = v0 + Math.max(f, 0) * (127 - v0) + Math.min(f, 0) * (v0 - 1);
	for (var k = 0; k < hits.length; k++) {
		var vel = v0;
		if (finite && hits.length > 1 && last.t > 0) {
			var x = hits[k].t / last.t;
			var lin = v0 + (ve - v0) * x, ex = v0 * Math.pow(ve / v0, x);
			vel = (1 - n.curve) * lin + n.curve * ex;
		}
		hits[k].vel = Math.max(1, Math.min(127, Math.floor(vel + 0.5)));
		hits[k].play = k === 0 || (n.burstOk && (n.pmode !== 0 || n.pass(k)));
	}
	return { hits: hits, span: finite && last ? last.t + last.iv : Infinity };
}

// Abs step of the lane's next played note after `from` (for INF gates).
Model.prototype.nextNoteAbs = function (l, from, stepMs, seed) {
	for (var b = from + 1; b <= from + RETRIG_LOOKBACK; b++) if (this.noteAt(l, b, stepMs, seed)) return b;
	return from + RETRIG_LOOKBACK;
};

// Events to play during absStep: [{offMs, lane, pitch, velocity, durMs, channel}],
// offMs = time after the step's start. Includes retrig hits of bursts that
// started on earlier steps (back to startAbs, the play start: nothing ran
// before it). Voices: each new note may keep at most VOICES−1 bursts running
// (its own VOICES setting; Mono = 1): the oldest are stopped at its start.
// Not yet: microtime, conditions, fill, accent, slide/tie (later steps).
Model.prototype.eventsAt = function (absStep, stepMs, seed, startAbs) {
	if (startAbs === undefined || startAbs > absStep) startAbs = absStep;
	var out = [];
	for (var l = 0; l < 2; l++) {
		var from = Math.max(startAbs, absStep - RETRIG_LOOKBACK), running = [], bursts = [];
		for (var b = from; b <= absStep; b++) {
			var n = this.noteAt(l, b, stepMs, seed);
			if (!n) continue;
			running = running.filter(function (x) { return x.end > b + 1e-9; });
			while (running.length >= n.voices) running.shift().end = b; // steal the oldest
			var h = burstHits(n, absStep + 1 - b);
			var burst = { n: n, hits: h.hits, end: b + h.span };
			running.push(burst);
			bursts.push(burst);
		}
		for (var k = 0; k < bursts.length; k++) {
			var bu = bursts[k], st0 = bu.n.abs;
			if (bu.end <= absStep) continue;
			for (var j = 0; j < bu.hits.length; j++) {
				var hit = bu.hits[j], at = st0 + hit.t;
				if (at < absStep - 1e-9 || at >= absStep + 1 - 1e-9 || at >= bu.end - 1e-9 || !hit.play) continue;
				var dur;
				if (hit.plain && hit.iv === Infinity) dur = (this.nextNoteAbs(l, st0, stepMs, seed) - st0) * stepMs - 1; // INF: until the next note
				else dur = hit.plain ? hit.iv * stepMs : Math.max(1, hit.iv * stepMs - 1); // retrig: held until the next hit
				out.push({
					offMs: Math.max(0, Math.round((at - absStep) * stepMs * 100) / 100),
					lane: l, pitch: bu.n.pitch, velocity: hit.vel,
					durMs: Math.max(1, Math.round(dur)), channel: bu.n.channel
				});
			}
		}
	}
	return out;
};

// ---------- note keyboard ----------
var CHROMATIC = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var MIN_OCTAVE = -2, MAX_OCTAVE = 6;

// 16 ascending in-scale notes for the keyboard rows, starting at the root
// of `octave` (octave 1 + root C = MIDI 36, Live's C1). Notes above 127 → -1.
function keyboardNotes(root, intervals, octave) {
	var iv = (intervals && intervals.length) ? intervals : CHROMATIC;
	var base = (root | 0) + 12 * (octave + 2), out = [];
	for (var k = 0; k < 16; k++) {
		var n = base + iv[k % iv.length] + 12 * Math.floor(k / iv.length);
		out.push(n >= 0 && n <= 127 ? n : -1);
	}
	return out;
}

// ---------- serialisation ----------
// Flat int list (safe to store in a [pattr] blob, no quoting issues). Sparse:
// only steps with a trig are written.
// [MAGIC, VERSION, nSettings, settings…, loopStart, loopEnd, nLanes,
//   per lane: nCc, ccNums…, nParams, defaults…, nSteps,
//     per step: index, flags(bit0 muted), note, nLocks, (pid, value)…]
Model.prototype.encode = function () {
	var out = [MAGIC, VERSION, SETTINGS.length], i, l;
	for (i = 0; i < SETTINGS.length; i++) out.push(this.settings[SETTINGS[i].key]);
	out.push(this.loopStart, this.loopEnd, this.lanes.length);
	for (l = 0; l < this.lanes.length; l++) {
		var lane = this.lanes[l];
		out.push(CC_SLOTS);
		for (i = 0; i < CC_SLOTS; i++) out.push(lane.ccNums[i]);
		out.push(PARAMS.length);
		for (i = 0; i < PARAMS.length; i++) out.push(lane.defaults[i]);
		var countAt = out.length, n = 0;
		out.push(0);
		for (i = 0; i < NUM_STEPS; i++) {
			var st = lane.steps[i];
			if (!st) continue;
			n++;
			var keys = [];
			for (var k in st.locks) keys.push(Number(k));
			keys.sort(function (a, b) { return a - b; });
			out.push(i, st.muted ? 1 : 0, st.note, keys.length);
			for (var j = 0; j < keys.length; j++) out.push(keys[j], st.locks[keys[j]]);
		}
		out[countAt] = n;
	}
	return out;
};

// Returns true on success. On a malformed list the model is left cleared.
Model.prototype.decode = function (list) {
	var a = [], i;
	for (i = 0; i < list.length; i++) a.push(Number(list[i]));
	var pos = 0;
	function next() {
		if (pos >= a.length) throw new Error("truncated at " + pos);
		return a[pos++];
	}
	var saved = this.onChange;
	this.onChange = null;
	this.clear();
	try {
		if (next() !== MAGIC) throw new Error("bad magic");
		var ver = next();
		if (ver > VERSION) throw new Error("saved by newer version " + ver);
		var ns = next();
		for (i = 0; i < ns; i++) {
			var v = next();
			if (i < SETTINGS.length) this.settings[SETTINGS[i].key] = clamp(v, SETTINGS[i].min, SETTINGS[i].max);
		}
		this.loopStart = clamp(next(), 0, PAGES - 1);
		this.loopEnd = clamp(next(), this.loopStart, PAGES - 1);
		var nl = next();
		for (var l = 0; l < nl; l++) {
			var lane = l < 2 ? this.lanes[l] : null;
			var nc = next();
			for (i = 0; i < nc; i++) { var cc = next(); if (lane && i < CC_SLOTS) lane.ccNums[i] = clamp(cc, 0, 127); }
			var np = next();
			for (i = 0; i < np; i++) {
				var d = next();
				if (lane && i < PARAMS.length) lane.defaults[i] = d === -1 && PARAMS[i].def === -1 ? -1 : clamp(d, PARAMS[i].min, PARAMS[i].max);
			}
			if (lane && ver < 2) lane.defaults[PARAM_ID.length] = nearestLen(lane.defaults[1] / TICKS_PER_STEP);
			var nsteps = next();
			for (var s = 0; s < nsteps; s++) {
				var idx = next(), flags = next(), note = next(), nlocks = next();
				var st = { muted: !!(flags & 1), note: l === BASS ? clamp(note, 0, 127) : -1, locks: {} };
				for (var j = 0; j < nlocks; j++) {
					var pid = next(), val = next();
					if (pid >= 0 && pid < PARAMS.length && PARAMS[pid].lanes[l]) st.locks[pid] = clamp(val, PARAMS[pid].min, PARAMS[pid].max);
				}
				if (ver < 2 && (1 in st.locks)) { // v1 gate ticks -> length index
					st.locks[PARAM_ID.length] = nearestLen(st.locks[1] / TICKS_PER_STEP);
					delete st.locks[1];
				}
				if (lane && idx >= 0 && idx < NUM_STEPS) lane.steps[idx] = st;
			}
		}
	} catch (e) {
		this.clear();
		this.onChange = saved;
		this.lastError = String(e.message || e);
		return false;
	}
	this.onChange = saved;
	this.lastError = null;
	return true;
};

var api = {
	Model: Model,
	PARAMS: PARAMS, PARAM_ID: PARAM_ID, SETTINGS: SETTINGS,
	CONDITIONS: CONDITIONS, RETRIG_RATES: RETRIG_RATES, RETRIG_LENS: RETRIG_LENS,
	RETRIG_LEN_LABELS: RETRIG_LEN_LABELS, RETRIG_PMODES: RETRIG_PMODES, RETRIG_VOICES: RETRIG_VOICES,
	STEPS_PER_PAGE: STEPS_PER_PAGE, PAGES: PAGES, NUM_STEPS: NUM_STEPS,
	TICKS_PER_STEP: TICKS_PER_STEP, CC_SLOTS: CC_SLOTS,
	KICK: KICK, BASS: BASS, LANE_NAMES: LANE_NAMES,
	keyboardNotes: keyboardNotes, CHROMATIC: CHROMATIC,
	MIN_OCTAVE: MIN_OCTAVE, MAX_OCTAVE: MAX_OCTAVE
};
if (typeof exports !== "undefined") for (var _k in api) exports[_k] = api[_k];
return api; // bundled build wraps this file in a function
