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
	pm.setLock(B, 0, P.length, 24);
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

	log.push(passes + " passed, " + fails + " failed");
	return log.join("\n");
}
