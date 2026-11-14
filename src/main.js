// kbSequencer.js — main device script.
// Build steps 1–2: Push takeover, step data + storage.
// Pad layout (y 0 = top): rows 0–3 steps of the viewed page · tap empty =
// trig, lit = mute, muted = unmute · hold Delete + tap = wipe; rows 4–5 page
// pads; rows 6–7 note keyboard. Lower display buttons: 1 kick, 2 bass,
// 6 follow.
// Build step 3: playback (see "playback" section for the timing design).
// Build step 4: pad UI: step / page / note rows, follow mode, page viewing,
// loop by holding two page pads, note brush + audition, octave buttons.
// Encoders, p-lock gestures etc. come in later build steps.
//
// ES5 on purpose: runs in both [js] (Max 8) and [v8] (Max 9).

autowatch = 1;
inlets = 1;
outlets = 5; // 0: status text, 1: last event text, 2: storage list -> [pattr],
             // 3: event slots -> [coll] read by the patch's transport clock,
             // 4: audition note "lane pitch vel durMs ch" -> the lane chains

// S (the sequence model, src/seq_model.js) is bundled in above this line by tools/build.py.
var model = new S.Model();

// ---------- colours (Push palette indices; placeholders until tested) ----------
// Spec colours in comments. Tune live with "col <name> <index>", print with "cols".
var COL = {
	off: 0,
	kick: 3,          kickMuted: 124,  kickLocked: 3,    // orange · dim · lighter orange
	bass: 125,        bassMuted: 124,  bassLocked: 125,  // blue · dim · lighter blue
	both: 49,         bothMuted: 124,  bothLocked: 49,   // purple
	playhead: 122,    // white
	pageViewed: 122,  // white
	pagePlaying: 126, // green (follow off)
	pageTrigs: 123,   // mid grey: in loop, has trigs
	pageEmpty: 124,   // dim grey: in loop, empty
	noteRoot: 125,    // blue
	noteScale: 123,   // dim white
	noteBrush: 122,   // bright white
	noteDimmed: 124,  // only kick selected
	laneOff: 124,     // lane button not selected
	followOn: 122, followOff: 124,
	buttonOn: 127     // white-LED buttons (octave)
};

// ---------- UI state ----------
var selKick = true, selBass = false;
var viewPage = 0;
var deleteHeld = false, selectHeld = false;
var heldPages = [];     // page pads currently held, in press order
var follow = true;      // viewed page follows the playhead (display button 6)
var octave = 1;         // note keyboard octave; octave 1 root C = MIDI 36
var brushNote = 36;     // note new bass trigs get (tap a note pad)
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
	touches: "Track_Control_Touches",
	octaveUp: "Octave_Up_Button",
	octaveDown: "Octave_Down_Button"
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
	if (restoring) return;
	saveTask.schedule(250); // debounce bursts of edits
	refillSoon();           // edits reach the next steps without waiting a tick
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
	refillSoon();
	if (grabbed) defer(renderAll);
	showStatus();
}

// ---------- playback ----------
// Timing design: Max runs ALL JavaScript in the low-priority thread, so notes
// are never sent from here. The patch does the timing:
//   [metro 16n @quantize 16n] (Live transport, high priority)
//     -> [transport] raw ticks -> abs step = round(ticks / 120)
//     -> [% SLOTS] -> [coll] -> [makenote] -> [midiformat] -> [midiout]
// This script keeps the coll filled LOOKAHEAD steps ahead: after each tick
// (sent back here via [deferlow] as "tick <absStep>") and after every edit.
// At 150 BPM 4 steps is 400 ms of slack for the low-priority thread.
// Coll entry: slot, then per event: lane pitch velocity durMs channel;
// "slot -1" means nothing to play.
var SLOTS = 64;           // must match [% 64] in the patch (tools/build.py)
var LOOKAHEAD = 4;
var TICKS_PER_16TH = 120; // Live transport: 480 per quarter
var playing = false;
var lastAbs = -1;         // last abs step the patch played (or the start point)
var playStep = -1;        // sequence index under the playhead, -1 = none
var tempo = 120;
var randSeed = Math.floor(Math.random() * 100000);
var transportApi = null, tempoApi = null, songTimeApi = null;
var refillTask = new Task(refillWindow, this);

function stepMs() { return 60000 / tempo / 4; }

function setupTransport() {
	if (transportApi) return;
	transportApi = new LiveAPI(onIsPlaying, "live_set");
	transportApi.property = "is_playing";
	tempoApi = new LiveAPI(onTempo, "live_set");
	tempoApi.property = "tempo";
	songTimeApi = new LiveAPI(onSongTime, "live_set");
	songTimeApi.property = "current_song_time";
	tempo = Number(tempoApi.get("tempo")) || 120;
	playing = Number(transportApi.get("is_playing")) === 1;
	if (!playing) syncToSongTime(Number(songTimeApi.get("current_song_time")));
	refillWindow();
}

