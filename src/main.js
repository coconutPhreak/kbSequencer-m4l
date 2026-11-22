// kbSequencer.js — main device script.
// Build steps 1–2: Push takeover, step data + storage.
// Pad layout (y 0 = top): rows 0–3 steps of the viewed page · tap empty =
// trig, lit = mute, muted = unmute · hold Delete + tap = wipe; rows 4–5 page
// pads; rows 6–7 note keyboard. Lower display buttons: 1 kick, 2 bass,
// 3–8 banks. Follow on: tap the playing page pad, or Shift + page pad.
// Build step 3: playback (see "playback" section for the timing design).
// Build step 4: pad UI: step / page / note rows, follow mode, page viewing,
// loop by holding two page pads, note brush + audition, octave buttons.
// Build step 5: step gestures: create on press, mute on release unless the
// held step was edited, hold step + note pad sets its note.
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
	// Page pads, normal mode: greys, white, green
	pageViewed: 122,  // white
	pagePlaying: 126, // green: page under the playhead
	pageLoop: 123,    // mid grey: other pages of the loop
	pageOther: 124,   // dim grey: outside the loop (every pad stays lit)
	// Page pads, performance mode: lane colours (kick / bass / both above),
	// bright = a lane's playhead is on that page, dim = the rest of its range
	perfQueued: 126,  // green: a switch waiting for the next beat
	// Preset display (note keyboard rows)
	slotActive: 122,  // white: the slot last loaded / saved
	slotDirty: 9,     // active slot with unsaved edits (placeholder)
	slotQueued: 126,  // green: load waiting for the next bar
	slotFull: 123,    // mid grey: has a pattern
	slotEmpty: 124,   // dim grey: empty
	noteRoot: 125,    // blue
	noteScale: 123,   // dim white
	noteBrush: 122,   // bright white
	noteDimmed: 124,  // only kick selected
	laneOff: 124,     // lane button not selected
	followOn: 122, followOff: 124,
	buttonOn: 127,    // white-LED buttons (octave)
	euKick: 4, euBass: 46, euBoth: 50, // Euclid hits (no manual step there): dimmer lane colours
	maskSel: 5, maskUnsel: 7          // lane button while its live mask is on
};

// ---------- UI state ----------
var selKick = true, selBass = false;
var viewPage = 0;
var deleteHeld = false, selectHeld = false;
var heldPages = [];     // page pads currently held, in press order
var shiftHeld = false;
var muteHeld = false;   // Mute + page pad: un-mute every step on that page
var follow = true;      // viewed page follows the playhead (display button 6)
var octave = 3;         // note keyboard octave; octave 1 root C = MIDI 36, 3 = C3 (60)
var brushNote = 60;     // note new bass trigs get (tap a note pad); C3
var paletteBase = -1; // >= 0 while showing the palette test

// ---------- takeover state ----------
var surface = null, surfaceIndex = -1;
var controls = {};
var grabbed = false, enabled = 1, followFocus = 1, focused = false;
var thisTrackId = 0, selObserver = null, initialised = false;
var padCache = {}; // "x,y" -> colour last sent
// Other LEDs: "role:x" -> value last sent. Live API objects are created once
// per control (creating one per LED send was a big part of encoder lag).
var ledCache = {};
function ledApi(role) {
	var c = controls[role];
	if (!c) return null;
	if (!c.out) c.out = new LiveAPI("id " + c.id);
	return c.out;
}
function sendLed(role, args) {
	var key = role + ":" + (args.length > 1 ? args[0] : ""), v = args.join(",");
	if (ledCache[key] === v) return;
	ledCache[key] = v;
	var a = ledApi(role);
	if (a) a.call.apply(a, ["send_value"].concat(args));
}

// Confirmed on Push 3 — see docs/push3-notes.md
var CONTROL_NAMES = {
	matrix: "Button_Matrix",
	deleteBtn: "Delete_Button",
	selectBtn: "Select_Button",
	display: "Track_State_Buttons",
	encoders: "Track_Controls",
	touches: "Track_Control_Touches",
	octaveUp: "Octave_Up_Button",
	octaveDown: "Octave_Down_Button",
	undoBtn: "Undo_Button",
	shiftBtn: "Shift_Button",
	duplicateBtn: "Duplicate_Button",
	muteBtn: "Global_Mute_Button",
	jog: "Jogwheel",                 // turn: next / previous bank
	jogPress: "Jogwheel_Press",      // Shift + press: performance mode on / off
	jogLeft: "Jogwheel_Left_nudge",  // nudge: previous bank
	jogRight: "Jogwheel_Right_nudge" // nudge: next bank
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
	if (encoderEdit) refillTask.schedule(ENCODER_REFILL_MS); // one refill per pause, not per tick
	else refillSoon();      // edits reach the next steps without waiting a tick
	historyChanged();
	if (presetView && grabbed) presetPaintTask.schedule(0); // unsaved mark
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
	resetHistory(); // a loaded Set / preset starts a fresh history
	refillSoon();
	if (grabbed) defer(renderAll);
	showStatus();
}

// ---------- undo / redo ----------
// Sequencer edits aren't Live parameters, so Live's undo can't see them.
// The device keeps its own history: a snapshot (the encoded model) of the
// state before each edit. Every change made inside one gesture (a page
// wipe's 64 wipes, testfill, clearall) is committed as one entry on the next
// scheduler tick. While the device has Push, Undo steps back, Shift + Undo
// steps forward; released, Push's Undo is Live's again.
var HISTORY_MAX = 50;
var undoStack = [], redoStack = [];
var historyNow = model.encode(), historyKey = historyNow.join(" ");
var historyTask = new Task(commitHistory, this);
var historyPending = false;

var encoderEdit = false;   // set while an encoder edits: group a turn into one undo
var ENCODER_REFILL_MS = 60;
var ENCODER_UNDO_MS = 600;
var FINE_FACTOR = 4;       // fine turns: ticks per value multiplied by this
var MACRO_COARSE = 8;      // Shift + turn on a macro lock: units per value
function historyChanged() {
	if (encoderEdit) { historyPending = true; historyTask.schedule(ENCODER_UNDO_MS); return; }
	if (historyPending) return;
	historyPending = true;
	historyTask.schedule(0);
}
function commitHistory() {
	historyTask.cancel();
	if (!historyPending) return;
	historyPending = false;
	var enc = model.encode(), key = enc.join(" ");
	if (key === historyKey) return; // changed and changed back
	undoStack.push(historyNow);
	if (undoStack.length > HISTORY_MAX) undoStack.shift();
	redoStack = [];
	historyNow = enc;
	historyKey = key;
	renderUndoButton();
}
function resetHistory() {
	historyTask.cancel();
	historyPending = false;
	undoStack = [];
	redoStack = [];
	historyNow = model.encode();
	historyKey = historyNow.join(" ");
	renderUndoButton();
}
function undo() { stepHistory(undoStack, redoStack, "undo"); }
function redo() { stepHistory(redoStack, undoStack, "redo"); }
function stepHistory(from, to, what) {
	commitHistory(); // an edit from this same tick goes in first
	if (!from.length) { post("kbSequencer: nothing to " + what + "\n"); return; }
	to.push(historyNow);
	historyNow = from.pop();
	historyKey = historyNow.join(" ");
	restoring = true;
	model.decode(historyNow);
	restoring = false;
	saveTask.schedule(250);
	refillSoon();
	heldSteps = [];
	cancelPageHold();
	post("kbSequencer: " + what + " (" + undoStack.length + " undo / " + redoStack.length + " redo left)\n");
	renderAll();
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
var playSteps = [-1, -1]; // per lane: sequence index under the playhead, -1 = none
var playStartAbs = 0;     // abs step playback started from (bursts don't reach back past it)
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
		var old = playSteps;
		playSteps = [-1, -1];
		defer(function () { renderStep(old[0]); renderStep(old[1]); renderPages(); });
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
	playStartAbs = lastAbs + 1;
}

// From the patch, low priority, right after the clock played absStep.
function tick(absStep) {
	absStep = absStep | 0;
	var pendingBefore = perfPendingAny(); // a switch waiting until now: repaint the page pads
	var jumped = absStep !== lastAbs + 1; // start, song loop, or locate
	if (jumped) { playStartAbs = absStep; model.perfCollapse(); } // retrig bursts only from here on
	lastAbs = absStep;
	if (refillFloor > -Infinity && absStep >= refillFloor) refillFloor = -Infinity;
	if (pendingLoad && (jumped || absStep + LOOKAHEAD >= pendingLoad.at)) applyLoad(jumped);
	if (model.perf && !perfMode && model.perfPrune(absStep)) model.setPerf(false); // exit fully done
	else if (model.perf) model.perfPrune(absStep);
	if (!playing) playing = true; // tick can arrive before the is_playing notification
	if (jumped) refillWindow(); else fillSlot(absStep + LOOKAHEAD);
	var old = playSteps, oldPage = playPage();
	playSteps = [model.seqIndexFor(absStep, S.KICK), model.seqIndexFor(absStep, S.BASS)];
	if (old[0] !== playSteps[0] || old[1] !== playSteps[1]) screenDirty();
	if (!grabbed || (old[0] === playSteps[0] && old[1] === playSteps[1])) return;
	if (followPlayhead()) { renderAll(); showStatus(); return; }
	for (var l = 0; l < 2; l++) { renderStep(old[l]); renderStep(playSteps[l]); }
	var pg = function (st) { return st >= 0 ? Math.floor(st / S.STEPS_PER_PAGE) : -1; };
	if (playPage() !== oldPage || pendingBefore !== perfPendingAny() ||
		(perfMode && (pg(old[0]) !== pg(playSteps[0]) || pg(old[1]) !== pg(playSteps[1])))) renderPages();
}

