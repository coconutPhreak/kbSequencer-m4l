// seq_model.js — sequence data for kbSequencer (build step 2).
// Pure data + (de)serialisation. No Max/Live globals, so it can be tested
// outside Max. ES5 so it runs in [js] and [v8]. Loaded with require("seq_model").

var STEPS_PER_PAGE = 32;
var PAGES = 16;
var NUM_STEPS = STEPS_PER_PAGE * PAGES; // 512 per lane
var KICK = 0, BASS = 1;
var LANE_NAMES = ["kick", "bass"];
var MACRO_SLOTS = 8; // macro lock slots per lane: slot N = macro N of the Rack after kbLane

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
// def: lane default used when a step has no lock.
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
// Macro lock slots (v4; these ids held the CC lock slots up to v3): an offset
// in % of the macro's range, added to its knob by kbLane. 0 = no offset.
for (var _c = 0; _c < MACRO_SLOTS; _c++)
	PARAMS.push({ key: "m" + (_c + 1), min: -100, max: 100, def: 0, lanes: [1, 1], macro: _c });

// Retrig, appended after the macro slots (ids are the save format).
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
	{ key: "retrigVoices", min: 0, max: RETRIG_VOICES.length - 1, def: 0, lanes: [1, 1] },
	// Slide (bass): read from the first note of a slide chain.
	{ key: "slideTime",    min: 0, max: 200, def: 100, lanes: [0, 1] },  // % of the gap to the next note
	{ key: "slideCurve",   min: -100, max: 100, def: 0, lanes: [0, 1] }  // -100 fast start, +100 slow start
);

var PARAM_ID = {};
for (var _p = 0; _p < PARAMS.length; _p++) PARAM_ID[PARAMS[_p].key] = _p;

// Device-wide settings (not lockable). Order is the save format: APPEND ONLY.
var SETTINGS = [
	{ key: "kickChannel", min: 1, max: 16,  def: 1 },
	{ key: "bassChannel", min: 1, max: 16,  def: 2 },
	{ key: "kickNote",    min: 0, max: 127, def: 36 },
	{ key: "bendRange",   min: 1, max: 96,  def: 24 }, // ± semitones each way; must match the instrument
	{ key: "scaleFollow", min: 0, max: 1,   def: 1 },
	{ key: "swing",       min: 50, max: 75, def: 50 },
	{ key: "maskKick",    min: 0, max: 1,   def: 0 },  // live mask: kick silences bass notes where it plays
	{ key: "maskBass",    min: 0, max: 1,   def: 0 }   // live mask: bass silences kick notes
];

// Euclidean generator, per lane (a separate layer from the manual steps).
// Order is the save format: APPEND ONLY. layer: which steps play.
var EUCLID = [
	{ key: "steps",    min: 1, max: 64,  def: 16 },  // pattern length, repeats through the lane
	{ key: "pulses",   min: 0, max: 64,  def: 0 },   // hits per pattern (capped at steps)
	{ key: "rotate",   min: 0, max: 63,  def: 0 },   // shifts the hits later by n steps
	{ key: "layer",    min: 0, max: 2,   def: 2 },   // 0 Manual, 1 Euclid, 2 Both (manual wins)
	{ key: "velocity", min: 1, max: 127, def: 100 },
	{ key: "note",     min: 0, max: 127, def: 36 },  // bass only
	{ key: "follow",   min: 0, max: 1,   def: 0 }    // 1: Steps = the lane's Length (Steps ignored)
];
var LAYERS = ["Manual", "Euclid", "Both"];
var MAX_LENGTH = NUM_STEPS;

var DEFAULT_BASS_NOTE = 36;

// v2: step length is an index into RETRIG_LENS (v1: gate ticks, param 1).
// v3: per-lane Length (steps) and Euclid settings, after the lanes.
// v4: macro lock slots replace the CC lock slots (same param ids); the CC
//     numbers are gone (nCc written as 0). Older CC locks are dropped on load.
var MAGIC = 7101, VERSION = 4;

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
function Model() { this.perf = null; this.clear(); }

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
		var eu = {};
		for (var e = 0; e < EUCLID.length; e++) eu[EUCLID[e].key] = EUCLID[e].def;
		this.lanes.push({ steps: steps, defaults: defs, length: STEPS_PER_PAGE, euclid: eu });
	}
	this.changed();
};