function teardownTransport() {
	if (transportApi) transportApi.property = "";
	if (tempoApi) tempoApi.property = "";
	if (songTimeApi) songTimeApi.property = "";
	transportApi = tempoApi = songTimeApi = null;
	refillTask.cancel();
}

function onIsPlaying(args) {
	var a = flatten(args);
	if (a[0] !== "is_playing") return;
	var was = playing;
	playing = Number(a[1]) === 1;
	if (was === playing) return;
	if (!playing) {
		var old = playStep;
		playStep = -1;
		defer(function () { renderStep(old); renderPages(); });
		defer(function () { syncToSongTime(Number(songTimeApi.get("current_song_time"))); refillWindow(); });
	}
	showStatus();
}

function onTempo(args) {
	var a = flatten(args);
	if (a[0] !== "tempo") return;
	tempo = Number(a[1]) || tempo;
	refillSoon(); // note lengths are in ms
}

// While stopped, keep the steps from the start position ready so the very
// first tick after pressing Play already has its events.
function onSongTime(args) {
	if (playing) return;
	var a = flatten(args);
	if (a[0] !== "current_song_time") return;
	var before = lastAbs;
	syncToSongTime(Number(a[1]));
	if (lastAbs !== before) refillSoon();
}

function syncToSongTime(beats) {
	if (isNaN(beats)) return;
	// The first tick will be at abs step ceil(beats*4); fill from there.
	lastAbs = Math.ceil(beats * 4 - 1e-6) - 1;
}

// From the patch, low priority, right after the clock played absStep.
function tick(absStep) {
	absStep = absStep | 0;
	var jumped = absStep !== lastAbs + 1; // start, song loop, or locate
	lastAbs = absStep;
	if (!playing) playing = true; // tick can arrive before the is_playing notification
	if (jumped) refillWindow(); else fillSlot(absStep + LOOKAHEAD);
	var old = playStep, oldPage = playPage();
	playStep = model.seqIndexFor(absStep);
	if (!grabbed || old === playStep) return;
	if (followPlayhead()) { renderAll(); showStatus(); return; }
	renderStep(old);
	renderStep(playStep);
	if (playPage() !== oldPage) renderPages();
}

function refillSoon() { refillTask.schedule(0); }

function refillWindow() {
	for (var k = 1; k <= LOOKAHEAD; k++) fillSlot(lastAbs + k);
}

function fillSlot(absStep) {
	var slot = ((absStep % SLOTS) + SLOTS) % SLOTS;
	var ev = model.eventsAt(absStep, stepMs(), randSeed);
	var msg = [slot];
	if (!ev.length) msg.push(-1);
	for (var i = 0; i < ev.length; i++) {
		var e = ev[i];
		msg.push(e.lane, e.pitch, e.velocity, e.durMs, e.channel);
	}
	outlet(3, msg);
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
	longPressTask.cancel();
	teardownTransport();
	teardownScale();
	release();
	if (selObserver) selObserver.property = "";
}

// ---------- setup ----------
function init() {
	initialised = true;
	post("kbSequencer " + BUILD_STAMP + "\n");
	setupTransport(); // playback works with or without Push
	setupScale();
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
	heldPages = [];
	cancelLongPress();
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
	if (role === "display") { if (pressed) onDisplayButton(v[1]); return; }
	if (role === "matrix") { onPad(v[1], v[2], pressed); return; }
	if (role === "octaveUp") { if (pressed) shiftOctave(1); return; }
	if (role === "octaveDown") { if (pressed) shiftOctave(-1); return; }
}

// Lower display buttons: 1 kick, 2 bass, 3–5 banks (step 6), 6 follow.
function onDisplayButton(x) {
	if (x === 0) { selKick = !selKick; if (!selKick && !selBass) selBass = true; } // one lane stays on
	else if (x === 1) { selBass = !selBass; if (!selKick && !selBass) selKick = true; }
	else if (x === 5) { follow = !follow; if (follow) followPlayhead(); }
	else return;
	renderAll();
	showStatus();
}

// Grid: y 0 = top row. Steps y 0–3, pages y 4–5, note keyboard y 6–7.
function onPad(x, y, pressed) {
	if (paletteBase >= 0) {
		if (pressed) post("kbSequencer: palette index " + (paletteBase + y * 8 + x) + "\n");
		return;
	}
	if (y <= 3) { if (pressed) onStepPad(viewPage * S.STEPS_PER_PAGE + y * 8 + x); return; }
	if (y <= 5) { onPagePad((y - 4) * 8 + x, pressed); return; }
	if (pressed) onNotePad(x, y);
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
			if (!st || !model.hasTrig(l, i)) model.addTrig(l, i, brushNote); // kick ignores the note
			else model.setMuted(l, i, !st.muted);
		}
	}
	renderStep(i);
	renderPages();
}