function refillSoon() { refillTask.schedule(0); }

function refillWindow() {
	for (var k = 1; k <= LOOKAHEAD; k++) if (lastAbs + k >= refillFloor) fillSlot(lastAbs + k);
}

function fillSlot(absStep) {
	var slot = ((absStep % SLOTS) + SLOTS) % SLOTS;
	var ev = model.eventsAt(absStep, stepMs(), randSeed, playStartAbs);
	var msg = [slot];
	if (!ev.length) msg.push(-1);
	for (var i = 0; i < ev.length; i++) {
		var e = ev[i];
		msg.push(e.offMs, e.lane, e.pitch, e.velocity, e.durMs, e.channel);
	}
	outlet(3, msg);
}

// ---------- messages from the device UI ----------
function bang() { init(); } // [live.thisdevice]
function rescan() { release(); init(); }
// Device bank > Rescan shows "Done" for a second after it runs.
var rescanShown = false;
var rescanTask = new Task(function () { rescanShown = false; updateDisplay(); }, this);
function enable(v) { enabled = v ? 1 : 0; if (initialised) defer(updateGrab); }
function autofocus(v) { followFocus = v ? 1 : 0; if (initialised) defer(updateGrab); }
// Takeover parameter (device view, Settings bank encoder 8; saved with the
// Set): 0 Off, 1 only while this track is selected, 2 always. Arrives from
// the parameter's output: an encoder edit, a click, or Push turning it
// natively while the device has let go (Off / track not selected).
var takeoverMode = 1;
var TAKEOVER_NAMES = ["off", "track selected", "always"];
function takeover(v) {
	v = Math.max(0, Math.min(2, Number(v) | 0));
	takeoverMode = v;
	enabled = v > 0 ? 1 : 0;
	followFocus = v === 1 ? 1 : 0;
	post("kbSequencer: takeover " + TAKEOVER_NAMES[v] + "\n");
	if (initialised) defer(updateGrab);
	updateDisplay();
}
function readTakeover() { // the stored value, at init (the parameter may not output on load)
	var o = this.patcher ? this.patcher.getnamed("pv_takeover") : null;
	if (!o) return;
	var v = Number(o.getvalueof());
	if (!isNaN(v)) { takeoverMode = Math.max(0, Math.min(2, v | 0)); enabled = takeoverMode > 0 ? 1 : 0; followFocus = takeoverMode === 1 ? 1 : 0; }
}

function dump() {
	post("kbSequencer: loop pages " + (model.loopStart + 1) + "–" + (model.loopEnd + 1) + ", length K " + model.lanes[0].length + " B " + model.lanes[1].length + ", settings " + JSON.stringify(model.settings) + "\n");
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
	var notes = [60, 60, 67, 65];
	for (var j = 2; j < 64; j += 4) {
		model.addTrig(S.BASS, j, notes[(j >> 2) % 4]);
		if (j % 8 === 2) model.setLock(S.BASS, j, S.PARAM_ID.slide, 1);
	}
	model.setLock(S.KICK, 0, S.PARAM_ID.velocity, 127);
	model.setLock(S.BASS, 6, S.PARAM_ID.m1, 50);
	model.setLoop(0, 1);
	model.setSetting("kickNote", 60);
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
	padCache = {}; ledCache = {};
	if (base < 0) {
		paletteBase = -1;
		post("kbSequencer: palette test off\n");
	} else {
		paletteBase = Math.min(64, base);
		post("kbSequencer: palette " + paletteBase + "–" + (paletteBase + 63) + " (palette -1 to exit)\n");
	}
	if (grabbed) defer(renderAll);
}

// A deleted kbSequencer releases Push's controls. If another one grabbed them
// already (a device replaced by a new copy: the new one loads and grabs
// before the old one is deleted), that release takes them away from it
// without it knowing. So the deleted one tells the others to grab again.
var deleting = false;
function notifydeleted() {
	deleting = true;
	screenTask.cancel();
	if (viewObs) { viewObs.property = ""; viewObs = null; }
	saveTask.cancel();
	grabTask.cancel();
	repaintTask.cancel();
	pageShowTask.cancel();
	refreshTask.cancel();
	teardownTransport();
	teardownScale();
	try { release(); } catch (e) {}
	if (selObserver) selObserver.property = "";
	messnamed("kbSeqCmd", "regrab");
}

// [receive kbSeqCmd] "regrab": grab again if this device should own Push.
function regrab() {
	if (deleting || !initialised) return;
	grabTask.cancel();
	if (grabbed) {
		for (var role in controls) if (controls[role].api) { controls[role].api.property = ""; controls[role].api = null; }
		grabbed = false;
	}
	updateGrab(); // grabs after GRAB_DELAY_MS, once the release has gone through
}

// ---------- setup ----------
function init() {
	initialised = true;
	post("kbSequencer " + BUILD_STAMP + "\n");
	setupTransport(); // playback works with or without Push
	setupScale();
	refresh(); // ask the kbLanes for their macros
	readTakeover();
	findPush();
	if (!surface) { status("No Push found — is Push set as a control surface?"); return; }
	setupScreen();
	resolveControls();
	setupFocus();
	ensureBanks();
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
	deleteHeld = selectHeld = shiftHeld = muteHeld = false;
	dupHeld = false; clip = null; dupAnchor = -1; dupPageAnchor = -1; clearLatch = false;
	heldPages = [];
	heldSteps = [];
	pageHold = null;
	pageShowTask.cancel();
	padCache = {}; ledCache = {};
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
	padCache = {}; ledCache = {};
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
	// Push now shows this device's bank: make it Settings, so Push can turn
	// Takeover (encoder 8) back on.
	heldSteps = []; pageHold = null;
	bankSel.settings = 0;
	lastBankSig = "";
	updateDisplay();
	showStatus();
}

// ---------- input ----------
function makeHandler(role) {
	return function (args) {
		var a = flatten(args);
		if (a[0] !== "value") return;
		var v = [];
		for (var i = 1; i < a.length; i++) v.push(Number(a[i]));
		if (!v.length || isNaN(v[0])) return; // the call an observer makes when it's set up
		outlet(1, role + " " + v.join(" "));
		defer(function () { handleInput(role, v); });
	};
}

function handleInput(role, v) {
	var pressed = v[0] > 0;
	if (role === "deleteBtn") { onDelete(pressed); return; }
	if (role === "selectBtn") { selectHeld = pressed; return; }
	if (role === "shiftBtn") { shiftHeld = pressed; return; }
	if (role === "muteBtn") { muteHeld = pressed; return; }
	if (role === "duplicateBtn") {
		if (pressed && shiftHeld) { printEuclid(); dupPrinted = true; return; }
		if (!pressed && dupPrinted) { dupPrinted = false; return; }
		onDuplicate(pressed);
		return;
	}
	if (role === "undoBtn") { if (pressed) { if (shiftHeld) redo(); else undo(); } return; }
	if (role === "display") { if (pressed) onDisplayButton(v[1]); return; }
	if (role === "matrix") { onPad(v[1], v[2], pressed); return; }
	if (role === "octaveUp") { if (pressed) { if (shiftHeld) togglePresetView(); else shiftOctave(1); } return; }
	if (role === "octaveDown") { if (pressed) shiftOctave(-1); return; }
	if (role === "encoders") { onEncoder(v); return; }
	if (role === "touches") { onTouch(v); return; }
	if (role === "jog") { onJog(v); return; }
	if (role === "jogPress") { if (pressed && shiftHeld) togglePerf(); return; }
	if (role === "jogLeft") { if (pressed) stepBank(-1); return; }
	if (role === "jogRight") { if (pressed) stepBank(1); return; }
}

// Jog wheel: each turn message steps one bank in the current context (no
// wrap-around); the direction comes from the relative value, like the
// encoders. The first few raw messages go to the Max Console (format check).
var jogLogLeft = 6;
function onJog(v) {
	if (jogLogLeft > 0) { jogLogLeft--; post("kbSequencer: jog raw " + v.join(" ") + "\n"); }
	var d = encoderDelta(v[0]);
	if (d) stepBank(d > 0 ? 1 : -1);
}
function stepBank(d) {
	var c = context(), bi = bankSel[c] + d;
	if (bi < 0 || bi >= BANKS[c].length) return;
	selectBank(c, bi);
}
function selectBank(c, bi) {
	// Picking a bank while a step / page pad is held counts as using it: the
	// pad won't mute (or view / loop) on release.
	if (heldSteps.length) markHeldEdited();
	if (pageHold) pageHold.edited = true;
	bankSel[c] = bi;
	encAcc = [0, 0, 0, 0, 0, 0, 0, 0];
	renderAll();
	showStatus();
}

// Display buttons: 1 kick, 2 bass, 3–8 banks (see BANK_BUTTONS).
function onDisplayButton(x) {
	if (muteHeld && (x === 0 || x === 1)) { maskLanes(x === 0 ? S.KICK : S.BASS); return; }
	if (shiftHeld && (x === 0 || x === 1)) { toggleMask(x === 0 ? S.KICK : S.BASS); return; }
	if (x === 0) { selKick = !selKick; if (!selKick && !selBass) selBass = true; } // one lane stays on
	else if (x === 1) { selBass = !selBass; if (!selKick && !selBass) selKick = true; }
	else if (BANK_BUTTONS.indexOf(x) >= 0) {
		var c = context(), bi = BANK_BUTTONS.indexOf(x);
		if (bi >= BANKS[c].length) return;
		selectBank(c, bi);
		return;
	}
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
	if (y <= 3) { onStepPad(y * 8 + x, pressed); return; }
	if (y <= 5) { onPagePad((y - 4) * 8 + x, pressed); return; }
	if (!pressed) return;
	if (presetView) onSlotPad((y === 6 ? 0 : 8) + x); else onNotePad(x, y);
}

