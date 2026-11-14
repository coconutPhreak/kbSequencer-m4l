// kbSequencer.js — main device script.
// Build step 2: step data + storage, on top of the step 1 Push takeover.
// A minimal pad UI is included only so storage can be tested by hand:
//   rows 0–3 (top): 32 steps of the viewed page · tap empty = trig, lit = mute,
//                   muted = unmute · hold Delete + tap = wipe
//   rows 4–5: page pads · Select + page pad = view that page
//   lower display buttons 1/2: kick / bass lane select
// Playback, encoders, p-lock gestures etc. come in later build steps.
//
// ES5 on purpose: runs in both [js] (Max 8) and [v8] (Max 9).

autowatch = 1;
inlets = 1;
outlets = 3; // 0: status text, 1: last event text, 2: storage list -> [pattr]

// S (the sequence model, src/seq_model.js) is bundled in above this line by tools/build.py.
var model = new S.Model();

// ---------- colours (Push palette indices; placeholders until tested) ----------
var COL = {
	off: 0,
	kick: 3,          // spec: orange
	bass: 125,        // spec: blue
	both: 49,         // spec: purple
	muted: 124,       // spec: dim lane colour; dark grey for now
	pageViewed: 122,  // white
	pageTrigs: 123,   // light grey
	pageEmpty: 124,   // dark grey (spec: dim grey)
	laneOff: 124
};

// ---------- UI state ----------
var selKick = true, selBass = false;
var viewPage = 0;
var deleteHeld = false, selectHeld = false;
var paletteBase = -1; // >= 0 while showing the palette test

// ---------- takeover state ----------
var surface = null, surfaceIndex = -1;
var controls = {};
var grabbed = false, enabled = 1, followFocus = 1, focused = false;
var thisTrackId = 0, selObserver = null, initialised = false;
var padCache = {}; // "x,y" -> colour last sent

// Confirmed on Push 3 — see docs/push3-notes.md
var CONTROL_NAMES = {
	matrix: "Button_Matrix",
	deleteBtn: "Delete_Button",
	selectBtn: "Select_Button",
	display: "Track_State_Buttons",
	encoders: "Track_Controls",
	touches: "Track_Control_Touches"
};

// ---------- deferred work queue ----------
// Live refuses changes made from inside observer callbacks, so grabs,
// releases and LED sends go through a Task on the next tick.
var queue = [];
var runner = new Task(drainQueue, this);
function defer(fn) { queue.push(fn); runner.schedule(0); }
function drainQueue() {
	var q = queue; queue = [];
	for (var i = 0; i < q.length; i++) {
		try { q[i](); } catch (e) { post("kbSequencer error: " + e + "\n"); }
	}
}

// ---------- storage ----------
// The sequence lives in the model; a [pattr kbData] (Live blob parameter,
// stored only) holds its encoded int list so it saves with the Set and is
// copied when the track/device is duplicated.
// The list must be sent to pattr as a plain value, NOT "set …": "set" changes
// pattr silently, so Live never learns the parameter changed and saves or
// copies the stale (empty) value. A plain value makes pattr echo it back to
// restore(), which `saving` ignores.
var restoring = false, saving = false;
var lastSaved = "";
var saveTask = new Task(saveNow, this);
model.onChange = function () {
	if (!restoring) saveTask.schedule(250); // debounce bursts of edits
};
function saveNow() {
	var enc = model.encode();
	var key = enc.join(" ");
	if (key === lastSaved) return;
	lastSaved = key;
	saving = true;
	try { outlet(2, enc); } finally { saving = false; }
	post("kbSequencer: saved " + enc.length + " values\n");
}

// [pattr kbData] -> [prepend restore] -> here. Fires when Live restores the
// parameter (Set load, preset, duplicate) and once more at device init, when
// the patch bangs pattr so a value restored before the script was ready
// is not missed.
function restore() {
	if (saving) return; // our own echo
	var a = arrayfromargs(arguments);
	if (a.length < 3) { post("kbSequencer: no stored sequence (" + a.length + " values)\n"); return; }
	if (a.join(" ") === lastSaved) return; // already have it
	lastSaved = a.join(" ");
	restoring = true;
	var ok = model.decode(a);
	restoring = false;
	if (ok) post("kbSequencer: restored " + model.countTrigs(S.KICK) + " kick + " + model.countTrigs(S.BASS) + " bass trigs\n");
	else post("kbSequencer: restore failed (" + model.lastError + "), starting empty\n");
	if (grabbed) defer(renderAll);
	showStatus();
}