// Page pads. Select + pad: view that page (follow off). Hold one pad and
// press another: loop from the first to the second. Long-press one pad on
// its own: loop that single page. Plain tap: nothing.
// Page locks (hold + encoder) come in step 7; turning an encoder while a page
// is held must then call cancelLongPress() so a page lock never resets the loop.
var LONG_PRESS_MS = 500;
var longPressPage = -1;
var longPressTask = new Task(function () {
	if (heldPages.length !== 1 || heldPages[0] !== longPressPage) return;
	model.setLoop(longPressPage, longPressPage);
	longPressPage = -1;
	renderPages();
	showStatus();
}, this);
function cancelLongPress() { longPressTask.cancel(); longPressPage = -1; }

function onPagePad(page, pressed) {
	var at = heldPages.indexOf(page);
	if (!pressed) {
		if (at >= 0) heldPages.splice(at, 1);
		if (page === longPressPage) cancelLongPress(); // released early: a plain tap
		return;
	}
	if (selectHeld) {
		viewPage = page;
		follow = false;
		renderAll();
		showStatus();
		return;
	}
	if (at < 0) heldPages.push(page);
	if (heldPages.length === 1) {
		longPressPage = page;
		longPressTask.schedule(LONG_PRESS_MS);
	} else {
		cancelLongPress(); // second pad: range gesture instead
		model.setLoop(heldPages[0], page);
		renderPages();
		showStatus();
	}
}

// Note keyboard: bottom row (y 7) = notes 1–8, row above = 9–16. Tapping a
// note makes it the brush (new bass trigs get it) and auditions it.
// Hold step + note pad (set a step's note) comes in step 5.
function onNotePad(x, y) {
	var n = keyboardNotes()[(y === 7 ? 0 : 8) + x];
	if (n < 0) return;
	if (selBass) {
		brushNote = n;
		audition(S.BASS, n);
	} else {
		audition(S.KICK, model.settings.kickNote); // spec: may still audition the kick
	}
	renderNotes();
}

function shiftOctave(d) {
	var o = Math.max(S.MIN_OCTAVE, Math.min(S.MAX_OCTAVE, octave + d));
	if (o === octave) return;
	octave = o;
	renderNotes();
	renderOctaveButtons();
	showStatus();
}

// Sends one note through the patch's lane chains (same path as playback, so
// it reaches the sequencer's output and the kbLane devices). Low priority:
// fine for auditioning, never used for sequenced notes.
function audition(lane, pitch) {
	var ch = lane === S.KICK ? model.settings.kickChannel : model.settings.bassChannel;
	outlet(4, [lane, pitch, 100, Math.round(stepMs() * 2), ch]);
}

function selectedLanes() {
	var out = [];
	if (selKick) out.push(S.KICK);
	if (selBass) out.push(S.BASS);
	return out;
}

// ---------- scale (Live's Song scale) ----------
var scaleRoot = 0, scaleIntervals = [0, 2, 4, 5, 7, 9, 11];
var scaleApi = null;
// Polled, not observed: an observer on scale_intervals crashed Live inside
// Max's jsliveapi when Push's scale page changed the scale. A get() every
// 400 ms is cheap and only re-renders when the scale actually changed.
var SCALE_POLL_MS = 400;
var scaleTask = new Task(function () {
	if (readScale() && grabbed) renderNotes();
}, this);

function setupScale() {
	if (scaleApi) return;
	scaleApi = new LiveAPI("live_set");
	readScale();
	scaleTask.interval = SCALE_POLL_MS;
	scaleTask.repeat();
}
function teardownScale() {
	scaleTask.cancel();
	scaleApi = null;
}
// Returns true when the root or intervals changed.
function readScale() {
	if (!scaleApi) return false;
	var r = Number(flatten(scaleApi.get("root_note"))[0]);
	var iv = flatten(scaleApi.get("scale_intervals"));
	var list = [];
	for (var i = 0; i < iv.length; i++) { var n = Number(iv[i]); if (!isNaN(n)) list.push(n); }
	var changed = false;
	if (!isNaN(r) && r !== scaleRoot) { scaleRoot = r; changed = true; }
	if (list.length && list.join(",") !== scaleIntervals.join(",")) { scaleIntervals = list; changed = true; }
	return changed;
}
function keyboardNotes() {
	return S.keyboardNotes(scaleRoot, model.settings.scaleFollow ? scaleIntervals : S.CHROMATIC, octave);
}