// Step pads (build step 5). An empty step gets its trig on press, so it can
// be held and edited straight away. A lit step mutes / unmutes on release,
// and only after a quick tap (under TAP_MS) with nothing edited while it was
// held (encoder turn or note pad): holding a step to edit it never mutes it. Delete + tap wipes on press.
// heldSteps: { pad, i, created, edited }. pad is the local pad (0–31) and i
// the absolute step fixed at press, so a page change can't retarget it.
var heldSteps = [];
// A release only mutes / unmutes after a quick tap: shorter than TAP_MS.
var TAP_MS = 300;
function now() { return new Date().getTime(); }

function heldStepAt(pad) {
	for (var k = 0; k < heldSteps.length; k++) if (heldSteps[k].pad === pad) return k;
	return -1;
}

function onStepPad(pad, pressed) {
	if (dupHeld) { onDupStep(pad, pressed); return; }
	var lanes = selectedLanes();
	if (!pressed) {
		var at = heldStepAt(pad);
		if (at < 0) return;
		var h = heldSteps.splice(at, 1)[0];
		var quick = now() - h.at < TAP_MS; // a longer hold is for editing, never a mute
		if (!h.created && !h.edited && quick) {
			// Decide from the first selected lane that has a trig, so both lanes move together.
			var ref = null;
			for (var r = 0; r < lanes.length && !ref; r++) ref = model.step(lanes[r], h.i);
			if (ref) {
				var mute = !ref.muted;
				for (var m = 0; m < lanes.length; m++) model.setMuted(lanes[m], h.i, mute);
			}
		}
		renderStep(h.i);
		renderNotes();
		if (!heldSteps.length) { renderDisplayButtons(); updateDisplay(); endClearLatch(); } // back to settings
		return;
	}
	var i = viewPage * S.STEPS_PER_PAGE + pad;
	if (shiftHeld && !heldSteps.length) { setEndStep(i); return; }
	if (deleteHeld) {
		for (var k = 0; k < lanes.length; k++) model.wipe(lanes[k], i);
		renderStep(i);
		renderPages();
		return;
	}
	if (heldStepAt(pad) >= 0) return;
	// Create on press when the first selected lane is empty; any other
	// selected lane that is empty gets a trig too.
	var created = !model.hasTrig(lanes[0], i);
	if (created) for (var j = 0; j < lanes.length; j++) model.addTrig(lanes[j], i, brushNote); // kick ignores the note
	heldSteps.push({ pad: pad, i: i, created: created, edited: false, at: now() });
	renderStep(i);
	renderPages();
	renderNotes(); // keyboard shows the held step's note
	renderDisplayButtons();
	updateDisplay(); // Push shows the held step
}

// Shift + tap a step: the selected lanes' loop ends on that step (their
// Length, counted from the loop's start page). Steps aren't created or muted.
function setEndStep(i) {
	var lanes = selectedLanes();
	for (var k = 0; k < lanes.length; k++) model.setLaneEnd(lanes[k], i);
	post("kbSequencer: end step " + (i % S.STEPS_PER_PAGE + 1) + " on page " + (Math.floor(i / S.STEPS_PER_PAGE) + 1) +
		" · Length kick " + model.lanes[S.KICK].length + " / bass " + model.lanes[S.BASS].length + "\n");
	renderAll();
	updateDisplay();
	showStatus();
}

// Anything that edits the held steps makes their release not a tap.
function markHeldEdited() {
	for (var k = 0; k < heldSteps.length; k++) heldSteps[k].edited = true;
}