// Called on every edit; the device hooks this to schedule a save.
Model.prototype.onChange = null;
Model.prototype.changed = function () { this._reach = null; this._eu = null; if (this.onChange) this.onChange(); };

// How many steps back a note could still be sounding, per lane: the longest
// Length (INF: RETRIG_LOOKBACK), plus one 1/1 interval on retrig steps.
// eventsAt only looks back this far (was always RETRIG_LOOKBACK: slow).
Model.prototype.reach = function (l) {
	if (!this._reach) this._reach = [];
	if (this._reach[l] !== undefined) return this._reach[l];
	var steps = this.lanes[l].steps, r = 1;
	for (var i = -1; i < NUM_STEPS; i++) {
		if (i >= 0 && !steps[i]) continue; // -1: the lane defaults (Euclid hits use them)
		var len = RETRIG_LENS[this.value(l, i, PARAM_ID.length)];
		if (len === Infinity) { r = RETRIG_LOOKBACK; break; }
		if (this.value(l, i, PARAM_ID.retrig) === 1) len += 16;
		if (len > r) r = len;
	}
	return (this._reach[l] = Math.min(RETRIG_LOOKBACK, Math.ceil(r) + 1));
};

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

// Value from a step object (manual or a Euclid hit): its lock, else the default.
Model.prototype.stepValue = function (lane, st, pid) {
	if (st && (pid in st.locks)) return st.locks[pid];
	return this.lanes[lane].defaults[pid];
};

// Effective value: the step's lock, else the lane default.
Model.prototype.value = function (lane, i, pid) {
	var st = this.lanes[lane].steps[i];
	if (st && (pid in st.locks)) return st.locks[pid];
	return this.lanes[lane].defaults[pid];
};

// Un-mutes every manual step on a page; returns how many changed.
Model.prototype.unmutePage = function (lane, page) {
	var steps = this.lanes[lane].steps, base = page * STEPS_PER_PAGE, n = 0;
	for (var i = base; i < base + STEPS_PER_PAGE; i++) if (steps[i] && steps[i].muted) { steps[i].muted = false; n++; }
	if (n) this.changed();
	return n;
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
	for (var l = 0; l < 2; l++) this.lanes[l].length = (Math.max(a, b) - this.loopStart + 1) * STEPS_PER_PAGE;
	this.updateLoopEnd();
	this.changed();
};

// Per-lane Length in steps, counted from the loop's start page (any number,
// not just whole pages). The loop's last page follows the longer lane.
Model.prototype.maxLength = function () { return MAX_LENGTH - this.loopStart * STEPS_PER_PAGE; };
Model.prototype.setLaneLength = function (l, len) {
	this.lanes[l].length = clamp(len, 1, this.maxLength());
	this.updateLoopEnd();
	this.changed();
};
Model.prototype.updateLoopEnd = function () {
	var m = Math.max(this.lanes[0].length, this.lanes[1].length);
	this.loopEnd = Math.min(PAGES - 1, this.loopStart + Math.ceil(m / STEPS_PER_PAGE) - 1);
};
// Is step i inside lane l's loop?
Model.prototype.inLoop = function (l, i) {
	var m = i - this.loopStart * STEPS_PER_PAGE;
	return m >= 0 && m < this.lanes[l].length;
};