// ---------- colour tuning (until final colours are picked) ----------
// "col <name> <index>" changes one colour live; "cols" prints them all.
function col(name, idx) {
	if (!(name in COL)) { post("kbSequencer: no colour '" + name + "'\n"); return; }
	COL[name] = Math.max(0, Math.min(127, idx | 0));
	padCache = {};
	if (grabbed) defer(renderAll);
}
function cols() { post("kbSequencer colours: " + JSON.stringify(COL) + "\n"); }

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
		renderNotes();
	}
	renderDisplayButtons();
	renderOctaveButtons();
}

function renderStep(i) {
	if (!grabbed || !controls.matrix || paletteBase >= 0) return;
	var local = i - viewPage * S.STEPS_PER_PAGE;
	if (local < 0 || local >= S.STEPS_PER_PAGE) return;
	var k = selKick && model.step(S.KICK, i), b = selBass && model.step(S.BASS, i);
	var c = COL.off;
	if (i === playStep) c = COL.playhead;
	else if (k && b) {
		var locked = model.hasLocks(S.KICK, i) || model.hasLocks(S.BASS, i);
		c = (k.muted && b.muted) ? COL.bothMuted : locked ? COL.bothLocked : COL.both;
	} else if (k) c = k.muted ? COL.kickMuted : model.hasLocks(S.KICK, i) ? COL.kickLocked : COL.kick;
	else if (b) c = b.muted ? COL.bassMuted : model.hasLocks(S.BASS, i) ? COL.bassLocked : COL.bass;
	sendPad(local % 8, local >> 3, c);
}

function playPage() { return playStep >= 0 ? Math.floor(playStep / S.STEPS_PER_PAGE) : -1; }

function renderPages() {
	if (!grabbed || !controls.matrix || paletteBase >= 0) return;
	var pp = playing ? playPage() : -1;
	for (var p = 0; p < S.PAGES; p++) {
		var c;
		if (p === viewPage) c = COL.pageViewed;
		else if (p === pp) c = COL.pagePlaying; // only differs from viewed when follow is off
		else if (p < model.loopStart || p > model.loopEnd) c = COL.off;
		else c = (model.pageHasTrigs(S.KICK, p) || model.pageHasTrigs(S.BASS, p)) ? COL.pageTrigs : COL.pageEmpty;
		sendPad(p % 8, 4 + (p >> 3), c);
	}
}

function renderNotes() {
	if (!grabbed || !controls.matrix || paletteBase >= 0) return;
	var notes = keyboardNotes();
	for (var k = 0; k < 16; k++) {
		var n = notes[k], c;
		if (n < 0) c = COL.off;
		else if (!selBass) c = COL.noteDimmed;
		else if (n === brushNote) c = COL.noteBrush;
		else if (((n - scaleRoot) % 12 + 12) % 12 === 0) c = COL.noteRoot;
		else c = COL.noteScale;
		sendPad(k % 8, k < 8 ? 7 : 6, c);
	}
}

function renderDisplayButtons() {
	var d = controls.display;
	if (!grabbed || !d) return;
	var api = new LiveAPI("id " + d.id);
	api.call("send_value", 0, 0, selKick ? COL.kick : COL.laneOff);
	api.call("send_value", 1, 0, selBass ? COL.bass : COL.laneOff);
	for (var x = 2; x < 5; x++) api.call("send_value", x, 0, COL.off); // banks: step 6
	api.call("send_value", 5, 0, follow ? COL.followOn : COL.followOff);
	api.call("send_value", 6, 0, COL.off);
	api.call("send_value", 7, 0, COL.off);
}

function renderOctaveButtons() {
	if (!grabbed) return;
	if (controls.octaveUp) new LiveAPI("id " + controls.octaveUp.id).call("send_value", octave < S.MAX_OCTAVE ? COL.buttonOn : COL.off);
	if (controls.octaveDown) new LiveAPI("id " + controls.octaveDown.id).call("send_value", octave > S.MIN_OCTAVE ? COL.buttonOn : COL.off);
}

// Follow mode: keep the viewed page on the playhead's page.
function followPlayhead() {
	var pp = playPage();
	if (!follow || !playing || pp < 0 || pp === viewPage) return false;
	viewPage = pp;
	return true;
}

// ---------- status ----------
function showStatus() {
	if (!surface) { status("No Push found"); return; }
	var parts = [grabbed ? "GRABBED" : "released"];
	if (!enabled) parts.push("(takeover off)");
	else if (followFocus && !focused) parts.push("(track not selected)");
	parts.push("lanes " + (selKick ? "K" : "") + (selBass ? "B" : ""));
	parts.push("page " + (viewPage + 1) + (follow ? " (follow)" : ""));
	parts.push("oct " + octave);
	parts.push((playing ? "playing" : "stopped") + " loop " + (model.loopStart + 1) + "-" + (model.loopEnd + 1));
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