// ---------- encoders, banks and the Push display (build step 6) ----------
// Push can't be custom-drawn: it shows the device's parameters. The device
// has one Push bank, rewritten with live.banks to hold whichever 8 display
// parameters (DISPLAY_PARAMS, made by tools/build.py) the context needs, and
// the script sets their values ("set", no output) for Push to show.
// The encoders stay grabbed and edit the sequence directly.
//   Nothing held:  display buttons 3 / 4 / 5 = Settings / Kick Euclid / Bass Euclid.
//   Step held:     display buttons 3–8 = Step / Retrig / Rt Chance / More /
//                  Slide / Macro Locks, showing the held step.
// Macro Locks shows the lane of the held trig (else the first selected lane);
// slots without a visible macro on that lane's Rack show "-".
var BANKS = {
	settings: [
		{ name: "Settings", items: ["kickChannel", "bassChannel", "kickNote", "bendRange", "scaleFollow", "swing", "macroRefresh", "takeover"] },
		{ name: "Kick Euclid", items: ["kLength", "kEuSteps", "kEuPulses", "kEuRotate", "kEuLayer", "kEuVel", "kEuFollow", null] },
		{ name: "Bass Euclid", items: ["bLength", "bEuSteps", "bEuPulses", "bEuRotate", "bEuLayer", "bEuVel", "bEuFollow", "bEuNote"] },
		// turn encoder N to step slot N's target through the
		// parameters on the lane's track (first selected lane); the bank
		// title shows the picked parameter.
		{ name: "CC Map", items: ["map1", "map2", "map3", "map4", "map5", "map6", "map7", "map8"] },
		// Group = the device's Group box; Rescan = its rescan button
		{ name: "Device", items: ["groupView", "rescanView", null, null, null, null, null, null] }
	],
	step: [
		{ name: "Step", items: ["note", "velocity", "length", "microtime", "probability", "accent", "slide", "tie"] },
		{ name: "Retrig", items: ["retrig", "retrigRate", "length", "retrigFade", "retrigCurve", "retrigProb", "retrigTRate", "retrigGlide"] }, // Length = the Step bank's Length
		{ name: "Rt Chance", items: ["retrigProb", "retrigLock", "retrigPMode", "retrigVoices", null, null, null, null] },
		{ name: "More", items: ["fill", "condition", null, null, null, null, null, null] },
		{ name: "Slide", items: ["slide", "tie", "slideTime", "slideCurve", null, null, null, null] },
		{ name: "CC Locks", items: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"] }
	]
};
// Display buttons that pick banks (0-based): 3–8 (8 = Macro Locks while a
// step is held); 6–8 are free with nothing held.
var BANK_BUTTONS = [2, 3, 4, 5, 6, 7];
// Lane items of the Euclid banks: display key -> [lane, field] (field
// "length" = the lane's Length, else an Euclid setting).
var LANE_ITEMS = {};
(function () {
	var f = { Length: "length", EuSteps: "steps", EuPulses: "pulses", EuRotate: "rotate", EuLayer: "layer", EuVel: "velocity", EuNote: "note", EuFollow: "follow" };
	for (var k in f) { LANE_ITEMS["k" + k] = [0, f[k]]; LANE_ITEMS["b" + k] = [1, f[k]]; }
})();
function laneItemValue(key) {
	var li = LANE_ITEMS[key], lane = model.lanes[li[0]];
	return li[1] === "length" ? lane.length : lane.euclid[li[1]];
}
// Display units -> stored units, for values shown in steps.
var DISPLAY_SCALE = { retrigGlide: 4 };
var bankSel = { settings: 0, step: 0 };
var banksReady = false, lastBankSig = "";
var encAcc = [0, 0, 0, 0, 0, 0, 0, 0];
var encLogLeft = 6; // print the first few raw encoder messages (format check)

function context() { return heldSteps.length || (pageHold && pageHold.shown) ? "step" : "settings"; }
function currentBank() { var c = context(); return BANKS[c][bankSel[c]]; }
function editLane() { return selKick ? S.KICK : S.BASS; }

// Items hidden in the current state (Note and Slide need bass; a macro slot
// needs a visible macro on its lane's Rack).
function itemShown(key) {
	if (!key) return false;
	if ((key === "note" || key === "slide" || key === "slideTime" || key === "slideCurve") && !selBass) return false;
	if (MACRO_KEY.test(key)) return Number(key.slice(1)) <= macroCount(macroLane());
	return true;
}
var MACRO_KEY = /^m[1-8]$/;
var MAP_KEY = /^map[1-8]$/; // CC Map bank
var mapTitle = "";          // last picked target, shown as the bank title
var mapPending = null;      // { lane, slot } of the last pick, until its report arrives

// The held step and the lane its values are read from: the first selected
// lane with a trig there.
// With a page held: the first trig on the page (null if the page is empty).
function heldTarget() {
	var lanes = selectedLanes(), k;
	if (heldSteps.length) {
		var i = heldSteps[0].i;
		for (k = 0; k < lanes.length; k++) if (model.hasTrig(lanes[k], i)) return { lane: lanes[k], i: i };
		return { lane: lanes[0], i: i };
	}
	if (pageHold) {
		var first = pageHold.page * S.STEPS_PER_PAGE;
		for (var j = first; j < first + S.STEPS_PER_PAGE; j++)
			for (k = 0; k < lanes.length; k++) if (model.hasTrig(lanes[k], j)) return { lane: lanes[k], i: j };
	}
	return null;
}

// Every trig a lock edit writes to: the held steps (or every trig on the
// held page; muted ones count) on the selected lanes.
function lockTargets() {
	var out = [], lanes = selectedLanes(), k, l;
	if (heldSteps.length) {
		for (k = 0; k < heldSteps.length; k++)
			for (l = 0; l < lanes.length; l++) if (model.hasTrig(lanes[l], heldSteps[k].i)) out.push({ lane: lanes[l], i: heldSteps[k].i });
	} else if (pageHold) {
		var first = pageHold.page * S.STEPS_PER_PAGE;
		for (var i = first; i < first + S.STEPS_PER_PAGE; i++)
			for (l = 0; l < lanes.length; l++) if (model.hasTrig(lanes[l], i)) out.push({ lane: lanes[l], i: i });
	}
	return out;
}

// Value of a display item, in the display parameter's own units.
function itemValue(key) {
	if (MAP_KEY.test(key)) { var mi = macroInfo[editLane()]; return mi && mi.codes ? mi.codes[Number(key.slice(3)) - 1] || 0 : 0; }
	if (key === "macroRefresh") return refreshShown ? 1 : 0;
	if (key === "takeover") return takeoverMode;
	if (key === "groupView") return laneGroup;
	if (key === "rescanView") return rescanShown ? 1 : 0;
	if (LANE_ITEMS[key]) return laneItemValue(key);
	if (key in model.settings) return model.settings[key];
	var t = heldTarget();
	if (key === "note") {
		var bs = t && model.step(S.BASS, t.i);
		return bs ? bs.note : brushNote;
	}
	var pid = S.PARAM_ID[key];
	var v = t ? model.value(t.lane, t.i, pid) : model.lanes[editLane()].defaults[pid];
	if (DISPLAY_SCALE[key]) return v / DISPLAY_SCALE[key];
	return v;
}

var pvObjs = {}, pvSent = {};
function setDisplayParam(key, v) {
	if (pvSent[key] === v) return;
	var o = pvObjs[key];
	if (!o) o = pvObjs[key] = this.patcher ? this.patcher.getnamed("pv_" + key) : null;
	if (!o) return;
	pvSent[key] = v;
	o.message("set", v);
}

// live.banks: make sure the device has exactly one bank, then keep it current.
function ensureBanks() {
	var b = this.patcher ? this.patcher.getnamed("banks") : null;
	if (b) b.message("getcount");
}
function banks() {
	var a = arrayfromargs(arguments);
	if (a[0] !== "count") return;
	var n = Number(a[1]) || 0, b = this.patcher.getnamed("banks");
	for (var k = n - 1; k >= 1; k--) b.message("delete", k);
	var bank = BANKS.settings[0];
	var msg = [n > 0 ? "edit" : "new", 0, bank.name].concat(bank.items.map(function (k) { return k ? DISPLAY_PARAMS[k].longname : "-"; }));
	b.message.apply(b, msg);
	banksReady = true;
	lastBankSig = "";
	pvSent = {};
	updateDisplay();
}

function updateDisplay() {
	screenDirty();
	if (!banksReady) return;
	var bank = currentBank(), names = [];
	for (var k = 0; k < 8; k++) names.push(itemShown(bank.items[k]) ? DISPLAY_PARAMS[bank.items[k]].longname : "-");
	var bname = (perfMode ? "PERF " : "") + (model.activeSlot >= 0 ? "P" + (model.activeSlot + 1) + (model.isDirty() ? "* " : " ") : "") + bank.name;
	if (bank.name === "CC Map") bname = mapTitle || ("CC Map " + S.LANE_NAMES[editLane()] + ": turn to pick");
	var sig = bname + "|" + names.join("|");
	if (sig !== lastBankSig) {
		var b = this.patcher ? this.patcher.getnamed("banks") : null;
		if (!b) return; // device being deleted
		b.message.apply(b, ["edit", 0, bname].concat(names));
		lastBankSig = sig;
	}
	for (var j = 0; j < 8; j++) if (itemShown(bank.items[j])) setDisplayParam(bank.items[j], itemValue(bank.items[j]));
}

// Encoder ticks per value step: small ranges (menus, channels) move slower.
function ticksPerStep(key) {
	var d = DISPLAY_PARAMS[key];
	if (DISPLAY_SCALE[key]) return 1; // shown in steps, edited in the stored unit
	if (d.kind === "enum") return d.items > 8 ? 2 : 4; // long lists (RATE, LEN) move faster
	return (d.hi - d.lo) <= 48 ? 4 : 1;
}

// Push encoders are relative: 1..63 = clockwise ticks, 65..127 = counter-clockwise.
function encoderDelta(raw) {
	raw = Number(raw);
	if (raw > 64) return raw - 128;
	return raw;
}

function onEncoder(v) {
	if (encLogLeft > 0) { encLogLeft--; post("kbSequencer: encoder raw " + v.join(" ") + "\n"); }
	var idx = v[1] | 0, d = encoderDelta(v[0]);
	if (idx < 0 || idx > 7 || !d) return;
	var locking = heldSteps.length || pageHold;
	if (locking) {
		markHeldEdited();
		if (pageHold) {
			pageHold.edited = true; // no view / loop on release
			if (!pageHold.shown) pageShowTask.fire();
		}
	}
	var key = currentBank().items[idx];
	if (!itemShown(key)) return;
	encAcc[idx] += d;
	// Macro locks are fine by default and Shift + turn is coarse (MACRO_COARSE
	// units per value); everything else is normal, Shift + turn = fine.
	var d0 = DISPLAY_PARAMS[key], macro = MACRO_KEY.test(key);
	var fine = macro ? !shiftHeld : shiftHeld && d0.kind !== "enum";
	if (MAP_KEY.test(key)) fine = true; // one parameter per detent
	var per = ticksPerStep(key) * (fine ? FINE_FACTOR : 1), steps = (encAcc[idx] / per) | 0;
	if (!steps) return;
	encAcc[idx] -= steps * per;
	// Fine: 4× the ticks per value, and one value per message at most (Push's
	// encoder acceleration would otherwise still jump).
	if (fine && Math.abs(steps) > 1) { steps = steps > 0 ? 1 : -1; encAcc[idx] = 0; }
	if (macro && shiftHeld) steps *= MACRO_COARSE;
	// Short menus (Layer, On/Off…) move one item per message: Push's encoder
	// acceleration could otherwise jump over the middle item of three.
	if (d0.kind === "enum" && d0.items <= 4 && Math.abs(steps) > 1) { steps = steps > 0 ? 1 : -1; encAcc[idx] = 0; }
	if (locking) editLock(key, steps); else editSetting(key, steps);
}

// Hold step(s) / page + turn: every target gets the shown value moved by
// `steps`. On a page the first turn makes every trig jump to the first
// trig's value; then they move together.
function editLock(key, steps) {
	var targets = lockTargets();
	if (!targets.length) return;
	var base = itemValue(key), k;
	encoderEdit = true;
	if (key === "note") {
		for (k = 0; k < targets.length; k++) if (targets[k].lane === S.BASS) model.setNote(S.BASS, targets[k].i, base + steps);
	} else {
		var pid = S.PARAM_ID[key];
		if (DISPLAY_SCALE[key]) base = Math.round(base * DISPLAY_SCALE[key]);
		var v = base + steps;
		for (k = 0; k < targets.length; k++) model.setLock(targets[k].lane, targets[k].i, pid, v);
	}
	encoderEdit = false;
	// Only the touched steps (locked colour) and the values on Push.
	for (k = 0; k < targets.length; k++) renderStep(targets[k].i);
	updateDisplay();
	if (key === "note") renderNotes();
}

// Hold step(s) / page + Delete + touch an encoder: clear that parameter's
// lock on every target (the default plays again).
// Latch: pressing Delete while a step or page pad is held turns on clear
// mode until that pad is let go (Delete lit), so touching encoders clears
// their locks without keeping Delete held.
var clearLatch = false;
function onDelete(pressed) {
	deleteHeld = pressed;
	if (!pressed || !(heldSteps.length || pageHold)) return;
	clearLatch = true;
	markHeldEdited(); // the held step won't mute on release
	if (pageHold) { pageHold.edited = true; if (!pageHold.shown) pageShowTask.fire(); }
	renderDeleteButton();
}
function endClearLatch() {
	if (heldSteps.length || pageHold || !clearLatch) return;
	clearLatch = false;
	renderDeleteButton();
}
function renderDeleteButton() {
	if (!grabbed || !controls.deleteBtn) return;
	sendLed("deleteBtn", [clearLatch ? COL.buttonOn : COL.off]);
}

var touchLogLeft = 4;
function onTouch(v) {
	if (touchLogLeft > 0) { touchLogLeft--; post("kbSequencer: touch raw " + v.join(" ") + "\n"); }
	if (!(v[0] > 0) || !(deleteHeld || clearLatch) || !(heldSteps.length || pageHold)) return;
	markHeldEdited();
	if (pageHold) { pageHold.edited = true; if (!pageHold.shown) pageShowTask.fire(); }
	var key = currentBank().items[v[1] | 0];
	if (!itemShown(key) || key === "note") { updateDisplay(); return; }
	var targets = lockTargets(), pid = S.PARAM_ID[key];
	for (var k = 0; k < targets.length; k++) model.clearLock(targets[k].lane, targets[k].i, pid);
	renderAll();
}

function editSetting(key, steps) {
	encoderEdit = true;
	if (LANE_ITEMS[key]) {
		var li = LANE_ITEMS[key], v = laneItemValue(key) + steps;
		if (li[1] === "length") model.setLaneLength(li[0], v); else model.setEuclid(li[0], li[1], v);
		encoderEdit = false;
		renderAll(); // hits, loop pages and playhead change
		showStatus();
		return;
	}
	if (key === "macroRefresh") {
		encoderEdit = false;
		refresh();
		return;
	}
	if (MAP_KEY.test(key)) { // ask the lane's kbLane to step the slot's target
		encoderEdit = false;
		var lc = this.patcher ? this.patcher.getnamed("lane_cmd") : null, l = editLane(), slot = Number(key.slice(3));
		mapPending = { lane: l, slot: slot };
		if (lc) lc.message("pick", laneGroup, l, slot, steps > 0 ? 1 : -1);
		return;
	}
	if (key === "groupView") { // through the Group box, so it's saved; its output calls group()
		encoderEdit = false;
		var gb = this.patcher ? this.patcher.getnamed("Group") : null, ng = Math.max(1, Math.min(16, laneGroup + steps));
		if (ng === laneGroup) return;
		if (gb) gb.message("int", ng); else group(ng);
		updateDisplay();
		return;
	}
	if (key === "rescanView") { // release and grab again, then come back to this bank
		encoderEdit = false;
		var keep = bankSel.settings;
		defer(function () {
			rescan();
			bankSel.settings = keep;
			rescanShown = true;
			rescanTask.schedule(1000);
			lastBankSig = "";
			renderAll();
			updateDisplay();
		});
		return;
	}
	if (key === "takeover") { // through the parameter, so it's saved; its output calls takeover()
		encoderEdit = false;
		var to = this.patcher ? this.patcher.getnamed("pv_takeover") : null, nv = Math.max(0, Math.min(2, takeoverMode + steps));
		if (nv === takeoverMode) return;
		pvSent.takeover = nv;
		if (to) to.message("int", nv); else takeover(nv);
		return;
	}
	model.setSetting(key, model.settings[key] + steps);
	encoderEdit = false;
	if (key === "scaleFollow") renderNotes();
	updateDisplay();
	showStatus();
}


// Copy / paste with Push's Duplicate button, Push style: while Duplicate is
// held, the first pad touched is the source and every pad after it is a
// paste target. Releasing Duplicate forgets the clipboard.
//   Steps: Duplicate + step copies it (with its locks, selected lanes).
//          Keep holding that step and press another: copies the range
//          between them. Then tap a step to paste there (the range runs on
//          into the next page if needed, stops at the last step). Page pads
//          view another page meanwhile, so steps can be pasted to any page.
//   Pages: Duplicate + page pad copies the whole page; tap other page pads
//          to paste it over them.
// A paste replaces the target exactly, empty steps included; one Undo
// takes back one paste.
var dupHeld = false;
var clip = null;     // { kind: "steps"|"page", lanes: [..], len, data: {lane: steps} }
var dupAnchor = -1;  // local pad of the source step while still held (range copy)
var dupAnchorStep = -1;

// Shift + Duplicate: print the selected lanes' Euclid hits onto their manual
// steps (one Undo). Existing steps keep their locks.
var dupPrinted = false;

// Shift + Kick / Bass button: that lane's live mask on/off (it silences
// the other lane's notes where it plays, exactly on every pass).
// Mute + Kick / Bass button: print that mask into the other lane's steps
// as mutes (any overlap over the combined cycle). One Undo each.
function toggleMask(src) {
	var key = src === S.KICK ? "maskKick" : "maskBass";
	model.setSetting(key, model.settings[key] ? 0 : 1);
	post("kbSequencer: " + S.LANE_NAMES[src] + " mask " + (model.settings[key] ? "on" : "off") + "\n");
	commitHistory();
	renderDisplayButtons();
	showStatus();
}
function maskLanes(src) {
	var dst = src === S.KICK ? S.BASS : S.KICK;
	var n = model.maskLane(src, dst);
	post("kbSequencer: " + S.LANE_NAMES[src] + " masked " + n + " " + S.LANE_NAMES[dst] + " step" + (n === 1 ? "" : "s") + "\n");
	commitHistory();
	renderAll();
	showStatus();
}

function printEuclid() {
	var lanes = selectedLanes(), n = 0;
	for (var k = 0; k < lanes.length; k++) n += model.printEuclid(lanes[k]);
	post("kbSequencer: printed " + n + " Euclid step" + (n === 1 ? "" : "s") + "\n");
	commitHistory();
	renderAll();
	showStatus();
}

// Hold Mute + tap a page pad: un-mute every step on that page for the
// selected lanes (locks untouched). One Undo.
function unmutePage(page) {
	var lanes = selectedLanes(), n = 0;
	for (var k = 0; k < lanes.length; k++) n += model.unmutePage(lanes[k], page);
	post("kbSequencer: un-muted " + n + " step" + (n === 1 ? "" : "s") + " on page " + (page + 1) + "\n");
	commitHistory();
	renderAll();
	showStatus();
}

function onDuplicate(pressed) {
	dupHeld = pressed;
	if (!pressed) { clip = null; dupAnchor = -1; dupPageAnchor = -1; presetClip = -1; }
	renderDuplicateButton();
	showStatus();
}

function copyRange(kind, from, len) {
	var lanes = selectedLanes();
	clip = { kind: kind, lanes: lanes, from: from, len: len, data: {} };
	for (var k = 0; k < lanes.length; k++) clip.data[lanes[k]] = model.copySteps(lanes[k], from, len);
	post("kbSequencer: copied " + clipLabel() + "\n");
	renderDuplicateButton();
	showStatus();
}

function clipLabel() {
	if (clip.kind !== "page") return clip.len + " step" + (clip.len > 1 ? "s" : "");
	var P = S.STEPS_PER_PAGE, a = clip.from / P + 1, n = clip.len / P;
	return n > 1 ? "pages " + a + "-" + (a + n - 1) : "page " + a;
}

function pasteAt(at) {
	for (var k = 0; k < clip.lanes.length; k++) model.pasteSteps(clip.lanes[k], at, clip.data[clip.lanes[k]]);
	renderAll();
	showStatus();
}

function onDupStep(pad, pressed) {
	if (!pressed) { if (pad === dupAnchor) dupAnchor = -1; return; }
	var i = viewPage * S.STEPS_PER_PAGE + pad;
	if (!clip) {
		copyRange("steps", i, 1);
		dupAnchor = pad;
		dupAnchorStep = i;
	} else if (clip.kind === "steps" && dupAnchor >= 0) {
		var from = Math.min(dupAnchorStep, i), to = Math.max(dupAnchorStep, i);
		copyRange("steps", from, to - from + 1);
	} else if (clip.kind === "steps") {
		pasteAt(i);
	}
}

// Page pads with Duplicate held: tap = copy that page; hold the first page
// and tap another = copy that range of pages; with a page clipboard, tap a
// page = paste starting there (pages past the last are dropped).
var dupPageAnchor = -1;
function onDupPage(page, pressed) {
	if (!pressed) { if (page === dupPageAnchor) dupPageAnchor = -1; return; }
	var P = S.STEPS_PER_PAGE;
	if (!clip) {
		copyRange("page", page * P, P);
		dupPageAnchor = page;
	} else if (clip.kind === "page" && dupPageAnchor >= 0) {
		var a = Math.min(dupPageAnchor, page), b = Math.max(dupPageAnchor, page);
		copyRange("page", a * P, (b - a + 1) * P);
	} else if (clip.kind === "page") pasteAt(page * P);
	else viewPageAndStopFollow(page); // step clipboard: go to another page to paste
}

function renderDuplicateButton() {
	if (!grabbed || !controls.duplicateBtn) return;
	sendLed("duplicateBtn", [clip ? COL.buttonOn : COL.off]);
}

// Page pads. Select + pad: view that page (follow off). Hold one pad and
// press another: loop from the first to the second. One pad on its own is
// judged on release, so it can be held for a page lock (step 7):
//   released within LONG_PRESS_MS, nothing turned: view that page, follow off
//   held longer, nothing turned:                    loop that single page
//   an encoder turned / touched while held:          page lock only
// After TAP_MS of holding, Push shows the page's values (first trig).
var LONG_PRESS_MS = 500;
var pageHold = null; // { page, at, edited, shown } while one page pad is held alone
var pageShowTask = new Task(function () {
	if (!pageHold || pageHold.shown) return;
	pageHold.shown = true;
	encAcc = [0, 0, 0, 0, 0, 0, 0, 0];
	renderDisplayButtons();
	updateDisplay();
}, this);
function cancelPageHold() {
	pageShowTask.cancel();
	var was = pageHold && pageHold.shown;
	pageHold = null;
	if (was) { renderDisplayButtons(); updateDisplay(); }
	endClearLatch();
}

// Plain tap or Select + pad: edit that page; follow turns off.
// Follow back on (no dedicated button): tap the playing (green) page pad,
// or Shift + any page pad (also works while stopped).
function viewPageAndStopFollow(page) {
	if (shiftHeld || (playing && !follow && page === playPage())) {
		follow = true;
		if (!followPlayhead()) viewPage = page;
		renderAll();
		showStatus();
		return;
	}
	viewPage = page;
	follow = false;
	renderAll();
	showStatus();
}

function onPagePad(page, pressed) {
	if (dupHeld || page === dupPageAnchor) { onDupPage(page, pressed); return; }
	if (muteHeld && pressed) { unmutePage(page); return; }
	if (perfMode && !deleteHeld && !selectHeld && !shiftHeld) { onPerfPage(page, pressed); return; }
	var at = heldPages.indexOf(page);
	if (!pressed) {
		if (at >= 0) heldPages.splice(at, 1);
		if (pageHold && pageHold.page === page) {
			var ph = pageHold;
			cancelPageHold();
			if (!ph.edited) {
				if (now() - ph.at < LONG_PRESS_MS) viewPageAndStopFollow(page);
				else { model.setLoop(page, page); renderPages(); showStatus(); }
			}
		}
		return;
	}
	// Delete first, then page pad: wipe every step on that page (trigs, notes,
	// flags, p-locks) for the selected lanes. Holding the page first and then
	// Delete is a different gesture (page lock clear, step 7).
	if (deleteHeld && heldPages.length === 0) {
		var lanes = selectedLanes();
		var first = page * S.STEPS_PER_PAGE;
		for (var l = 0; l < lanes.length; l++)
			for (var i = first; i < first + S.STEPS_PER_PAGE; i++) model.wipe(lanes[l], i);
		heldSteps = [];
		renderAll();
		showStatus();
		return;
	}
	if (selectHeld) { viewPageAndStopFollow(page); return; }
	if (at < 0) heldPages.push(page);
	if (heldPages.length === 1) {
		pageHold = { page: page, at: now(), edited: false, shown: false };
		pageShowTask.schedule(TAP_MS);
	} else {
		cancelPageHold(); // second pad: range gesture instead
		model.setLoop(heldPages[0], page);
		renderPages();
		showStatus();
	}
}

// Note keyboard: bottom row (y 7) = notes 1–8, row above = 9–16. Tapping a
// note makes it the brush (new bass trigs get it) and auditions it.
// Hold step(s) + note pad: sets or replaces the held steps' bass note
// (brush unchanged).
function onNotePad(x, y) {
	var n = keyboardNotes()[(y === 7 ? 0 : 8) + x];
	if (n < 0) return;
	if (heldSteps.length) {
		if (!selBass) return;
		var any = false;
		for (var k = 0; k < heldSteps.length; k++) {
			if (model.hasTrig(S.BASS, heldSteps[k].i)) { model.setNote(S.BASS, heldSteps[k].i, n); any = true; }
		}
		markHeldEdited();
		if (any) audition(S.BASS, n);
		renderNotes();
		updateDisplay();
		return;
	}
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
	outlet(4, [0, lane, pitch, 100, Math.round(stepMs() * 2), ch]);
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
	padCache = {}; ledCache = {};
	if (grabbed) defer(renderAll);
}
function cols() { post("kbSequencer colours: " + JSON.stringify(COL) + "\n"); }

// ---------- rendering ----------
function sendPad(x, y, colour) {
	var key = x + "," + y;
	if (padCache[key] === colour) return;
	padCache[key] = colour;
	var a = ledApi("matrix");
	if (a) a.call("send_value", x, y, colour);
}

function renderAll() {
	screenDirty();
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
	renderUndoButton();
	renderDuplicateButton();
	renderDeleteButton();
	updateDisplay();
}

function renderStep(i) {
	screenDirty();
	if (!grabbed || !controls.matrix || paletteBase >= 0) return;
	var local = i - viewPage * S.STEPS_PER_PAGE;
	if (local < 0 || local >= S.STEPS_PER_PAGE) return;
	var k = selKick && model.step(S.KICK, i), b = selBass && model.step(S.BASS, i);
	var c = COL.off;
	if ((selKick && i === playSteps[0]) || (selBass && i === playSteps[1])) c = COL.playhead;
	else if (!k && !b && (euShown(S.KICK, i) || euShown(S.BASS, i))) {
		var ek = euShown(S.KICK, i), eb = euShown(S.BASS, i);
		c = ek && eb ? COL.euBoth : ek ? COL.euKick : COL.euBass;
	}
	else if (k && b) {
		var locked = model.hasLocks(S.KICK, i) || model.hasLocks(S.BASS, i);
		c = (k.muted && b.muted) ? COL.bothMuted : locked ? COL.bothLocked : COL.both;
	} else if (k) c = k.muted ? COL.kickMuted : model.hasLocks(S.KICK, i) ? COL.kickLocked : COL.kick;
	else if (b) c = b.muted ? COL.bassMuted : model.hasLocks(S.BASS, i) ? COL.bassLocked : COL.bass;
	sendPad(local % 8, local >> 3, c);
}

// A selected lane's Euclid hit that plays (Layer not Manual).
function euShown(l, i) {
	if (!(l === S.KICK ? selKick : selBass) || model.lanes[l].euclid.layer === 0) return false;
	return model.euclidHit(l, i);
}

// Follow uses the first selected lane's playhead (lanes can differ in Length).
function playPage() { var ps = playSteps[editLane()]; return ps >= 0 ? Math.floor(ps / S.STEPS_PER_PAGE) : -1; }

// Page pads. Normal mode (selected lanes): page under the playhead (green)
// > viewed (white) > other loop pages (mid grey) > the rest (dim grey).
// Performance mode (both lanes, lane colours): queued switch (green) > a
// lane's playhead page (kick / bass / both colour) > viewed (white) > the
// rest of a lane's range (dim lane colour) > the rest (dim grey). A lane
// that hasn't picked a page shows the normal loop as its range.
function renderPages() {
	if (!grabbed || !controls.matrix || paletteBase >= 0) return;
	var p, k, c;
	if (perfMode) {
		var head = [{}, {}], range = [{}, {}], queued = {};
		for (k = 0; k < 2; k++) {
			var cur = null;
			if (model.perf) {
				var q = model.perfPending(k, lastAbs);
				if (q && q.start !== null) for (p = q.start; p <= q.end; p++) queued[p] = true;
				cur = model.perfAt(k, playing ? lastAbs : Infinity);
			}
			for (p = cur ? cur.start : model.loopStart; p <= (cur ? cur.end : model.loopEnd); p++) range[k][p] = true;
			if (playing && playSteps[k] >= 0) head[k][Math.floor(playSteps[k] / S.STEPS_PER_PAGE)] = true;
		}
		var laneCol = function (kick, bass, bright) {
			if (kick && bass) return bright ? COL.both : COL.euBoth;
			if (kick) return bright ? COL.kick : COL.euKick;
			return bright ? COL.bass : COL.euBass;
		};
		for (p = 0; p < S.PAGES; p++) {
			if (queued[p]) c = COL.perfQueued;
			else if (head[0][p] || head[1][p]) c = laneCol(head[0][p], head[1][p], true);
			else if (p === viewPage) c = COL.pageViewed;
			else if (range[0][p] || range[1][p]) c = laneCol(range[0][p], range[1][p], false);
			else c = COL.pageOther;
			sendPad(p % 8, 4 + (p >> 3), c);
		}
		return;
	}
	var lanes = selectedLanes(), heads = {};
	if (playing) for (k = 0; k < lanes.length; k++) if (playSteps[lanes[k]] >= 0) heads[Math.floor(playSteps[lanes[k]] / S.STEPS_PER_PAGE)] = true;
	for (p = 0; p < S.PAGES; p++) {
		if (heads[p]) c = COL.pagePlaying;
		else if (p === viewPage) c = COL.pageViewed;
		else if (p >= model.loopStart && p <= model.loopEnd) c = COL.pageLoop;
		else c = COL.pageOther;
		sendPad(p % 8, 4 + (p >> 3), c);
	}
}

function renderNotes() {
	if (!grabbed || !controls.matrix || paletteBase >= 0) return;
	if (presetView) { renderSlots(); return; }
	var notes = keyboardNotes();
	var lit = brushNote;
	if (heldSteps.length) {
		var hs = model.step(S.BASS, heldSteps[0].i);
		lit = hs ? hs.note : -1;
	}
	for (var k = 0; k < 16; k++) {
		var n = notes[k], c;
		if (n < 0) c = COL.off;
		else if (!selBass) c = COL.noteDimmed;
		else if (n === lit) c = COL.noteBrush;
		else if (((n - scaleRoot) % 12 + 12) % 12 === 0) c = COL.noteRoot;
		else c = COL.noteScale;
		sendPad(k % 8, k < 8 ? 7 : 6, c);
	}
}

function renderDisplayButtons() {
	var d = controls.display;
	if (!grabbed || !d) return;
	// A lane whose live mask is on shows the mask colour (bright when selected).
	var mk = model.settings.maskKick, mb = model.settings.maskBass;
	sendLed("display", [0, 0, mk ? (selKick ? COL.maskSel : COL.maskUnsel) : selKick ? COL.kick : COL.laneOff]);
	sendLed("display", [1, 0, mb ? (selBass ? COL.maskSel : COL.maskUnsel) : selBass ? COL.bass : COL.laneOff]);
	var c = context();
	for (var k = 0; k < BANK_BUTTONS.length; k++)
		sendLed("display", [BANK_BUTTONS[k], 0, k >= BANKS[c].length ? COL.off : k === bankSel[c] ? COL.followOn : COL.followOff]);
}

// Undo LED: lit while there is something to undo.
function renderUndoButton() {
	if (!grabbed || !controls.undoBtn) return;
	sendLed("undoBtn", [undoStack.length ? COL.buttonOn : COL.off]);
}

function renderOctaveButtons() {
	if (!grabbed) return;
	sendLed("octaveUp", [octave < S.MAX_OCTAVE ? COL.buttonOn : COL.off]);
	sendLed("octaveDown", [octave > S.MIN_OCTAVE ? COL.buttonOn : COL.off]);
}

// Follow mode: keep the viewed page on the playhead's page.
function followPlayhead() {
	var pp = playPage();
	if (!follow || !playing || pp < 0 || pp === viewPage || heldSteps.length) return false;
	viewPage = pp;
	return true;
}

// ---------- performance mode ----------
// Shift + jog wheel press turns it on / off. While on, a page pad loops that
// page (full 32 steps, each lane's Length ignored) on the selected lanes;
// hold one page pad and press another to loop the range between them. A
// switch waits for the next beat (quarter note) and keeps the position: the
// step inside the page follows the song position, so the bar grid never
// moves. Turning it off returns to the normal loop at the next beat too.
// Nothing is saved; the sequence, loop and Lengths are never changed.
// Delete / Select / Shift / Mute / Duplicate + page pad work as usual.
var perfMode = false;
var perfHeld = [];   // page pads held in performance mode, in press order
var PERF_BEAT = 4;   // steps per beat: switches land on quarter notes
function togglePerf() {
	perfMode = !perfMode;
	perfHeld = [];
	if (perfMode) {
		if (!model.perf) model.setPerf(true);
		else for (var j = 0; j < 2; j++) model.perf[j] = model.perf[j].filter(function (sg) { return sg.from <= lastAbs; }); // cancel a pending exit
	} else if (model.perf) {
		var at = perfSwitchAt();
		for (var l = 0; l < 2; l++) model.perfSwitch(l, null, null, at);
		if (!playing) model.setPerf(false);
	}
	post("kbSequencer: performance mode " + (perfMode ? "on" : "off") + "\n");
	refillSoon();
	lastBankSig = "";
	renderAll();
	updateDisplay();
	showStatus();
}
// The abs step a switch made now lands on: the next beat at least one step
// after the step about to play (the patch already holds the next steps, and
// the refill rewrites them). Stopped: at once.
function perfSwitchAt() {
	if (!playing || lastAbs < 0) return -Infinity;
	return Math.ceil((lastAbs + 2) / PERF_BEAT) * PERF_BEAT;
}
function onPerfPage(page, pressed) {
	var at = perfHeld.indexOf(page);
	if (!pressed) { if (at >= 0) perfHeld.splice(at, 1); return; }
	if (at < 0) perfHeld.push(page);
	var a = perfHeld[0], b = perfHeld.length > 1 ? page : a; // second pad: the range
	var lanes = selectedLanes(), when = perfSwitchAt();
	for (var k = 0; k < lanes.length; k++) model.perfSwitch(lanes[k], Math.min(a, b), Math.max(a, b), when);
	refillSoon();
	renderPages();
	showStatus();
}
function perfPendingAny() {
	return !!(model.perf && (model.perfPending(S.KICK, lastAbs) || model.perfPending(S.BASS, lastAbs)));
}
// ---------- presets ----------
// Shift + Octave Up swaps the note keyboard (bottom two rows) for 16 preset
// slots: top row 1–8, bottom row 9–16. A slot is a stored copy of the
// pattern; the working pattern is what plays and is edited.
//   Tap a slot:           load it at the next bar (empty slot: an empty
//                         pattern), keeping the song position. Stopped: now.
//   Shift + tap:          save the working pattern into that slot.
//   Duplicate + slot, then tap others: copy that slot to them.
//   Delete + slot:        clear that slot.
// Every load, save, paste and clear is one Undo step (Undo right after a
// load brings back unsaved edits).
var presetView = false;
var presetClip = -1;     // slot copied while Duplicate is held
var pendingLoad = null;  // { slot, at } load waiting for the bar
var refillFloor = -Infinity; // refills skip steps before this (a load lands there)
var BAR = 16;            // steps per bar (4/4)
var presetPaintTask = new Task(function () { renderNotes(); updateDisplay(); }, this);
function togglePresetView() {
	presetView = !presetView;
	presetClip = -1;
	renderNotes();
	showStatus();
}
function onSlotPad(n) {
	if (dupHeld) {
		if (presetClip < 0) { presetClip = n; post("kbSequencer: copied preset " + (n + 1) + "\n"); }
		else model.copySlot(presetClip, n);
	} else if (deleteHeld) {
		model.clearSlot(n);
	} else if (shiftHeld) {
		model.saveSlot(n);
		post("kbSequencer: saved preset " + (n + 1) + "\n");
	} else {
		requestLoad(n);
		return;
	}
	renderNotes();
	updateDisplay();
	showStatus();
}
// Load at the next bar, at least one step ahead (the steps up to
// LOOKAHEAD are already queued: those before the bar keep the old pattern).
function requestLoad(n) {
	if (!playing || lastAbs < 0) { pendingLoad = { slot: n, at: -Infinity }; applyLoad(true); return; }
	pendingLoad = { slot: n, at: Math.ceil((lastAbs + 2) / BAR) * BAR };
	if (lastAbs + LOOKAHEAD >= pendingLoad.at) applyLoad(false);
	renderNotes();
	showStatus();
}
function applyLoad(now) {
	var pl = pendingLoad;
	pendingLoad = null;
	if (!pl) return;
	if (!now) refillFloor = pl.at; // queued steps before the bar keep the old pattern
	model.loadSlot(pl.slot);
	post("kbSequencer: loaded preset " + (pl.slot + 1) + "\n");
	refillWindow();
	if (grabbed) defer(renderAll);
	updateDisplay();
	showStatus();
}
function renderSlots() {
	var dirty = model.isDirty();
	for (var n = 0; n < S.PRESET_SLOTS; n++) {
		var c;
		if (pendingLoad && pendingLoad.slot === n) c = COL.slotQueued;
		else if (n === model.activeSlot) c = dirty ? COL.slotDirty : COL.slotActive;
		else c = model.slotFull(n) ? COL.slotFull : COL.slotEmpty;
		sendPad(n % 8, n < 8 ? 6 : 7, c);
	}
}

// ---------- status ----------
function showStatus() {
	if (!surface) { status("No Push found"); return; }
	var parts = [grabbed ? "GRABBED" : "released"];
	if (!enabled) parts.push("(takeover off: turn it on in the device or Push's Settings bank)");
	else if (followFocus && !focused) parts.push("(track not selected)");
	if (perfMode) parts.push("PERF");
	if (model.activeSlot >= 0) parts.push("preset " + (model.activeSlot + 1) + (model.isDirty() ? " (unsaved)" : ""));
	if (pendingLoad) parts.push("loading " + (pendingLoad.slot + 1) + " at the bar");
	parts.push("lanes " + (selKick ? "K" : "") + (selBass ? "B" : ""));
	parts.push("page " + (viewPage + 1) + (follow ? " (follow)" : ""));
	parts.push("oct " + octave);
	if (clip) parts.push("clip: " + clipLabel());
	parts.push((playing ? "playing" : "stopped") + " loop " + (model.loopStart + 1) + "-" + (model.loopEnd + 1) + " len " + model.lanes[0].length + "/" + model.lanes[1].length);
	parts.push("trigs " + model.countTrigs(S.KICK) + "/" + model.countTrigs(S.BASS));
	status(parts.join(" · "));
}
function status(s) { outlet(0, s); }

// ---------- macro lock slots: what each lane's kbLane found ----------
// Each kbLane finds the first Rack after itself on its track and reports
// "laneinfo group lane count name1 … name8" on [receive kbLaneInfo]
// (count = visible macros, -1 = no Rack, -2 = kbLane removed or moved to
// another group / lane). Only reports for this device's Group count. The
// sequencer asks for reports with "refresh" on [send kbLaneCmd]: at init,
// when Group changes and from Settings > Refresh. Non-time-critical.
var laneGroup = 1;
var macroInfo = [null, null]; // per lane: { count, names } or null = no kbLane heard
var refreshShown = false;
var refreshTask = new Task(function () { refreshShown = false; updateDisplay(); }, this);
function group(g) {
	g = g | 0;
	if (g === laneGroup) return;
	laneGroup = g;
	macroInfo = [null, null];
	refresh();
	updateDisplay();
}
function refresh() {
	var o = this.patcher ? this.patcher.getnamed("lane_cmd") : null;
	if (o) o.message("refresh");
	refreshShown = true;
	refreshTask.schedule(1000);
	renderMacroView();
	updateDisplay();
}
function laneinfo() {
	var a = arrayfromargs(arguments), g = Number(a[0]), l = Number(a[1]), n = Number(a[2]);
	if (g !== laneGroup || (l !== S.KICK && l !== S.BASS)) return;
	macroInfo[l] = n === -2 ? null : { count: Math.max(-1, Math.min(S.MACRO_SLOTS, n)), names: a.slice(3, 3 + S.MACRO_SLOTS).map(String),
		codes: a.slice(3 + S.MACRO_SLOTS, 3 + 2 * S.MACRO_SLOTS).map(Number) }; // macro number per slot
	if (mapPending && mapPending.lane === l && macroInfo[l]) // show the picked target
		mapTitle = S.LANE_NAMES[l] + " " + mapPending.slot + ": " + macroInfo[l].names[mapPending.slot - 1];
	post("kbSequencer: " + S.LANE_NAMES[l] + " macros: " + macroText(l) + "\n");
	renderMacroView();
	lastBankSig = ""; // slot names / availability may have changed
	updateDisplay();
}
function macroLane() { var t = heldTarget(); return t ? t.lane : editLane(); }
function macroCount(l) { var mi = macroInfo[l]; return mi ? Math.max(0, mi.count) : 0; }
function macroText(l) {
	var mi = macroInfo[l];
	if (!mi) return "no kbLane";
	if (mi.count < 0) return "no rack";
	if (!mi.count) return "no visible macros";
	var out = [];
	for (var k = 0; k < mi.count; k++) out.push((k + 1) + " " + (mi.names[k] || "?"));
	return out.join(" · ");
}
// Device view: the macro names on the slots, per lane.
function renderMacroView() {
	if (!this.patcher) return;
	for (var l = 0; l < 2; l++) {
		var o = this.patcher.getnamed(l === S.KICK ? "mv_kick" : "mv_bass");
		if (o) o.message("set", (l === S.KICK ? "Kick macros: " : "Bass macros: ") + macroText(l));
	}
}

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

// ---------- Push screen (Live 13 Custom Device Display API) ----------
// While Push shows this device (view_device == this device), send the view
// state (encoder styles) and keep the drawing in [js kbSequencerDraw.js]
// current. Push clears the drawing itself when it shows another device, and
// resets the view state, so both are sent again each time we're shown.
// The view state call goes through [live.object] (vs_obj) in Looplet's form:
// "call request_view_state_change dictionary <name>".
var VIEW_DICT = "kbSequencerView";
var viewObs = null, myDeviceId = 0, screenViewed = false, screenLogLeft = 8;
var screenTask = new Task(function () { screenPending = false; pushScreen(); }, this);
var screenPending = false;
var viewStateDict = new Dict(VIEW_DICT);

function screenLog(m) { if (screenLogLeft > 0) { screenLogLeft--; post("kbSequencer screen: " + m + "\n"); } }

function setupScreen() {
	if (viewObs) { viewObs.property = ""; viewObs = null; }
	screenViewed = false;
	if (!surface) return;
	var me = new LiveAPI("this_device");
	myDeviceId = me ? Number(me.id) : 0;
	var vs = this.patcher ? this.patcher.getnamed("vs_obj") : null;
	// Live 12 and earlier: no view_device, so no screen (the rest works as before).
	var vd = surface.get("view_device");
	if (!vd || !vd.length) { screenLog("no device display (needs Live 13)"); return; }
	if (vs) vs.message("id", Number(surface.id));
	viewObs = new LiveAPI(onViewDevice, "id " + surface.id);
	viewObs.property = "view_device";
	screenLog("watching view_device on surface " + surface.id + ", this device " + myDeviceId);
}

function onViewDevice(args) {
	var a = flatten(args);
	if (a[0] !== "view_device") return;
	var shown = Number(a[a.length - 1]) === myDeviceId && myDeviceId !== 0;
	if (shown === screenViewed) return;
	screenViewed = shown;
	screenLog("viewed " + (shown ? 1 : 0));
	if (shown) defer(function () { sendViewState(); pushScreen(); });
}

// One combined dict per request (only the last of quick requests applies).
// All encoders: small value, no dial, label on, so the middle is free.
function sendViewState() {
	var v = ["Small", "Small", "Small", "Small", "Small", "Small", "Small", "Small"];
	var n = ["None", "None", "None", "None", "None", "None", "None", "None"];
	viewStateDict.clear();
	viewStateDict.set("EncodersValueStyle", v);
	viewStateDict.set("EncodersVisualStyle", n);
	viewStateDict.set("EncodersShowLabel", [1, 1, 1, 1, 1, 1, 1, 1]);
	var vs = this.patcher ? this.patcher.getnamed("vs_obj") : null;
	if (!vs) return;
	vs.message("call", "request_view_state_change", "dictionary", VIEW_DICT);
	screenLog("view state sent");
}

// Coalesce: many pads change at once (page flips, playhead), draw once.
function screenDirty() {
	if (!screenViewed || screenPending) return;
	screenPending = true;
	screenTask.schedule(20);
}

// Which screen a bank gets; others show the page view.
var SCREEN_OF = { "Kick Euclid": "euclid", "Bass Euclid": "euclid", "Retrig": "retrig", "Slide": "slide", "CC Locks": "cclocks" };

function pushScreen() {
	if (!screenViewed) return;
	var d = this.patcher ? this.patcher.getnamed("draw") : null;
	if (!d) return;
	var bank = currentBank(), mode = SCREEN_OF[bank.name] || "page", t = heldTarget();
	var fl = bank.name === "Kick Euclid" ? S.KICK : bank.name === "Bass Euclid" ? S.BASS : t ? t.lane : editLane();
	if (mode === "slide" && !selBass) mode = "page";
	if ((mode === "retrig" || mode === "slide") && !(t && model.hasTrig(t.lane, t.i))) mode = "page"; // page held on an empty page
	d.message("setmode", mode, fl);
	var first = viewPage * S.STEPS_PER_PAGE, loop0 = model.loopStart * S.STEPS_PER_PAGE;
	for (var l = 0; l < 2; l++) {
		var row = ["lane", l], end = loop0 + model.lanes[l].length;
		for (var i = first; i < first + S.STEPS_PER_PAGE; i++) {
			var st = model.step(l, i), c = 0;
			if (i >= end || i < loop0) c = 5;
			else if (st) c = st.muted ? 2 : model.hasLocks(l, i) ? 3 : 1;
			else if (model.lanes[l].euclid.layer !== 0 && model.euclidHit(l, i)) c = 4;
			row.push(c);
		}
		d.message.apply(d, row);
	}
	var h = [];
	for (var k = 0; k < 2; k++) {
		var p = playSteps[k];
		h.push(p >= first && p < first + S.STEPS_PER_PAGE ? p - first : -1);
	}
	d.message("playhead", h[0], h[1]);
	var hl = ["setheld"];
	for (var j = 0; j < heldSteps.length; j++) {
		var hi = heldSteps[j].i - first;
		if (hi >= 0 && hi < S.STEPS_PER_PAGE) hl.push(hi);
	}
	d.message.apply(d, hl);
	var pg = [];
	for (var m = 0; m < 2; m++) pg.push("pg " + (viewPage - model.loopStart + 1) + "/" + Math.max(1, Math.ceil(model.lanes[m].length / S.STEPS_PER_PAGE)));
	d.message("pages", pg[0], pg[1]);
	d.message("sel", selKick ? 1 : 0, selBass ? 1 : 0);
	var info = BUILD_STAMP;
	if (mode === "euclid") info = screenEuclid(d, fl);
	else if (mode === "retrig") info = screenRetrig(d, t);
	else if (mode === "slide") info = screenSlide(d, t);
	else if (mode === "cclocks") screenCC(d, fl, t);
	d.message("setinfo", info);
	d.message("bang");
}

// One cycle of the lane's Euclid pattern (as model.euclidHit, from the
// loop's first step).
function screenEuclid(d, l) {
	var eu = model.lanes[l].euclid, n = eu.follow ? model.lanes[l].length : eu.steps, k = Math.min(eu.pulses, n);
	var msg = ["setpattern"];
	for (var m = 0; m < n && m < 512; m++) {
		var e = ((m - eu.rotate) % n + n) % n;
		msg.push(k > 0 && (e * k) % n < k ? 1 : 0);
	}
	d.message.apply(d, msg);
	return S.LANE_NAMES[l] + " · " + n + " steps · " + k + " pulses · rotate " + eu.rotate + " · " + S.LAYERS[eu.layer] + (eu.follow ? " · follows Length" : "");
}

// The held step's burst, with every repeat shown (chance: dimmer hits).
function screenRetrig(d, t) {
	var v = function (key) { return model.value(t.lane, t.i, S.PARAM_ID[key]); };
	var n = { retrig: v("retrig") === 1, velocity: Math.max(1, v("velocity")), lenSteps: S.RETRIG_LENS[v("length")] };
	if (n.retrig) {
		n.rate = S.rateSteps(v("retrigRate")); n.len = n.lenSteps;
		n.fade = v("retrigFade") / 100; n.curve = v("retrigCurve") / 100;
		n.pmode = v("retrigPMode"); n.burstOk = true; n.lock = true;
		var tr = v("retrigTRate");
		n.trate = tr > 0 ? S.rateSteps(tr - 1) : 0;
		n.glide = v("retrigGlide") / 4;
		n.pass = function () { return true; };
	}
	var b = S.burstHits(n, 32), msg = ["setburst", b.span === Infinity ? 33 : b.span, v("retrigLock") === 1 ? 100 : v("retrigProb")];
	for (var k = 0; k < b.hits.length && k < 256; k++) msg.push(b.hits[k].t, b.hits[k].vel, b.hits[k].play ? 1 : 0);
	d.message.apply(d, msg);
	var len = S.RETRIG_LEN_LABELS[v("length")];
	return S.LANE_NAMES[t.lane] + " step " + (t.i + 1) + " · " + (n.retrig ? b.hits.length + (b.span === Infinity ? "+" : "") + " hits over " + len : "retrig off: one note, length " + len);
}

// The bass slide from the held step to the lane's next trig.
function screenSlide(d, t) {
	var l = S.BASS, i = t.i, st = model.step(l, i);
	var nx = -1, len = model.lanes[l].length, loop0 = model.loopStart * S.STEPS_PER_PAGE;
	for (var k = 1; k <= len && nx < 0; k++) {
		var j = loop0 + ((i - loop0 + k) % len);
		var s2 = model.step(l, j);
		if (s2 && !s2.muted) nx = j;
	}
	var to = nx >= 0 ? model.step(l, nx).note : st ? st.note : 0, from = st ? st.note : 0;
	var p = model.value(l, i, S.PARAM_ID.slideTime) / 100, c = model.value(l, i, S.PARAM_ID.slideCurve) / 100;
	d.message("setslide", p, c, from, to);
	var on = model.value(l, i, S.PARAM_ID.slide) === 1 ? "slide on" : model.value(l, i, S.PARAM_ID.tie) === 1 ? "tie on" : "slide off";
	return "bass step " + (i + 1) + " → " + (nx >= 0 ? "step " + (nx + 1) : "none") + " · " + (to - from >= 0 ? "+" : "") + (to - from) + " st · " + on;
}

// CC slot values of the held step (or the lane defaults), and their targets.
function screenCC(d, l, t) {
	var msg = ["setcc"], lk = [], mi = macroInfo[l];
	for (var k = 1; k <= 8; k++) {
		var pid = S.PARAM_ID["m" + k];
		msg.push(t ? model.value(t.lane, t.i, pid) : model.lanes[l].defaults[pid]);
		lk.push(t && model.isLocked(t.lane, t.i, pid) ? 1 : 0);
	}
	d.message.apply(d, msg.concat(lk));
	for (var j = 0; j < 8; j++) d.message("ccname", j, mi && mi.names && mi.names[j] && mi.names[j] !== "-" ? mi.names[j] : "");
}