// ---------- Euclidean layer ----------
Model.prototype.setEuclid = function (l, key, value) {
	for (var e = 0; e < EUCLID.length; e++) {
		if (EUCLID[e].key !== key) continue;
		this.lanes[l].euclid[key] = clamp(value, EUCLID[e].min, EUCLID[e].max);
		this.changed();
		return;
	}
};
// Does the Euclid pattern have a hit on step i (inside the lane's loop)?
// Pulses spread as evenly as possible over Steps (or the whole Length with
// Follow on) (Bjorklund), first hit on
// the pattern's first step, then shifted later by Rotate; the pattern
// restarts with every pass of the lane's Length.
Model.prototype.euclidHit = function (l, i) {
	var eu = this.lanes[l].euclid, n = eu.follow ? this.lanes[l].length : eu.steps, k = Math.min(eu.pulses, n);
	if (k <= 0 || (!this.inLoop(l, i) && !this.perf)) return false; // performance mode: any page
	var m = i - this.loopStart * STEPS_PER_PAGE;
	var e = (((m % n) - eu.rotate) % n + n) % n;
	return (e * k) % n < k;
};
// The step that plays at index i, by the lane's Layer: the manual step, a
// Euclid hit (a step with the Euclid velocity and note, else the lane
// defaults) or, in Both, the manual step if there is one (muted included).
Model.prototype.playStepAt = function (l, i) {
	var lane = this.lanes[l], manual = lane.steps[i], layer = lane.euclid.layer;
	if (layer === 0 || (layer === 2 && manual)) return manual;
	if (!this.euclidHit(l, i)) return layer === 2 ? manual : null;
	if (!this._eu) this._eu = [];
	if (!this._eu[l]) {
		var locks = {};
		locks[PARAM_ID.velocity] = lane.euclid.velocity;
		this._eu[l] = { muted: false, note: l === BASS ? lane.euclid.note : -1, locks: locks, euclid: true };
	}
	return this._eu[l];
};
Model.prototype.pageHasEuclid = function (l, page) {
	if (this.lanes[l].euclid.layer === 0) return false;
	for (var i = page * STEPS_PER_PAGE; i < (page + 1) * STEPS_PER_PAGE; i++) if (this.euclidHit(l, i)) return true;
	return false;
};
// Print: writes the lane's Euclid hits (over its Length) onto the manual
// steps. A hit on an existing step replaces its note (bass) and un-mutes it,
// keeping its locks; a new step gets the Euclid velocity (as a lock when it
// differs from the default). Returns the number of steps written.
Model.prototype.printEuclid = function (l) {
	var lane = this.lanes[l], eu = lane.euclid, n = 0;
	for (var i = this.loopStart * STEPS_PER_PAGE, end = i + lane.length; i < end; i++) {
		if (!this.euclidHit(l, i)) continue;
		var st = lane.steps[i];
		if (!st) {
			st = lane.steps[i] = { muted: false, note: -1, locks: {} };
			if (eu.velocity !== lane.defaults[PARAM_ID.velocity]) st.locks[PARAM_ID.velocity] = eu.velocity;
		}
		st.muted = false;
		if (l === BASS) st.note = eu.note;
		n++;
	}
	if (n) this.changed();
	return n;
};


Model.prototype.countTrigs = function (lane) {
	var n = 0, steps = this.lanes[lane].steps;
	for (var i = 0; i < NUM_STEPS; i++) if (steps[i]) n++;
	return n;
};

// Negative mask, printed: mutes lane dst's steps wherever lane src plays
// on them in any pass of the combined cycle (LCM of the two Lengths, as
// playback lines them up from the song start), so differing Lengths never
// collide. "Plays": an un-muted manual trig or Euclid hit (by Layer).
// Manual trigs are muted, never deleted, and keep their locks. A Euclid hit
// with no manual step gets a muted manual step on top (silences it in Both).
// Returns the number of steps muted.
function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
Model.prototype.maskLane = function (src, dst) {
	var lane = this.lanes[dst], Lt = lane.length, Ls = this.lanes[src].length, n = 0;
	var base = this.loopStart * STEPS_PER_PAGE, passes = Ls / gcd(Lt, Ls);
	for (var m = 0; m < Lt; m++) {
		var hit = false;
		for (var p = 0; p < passes && !hit; p++) {
			var s = this.playStepAt(src, base + (m + p * Lt) % Ls);
			hit = !!s && !s.muted;
		}
		if (!hit) continue;
		var i = base + m, st = lane.steps[i];
		if (st) { if (!st.muted) { st.muted = true; n++; } continue; }
		if (lane.euclid.layer !== 0 && this.euclidHit(dst, i)) {
			lane.steps[i] = { muted: true, note: dst === BASS ? lane.euclid.note : -1, locks: {} };
			n++;
		}
	}
	if (n) this.changed();
	return n;
};