// ---------- messages from the device UI ----------
function bang() { init(); } // [live.thisdevice]
function rescan() { release(); init(); }
function enable(v) { enabled = v ? 1 : 0; if (initialised) defer(updateGrab); }
function autofocus(v) { followFocus = v ? 1 : 0; if (initialised) defer(updateGrab); }

function dump() {
	post("kbSequencer: loop pages " + (model.loopStart + 1) + "–" + (model.loopEnd + 1) + ", settings " + JSON.stringify(model.settings) + "\n");
	for (var l = 0; l < 2; l++) {
		var out = [];
		for (var i = 0; i < S.NUM_STEPS; i++) {
			var st = model.step(l, i);
			if (!st) continue;
			var s = (i + 1) + (st.muted ? "m" : "");
			if (l === S.BASS) s += ":n" + st.note;
			var locks = [];
			for (var k in st.locks) locks.push(S.PARAMS[k].key + "=" + st.locks[k]);
			if (locks.length) s += "{" + locks.join(",") + "}";
			out.push(s);
		}
		post("  " + S.LANE_NAMES[l] + " (" + out.length + "): " + out.join(" ") + "\n");
	}
}

// Test data: a four-on-the-floor kick, an offbeat bass with some locks,
// on pages 1 and 2. Exercises every part of the save format.
function testfill() {
	model.clear();
	for (var i = 0; i < 64; i += 4) model.addTrig(S.KICK, i);
	model.setMuted(S.KICK, 12, true);
	var notes = [36, 36, 43, 41];
	for (var j = 2; j < 64; j += 4) {
		model.addTrig(S.BASS, j, notes[(j >> 2) % 4]);
		if (j % 8 === 2) model.setLock(S.BASS, j, S.PARAM_ID.slide, 1);
	}
	model.setLock(S.KICK, 0, S.PARAM_ID.velocity, 127);
	model.setLock(S.BASS, 6, S.PARAM_ID.cc1, 90);
	model.setLoop(0, 1);
	model.setSetting("kickNote", 36);
	if (grabbed) defer(renderAll);
	dump();
}

function clearall() {
	model.clear();
	if (grabbed) defer(renderAll);
	post("kbSequencer: cleared\n");
}

// Palette test: shows indices base..base+63 on the grid; pressing a pad
// prints its index. Use to choose the final pad colours.
function palette(base) {
	base = base | 0;
	padCache = {};
	if (base < 0) {
		paletteBase = -1;
		post("kbSequencer: palette test off\n");
	} else {
		paletteBase = Math.min(64, base);
		post("kbSequencer: palette " + paletteBase + "–" + (paletteBase + 63) + " (palette -1 to exit)\n");
	}
	if (grabbed) defer(renderAll);
}

function notifydeleted() {
	saveTask.cancel();
	grabTask.cancel();
	repaintTask.cancel();
	release();
	if (selObserver) selObserver.property = "";
}

// ---------- setup ----------
function init() {
	initialised = true;
	findPush();
	if (!surface) { status("No Push found — is Push set as a control surface?"); return; }
	resolveControls();
	setupFocus();
	defer(updateGrab);
}

function findPush() {
	surface = null; surfaceIndex = -1;
	for (var i = 0; i < 8; i++) {
		var api = new LiveAPI("control_surfaces " + i);
		if (!api || api.id == 0) continue;
		if (surface === null && /push/i.test(String(api.type))) { surface = api; surfaceIndex = i; }
	}
	if (surface) post("kbSequencer: using control_surfaces " + surfaceIndex + " (" + surface.type + ")\n");
}

function resolveControls() {
	controls = {};
	for (var role in CONTROL_NAMES) {
		var id = toId(surface.call("get_control", CONTROL_NAMES[role]));
		if (id) controls[role] = { name: CONTROL_NAMES[role], id: id, api: null };
		else post("kbSequencer: control not found: " + CONTROL_NAMES[role] + "\n");
	}
}

