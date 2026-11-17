// kbLane.js — CC lock slots for one lane (non-time-critical side).
// The 8 lock slots arrive as CC values 0–127 (patch only, high priority):
// each goes out as a real MIDI CC (slot N -> the slot's CC number, the lane's
// channel) and, when the slot is mapped, modulates that Live parameter with
// live.modulate~ (an offset added to its knob, CC 0 = Min, 127 = Max).
// This script only handles the mapping:
//   "map N" / "clear N"              device view: click a parameter in Live
//   "pick group lane slot delta"     from kbSequencer (Push): step slot N's target
//                                    through this track's device parameters
// and reports slot labels to kbSequencer on [send kbLaneInfo]:
//   "group lane 8 label1 … label8"   (-2 = this kbLane is gone)
// Mappings are saved with the Set as parameter paths in [pattr kbLaneData].
//
// ES5 on purpose: runs in both [js] and [v8].

autowatch = 1;
inlets = 1;
outlets = 5; // 0: status text, 1: "slot id N" -> live.modulate~, 2: bang = all offsets 0,
             // 3: report -> [send kbLaneInfo], 4: storage list -> [pattr]

var SLOTS = 8;
var grp = 1, laneIdx = 0, reported = null, lastReport = "";
var ready = false;
var paths = ["-", "-", "-", "-", "-", "-", "-", "-"]; // parameter path per slot ("/" for spaces)
var labels = ["-", "-", "-", "-", "-", "-", "-", "-"];
// Per slot for Push: 0 = not mapped, 1–16 = that macro of a Rack on this
// track (top level), 17 = any other parameter.
var codes = [0, 0, 0, 0, 0, 0, 0, 0];
var MACRO_OTHER = 17;
var mapping = -1, selApi = null, selFirst = true, playApi = null;
var saving = false, lastSaved = "";
var candidates = null; // [{ path, label }] of this track's parameters, built on demand
var trackApi = null;

function bang() { // live.thisdevice
	ready = true;
	observeSelection();
	observePlay();
	observeTrack();
	for (var i = 0; i < SLOTS; i++) resolve(i);
	report();
	if (!restoredOnce) defaultTask.schedule(DEFAULT_MAP_MS);
}

// A kbLane with nothing saved (new, or from a Set made before the CC locks)
// maps slot N to macro N of the first Rack after it, as the old macro locks
// did. Waits a moment: Live can restore the saved mappings after load.
var restoredOnce = false, DEFAULT_MAP_MS = 500;
var defaultTask = new Task(function () {
	if (restoredOnce) return;
	var me = new LiveAPI("this_device");
	var trackPath = me.unquotedpath.replace(/ devices \d+$/, "");
	var ids = idList(new LiveAPI(trackPath).get("devices")), after = false;
	for (var i = 0; i < ids.length; i++) {
		if (ids[i] === Number(me.id)) { after = true; continue; }
		if (!after) continue;
		var d = new LiveAPI("id " + ids[i]);
		if (Number(d.get("can_have_chains")) !== 1) continue;
		var params = idList(d.get("parameters"));
		var count = Math.min(SLOTS, Number(d.get("visible_macro_count")) || 0, params.length - 1);
		for (var k = 0; k < count; k++) paths[k] = (d.unquotedpath + " parameters " + (k + 1)).replace(/ /g, "/");
		for (k = 0; k < SLOTS; k++) resolve(k);
		save();
		report();
		post("kbLane: mapped slots 1–" + count + " to the macros of \"" + str(d.get("name")) + "\"\n");
		return;
	}
}, this);
function group(g) { setTarget(g | 0, laneIdx); }
function lane(l) { setTarget(grp, l | 0); }
function refresh() { if (ready) { lastReport = ""; report(); } }
function setTarget(g, l) {
	if (g === grp && l === laneIdx) return;
	grp = g; laneIdx = l;
	if (ready) report();
}

// ---------- mapping with the mouse (device view) ----------
function map(n) {
	n = (n | 0) - 1;
	if (!ready || n < 0 || n >= SLOTS) return;
	mapping = n;
	setName(n, "click a parameter…");
	status("slot " + (n + 1) + ": click any parameter in Live");
}
function clear(n) {
	n = (n | 0) - 1;
	if (n < 0 || n >= SLOTS) return;
	if (mapping === n) mapping = -1;
	setPath(n, "-");
}
function observeSelection() {
	if (selApi) return;
	selFirst = true;
	selApi = new LiveAPI(function (a) {
		if (a[0] !== "selected_parameter") return;
		if (selFirst) { selFirst = false; return; }
		if (mapping < 0) return;
		var id = Number(a[a.length - 1]), n = mapping;
		if (!id) return;
		mapping = -1;
		var t = new Task(function () { assignId(n, id); }, this); // not inside the callback
		t.schedule(0);
	}, "live_set view");
	selApi.property = "selected_parameter";
}
function assignId(n, id) {
	var p = new LiveAPI("id " + id);
	if (!p.id || Number(p.id) === 0) return;
	if (p.unquotedpath.replace(/ parameters \d+$/, "") === new LiveAPI("this_device").unquotedpath) {
		status("can't map this device's own controls");
		setName(n, labels[n]);
		return;
	}
	setPath(n, p.unquotedpath.replace(/ /g, "/"));
}

// ---------- mapping from Push: "pick group lane slot delta" ----------
// Steps the slot through every parameter of the devices after this one on its
// track (Racks: their chains too), index 0 = no mapping.
function pick(g, l, slot, delta) {
	if (!ready || (g | 0) !== grp || (l | 0) !== laneIdx) return;
	var n = (slot | 0) - 1;
	if (n < 0 || n >= SLOTS) return;
	var list = getCandidates(), cur = 0;
	for (var i = 0; i < list.length; i++) if (list[i].path === paths[n]) { cur = i + 1; break; }
	var next = Math.max(0, Math.min(list.length, cur + (delta | 0)));
	if (next === cur) return;
	setPath(n, next === 0 ? "-" : list[next - 1].path);
}

