// kbLane.js — discovery for the macro lock slots (non-time-critical).
// Finds the first Rack after this device on its own track, maps the patch's
// 8 [live.modulate~] objects to its visible macros (slot N = macro N) and
// reports the macro names to the kbSequencer of its Group on [send kbLaneInfo]:
//   "group lane count name1 … name8"  count = visible macros, -1 = no Rack,
//   -2 = this kbLane is gone (removed, or moved to another group / lane).
// Re-scans at load (Live object ids change between sessions), when the
// track's devices change, when the Rack's visible macro count or a macro
// name changes, and on "refresh" from a kbSequencer ([receive kbLaneCmd]).
// The offsets themselves never pass through here: they go patch-only from
// [receive kbLanes] to live.modulate~ (high priority, in order with the notes).
//
// ES5 on purpose: runs in both [js] and [v8].

autowatch = 1;
inlets = 1;
outlets = 4; // 0: status text, 1: "slot id N" -> live.modulate~ right inlets,
             // 2: bang = every offset back to 0, 3: report -> [send kbLaneInfo]

var SLOTS = 8;
var grp = 1, laneIdx = 0;      // this device's Group and Lane (0 kick, 1 bass)
var reported = null;           // [group, lane] last reported, to retract on change
var ready = false;
var mapped = [0, 0, 0, 0, 0, 0, 0, 0];
var info = { count: -1, names: [] };
var trackApi = null, rackApi = null, playApi = null, nameApis = [];
var scanTask = new Task(scan, this);
var watchedPids = "";          // macro ids the name observers are on
var lastReport = "";           // last report sent, to skip identical ones

function bang() { ready = true; observePlay(); scanSoon(); } // live.thisdevice
function group(g) { setTarget(g | 0, laneIdx); }
function lane(l) { setTarget(grp, l | 0); }
function refresh() { if (ready) { lastReport = ""; scanSoon(); } } // asked: always report
function rescan() { refresh(); }

function setTarget(g, l) {
	if (g === grp && l === laneIdx) return;
	grp = g; laneIdx = l;
	if (ready) report();
}

// Live refuses changes from inside observer callbacks: scan a little later
// (also folds a burst of observer callbacks into one scan).
function scanSoon() { scanTask.cancel(); scanTask.schedule(50); }

function scan() {
	var me = new LiveAPI("this_device");
	if (!me.id || Number(me.id) === 0) return;
	var trackPath = me.unquotedpath.replace(/ devices \d+$/, "");
	if (!trackApi || trackApi.unquotedpath !== trackPath) {
		if (trackApi) trackApi.property = "";
		trackApi = new LiveAPI(function (a) { if (a[0] === "devices") scanSoon(); }, trackPath);
		trackApi.property = "devices";
	}
	var ids = idList(trackApi.get("devices")), myId = Number(me.id), after = false, rackId = 0;
	for (var i = 0; i < ids.length; i++) {
		if (ids[i] === myId) { after = true; continue; }
		if (!after) continue;
		var d = new LiveAPI("id " + ids[i]);
		if (Number(d.get("can_have_chains")) === 1) { rackId = ids[i]; break; }
	}
	var names = [], count = -1;
	if (rackId) {
		if (!rackApi || Number(rackApi.id) !== rackId) {
			if (rackApi) rackApi.property = "";
			rackApi = new LiveAPI(function (a) { if (a[0] === "visible_macro_count") scanSoon(); }, "id " + rackId);
			rackApi.property = "visible_macro_count";
		}
		var params = idList(rackApi.get("parameters"));
		// Parameter 0 is "Device On"; macros 1–16 follow.
		count = Math.min(SLOTS, Number(rackApi.get("visible_macro_count")) || 0, params.length - 1);
		for (i = 0; i < SLOTS; i++) {
			var pid = i < count ? params[i + 1] : 0;
			if (pid) names.push(str(new LiveAPI("id " + pid).get("name")));
			mapSlot(i, pid);
		}
		watchNames(params.slice(1, 1 + count));
		status("Rack \"" + str(rackApi.get("name")) + "\" · " + count + " macro" + (count === 1 ? "" : "s"));
	} else {
		if (rackApi) { rackApi.property = ""; rackApi = null; }
		for (i = 0; i < SLOTS; i++) mapSlot(i, 0);
		watchNames([]);
		status("no Rack after kbLane");
	}
	info = { count: count, names: names };
	report();
}

function mapSlot(i, pid) {
	if (mapped[i] === pid) return;
	mapped[i] = pid;
	outlet(1, i + 1, "id", pid);
}

// A renamed macro reports again (Refresh also does). The observers are only
// rebuilt when the macros themselves change, and each one ignores the call it
// makes when it is set up: rebuilding them on every scan made each scan start
// the next one (an endless rescan loop).
function watchNames(pids) {
	var key = pids.join(" "), k;
	if (key === watchedPids) return;
	watchedPids = key;
	for (k = 0; k < nameApis.length; k++) nameApis[k].property = "";
	nameApis = [];
	for (k = 0; k < pids.length; k++) {
		var api = new LiveAPI(nameWatcher(), "id " + pids[k]);
		api.property = "name";
		nameApis.push(api);
	}
}
function nameWatcher() {
	var first = true;
	return function (a) {
		if (a[0] !== "name") return;
		if (first) { first = false; return; }
		scanSoon();
	};
}

// Transport stop: every offset back to 0, so the macros sit at their knobs.
function observePlay() {
	if (playApi) return;
	playApi = new LiveAPI(function (a) { if (a[0] === "is_playing" && Number(a[1]) === 0) outlet(2, "bang"); }, "live_set");
	playApi.property = "is_playing";
}

function report() {
	if (reported && (reported[0] !== grp || reported[1] !== laneIdx)) { outlet(3, reported[0], reported[1], -2); lastReport = ""; }
	reported = [grp, laneIdx];
	var msg = [grp, laneIdx, info.count].concat(info.names), key = msg.join("|");
	if (key === lastReport) return; // nothing changed: no report, no Console line
	lastReport = key;
	outlet(3, msg);
	post("kbLane: group " + grp + " " + (laneIdx ? "bass" : "kick") + ": " +
		(info.count < 0 ? "no rack" : info.count + " macros " + info.names.join(" · ")) + "\n");
}

function notifydeleted() {
	scanTask.cancel();
	if (reported) outlet(3, reported[0], reported[1], -2);
	if (trackApi) trackApi.property = "";
	if (rackApi) rackApi.property = "";
	if (playApi) playApi.property = "";
	watchNames([]);
}

function status(s) { outlet(0, s); }
function str(v) { return v instanceof Array ? v.join(" ") : String(v); }

function idList(list) {
	var out = [];
	if (!list) return out;
	for (var i = 0; i < list.length; i++) if (list[i] !== "id") out.push(Number(list[i]));
	return out;
}