// Live mask (settings maskKick / maskBass: that lane masks the other): a
// new note on the other lane doesn't start on a step where the masking lane
// plays a note (after its probability roll), on every pass.
Model.prototype.maskedAt = function (l, absStep, seed) {
	var src = l === KICK ? BASS : KICK;
	if (!this.settings[src === KICK ? "maskKick" : "maskBass"]) return false;
	return !!this.rawNoteAt(src, absStep, 0, seed);
};

// ---------- performance mode ----------
// Not part of the sequence (not saved, survives undo / restore): per lane, a
// list of segments { from, start, end }: from abs step `from` on, the lane
// loops pages start..end (start null = the normal loop again). Switches are
// added ahead of time (quantized to a beat), so lookahead and lookback see
// the old pages before `from` and the new ones after it. The position inside
// the pages follows the song position, so a switch keeps the bar position.
Model.prototype.setPerf = function (on) {
	this.perf = on ? [[], []] : null;
	this._reach = null;
};
Model.prototype.perfSwitch = function (l, start, end, from) {
	if (!this.perf) return;
	var segs = this.perf[l].filter(function (s) { return s.from < from; });
	segs.push({ from: from, start: start, end: start === null ? null : Math.max(start, end) });
	this.perf[l] = segs;
};
// The segment in force on lane l at absStep, or null (normal loop).
Model.prototype.perfAt = function (l, absStep) {
	if (!this.perf) return null;
	var segs = this.perf[l], hit = null;
	for (var k = 0; k < segs.length; k++) if (segs[k].from <= absStep) hit = segs[k];
	return hit && hit.start !== null ? hit : null;
};
// A switch still waiting on lane l after absStep, or null.
Model.prototype.perfPending = function (l, absStep) {
	if (!this.perf) return null;
	var segs = this.perf[l];
	for (var k = 0; k < segs.length; k++) if (segs[k].from > absStep) return segs[k];
	return null;
};
// Playback jumped (start, locate): every lane keeps its latest choice, now.
Model.prototype.perfCollapse = function () {
	if (!this.perf) return;
	for (var l = 0; l < 2; l++) {
		var segs = this.perf[l];
		this.perf[l] = segs.length ? [{ from: -Infinity, start: segs[segs.length - 1].start, end: segs[segs.length - 1].end }] : [];
	}
};
// Forget segments that ended more than the lookback ago. Returns true when
// performance mode has fully ended (only "normal" left on both lanes).
Model.prototype.perfPrune = function (absStep) {
	if (!this.perf) return false;
	var done = true;
	for (var l = 0; l < 2; l++) {
		var segs = this.perf[l];
		while (segs.length > 1 && segs[1].from <= absStep - RETRIG_LOOKBACK) segs.shift();
		if (segs.length > 1 || (segs.length === 1 && (segs[0].start !== null || segs[0].from > absStep - RETRIG_LOOKBACK))) done = false;
	}
	return done;
};

