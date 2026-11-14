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
var RETRIG_RATES = ["1/16", "1/24", "1/32", "1/48", "1/64"];

// Lockable step parameters. The id (array index) is the save format:
// APPEND ONLY, never reorder or remove.
// def: lane default used when a step has no lock. -1 on a CC = send nothing.
// lanes: which lanes the parameter applies to.
var PARAMS = [
	{ key: "velocity",    min: 0,   max: 127, def: 100, lanes: [1, 1] },
	{ key: "length",      min: 1,   max: TICKS_PER_STEP * 16, def: 12, lanes: [1, 1] },
	{ key: "microtime",   min: -12, max: 12,  def: 0,   lanes: [1, 1] },
	{ key: "probability", min: 0,   max: 100, def: 100, lanes: [1, 1] },
	{ key: "condition",   min: 0,   max: CONDITIONS.length - 1, def: 0, lanes: [1, 1] },
	{ key: "accent",      min: 0,   max: 1,   def: 0,   lanes: [1, 1] },
	{ key: "slide",       min: 0,   max: 1,   def: 0,   lanes: [0, 1] },
	{ key: "tie",         min: 0,   max: 1,   def: 0,   lanes: [1, 1] },
	{ key: "retrig",      min: 0,   max: 1,   def: 0,   lanes: [1, 1] },
	{ key: "retrigRate",  min: 0,   max: RETRIG_RATES.length - 1, def: 2, lanes: [1, 1] },
	{ key: "retrigFade",  min: -64, max: 63,  def: 0,   lanes: [1, 1] },
	{ key: "fill",        min: 0,   max: 1,   def: 0,   lanes: [1, 1] }
];
for (var _c = 0; _c < CC_SLOTS; _c++)
	PARAMS.push({ key: "cc" + (_c + 1), min: 0, max: 127, def: -1, lanes: [1, 1], cc: _c });

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

var MAGIC = 7101, VERSION = 1;

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

// Events to play at absStep: [{lane, pitch, velocity, durMs, channel}].
// Applies mute, probability, velocity, length. stepMs = one 1/16 in ms.
// Not yet: microtime, conditions, fill, retrig, accent, slide/tie (later steps).
Model.prototype.eventsAt = function (absStep, stepMs, seed) {
	var out = [], idx = this.seqIndexFor(absStep);
	for (var l = 0; l < 2; l++) {
		var st = this.lanes[l].steps[idx];
		if (!st || st.muted) continue;
		var prob = this.value(l, idx, PARAM_ID.probability);
		if (prob < 100 && chance(absStep, l, seed || 0) * 100 >= prob) continue;
		var len = this.value(l, idx, PARAM_ID.length);
		out.push({
			lane: l,
			pitch: l === KICK ? this.settings.kickNote : st.note,
			velocity: Math.max(1, this.value(l, idx, PARAM_ID.velocity)),
			durMs: Math.max(1, Math.round(len / TICKS_PER_STEP * stepMs)),
			channel: l === KICK ? this.settings.kickChannel : this.settings.bassChannel
		});
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
			var nsteps = next();
			for (var s = 0; s < nsteps; s++) {
				var idx = next(), flags = next(), note = next(), nlocks = next();
				var st = { muted: !!(flags & 1), note: l === BASS ? clamp(note, 0, 127) : -1, locks: {} };
				for (var j = 0; j < nlocks; j++) {
					var pid = next(), val = next();
					if (pid >= 0 && pid < PARAMS.length && PARAMS[pid].lanes[l]) st.locks[pid] = clamp(val, PARAMS[pid].min, PARAMS[pid].max);
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
	CONDITIONS: CONDITIONS, RETRIG_RATES: RETRIG_RATES,
	STEPS_PER_PAGE: STEPS_PER_PAGE, PAGES: PAGES, NUM_STEPS: NUM_STEPS,
	TICKS_PER_STEP: TICKS_PER_STEP, CC_SLOTS: CC_SLOTS,
	KICK: KICK, BASS: BASS, LANE_NAMES: LANE_NAMES,
	keyboardNotes: keyboardNotes, CHROMATIC: CHROMATIC,
	MIN_OCTAVE: MIN_OCTAVE, MAX_OCTAVE: MAX_OCTAVE
};
if (typeof exports !== "undefined") for (var _k in api) exports[_k] = api[_k];
return api; // bundled build wraps this file in a function
