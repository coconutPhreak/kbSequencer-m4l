// Runs seq_model.js tests without Max, using macOS JavaScript for Automation:
//   osascript -l JavaScript tools/test_model.js "$PWD/src/seq_model.js"
ObjC.import("Foundation");

function run(argv) {
	var src = $.NSString.stringWithContentsOfFileEncodingError(argv[0], $.NSUTF8StringEncoding, null).js;
	// Same wrapping as the bundled device build.
	var M = (new Function("exports", src))({}), fails = 0, passes = 0, log = [];

	function eq(name, got, want) {
		var g = JSON.stringify(got), w = JSON.stringify(want);
		if (g === w) passes++; else { fails++; log.push("FAIL " + name + ": got " + g + " want " + w); }
	}

	var K = M.KICK, B = M.BASS, P = M.PARAM_ID;

	// empty model round trip
	var m = new M.Model();
	var empty = m.encode();
	var m2 = new M.Model();
	eq("decode empty", m2.decode(empty), true);
	eq("empty re-encode", m2.encode(), empty);
	eq("empty size", empty.length < 100, true);

	// edits
	var changes = 0;
	m.onChange = function () { changes++; };
	m.addTrig(K, 0);
	m.addTrig(K, 511);
	m.addTrig(B, 4, 40);
	m.addTrig(B, 5);
	eq("kick note ignored", m.step(K, 0).note, -1);
	eq("bass note", m.step(B, 4).note, 40);
	eq("bass default note", m.step(B, 5).note, 36);
	eq("changes fired", changes, 4);

	m.setMuted(K, 0, true);
	m.setLock(K, 0, P.velocity, 200);           // clamps
	m.setLock(K, 0, P.slide, 1);                // slide not on kick: ignored
	m.setLock(B, 4, P.slide, 1);
	m.setLock(B, 4, P.microtime, -99);          // clamps
	m.setLock(B, 4, P.cc3, 64);
	m.setLock(K, 100, P.velocity, 10);          // no trig: ignored
	eq("vel clamp", m.value(K, 0, P.velocity), 127);
	eq("kick slide ignored", m.isLocked(K, 0, P.slide), false);
	eq("micro clamp", m.value(B, 4, P.microtime), -12);
	eq("default used", m.value(B, 5, P.velocity), 100);
	eq("cc default none", m.value(B, 5, P.cc3), -1);
	eq("cc lock", m.value(B, 4, P.cc3), 64);
	eq("no trig no lock", m.hasTrig(K, 100), false);
	eq("hasLocks", m.hasLocks(B, 4), true);

	m.clearLock(B, 4, P.microtime);
	eq("clearLock", m.isLocked(B, 4, P.microtime), false);
	eq("other lock kept", m.isLocked(B, 4, P.slide), true);

	m.setSetting("kickNote", 38);
	m.setSetting("swing", 99);
	m.setLoop(5, 2);
	m.setCcNumber(B, 2, 74);
	eq("swing clamp", m.settings.swing, 75);
	eq("loop ordered", [m.loopStart, m.loopEnd], [2, 5]);
	eq("pageHasTrigs p0", m.pageHasTrigs(K, 0), true);
	eq("pageHasTrigs p15", m.pageHasTrigs(K, 15), true);
	eq("pageHasTrigs p1", m.pageHasTrigs(K, 1), false);

	// round trip with content
	var enc = m.encode();
	var r = new M.Model();
	var restoredChanges = 0;
	r.onChange = function () { restoredChanges++; };
	eq("decode", r.decode(enc), true);
	eq("decode silent", restoredChanges, 0);
	eq("re-encode identical", r.encode(), enc);
	eq("muted kept", r.step(K, 0).muted, true);
	eq("last step kept", r.hasTrig(K, 511), true);
	eq("kick note setting", r.settings.kickNote, 38);
	eq("cc number", r.lanes[B].ccNums[2], 74);
	eq("trig counts", [r.countTrigs(K), r.countTrigs(B)], [2, 2]);

	// wipe
	r.wipe(B, 4);
	eq("wipe", r.hasTrig(B, 4), false);
	r.addTrig(B, 4);
	eq("wipe cleared locks", r.hasLocks(B, 4), false);

	// bad input
	var bad = new M.Model();
	eq("bad magic", bad.decode([1, 2, 3]), false);
	eq("truncated", bad.decode(enc.slice(0, enc.length - 3)), false);
	eq("after bad, cleared", bad.countTrigs(K), 0);
	eq("strings ok", new M.Model().decode(enc.map(String)), true);

	// worst-case size: every step on both lanes, 6 locks each
	var big = new M.Model();
	for (var l = 0; l < 2; l++) for (var i = 0; i < M.NUM_STEPS; i++) {
		big.addTrig(l, i, 40);
		for (var p = 0; p < 6; p++) big.setLock(l, i, p, 1);
	}
	var bigEnc = big.encode();
	log.push("full sequence, 6 locks/step: " + bigEnc.length + " ints");
	var big2 = new M.Model();
	eq("big round trip", big2.decode(bigEnc) && big2.encode().length === bigEnc.length, true);

	// ---- playback ----
	var pm = new M.Model();
	pm.addTrig(K, 0);
	pm.addTrig(B, 0, 41);
	pm.addTrig(K, 4); pm.setMuted(K, 4, true);
	pm.addTrig(K, 32);
	pm.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(1));
	var stepMs = 100;
	var ev = pm.eventsAt(0, stepMs, 0);
	eq("two events at 0", ev.length, 2);
	eq("kick event", [ev[0].lane, ev[0].pitch, ev[0].velocity, ev[0].durMs, ev[0].channel], [K, 36, 100, 50, 1]);
	eq("bass event", [ev[1].lane, ev[1].pitch, ev[1].durMs, ev[1].channel], [B, 41, 100, 2]);
	eq("muted silent", pm.eventsAt(4, stepMs, 0).length, 0);
	eq("empty silent", pm.eventsAt(1, stepMs, 0).length, 0);
	// loop = page 1 only: abs 32 wraps to step 0, page 2 trig never plays
	eq("loop wrap", pm.seqIndexFor(32), 0);
	eq("loop wrap events", pm.eventsAt(32, stepMs, 0).length, 2);
	pm.setLoop(0, 1);
	eq("loop 2 pages", [pm.seqIndexFor(32), pm.seqIndexFor(64)], [32, 0]);
	pm.setLoop(1, 2);
	eq("loop from page 2", [pm.seqIndexFor(0), pm.seqIndexFor(33), pm.seqIndexFor(64)], [32, 65, 32]);
	eq("negative abs", pm.seqIndexFor(-1), 95);
	// probability: 0 never, 100 always, 50 about half and stable per step
	pm.setLoop(0, 0);
	pm.setLock(K, 0, P.probability, 0);
	var any = 0;
	for (var a = 0; a < 3200; a += 32) any += pm.eventsAt(a, stepMs, 0).filter(function (e) { return e.lane === K; }).length;
	eq("prob 0 never", any, 0);
	pm.setLock(K, 0, P.probability, 50);
	var hits = 0, stable = true;
	for (a = 0; a < 32000; a += 32) {
		var h = pm.eventsAt(a, stepMs, 7).filter(function (e) { return e.lane === K; }).length;
		if (pm.eventsAt(a, stepMs, 7).filter(function (e) { return e.lane === K; }).length !== h) stable = false;
		hits += h;
	}
	eq("prob 50 about half", hits > 400 && hits < 600, true);
	eq("prob roll stable on refill", stable, true);

	// ---- keyboard ----
	var major = [0, 2, 4, 5, 7, 9, 11];
	eq("C major oct 1", M.keyboardNotes(0, major, 1).slice(0, 9), [36, 38, 40, 41, 43, 45, 47, 48, 50]);
	eq("16 notes", M.keyboardNotes(0, major, 1).length, 16);
	eq("A minor root", M.keyboardNotes(9, [0, 2, 3, 5, 7, 8, 10], 1)[0], 45);
	eq("chromatic fallback", M.keyboardNotes(0, [], 1).slice(0, 3), [36, 37, 38]);
	eq("pentatonic wraps", M.keyboardNotes(0, [0, 2, 4, 7, 9], 0).slice(4, 7), [33, 36, 38]);
	eq("oct 6 top in range", M.keyboardNotes(0, major, 6)[15], 122);
	eq("oct 7 clipped", M.keyboardNotes(0, major, 7)[15], -1);
	eq("bottom ok", M.keyboardNotes(0, major, -2)[0], 0);

	// ---- copy / paste ----
	var cm = new M.Model();
	cm.addTrig(B, 2, 40); cm.setLock(B, 2, P.velocity, 90); cm.setMuted(B, 2, true);
	cm.addTrig(B, 4, 45);
	var clip = cm.copySteps(B, 2, 3);
	eq("clip len", clip.length, 3);
	eq("clip empty middle", clip[1], null);
	cm.setLock(B, 2, P.velocity, 10);
	eq("clip detached", clip[0].locks[P.velocity], 90);
	cm.addTrig(B, 101, 50);
	eq("paste count", cm.pasteSteps(B, 100, clip), 3);
	eq("pasted step", [cm.step(B, 100).note, cm.step(B, 100).muted, cm.value(B, 100, P.velocity)], [40, true, 90]);
	eq("paste overwrites with empty", cm.hasTrig(B, 101), false);
	eq("pasted third", cm.step(B, 102).note, 45);
	cm.setLock(B, 100, P.velocity, 1);
	eq("paste detached from clip", clip[0].locks[P.velocity], 90);
	eq("paste clipped at end", cm.pasteSteps(B, 510, clip), 2);
	eq("page copy", cm.copySteps(B, 0, 32).length, 32);

	// ---- retrig ----
	eq("len list size", M.RETRIG_LENS.length, 128);
	eq("len ends INF", M.RETRIG_LEN_LABELS[127], "INF");
	eq("len labels", [M.RETRIG_LEN_LABELS[0], M.RETRIG_LEN_LABELS[1], M.RETRIG_LEN_LABELS[2], M.RETRIG_LEN_LABELS[M.RETRIG_LENS.indexOf(4)], M.RETRIG_LEN_LABELS[126]], ["0.125", "0.188", "1/64", "1/4", "128"]);
	eq("len 1.13 label", M.RETRIG_LEN_LABELS[M.RETRIG_LENS.indexOf(1.125)], "1.13");
	eq("rates", [M.RETRIG_RATES.length, M.RETRIG_RATES[9]], [17, "1/16"]);
	var rt = new M.Model(), ms = 100;
	function on(m, l, i, o) { m.addTrig(l, i, 40); m.setLock(l, i, P.retrig, 1); m.setLock(l, i, P.length, M.RETRIG_LENS.indexOf(4)); for (var k in o) m.setLock(l, i, P[k], o[k]); }
	function evs(m, a, start) { return m.eventsAt(a, ms, 0, start === undefined ? 0 : start).filter(function (e) { return e.lane === K; }); }
	rt.setLoop(0, 3);
	on(rt, K, 0, {});                                     // 1/16, LEN 1/4 = 4 hits
	eq("burst hit per step", [0, 1, 2, 3, 4].map(function (a) { return evs(rt, a).length; }), [1, 1, 1, 1, 0]);
	eq("hit gate", evs(rt, 1)[0].durMs, 99);
	rt.setLock(K, 0, P.retrigFade, -100);
	eq("vfad -100 to last hit", [0, 1, 2, 3].map(function (a) { return evs(rt, a)[0].velocity; }), [100, 67, 34, 1]);
	rt.setLock(K, 0, P.retrigCurve, 100);
	eq("crv 100 exponential", [0, 1, 2, 3].map(function (a) { return evs(rt, a)[0].velocity; }), [100, 22, 5, 1]);
	rt.clearLock(K, 0, P.retrigCurve); rt.setLock(K, 0, P.retrigFade, 100);
	eq("vfad +100 to 127", evs(rt, 3)[0].velocity, 127);
	rt.clearLock(K, 0, P.retrigFade);
	rt.setLock(K, 0, P.retrigRate, M.RETRIG_RATES.indexOf("1/32"));
	eq("1/32: two hits in a step", evs(rt, 0).map(function (e) { return e.offMs; }), [0, 50]);
	rt.setLock(K, 0, P.retrigRate, 9);
	// no lookback start: only the step's own first hit
	eq("startAbs default", rt.eventsAt(2, ms, 0).filter(function (e) { return e.lane === K; }).length, 0);
	eq("before play start: nothing", evs(rt, 2, 2).length, 0);
	// mono: a later note cuts the burst
	rt.addTrig(K, 2);
	eq("mono cut", [evs(rt, 2).length, evs(rt, 3).length], [1, 0]);
	rt.setLock(K, 2, P.retrigVoices, 1);                  // 2 voices: burst keeps going
	eq("2 voices overlap", evs(rt, 3).length, 1);
	rt.wipe(K, 2);
	// INF runs until the next note
	rt.setLock(K, 0, P.length, 127);
	eq("INF keeps going", evs(rt, 40).length, 1);
	rt.addTrig(K, 50);
	eq("INF cut by next note", [evs(rt, 50).length, evs(rt, 51).length], [1, 0]);
	rt.wipe(K, 50); rt.setLock(K, 0, P.length, M.RETRIG_LENS.indexOf(4));
	// PROB / PMODE
	rt.setLock(K, 0, P.retrigProb, 0);
	eq("repeats prob 0: first hit only", [0, 1, 2].map(function (a) { return evs(rt, a).length; }), [1, 0, 0]);
	rt.setLock(K, 0, P.retrigLock, 1);
	eq("lock ignores prob", evs(rt, 1).length, 1);
	rt.clearLock(K, 0, P.retrigLock);
	rt.setLock(K, 0, P.retrigPMode, 1);
	eq("burst mode fail: no repeats", [evs(rt, 0).length, evs(rt, 1).length], [1, 0]);
	rt.setLock(K, 0, P.retrigPMode, 2);
	eq("note mode fail: nothing", evs(rt, 0).length, 0);
	rt.clearLock(K, 0, P.retrigProb); rt.clearLock(K, 0, P.retrigPMode);
	// speed fade: 1/16 -> 1/32 with GLIDE 0: second gap already 1/32
	rt.setLock(K, 0, P.retrigTRate, M.RETRIG_RATES.indexOf("1/32") + 1);
	rt.setLock(K, 0, P.retrigGlide, 0);
	eq("trate glide 0", evs(rt, 1).map(function (e) { return e.offMs; }), [0, 50]);
	rt.setLock(K, 0, P.retrigGlide, 16);                   // glide over 4 steps
	var n2 = 0; for (var a2 = 0; a2 < 4; a2++) n2 += evs(rt, a2).length;
	eq("glide: more hits than 4, fewer than 8", n2 > 4 && n2 < 8, true);
	// plain note on the other lane unaffected; bass plain still plays
	rt.addTrig(B, 1, 45);
	eq("bass plain", rt.eventsAt(1, ms, 0, 0).filter(function (e) { return e.lane === B; }).map(function (e) { return [e.offMs, e.pitch, e.durMs]; }), [[0, 45, 50]]);

	// ---- merged length ----
	var ml = new M.Model();
	eq("default length 1/32", M.RETRIG_LENS[ml.lanes[K].defaults[P.length]], 0.5);
	ml.addTrig(B, 0, 40); ml.setLock(B, 0, P.length, 127); ml.addTrig(B, 5, 41);
	eq("INF gate until next note", ml.eventsAt(0, 100, 0, 0).filter(function (e) { return e.lane === B; })[0].durMs, 499);
	// v1 save: gate ticks lock + default -> length index
	var v1 = new M.Model(); v1.addTrig(K, 3); v1.lanes[K].steps[3].locks[1] = 48; v1.lanes[K].defaults[1] = 24;
	var e1 = v1.encode(); e1[1] = 1;
	var m1 = new M.Model();
	eq("v1 decodes", m1.decode(e1), true);
	eq("v1 lock migrated", [M.RETRIG_LENS[m1.value(K, 3, P.length)], m1.isLocked(K, 3, 1)], [2, false]);
	eq("v1 default migrated", M.RETRIG_LENS[m1.lanes[K].defaults[P.length]], 1);
	eq("v2 round trip", new M.Model().decode(m1.encode()), true);

	log.push(passes + " passed, " + fails + " failed");
	return log.join("\n");
}