// ---------- playback ----------
// absStep: 1/16 steps since song start (from Live's transport).
// Maps it into the lane's loop (Length steps from the loop's start page), so
// the pattern stays locked to the song position.
Model.prototype.loopLength = function (l) {
	return this.lanes[l].length;
};
Model.prototype.seqIndexFor = function (absStep, l) {
	var pf = this.perfAt(l, absStep);
	if (pf) { // performance mode: the chosen page(s), full 32 steps each
		var plen = (pf.end - pf.start + 1) * STEPS_PER_PAGE, pm = absStep % plen;
		return pf.start * STEPS_PER_PAGE + (pm < 0 ? pm + plen : pm);
	}
	var len = this.lanes[l].length;
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
	if (this.maskedAt(l, absStep, seed)) return null;
	return this.rawNoteAt(l, absStep, stepMs, seed);
};
// noteAt without the live mask (also what the mask itself listens to).
Model.prototype.rawNoteAt = function (l, absStep, stepMs, seed) {
	var idx = this.seqIndexFor(absStep, l), st = this.playStepAt(l, idx);
	if (!st || st.muted) return null;
	var self = this, v = function (key) { return self.stepValue(l, st, PARAM_ID[key]); };
	var prob = v("probability");
	if (prob < 100 && chance(absStep, l, seed || 0) * 100 >= prob) return null;
	var n = {
		lane: l, abs: absStep,
		t: absStep + v("microtime") / TICKS_PER_STEP, // start time in steps (microtime)
		pitch: l === KICK ? this.settings.kickNote : st.note,
		velocity: Math.max(1, v("velocity")),
		lenSteps: RETRIG_LENS[v("length")],
		channel: l === KICK ? this.settings.kickChannel : this.settings.bassChannel,
		retrig: v("retrig") === 1,
		voices: v("retrigVoices") + 1,
		slide: l === BASS && v("slide") === 1,
		tie: v("tie") === 1,
		slideTime: l === BASS ? v("slideTime") / 100 : 0,
		slideCurve: l === BASS ? v("slideCurve") / 100 : 0
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

// ---------- slides and ties ----------
// A step with Slide (bass) or Tie on connects to the lane's next unmuted
// step, if that step starts before the note ends (the first note's Length):
// no new note-on, the held note bends to that step's pitch (Tie: an instant
// jump; Slide: a glide). A step after the note has ended plays normally. The connected step keeps only its note and
// its own Slide / Tie flag (so chains continue); its other locks don't apply.
// The first note of the chain sets velocity, Length (the whole held note,
// from its start, so a short Length ends before the slide), Slide Time and
// Curve. Retrig steps don't slide. A target
// further than the bend range starts a new note instead.
// Slide Time p = % of the gap g between the two notes: p ≤ 100 glides over
// the last p·g before the next note (lands on its beat); p > 100 starts at
// the first note and arrives (p−100)·g late.
var BEND_MS = 5; // bend message spacing during a glide

function curveShape(x, c) {
	x = x < 0 ? 0 : x > 1 ? 1 : x;
	return c >= 0 ? Math.pow(x, 1 + 3 * c) : 1 - Math.pow(1 - x, 1 + 3 * -c);
}

// Notes (chains) of one lane from `from`, until the first new note that
// starts after absStep (needed for mono cuts) or RETRIG_LOOKBACK steps on.
Model.prototype.laneChains = function (l, from, absStep, stepMs, seed) {
	var chains = [], cur = null, range = this.settings.bendRange;
	for (var b = from; b <= absStep + RETRIG_LOOKBACK; b++) {
		var idx = this.seqIndexFor(b, l), st = this.playStepAt(l, idx);
		if (cur && cur.open) {
			if (!st || st.muted) continue;
			var pitch = l === KICK ? this.settings.kickNote : st.note;
			// Connects only while the note still sounds (the first note's Length
			// from its start) and within the bend range; else a new note.
			var sounding = b < cur.first.t + cur.first.lenSteps - 1e-9;
			if (sounding && (l !== BASS || Math.abs(pitch - cur.first.pitch) <= range)) {
				var sl = l === BASS && this.stepValue(l, st, PARAM_ID.slide) === 1, ti = this.stepValue(l, st, PARAM_ID.tie) === 1;
				cur.notes.push({ abs: b, t: b, pitch: pitch, slide: sl, tie: ti }); // on the grid
				cur.open = sl || ti;
				continue;
			}
			cur.open = false; // ended, or out of bend range: a new note
		}
		var n = this.noteAt(l, b, stepMs, seed);
		if (!n) continue;
		cur = { first: n, notes: [{ abs: b, t: n.t, pitch: n.pitch, slide: n.slide, tie: n.tie }], open: !n.retrig && (n.slide || n.tie) };
		chains.push(cur);
		// Microtime moves a note at most half a step, so a note from the next
		// step can still start inside absStep: go one note past that.
		if (b > absStep + 1) break;
	}
	return chains;
};

// Glide windows [s0, s1] of a chain, one per pitch change (tie: s0 = s1).
function chainWindows(c) {
	var w = [], ns = c.notes, p = c.first.slideTime;
	for (var k = 0; k + 1 < ns.length; k++) {
		var a = ns[k].t, b = ns[k + 1].t, g = b - a, d = ns[k + 1].pitch - ns[k].pitch;
		if (!d) continue;
		if (ns[k].slide) {
			var D = p * g;
			w.push(D <= g ? { s0: b - D, s1: b, d: d } : { s0: a, s1: a + D, d: d });
		} else w.push({ s0: b, s1: b, d: d }); // tie: jump on the next note
	}
	return w;
}
// Pitch offset (semitones from the first note) of a chain at abs time t.
function chainOffset(c, t) {
	var off = 0, w = c.windows || (c.windows = chainWindows(c));
	for (var k = 0; k < w.length; k++)
		off += w[k].d * (w[k].s1 > w[k].s0 ? curveShape((t - w[k].s0) / (w[k].s1 - w[k].s0), c.first.slideCurve) : (t >= w[k].s0 - 1e-9 ? 1 : 0));
	return off;
}
function bendValue(off, range) {
	var v = Math.round(8192 + off / range * (off >= 0 ? 8191 : 8192));
	return v < 0 ? 0 : v > 16383 ? 16383 : v;
}

// Events to play during absStep: [{offMs, lane, pitch, velocity, durMs, channel}],
// offMs = time after the step's start. lane 2 = a bass pitch bend (pitch =
// 14-bit value); lane 3 / 4 = a kick / bass macro offset (pitch = slot 1–8,
// velocity = offset in %; slot 0 = reset all to 0), just before every new note. Includes retrig hits and held / sliding notes that started
// on earlier steps (back to startAbs, the play start: nothing ran before
// it). Voices: each new note may keep at most VOICES−1 notes or bursts
// running (its own VOICES; Mono = 1): the oldest are cut at its start, so
// lanes are mono by default. Microtime shifts a note's start (t) by
// ±12/24 step, so it may play in the step before. Not yet: conditions, fill, accent.
Model.prototype.eventsAt = function (absStep, stepMs, seed, startAbs) {
	if (startAbs === undefined || startAbs > absStep) startAbs = absStep;
	var out = [], range = this.settings.bendRange;
	var inStep = function (at) { return at >= absStep - 1e-9 && at < absStep + 1 - 1e-9; };
	var ms = function (at) { return Math.max(0, Math.round((at - absStep) * stepMs * 100) / 100); };
	for (var l = 0; l < 2; l++) {
		var from = Math.max(startAbs, absStep - this.reach(l)), running = [], items = [];
		var chains = this.laneChains(l, from, absStep, stepMs, seed);
		for (var ci = 0; ci < chains.length; ci++) {
			var c = chains[ci], n = c.first;
			// Nothing plays before the play start: an early (negative microtime)
			// note on the first step plays on it.
			if (n.t < startAbs) n.t = c.notes[0].t = startAbs;
			var b = n.t;
			running = running.filter(function (x) { return x.end > b + 1e-9; });
			while (running.length >= n.voices) running.shift().end = b; // steal the oldest
			if (b >= absStep + 1 - 1e-9) break; // only needed for the cut
			var it = { c: c, end: Infinity };
			if (c.notes.length > 1) {
				// The first note's Length is the whole held note, from its start: a
				// short Length ends it before the slide is heard. INF: until cut.
				it.natural = b + n.lenSteps;
			} else {
				it.h = burstHits(n, absStep + 1 - b);
				it.natural = b + it.h.span;
			}
			it.end = it.natural;
			running.push(it);
			items.push(it);
		}
		var ch = l === KICK ? this.settings.kickChannel : this.settings.bassChannel;
		for (var k = 0; k < items.length; k++) {
			var item = items[k], c2 = item.c, f = c2.first, st0 = f.t;
			if (item.end <= absStep) continue;
			var cut = item.end < item.natural; // stopped by a later note
			var endOrNext = item.end === Infinity ? this.nextNoteAbs(l, f.abs, stepMs, seed) : item.end;
			if (inStep(st0)) {
				// Macro offsets go out with the note, just before it (lane 3 / 4 =
				// kick / bass): first slot 0 = "all offsets back to 0", then each
				// slot 1–8 with a non-zero offset (pitch = slot, velocity = offset %).
				// So an unlocked step returns every macro to its knob. Once per
				// note: retrig hits and slid-into steps send none.
				var st0s = this.playStepAt(l, this.seqIndexFor(f.abs, l));
				out.push({ offMs: ms(st0), lane: 3 + l, pitch: 0, velocity: 0, durMs: 0, channel: ch });
				for (var mi = 0; mi < MACRO_SLOTS; mi++) {
					var mv = this.stepValue(l, st0s, PARAM_ID["m" + (mi + 1)]);
					if (mv) out.push({ offMs: ms(st0), lane: 3 + l, pitch: mi + 1, velocity: mv, durMs: 0, channel: ch });
				}
				if (l === BASS) // centre the bend before every new bass note
					out.push({ offMs: ms(st0), lane: 2, pitch: 8192, velocity: 0, durMs: 0, channel: ch });
			}
			if (c2.notes.length > 1) {
				if (inStep(st0))
					out.push({ offMs: ms(st0), lane: l, pitch: f.pitch, velocity: f.velocity,
						durMs: Math.max(1, Math.round((endOrNext - st0) * stepMs - (cut || item.end === Infinity ? 1 : 0))), channel: ch });
				if (l === BASS) this.chainBends(c2, absStep, endOrNext, stepMs, range, ch, out);
				continue;
			}
			for (var j = 0; j < item.h.hits.length; j++) {
				var hit = item.h.hits[j], at = st0 + hit.t;
				if (!inStep(at) || at >= item.end - 1e-9 || !hit.play) continue;
				var stop = Math.min(at + hit.iv, endOrNext), dur;
				if (hit.plain) dur = (stop - at) * stepMs - (cut || hit.iv === Infinity ? 1 : 0);
				else dur = Math.max(1, Math.min(hit.iv, stop - at) * stepMs - 1); // retrig: held until the next hit
				out.push({ offMs: ms(at), lane: l, pitch: f.pitch, velocity: hit.vel,
					durMs: Math.max(1, Math.round(dur)), channel: ch });
			}
		}
	}
	return out;
};

// Bend messages of a chain inside absStep, on a fixed grid (every BEND_MS
// from the chain's start) plus each window end (exact landing, tie jumps).
// Only when the 14-bit value changes; the comparison starts from the last
// grid point / window end before the step, so steps join seamlessly.
Model.prototype.chainBends = function (c, absStep, end, stepMs, range, ch, out) {
	var f = c.first.t, t0 = Math.max(absStep, f), t1 = Math.min(absStep + 1, end);
	if (t1 <= t0) return;
	var dt = BEND_MS / stepMs, w = c.windows || (c.windows = chainWindows(c));
	var prev = f + Math.floor((t0 - f - 1e-9) / dt) * dt, k;
	for (k = 0; k < w.length; k++) if (w[k].s1 < t0 - 1e-9 && w[k].s1 > prev) prev = w[k].s1;
	var last = prev < f ? 8192 : bendValue(chainOffset(c, prev), range);
	var times = [];
	for (var t = f + Math.ceil((t0 - f - 1e-9) / dt) * dt; t < t1 - 1e-9; t += dt) times.push(t);
	for (k = 0; k < w.length; k++) if (w[k].s1 >= t0 - 1e-9 && w[k].s1 < t1 - 1e-9) times.push(w[k].s1);
	times.sort(function (x, y) { return x - y; });
	for (var i = 0; i < times.length; i++) {
		var v = bendValue(chainOffset(c, times[i]), range);
		if (v === last) continue;
		last = v;
		out.push({ offMs: Math.max(0, Math.round((times[i] - absStep) * stepMs * 100) / 100), lane: 2, pitch: v, velocity: 0, durMs: 0, channel: ch });
	}
};

// Start time (steps, with microtime) of the lane's next played note after step `from` (for INF gates).
Model.prototype.nextNoteAbs = function (l, from, stepMs, seed) {
	for (var b = from + 1; b <= from + RETRIG_LOOKBACK; b++) { var n = this.noteAt(l, b, stepMs, seed); if (n) return n.t; }
	return from + RETRIG_LOOKBACK;
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
//   per lane: nCc (0 since v4; CC numbers before), ccNums…, nParams, defaults…, nSteps,
//     per step: index, flags(bit0 muted), note, nLocks, (pid, value)…]
Model.prototype.encode = function () {
	var out = [MAGIC, VERSION, SETTINGS.length], i, l;
	for (i = 0; i < SETTINGS.length; i++) out.push(this.settings[SETTINGS[i].key]);
	out.push(this.loopStart, this.loopEnd, this.lanes.length);
	for (l = 0; l < this.lanes.length; l++) {
		var lane = this.lanes[l];
		out.push(0); // nCc: no CC numbers since v4
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
	// v3: per lane Length, nEuclid, euclid values…
	for (l = 0; l < this.lanes.length; l++) {
		out.push(this.lanes[l].length, EUCLID.length);
		for (i = 0; i < EUCLID.length; i++) out.push(this.lanes[l].euclid[EUCLID[i].key]);
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
			for (i = 0; i < nc; i++) next(); // v1–v3 CC numbers: no longer used
			var np = next();
			for (i = 0; i < np; i++) {
				var d = next();
				if (lane && i < PARAMS.length) lane.defaults[i] = ver < 4 && PARAMS[i].macro !== undefined ? PARAMS[i].def : clamp(d, PARAMS[i].min, PARAMS[i].max);
			}
			if (lane && ver < 2) lane.defaults[PARAM_ID.length] = nearestLen(lane.defaults[1] / TICKS_PER_STEP);
			var nsteps = next();
			for (var s = 0; s < nsteps; s++) {
				var idx = next(), flags = next(), note = next(), nlocks = next();
				var st = { muted: !!(flags & 1), note: l === BASS ? clamp(note, 0, 127) : -1, locks: {} };
				for (var j = 0; j < nlocks; j++) {
					var pid = next(), val = next();
					if (pid < 0 || pid >= PARAMS.length || !PARAMS[pid].lanes[l]) continue;
					if (ver < 4 && PARAMS[pid].macro !== undefined) continue; // a v1–v3 CC lock: dropped
					st.locks[pid] = clamp(val, PARAMS[pid].min, PARAMS[pid].max);
				}
				if (ver < 2 && (1 in st.locks)) { // v1 gate ticks -> length index
					st.locks[PARAM_ID.length] = nearestLen(st.locks[1] / TICKS_PER_STEP);
					delete st.locks[1];
				}
				if (lane && idx >= 0 && idx < NUM_STEPS) lane.steps[idx] = st;
			}
		}
		var oldLen = (this.loopEnd - this.loopStart + 1) * STEPS_PER_PAGE;
		for (l = 0; l < 2; l++) this.lanes[l].length = oldLen; // v1/v2: whole loop pages
		if (ver >= 3) {
			for (l = 0; l < nl; l++) {
				var len = next(), ne = next(), ln = l < 2 ? this.lanes[l] : null;
				if (ln) ln.length = clamp(len, 1, this.maxLength());
				for (i = 0; i < ne; i++) { var ev = next(); if (ln && i < EUCLID.length) ln.euclid[EUCLID[i].key] = clamp(ev, EUCLID[i].min, EUCLID[i].max); }
			}
		}
		this.updateLoopEnd();
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
	EUCLID: EUCLID, LAYERS: LAYERS, MAX_LENGTH: MAX_LENGTH,
	CONDITIONS: CONDITIONS, RETRIG_RATES: RETRIG_RATES, RETRIG_LENS: RETRIG_LENS,
	RETRIG_LEN_LABELS: RETRIG_LEN_LABELS, RETRIG_PMODES: RETRIG_PMODES, RETRIG_VOICES: RETRIG_VOICES,
	STEPS_PER_PAGE: STEPS_PER_PAGE, PAGES: PAGES, NUM_STEPS: NUM_STEPS,
	TICKS_PER_STEP: TICKS_PER_STEP, MACRO_SLOTS: MACRO_SLOTS,
	KICK: KICK, BASS: BASS, LANE_NAMES: LANE_NAMES,
	keyboardNotes: keyboardNotes, CHROMATIC: CHROMATIC,
	MIN_OCTAVE: MIN_OCTAVE, MAX_OCTAVE: MAX_OCTAVE
};
if (typeof exports !== "undefined") for (var _k in api) exports[_k] = api[_k];
return api; // bundled build wraps this file in a function
