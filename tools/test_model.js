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
	eq("empty size", empty.length < 120, true);

	// edits
	var changes = 0;
	m.onChange = function () { changes++; };
	m.addTrig(K, 0);
	m.addTrig(K, 511);
	m.addTrig(B, 4, 40);
	m.addTrig(B, 5);
	eq("kick note ignored", m.step(K, 0).note, -1);
	eq("bass note", m.step(B, 4).note, 40);
	eq("bass default note", m.step(B, 5).note, 60);
	eq("changes fired", changes, 4);

	m.setMuted(K, 0, true);
	m.setLock(K, 0, P.velocity, 200);           // clamps
	m.setLock(K, 0, P.slide, 1);                // slide not on kick: ignored
	m.setLock(B, 4, P.slide, 1);
	m.setLock(B, 4, P.microtime, -99);          // clamps
	m.setLock(B, 4, P.m3, 64);
	m.setLock(B, 4, P.m4, -150);                // clamps
	m.setLock(K, 100, P.velocity, 10);          // no trig: ignored
	eq("vel clamp", m.value(K, 0, P.velocity), 127);
	eq("kick slide ignored", m.isLocked(K, 0, P.slide), false);
	eq("micro clamp", m.value(B, 4, P.microtime), -12);
	eq("default used", m.value(B, 5, P.velocity), 100);
	eq("macro default 0", m.value(B, 5, P.m3), 0);
	eq("macro lock", [m.value(B, 4, P.m3), m.value(B, 4, P.m4)], [64, -100]);
	eq("no trig no lock", m.hasTrig(K, 100), false);
	eq("hasLocks", m.hasLocks(B, 4), true);

	m.clearLock(B, 4, P.microtime);
	eq("clearLock", m.isLocked(B, 4, P.microtime), false);
	eq("other lock kept", m.isLocked(B, 4, P.slide), true);

	m.setSetting("kickNote", 38);
	m.setSetting("swing", 99);
	m.setLoop(5, 2);
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
	eq("macro locks kept", [r.value(B, 4, P.m3), r.value(B, 4, P.m4)], [64, -100]);
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
	function notes(evs) { return evs.filter(function (e) { return e.lane < 2; }); }
	var ev = notes(pm.eventsAt(0, stepMs, 0));
	eq("two events at 0", ev.length, 2);
	eq("kick event", [ev[0].lane, ev[0].pitch, ev[0].velocity, ev[0].durMs, ev[0].channel], [K, 60, 100, 50, 1]);
	eq("bass event", [ev[1].lane, ev[1].pitch, ev[1].durMs, ev[1].channel], [B, 41, 100, 2]);
	eq("muted silent", pm.eventsAt(4, stepMs, 0).length, 0);
	eq("empty silent", pm.eventsAt(1, stepMs, 0).length, 0);
	// loop = page 1 only: abs 32 wraps to step 0, page 2 trig never plays
	eq("loop wrap", pm.seqIndexFor(32, 0), 0);
	eq("loop wrap events", notes(pm.eventsAt(32, stepMs, 0)).length, 2);
	pm.setLoop(0, 1);
	eq("loop 2 pages", [pm.seqIndexFor(32, 0), pm.seqIndexFor(64, 0)], [32, 0]);
	pm.setLoop(1, 2);
	eq("loop from page 2", [pm.seqIndexFor(0, 0), pm.seqIndexFor(33, 0), pm.seqIndexFor(64, 0)], [32, 65, 32]);
	eq("negative abs", pm.seqIndexFor(-1, 0), 95);
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

	// ---- slides / ties / mono ----
	var sm = new M.Model(), sms = 100;
	function ev2(m, a) { return m.eventsAt(a, sms, 0, 0).filter(function (e) { return e.lane === B; }); }
	function bends(m, a) { return m.eventsAt(a, sms, 0, 0).filter(function (e) { return e.lane === 2; }); }
	sm.setLoop(0, 3);
	sm.addTrig(B, 0, 40); sm.setLock(B, 0, P.slide, 1); sm.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(2));
	sm.addTrig(B, 4, 47); sm.setLock(B, 4, P.velocity, 10); sm.setLock(B, 4, P.length, M.RETRIG_LENS.indexOf(0.25));
	var e0 = ev2(sm, 0);
	eq("slide: one note-on", e0.length, 1);
	eq("slide note: first's Length from its start", [e0[0].pitch, e0[0].durMs, e0[0].velocity], [40, 200, 100]);
	sm.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(8));
	eq("target: no note-on", ev2(sm, 4).length, 0);
	eq("reset before note", bends(sm, 0)[0].pitch, 8192);
	eq("100%: glide spans the gap", bends(sm, 1).length > 0 && bends(sm, 3).length > 0, true);
	var b4 = bends(sm, 4); // arrives on step 4's beat (last value at end of step 3)
	var b3 = bends(sm, 3);
	eq("lands exactly on the target's beat", [b4.length, b4[0] && b4[0].offMs, b4[0] && b4[0].pitch], [1, 0, Math.round(8192 + 7 / 24 * 8191)]);
	eq("glide still short of target at step 3", b3[b3.length - 1].pitch < b4[0].pitch, true);
	eq("nothing after arrival", bends(sm, 5).length, 0);
	sm.setLock(B, 0, P.slideTime, 25);  // last quarter of the gap only
	eq("25%: no bend early", [bends(sm, 1).length, bends(sm, 2).length, bends(sm, 3).length > 0], [0, 0, true]);
	sm.setLock(B, 0, P.slideTime, 150); // starts at the first note, arrives 2 steps late
	eq("150%: still gliding after target", bends(sm, 5).length > 0, true);
	sm.clearLock(B, 0, P.slideTime);
	// chain: B also slides on
	sm.setLock(B, 4, P.slide, 1); sm.addTrig(B, 8, 36);
	eq("chain: step 8 is where the 8-step note ends: new note", ev2(sm, 8).length, 1);
	sm.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(16));
	eq("chain: one note-on, first's Length (cut by nothing)", ev2(sm, 0)[0].durMs, 1600);
	eq("chain continues: no note-on at 8", ev2(sm, 8).length, 0);
	sm.clearLock(B, 4, P.slide);
	eq("chain ends at 4: step 8 new note", ev2(sm, 8).length, 1);
	// tie: instant jump at the target
	sm.clearLock(B, 0, P.slide); sm.setLock(B, 0, P.tie, 1);
	var bt = bends(sm, 4);
	eq("tie: one jump on target", [bends(sm, 1).length, bt.length, bt[0].offMs], [0, 1, 0]);
	sm.clearLock(B, 0, P.tie);
	// out of range: new note
	sm.setLock(B, 0, P.slide, 1); sm.setNote(B, 4, 70);
	eq("out of bend range: new note", ev2(sm, 4).length, 1);
	sm.setNote(B, 4, 47);
	// retrig step doesn't slide
	sm.setLock(B, 0, P.retrig, 1);
	eq("retrig: no slide", ev2(sm, 4).length, 1);
	sm.clearLock(B, 0, P.retrig);
	// mono cut: plain long note cut by the next note
	var mc = new M.Model(); mc.setLoop(0, 1);
	mc.addTrig(B, 0, 40); mc.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(8)); mc.addTrig(B, 2, 41);
	eq("mono cut", mc.eventsAt(0, sms, 0, 0).filter(function (e) { return e.lane === B; })[0].durMs, 199);
	mc.setLock(B, 2, P.retrigVoices, 1);
	eq("2 voices: no cut", mc.eventsAt(0, sms, 0, 0).filter(function (e) { return e.lane === B; })[0].durMs, 800);
	// kick tie holds
	var kt = new M.Model(); kt.setLoop(0, 1); kt.addTrig(K, 0); kt.setLock(K, 0, P.tie, 1); kt.setLock(K, 0, P.length, M.RETRIG_LENS.indexOf(4)); kt.addTrig(K, 3);
	eq("kick tie: held, no retrigger", [kt.eventsAt(0, sms, 0, 0).filter(function (e) { return e.lane === K; })[0].durMs, kt.eventsAt(3, sms, 0, 0).length], [400, 0]);

	// shortest Length on a slide: note ends before the glide, no bends after it
	var cl = new M.Model(); cl.setLoop(0, 1);
	cl.addTrig(B, 0, 40); cl.setLock(B, 0, P.slide, 1); cl.setLock(B, 0, P.length, 0); cl.addTrig(B, 4, 47);
	var cle = cl.eventsAt(0, 100, 0, 0);
	eq("click: 12.5 ms note", cle.filter(function (e) { return e.lane === B; })[0].durMs, 13);
	eq("click: no bends after it ends", [1, 2, 3].map(function (a) { return cl.eventsAt(a, 100, 0, 0).length; }), [0, 0, 0]);
	eq("click: target plays as a new note", cl.eventsAt(4, 100, 0, 0).filter(function (e) { return e.lane === B; }).map(function (e) { return e.pitch; }), [47]);
	// long Length: the next new note still cuts it
	cl.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(16)); cl.wipe(B, 4); cl.addTrig(B, 6, 50); cl.setLock(B, 4 - 4 + 0, P.slide, 1);
	cl.addTrig(B, 3, 45);
	eq("chain cut by next new note", cl.eventsAt(0, 100, 0, 0).filter(function (e) { return e.lane === B; })[0].durMs, 599);

	// Length 4 steps, target 5 steps away: no slide, target is a new note
	var far = new M.Model(); far.setLoop(0, 1);
	far.addTrig(B, 0, 40); far.setLock(B, 0, P.slide, 1); far.setLock(B, 0, P.length, M.RETRIG_LENS.indexOf(4)); far.addTrig(B, 5, 47);
	eq("far target: no bends", [1, 2, 3].map(function (a) { return far.eventsAt(a, 100, 0, 0).length; }), [0, 0, 0]);
	eq("far target: new note", far.eventsAt(5, 100, 0, 0).filter(function (e) { return e.lane === B; }).length, 1);
	far.wipe(B, 5); far.addTrig(B, 3, 47);
	eq("near target: slides", [far.eventsAt(3, 100, 0, 0).filter(function (e) { return e.lane === B; }).length, far.eventsAt(1, 100, 0, 0).length > 0], [0, true]);

	// ---- macro locks ----
	var cm2 = new M.Model(); cm2.setLoop(0, 1);
	var mac = function (evs, lane) { return evs.filter(function (e) { return e.lane === lane; }).map(function (e) { return [e.pitch, e.velocity]; }); };
	cm2.addTrig(K, 0); cm2.setLock(K, 0, P.m1, 64); cm2.setLock(K, 0, P.m3, -20); cm2.setLock(K, 0, P.m5, 0);
	cm2.addTrig(B, 2, 40); cm2.setLock(B, 2, P.m2, 99);
	var c0 = cm2.eventsAt(0, 100, 0, 0);
	eq("kick: reset, non-zero slots, then the note", c0.map(function (e) { return [e.lane, e.pitch, e.velocity, e.offMs]; }), [[3, 0, 0, 0], [3, 1, 64, 0], [3, 3, -20, 0], [0, 60, 100, 0]]);
	eq("bass macros on lane 4", mac(cm2.eventsAt(2, 100, 0, 0), 4), [[0, 0], [2, 99]]);
	cm2.addTrig(K, 1);
	eq("unlocked step: reset only", mac(cm2.eventsAt(1, 100, 0, 0), 3), [[0, 0]]);
	eq("empty step: nothing", cm2.eventsAt(3, 100, 0, 0).length, 0);
	cm2.setMuted(K, 0, true);
	eq("muted: no macros", mac(cm2.eventsAt(0, 100, 0, 0), 3), []);
	cm2.setMuted(K, 0, false); cm2.setLock(K, 0, P.probability, 0);
	eq("prob fail: no macros", mac(cm2.eventsAt(0, 100, 0, 0), 3), []);
	cm2.clearLock(K, 0, P.probability);
	// microtime: the macros move with the note
	cm2.setLock(K, 0, P.microtime, 6);
	eq("macros at the note's time", cm2.eventsAt(0, 100, 0, 0).map(function (e) { return e.offMs; }), [25, 25, 25, 25]);
	cm2.clearLock(K, 0, P.microtime);
	// slid-into step's macro lock doesn't apply
	cm2.setLock(B, 2, P.slide, 1); cm2.setLock(B, 2, P.length, M.RETRIG_LENS.indexOf(4)); cm2.addTrig(B, 3, 42); cm2.setLock(B, 3, P.m4, 10);
	eq("slid-into: no macros", mac(cm2.eventsAt(3, 100, 0, 0), 4), []);
	// retrig: macros once, with the first hit
	cm2.setLock(K, 0, P.retrig, 1); cm2.setLock(K, 0, P.length, M.RETRIG_LENS.indexOf(2)); cm2.setLock(K, 0, P.retrigRate, M.RETRIG_RATES.indexOf("1/32"));
	cm2.wipe(K, 1);
	eq("retrig: macros once", [mac(cm2.eventsAt(0, 100, 0, 0), 3).length, mac(cm2.eventsAt(1, 100, 0, 0), 3).length], [3, 0]);
	// Euclid hits: no locks, reset only
	var ce = new M.Model(); ce.setEuclid(K, "pulses", 4); ce.setEuclid(K, "layer", 1);
	eq("euclid hit: reset only", mac(ce.eventsAt(0, 100, 0, 0), 3), [[0, 0]]);

	// ---- performance mode ----
	var pm = new M.Model(); pm.setLaneLength(K, 12);
	pm.addTrig(K, 0); pm.addTrig(K, 4 * 32 + 13); pm.addTrig(B, 2 * 32 + 5, 40);
	eq("perf off: normal loop", [pm.seqIndexFor(45, K), pm.seqIndexFor(45, B)], [9, 13]);
	pm.setPerf(true);
	eq("perf on, nothing picked: normal loop", pm.seqIndexFor(45, K), 9);
	pm.perfSwitch(K, 4, 4, 48);
	eq("before the switch: old mapping", pm.seqIndexFor(47, K), 47 % 12);
	eq("from the switch: page 5, position kept, Length ignored", [pm.seqIndexFor(48, K), pm.seqIndexFor(77, K)], [4 * 32 + 16, 4 * 32 + 13]);
	eq("other lane untouched", pm.seqIndexFor(77, B), 13);
	eq("pending", [pm.perfPending(K, 40).start, pm.perfPending(K, 48)], [4, null]);
	eq("note on the new page plays at the same bar position", pm.eventsAt(77, 100, 0, 0).filter(function (e) { return e.lane === K; }).length, 1);
	pm.perfSwitch(B, 1, 2, 64);
	eq("range of 2 pages", [pm.seqIndexFor(64, B), pm.seqIndexFor(64 + 37, B)], [32 + 0, 32 + 37]);
	pm.perfSwitch(B, 5, 5, 60);
	eq("a newer switch replaces later ones", [pm.perf[B].length, pm.seqIndexFor(64, B)], [1, 5 * 32]);
	pm.addTrig(B, 2, 41); pm.clear(); pm.addTrig(K, 0);
	eq("survives clear / undo (not part of the sequence)", pm.perf !== null, true);
	pm.perfCollapse();
	eq("collapse: latest choice from the start", [pm.perf[K][0].from, pm.seqIndexFor(3, K)], [-Infinity, 4 * 32 + 3]);
	pm.perfSwitch(K, null, null, 200); pm.perfSwitch(B, null, null, 200);
	eq("exit: normal again from the switch", [pm.seqIndexFor(199, K), pm.seqIndexFor(200, K)], [4 * 32 + 7, 200 % 32]);
	eq("exit not done within the lookback", pm.perfPrune(300), false);
	eq("exit done after the lookback", pm.perfPrune(200 + 256), true);
	var pe = new M.Model(); pe.setEuclid(K, "pulses", 4); pe.setPerf(true); pe.perfSwitch(K, 3, 3, -Infinity);
	eq("euclid hits on a page outside the loop", pe.eventsAt(3 * 32, 100, 0, 0).filter(function (e) { return e.lane === K; }).length, 1);

	// ---- preset slots ----
	var ps = new M.Model();
	ps.addTrig(K, 0); ps.addTrig(B, 3, 45); ps.setLock(B, 3, P.m2, 40); ps.setLaneLength(B, 20); ps.setSetting("maskKick", 1); ps.setSetting("swing", 60);
	eq("no active slot: not dirty", [ps.activeSlot, ps.isDirty()], [-1, false]);
	ps.saveSlot(2);
	eq("save: active, clean", [ps.activeSlot, ps.isDirty(), ps.slotFull(2), ps.slotFull(3)], [2, false, true, false]);
	ps.addTrig(K, 8);
	eq("edit: dirty", ps.isDirty(), true);
	ps.setSetting("swing", 70);
	ps.wipe(K, 8);
	eq("global setting change: not dirty", ps.isDirty(), false);
	ps.copySlot(2, 5);
	ps.clear(); ps.setSetting("swing", 55); ps.setSetting("kickChannel", 9);
	eq("clear keeps the slots", ps.slotFull(5), true);
	ps.loadSlot(5);
	eq("load: pattern back", [ps.hasTrig(K, 0), ps.step(B, 3).note, ps.value(B, 3, P.m2), ps.lanes[B].length, ps.settings.maskKick], [true, 45, 40, 20, 1]);
	eq("load: globals kept", [ps.settings.swing, ps.settings.kickChannel], [55, 9]);
	eq("load: active + clean", [ps.activeSlot, ps.isDirty()], [5, false]);
	ps.loadSlot(9);
	eq("empty slot loads an empty pattern", [ps.countTrigs(K), ps.countTrigs(B), ps.activeSlot, ps.lanes[B].length], [0, 0, 9, 32]);
	eq("empty slot active: dirty until saved", ps.isDirty(), true);
	ps.clearSlot(2);
	eq("clear slot", ps.slotFull(2), false);
	var pe5 = ps.encode(), pr = new M.Model();
	eq("v5 round trip", [pr.decode(pe5), pr.slotFull(5), pr.slotFull(2), pr.activeSlot, pr.encode().join(" ") === pe5.join(" ")], [true, true, false, 9, true]);
	var old = new M.Model(); old.addTrig(K, 4); var oe = old.encode().slice(0, old.encodePattern(false).length); oe[1] = 4;
	var pr4 = new M.Model(); pr4.saveSlot(0);
	eq("v4 save: working pattern, no slots", [pr4.decode(oe), pr4.hasTrig(K, 4), pr4.slotFull(0), pr4.activeSlot], [true, true, false, -1]);
	ps.setPerf(true); ps.perfSwitch(K, 3, 3, -Infinity); ps.loadSlot(5);
	eq("load keeps performance mode", ps.perfAt(K, 0).start, 3);

	// ---- save v3 (CC locks) loads into v4 ----
	var v3 = new M.Model(); v3.addTrig(B, 4, 40); v3.setLock(B, 4, P.m2, 77); v3.setLock(B, 4, P.velocity, 90);
	var e3 = v3.encode(); e3[1] = 3;
	// a v3 lane carried 8 CC numbers: put them back where v4 writes nCc = 0
	var at = 3 + M.SETTINGS.length + 3, lane0 = at;
	eq("v4 writes nCc 0", e3[lane0], 0);
	e3.splice(lane0, 1, 8, 20, 21, 22, 23, 24, 25, 26, 27);
	var nPar = e3[lane0 + 9]; e3[lane0 + 10 + P.m1] = -1; // v3 CC default "none"
	var lane1 = lane0 + 10 + nPar; lane1 += 1; // nSteps (kick: 0 steps)
	e3.splice(lane1, 1, 8, 70, 71, 72, 73, 74, 75, 76, 77);
	var o3 = new M.Model();
	eq("v3 decodes", o3.decode(e3), true);
	eq("v3: CC lock dropped, others kept", [o3.isLocked(B, 4, P.m2), o3.value(B, 4, P.velocity), o3.lanes[K].defaults[P.m1]], [false, 90, 0]);
	eq("v3: saves in the current format", o3.encode()[1], 5);

	// ---- microtime ----
	var mt = new M.Model(); mt.setLoop(0, 1);
	var kn = function (ev, lane) { return ev.filter(function (e) { return e.lane === lane; }).map(function (e) { return [e.offMs, e.durMs]; }); };
	mt.addTrig(K, 4); mt.setLock(K, 4, P.microtime, 6);
	eq("late: offset in step", kn(mt.eventsAt(4, 100, 0, 0), K), [[25, 50]]);
	mt.addTrig(K, 8); mt.setLock(K, 8, P.microtime, -6);
	eq("early: plays in the step before", [kn(mt.eventsAt(7, 100, 0, 0), K), kn(mt.eventsAt(8, 100, 0, 0), K)], [[[75, 50]], []]);
	eq("early on the play start step: on it", kn(mt.eventsAt(8, 100, 0, 8), K), [[0, 50]]);
	mt.addTrig(K, 12); mt.setLock(K, 12, P.microtime, -12); mt.addTrig(K, 11); mt.setLock(K, 11, P.microtime, 12);
	eq("+12 and next -12 at the same time: one note", [kn(mt.eventsAt(11, 100, 0, 0), K), kn(mt.eventsAt(12, 100, 0, 0), K)], [[[50, 50]], []]);
	// mono cut by an early next note
	mt.addTrig(B, 16, 40); mt.setLock(B, 16, P.length, M.RETRIG_LENS.indexOf(2)); mt.addTrig(B, 17, 43); mt.setLock(B, 17, P.microtime, -6);
	eq("cut by early next note", kn(mt.eventsAt(16, 100, 0, 0), B), [[0, 74], [75, 50]]);
	// retrig hits move with the note
	mt.addTrig(K, 24); mt.setLock(K, 24, P.microtime, 3); mt.setLock(K, 24, P.retrig, 1); mt.setLock(K, 24, P.length, M.RETRIG_LENS.indexOf(1)); mt.setLock(K, 24, P.retrigRate, M.RETRIG_RATES.indexOf("1/32"));
	eq("retrig shifted", kn(mt.eventsAt(24, 100, 0, 0), K).map(function (x) { return x[0]; }), [12.5, 62.5]);
	// late slide: glide window is measured from the shifted start
	mt.addTrig(B, 20, 40); mt.setLock(B, 20, P.microtime, 12); mt.setLock(B, 20, P.slide, 1); mt.setLock(B, 20, P.length, M.RETRIG_LENS.indexOf(4)); mt.addTrig(B, 21, 42);
	var sb = mt.eventsAt(20, 100, 0, 0), bends = sb.filter(function (e) { return e.lane === 2 && e.pitch !== 8192; });
	eq("late slide: note at 50", kn(sb, B).map(function (x) { return x[0]; }), [50]);
	eq("late slide: bends after the note", bends.length > 0 && bends[0].offMs > 50, true);
	eq("late slide: lands on step 21", mt.eventsAt(21, 100, 0, 0).filter(function (e) { return e.lane === 2; }).slice(-1)[0].pitch, Math.round(8192 + 2 / 24 * 8191));

	// ---- per-lane Length + Euclid ----
	var eu = new M.Model();
	eq("default length 32", [eu.lanes[K].length, eu.lanes[B].length], [32, 32]);
	eu.setLoop(1, 2);
	eq("page loop sets lengths", [eu.lanes[K].length, eu.lanes[B].length, eu.loopEnd], [64, 64, 2]);
	eu.setLaneLength(K, 12); eu.setLaneLength(B, 40);
	eq("odd lengths, loop end follows longer", [eu.seqIndexFor(12, K), eu.seqIndexFor(13, K), eu.seqIndexFor(40, B), eu.loopEnd], [32, 33, 32, 2]);
	eq("length capped from start page", (eu.setLaneLength(K, 999), eu.lanes[K].length), 512 - 32);
	eu.setLoop(0, 0); eu.setLaneLength(K, 16);
	eu.setEuclid(K, "steps", 8); eu.setEuclid(K, "pulses", 3);
	var hits = function (m, l, n) { var o = ""; for (var i = 0; i < n; i++) o += m.euclidHit(l, i) ? "x" : "."; return o; };
	eq("E(3,8)", hits(eu, K, 16), "x..x..x.x..x..x.");
	eu.setEuclid(K, "rotate", 1);
	eq("rotate 1", hits(eu, K, 8), ".x..x..x");
	eu.setEuclid(K, "rotate", 0); eu.setEuclid(K, "pulses", 9);
	eq("pulses capped at steps", hits(eu, K, 8), "xxxxxxxx");
	eu.setEuclid(K, "pulses", 0);
	eq("0 pulses", hits(eu, K, 8), "........");
	eu.setEuclid(K, "pulses", 4); eu.setLaneLength(K, 6);
	eq("restarts each Length, none outside", hits(eu, K, 8), "x.x.x.xx".slice(0, 6) + "..");
	var fm = new M.Model(); fm.setLoop(0, 0); fm.setLaneLength(K, 12); fm.setEuclid(K, "steps", 8); fm.setEuclid(K, "pulses", 3);
	eq("follow off: Steps 8", hits(fm, K, 12), "x..x..x.x..x");
	fm.setEuclid(K, "follow", 1);
	eq("follow on: over Length 12", hits(fm, K, 12), "x...x...x...");
	fm.setLaneLength(K, 9);
	eq("follow tracks Length", hits(fm, K, 12), "x..x..x.....");
	var fm2 = new M.Model(); fm2.decode(fm.encode()); eq("follow saved", fm2.lanes[K].euclid.follow, 1);
	// layers
	var lm = new M.Model(); lm.setLoop(0, 0); lm.setEuclid(K, "steps", 4); lm.setEuclid(K, "pulses", 1); lm.setEuclid(K, "velocity", 77);
	lm.addTrig(K, 2); lm.addTrig(K, 4); lm.setLock(K, 4, P.velocity, 50);
	var kv = function (m, a) { return m.eventsAt(a, 100, 0, 0).filter(function (e) { return e.lane === K; }).map(function (e) { return e.velocity; }); };
	eq("Both: euclid + manual, manual wins", [kv(lm, 0), kv(lm, 2), kv(lm, 4)], [[77], [100], [50]]);
	lm.setMuted(K, 4, true);
	eq("Both: muted manual silences the hit", kv(lm, 4), []);
	lm.setEuclid(K, "layer", 0);
	eq("Manual only", [kv(lm, 0), kv(lm, 2)], [[], [100]]);
	lm.setEuclid(K, "layer", 1);
	eq("Euclid only", [kv(lm, 0), kv(lm, 2), kv(lm, 4)], [[77], [], [77]]);
	lm.setEuclid(B, "steps", 2); lm.setEuclid(B, "pulses", 1); lm.setEuclid(B, "note", 43);
	eq("bass euclid note", lm.eventsAt(0, 100, 0, 0).filter(function (e) { return e.lane === B; }).map(function (e) { return e.pitch; }), [43]);
	// print
	lm.setEuclid(K, "layer", 2); lm.addTrig(B, 2, 40); lm.setLock(B, 2, P.m1, 9); lm.setMuted(B, 2, true);
	eq("print count", [lm.printEuclid(K), lm.printEuclid(B)], [8, 16]);
	eq("print keeps locks, un-mutes, replaces note", [lm.step(B, 2).note, lm.step(B, 2).locks[P.m1], lm.step(B, 2).muted], [43, 9, false]);
	eq("print new step: euclid velocity lock", [lm.value(K, 8, P.velocity), lm.value(K, 4, P.velocity), lm.step(K, 4).muted], [77, 50, false]);
	eq("print leaves non-hits", [lm.hasTrig(K, 1), lm.hasTrig(K, 2)], [false, true]);
	// negative mask, printed (any overlap over the combined cycle)
	var mk = new M.Model(); mk.setLoop(0, 0);
	mk.addTrig(K, 0); mk.addTrig(K, 4); mk.addTrig(K, 8); mk.setMuted(K, 8, true);
	mk.addTrig(B, 0, 40); mk.setLock(B, 0, P.m2, 33); mk.addTrig(B, 2, 41); mk.addTrig(B, 8, 42);
	mk.setEuclid(B, "steps", 4); mk.setEuclid(B, "pulses", 1); // bass hits on 0, 4, 8…
	mk.setEuclid(K, "steps", 16); mk.setEuclid(K, "pulses", 1); mk.setEuclid(K, "rotate", 12); // kick hit on 12, 28
	eq("kick masks bass (same length)", mk.maskLane(K, B), 4);
	eq("manual muted, locks kept, others untouched", [mk.step(B, 0).muted, mk.step(B, 0).locks[P.m2], mk.step(B, 2).muted, mk.step(B, 8).muted], [true, 33, false, false]);
	eq("euclid hit gets muted manual step", [mk.step(B, 4).muted, mk.step(B, 12).muted, mk.step(B, 28).muted], [true, true, true]);
	eq("masked hits silent", [0, 4, 12].map(function (a) { return mk.eventsAt(a, 100, 0, 0).filter(function (e) { return e.lane === B; }).length; }), [0, 0, 0]);
	eq("unmasked still play", [2, 8].map(function (a) { return mk.eventsAt(a, 100, 0, 0).filter(function (e) { return e.lane === B; }).length > 0; }), [true, true]);
	eq("kick untouched", [mk.step(K, 0).muted, mk.step(K, 4).muted], [false, false]);
	eq("mask again: nothing new", mk.maskLane(K, B), 0);
	// different lengths: kick 12 (trig on 3), bass 16 (trigs on 3, 7, 11, 5)
	var md = new M.Model(); md.setLoop(0, 0); md.setLaneLength(K, 12); md.setLaneLength(B, 16);
	md.addTrig(K, 3); [3, 7, 11, 5].forEach(function (i) { md.addTrig(B, i, 40); });
	eq("print: every pass's overlap", [md.maskLane(K, B), md.step(B, 3).muted, md.step(B, 7).muted, md.step(B, 11).muted, md.step(B, 5).muted], [3, true, true, true, false]);
	// live mask: exact per pass, nothing written
	var lv = new M.Model(); lv.setLoop(0, 0); lv.setLaneLength(K, 12); lv.setLaneLength(B, 16);
	lv.addTrig(K, 3); [3, 7, 11].forEach(function (i) { lv.addTrig(B, i, 40); });
	var bassAt = function (a) { return lv.eventsAt(a, 100, 0, 0).filter(function (e) { return e.lane === B; }).length > 0; };
	lv.setSetting("maskKick", 1);
	// abs 3: kick 3 & bass 3 → masked; abs 7: kick idx 7 (empty) → bass plays;
	// abs 19: bass 3, kick 7 → plays; abs 23: bass 7, kick 11 → plays; abs 27: bass 11, kick 3 → masked
	eq("live mask per pass", [3, 7, 11, 19, 23, 27].map(bassAt), [false, true, true, true, true, false]);
	eq("live mask writes nothing", [lv.step(B, 3).muted, lv.step(B, 11).muted], [false, false]);
	eq("kick still plays", lv.eventsAt(3, 100, 0, 0).filter(function (e) { return e.lane === K; }).length, 1);
	lv.setSetting("maskKick", 0);
	eq("mask off", [3, 27].map(bassAt), [true, true]);
	lv.setSetting("maskBass", 1);
	eq("bass masks kick", lv.eventsAt(3, 100, 0, 0).filter(function (e) { return e.lane === K; }).length, 0);
	var lv2 = new M.Model(); lv2.decode(lv.encode()); eq("mask saved", [lv2.settings.maskKick, lv2.settings.maskBass], [0, 1]);
	var um = new M.Model(); um.addTrig(K, 1); um.addTrig(K, 2); um.addTrig(K, 40); um.setMuted(K, 1, true); um.setMuted(K, 40, true); um.setLock(K, 1, P.m1, 7);
	eq("unmute page", [um.unmutePage(K, 0), um.step(K, 1).muted, um.step(K, 1).locks[P.m1], um.step(K, 40).muted], [1, false, 7, true]);

	// save v3
	var sv = new M.Model(); sv.setLoop(2, 3); sv.setLaneLength(B, 23); sv.setEuclid(B, "pulses", 5); sv.setEuclid(K, "layer", 1);
	var sv2 = new M.Model(); sv2.decode(sv.encode());
	eq("v3 round trip", [sv2.loopStart, sv2.loopEnd, sv2.lanes[K].length, sv2.lanes[B].length, sv2.lanes[B].euclid.pulses, sv2.lanes[K].euclid.layer], [2, 3, 64, 23, 5, 1]);
	var v2 = sv.encode(); v2[1] = 2; v2 = v2.slice(0, v2.length - 16);
	var sv3 = new M.Model(); eq("v2 load", sv3.decode(v2), true);
	eq("v2: length from loop pages", [sv3.lanes[K].length, sv3.lanes[B].length, sv3.lanes[B].euclid.pulses], [64, 64, 0]);

	log.push(passes + " passed, " + fails + " failed");
	return log.join("\n");
}