function setupFocus() {
	var track = new LiveAPI("this_device canonical_parent");
	thisTrackId = track ? Number(track.id) : 0;
	if (selObserver) selObserver.property = "";
	selObserver = new LiveAPI(onSelectedTrack, "live_set view");
	selObserver.property = "selected_track";
	focused = (toId(selObserver.get("selected_track")) === thisTrackId);
}

function onSelectedTrack(args) {
	var a = flatten(args);
	if (a[0] !== "selected_track") return;
	var was = focused;
	focused = (Number(a[a.length - 1]) === thisTrackId);
	if (was !== focused) defer(updateGrab);
}

// ---------- grab / release ----------
// Only one device can own Push. When the selected track changes, every
// kbSequencer gets the notification in no fixed order; if the newly focused
// one grabbed first, the old one's release_control would then free the
// controls out from under it. So release happens at once, grab after a delay.
var GRAB_DELAY_MS = 60;
var grabTask = new Task(function () {
	if (wantGrab() && !grabbed) grab();
	else showStatus();
}, this);

function wantGrab() { return !!(surface && enabled && (!followFocus || focused)); }

function updateGrab() {
	var want = wantGrab();
	if (!want) { grabTask.cancel(); if (grabbed) release(); else showStatus(); }
	else if (!grabbed) grabTask.schedule(GRAB_DELAY_MS);
	else showStatus();
}

function grab() {
	for (var role in controls) {
		var c = controls[role];
		surface.call("grab_control", "id", c.id);
		c.api = new LiveAPI(makeHandler(role), "id " + c.id);
		c.api.property = "value";
	}
	grabbed = true;
	deleteHeld = selectHeld = false;
	padCache = {};
	renderAll();
	// Push resets the LEDs of controls it hands over a moment after the grab,
	// wiping what was just sent (lane buttons stayed dark until pressed).
	// Paint everything again once that has happened.
	repaintTask.schedule(REPAINT_AFTER_GRAB_MS);
	showStatus();
}

var REPAINT_AFTER_GRAB_MS = 200;
var repaintTask = new Task(function () {
	if (!grabbed) return;
	padCache = {};
	renderAll();
}, this);

function release() {
	if (!grabbed || !surface) { grabbed = false; return; }
	for (var role in controls) {
		var c = controls[role];
		if (c.api) { c.api.property = ""; c.api = null; }
		try { surface.call("release_control", "id", c.id); } catch (e) {}
	}
	grabbed = false;
	showStatus();
}

// ---------- input ----------
function makeHandler(role) {
	return function (args) {
		var a = flatten(args);
		if (a[0] !== "value") return;
		var v = [];
		for (var i = 1; i < a.length; i++) v.push(Number(a[i]));
		outlet(1, role + " " + v.join(" "));
		defer(function () { handleInput(role, v); });
	};
}

function handleInput(role, v) {
	var pressed = v[0] > 0;
	if (role === "deleteBtn") { deleteHeld = pressed; return; }
	if (role === "selectBtn") { selectHeld = pressed; return; }
	if (role === "display" && pressed) { onDisplayButton(v[1]); return; }
	if (role === "matrix" && pressed) { onPad(v[1], v[2]); return; }
}

function onDisplayButton(x) {
	// At least one lane stays selected.
	if (x === 0) { selKick = !selKick; if (!selKick && !selBass) selBass = true; }
	else if (x === 1) { selBass = !selBass; if (!selKick && !selBass) selKick = true; }
	else return;
	renderAll();
	showStatus();
}

function onPad(x, y) {
	if (paletteBase >= 0) {
		post("kbSequencer: palette index " + (paletteBase + y * 8 + x) + "\n");
		return;
	}
	if (y <= 3) return onStepPad(viewPage * S.STEPS_PER_PAGE + y * 8 + x);
	if (y <= 5) {
		var page = (y - 4) * 8 + x;
		if (selectHeld) { viewPage = page; renderAll(); showStatus(); }
		return; // plain tap: nothing (spec); loop setting comes in step 4
	}
	// rows 6–7: note keyboard, step 4+
}

