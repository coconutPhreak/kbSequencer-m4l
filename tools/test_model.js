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

	log.push(passes + " passed, " + fails + " failed");
	return log.join("\n");
}