function getCandidates() {
	if (candidates) return candidates;
	candidates = [];
	var me = new LiveAPI("this_device");
	var trackPath = me.unquotedpath.replace(/ devices \d+$/, "");
	var ids = idList(new LiveAPI(trackPath).get("devices")), after = false;
	for (var i = 0; i < ids.length; i++) {
		if (ids[i] === Number(me.id)) { after = true; continue; }
		if (after) addDevice(new LiveAPI("id " + ids[i]), 0);
	}
	return candidates;
}
function addDevice(d, depth) {
	var dname = str(d.get("name"));
	var params = idList(d.get("parameters"));
	for (var k = 1; k < params.length; k++) { // 0 = Device On
		var p = new LiveAPI("id " + params[k]);
		candidates.push({ path: p.unquotedpath.replace(/ /g, "/"), label: dname + " › " + str(p.get("name")) });
	}
	if (depth > 2 || Number(d.get("can_have_chains")) !== 1) return;
	var chains = idList(d.get("chains"));
	for (var c = 0; c < chains.length; c++) {
		var devs = idList(new LiveAPI("id " + chains[c]).get("devices"));
		for (var j = 0; j < devs.length; j++) addDevice(new LiveAPI("id " + devs[j]), depth + 1);
	}
}
// The parameter list is rebuilt after the track's devices change.
function observeTrack() {
	var me = new LiveAPI("this_device");
	if (!me.id || Number(me.id) === 0) return;
	var first = true;
	trackApi = new LiveAPI(function (a) {
		if (a[0] !== "devices") return;
		if (first) { first = false; return; }
		candidates = null;
	}, me.unquotedpath.replace(/ devices \d+$/, ""));
	trackApi.property = "devices";
}

// ---------- slot state ----------
function setPath(n, path) {
	paths[n] = path;
	resolve(n);
	save();
	report();
}
function resolve(n) {
	codes[n] = 0;
	if (paths[n] === "-") { outlet(1, n + 1, "id", 0); labels[n] = "-"; setName(n, "-"); return; }
	var p = new LiveAPI(paths[n].replace(/\//g, " "));
	if (!p.id || Number(p.id) === 0) { outlet(1, n + 1, "id", 0); labels[n] = "(missing)"; setName(n, labels[n]); return; }
	codes[n] = macroCode(p);
	outlet(1, n + 1, "id", Number(p.id));
	var dev = new LiveAPI(p.unquotedpath.replace(/ parameters \d+$/, ""));
	labels[n] = str(dev.get("name")) + " › " + str(p.get("name"));
	setName(n, labels[n]);
	status("slot " + (n + 1) + " → " + labels[n]);
}

// A top-level Rack on this track: parameter N (1–16) is macro N.
function macroCode(p) {
	var trackPath = new LiveAPI("this_device").unquotedpath.replace(/ devices \d+$/, "");
	var m = p.unquotedpath.match(/^(.*) devices (\d+) parameters (\d+)$/);
	if (!m || m[1] !== trackPath) return MACRO_OTHER;
	var idx = Number(m[3]);
	if (idx < 1 || idx > 16) return MACRO_OTHER;
	var dev = new LiveAPI(m[1] + " devices " + m[2]);
	return Number(dev.get("can_have_chains")) === 1 ? idx : MACRO_OTHER;
}

function report() {
	if (reported && (reported[0] !== grp || reported[1] !== laneIdx)) { outlet(3, reported[0], reported[1], -2); lastReport = ""; }
	reported = [grp, laneIdx];
	var msg = [grp, laneIdx, SLOTS].concat(labels, codes), key = msg.join("|"); // codes after the labels
	if (key === lastReport) return;
	lastReport = key;
	outlet(3, msg);
}

// Transport stop: every offset back to 0 (the knobs alone).
function observePlay() {
	if (playApi) return;
	playApi = new LiveAPI(function (a) { if (a[0] === "is_playing" && Number(a[1]) === 0) outlet(2, "bang"); }, "live_set");
	playApi.property = "is_playing";
}

// ---------- storage ----------
function save() {
	var key = paths.join(" ");
	if (key === lastSaved) return;
	lastSaved = key;
	saving = true;
	try { outlet(4, paths); } finally { saving = false; }
}
function restore() {
	if (saving) return;
	var a = arrayfromargs(arguments);
	if (a.length !== SLOTS) return;
	restoredOnce = true;
	defaultTask.cancel();
	if (a.join(" ") === lastSaved) return;
	lastSaved = a.join(" ");
	for (var i = 0; i < SLOTS; i++) paths[i] = String(a[i]);
	if (ready) { for (i = 0; i < SLOTS; i++) resolve(i); report(); }
}

function notifydeleted() {
	defaultTask.cancel();
	if (reported) outlet(3, reported[0], reported[1], -2);
	if (selApi) selApi.property = "";
	if (playApi) playApi.property = "";
	if (trackApi) trackApi.property = "";
}

function setName(n, s) {
	var o = this.patcher ? this.patcher.getnamed("name" + (n + 1)) : null;
	if (o) o.message("set", s);
}
function status(s) { outlet(0, s); }
function str(v) { return v instanceof Array ? v.join(" ") : String(v); }
function idList(list) {
	var out = [];
	if (!list) return out;
	for (var i = 0; i < list.length; i++) if (list[i] !== "id") out.push(Number(list[i]));
	return out;
}