function onStepPad(i) {
	var lanes = selectedLanes();
	if (deleteHeld) {
		for (var k = 0; k < lanes.length; k++) model.wipe(lanes[k], i);
	} else {
		// Decide from the first selected lane so both lanes move together.
		var st = model.step(lanes[0], i);
		for (var j = 0; j < lanes.length; j++) {
			var l = lanes[j];
			if (!st) model.addTrig(l, i);
			else if (model.hasTrig(l, i)) model.setMuted(l, i, !st.muted);
			else model.addTrig(l, i); // lane had no trig: create it
		}
	}
	renderStep(i);
	renderPages();
}

function selectedLanes() {
	var out = [];
	if (selKick) out.push(S.KICK);
	if (selBass) out.push(S.BASS);
	return out;
}

// ---------- rendering ----------
function sendPad(x, y, colour) {
	var key = x + "," + y;
	if (padCache[key] === colour) return;
	padCache[key] = colour;
	new LiveAPI("id " + controls.matrix.id).call("send_value", x, y, colour);
}

function renderAll() {
	if (!grabbed || !controls.matrix) return;
	if (paletteBase >= 0) {
		for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) sendPad(x, y, paletteBase + y * 8 + x);
	} else {
		for (var i = 0; i < S.STEPS_PER_PAGE; i++) renderStep(viewPage * S.STEPS_PER_PAGE + i);
		renderPages();
		for (var ny = 6; ny < 8; ny++) for (var nx = 0; nx < 8; nx++) sendPad(nx, ny, COL.off);
	}
	renderDisplayButtons();
}

function renderStep(i) {
	var local = i - viewPage * S.STEPS_PER_PAGE;
	if (local < 0 || local >= S.STEPS_PER_PAGE) return;
	var k = selKick && model.step(S.KICK, i), b = selBass && model.step(S.BASS, i);
	var c = COL.off;
	if (k && b) c = (k.muted && b.muted) ? COL.muted : COL.both;
	else if (k) c = k.muted ? COL.muted : COL.kick;
	else if (b) c = b.muted ? COL.muted : COL.bass;
	sendPad(local % 8, local >> 3, c);
}

function renderPages() {
	for (var p = 0; p < S.PAGES; p++) {
		var c;
		if (p === viewPage) c = COL.pageViewed;
		else if (p < model.loopStart || p > model.loopEnd) c = COL.off;
		else c = (model.pageHasTrigs(S.KICK, p) || model.pageHasTrigs(S.BASS, p)) ? COL.pageTrigs : COL.pageEmpty;
		sendPad(p % 8, 4 + (p >> 3), c);
	}
}

function renderDisplayButtons() {
	var d = controls.display;
	if (!d) return;
	var api = new LiveAPI("id " + d.id);
	api.call("send_value", 0, 0, selKick ? COL.kick : COL.laneOff);
	api.call("send_value", 1, 0, selBass ? COL.bass : COL.laneOff);
	for (var x = 2; x < 8; x++) api.call("send_value", x, 0, 0);
}

// ---------- status ----------
function showStatus() {
	if (!surface) { status("No Push found"); return; }
	var parts = [grabbed ? "GRABBED" : "released"];
	if (!enabled) parts.push("(takeover off)");
	else if (followFocus && !focused) parts.push("(track not selected)");
	parts.push("lanes " + (selKick ? "K" : "") + (selBass ? "B" : ""));
	parts.push("page " + (viewPage + 1));
	parts.push("trigs " + model.countTrigs(S.KICK) + "/" + model.countTrigs(S.BASS));
	status(parts.join(" · "));
}
function status(s) { outlet(0, s); }

// ---------- helpers ----------
function flatten(x) {
	if (x === undefined || x === null) return [];
	if (!(x instanceof Array)) {
		var s = String(x);
		return s.indexOf(" ") >= 0 ? s.split(" ") : [x];
	}
	var out = [];
	for (var i = 0; i < x.length; i++) out = out.concat(flatten(x[i]));
	return out;
}

function toId(res) {
	var a = flatten(res);
	for (var i = 0; i < a.length; i++) if (a[i] === "id" && i + 1 < a.length) return Number(a[i + 1]);
	var n = Number(a[a.length - 1]);
	return isNaN(n) ? 0 : n;
}
