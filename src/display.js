// kbSequencerDraw: Push 3 screen drawing (Live 13 Custom Device Display API).
// Knows nothing about the sequencer: the main script sends state through the
// setters below, then "bang". Output: "jit_matrix <name>" to [live.push].
// Only the strip y 23–141 is ours; Push draws its own rows above and below,
// and the encoders' small values near the top of the strip.
autowatch = 1;
inlets = 1;
outlets = 1;

var W = 960, H = 160;
var STRIP = [0, 23, 960, 118];
var TOP = 54; // below Push's small encoder values
var layer = new MGraphics(W, H);
var outMatrix = new JitterMatrix(4, "char", W, H);

// ---- state (set by the main script) ----
var STEPS = 32;
var mode = "page";         // page | euclid | retrig | slide | cclocks
var focusLane = 0;         // lane the bank is about (euclid / retrig / slide / cclocks)
// per lane: 32 cell codes for the viewed page
//   0 off, 1 trig, 2 muted, 3 locked, 4 Euclid hit, 5 outside the lane's Length
var cells = [[], []];
var head = [-1, -1];       // playhead cell on the viewed page, -1 = elsewhere
var held = [];             // held cells on the viewed page
var pageText = ["", ""];   // "pg 1/2"
var selected = [1, 1];     // lane selected on Push
var info = "";             // one line of text at the bottom of the strip
var pattern = [];          // euclid: 1/0 per pattern step
var burst = [];            // retrig: [t, vel, play] per hit (t in steps)
var burstSpan = 1, burstChance = 100;
var slideP = 1, slideC = 0, slideFrom = 0, slideTo = 0; // slide: time 0–2, curve -1–1, semitones
var cc = [], ccLocked = [], ccNames = [];

var KICK = [0.94, 0.60, 0.48], BASS = [0.36, 0.79, 0.65];
var GREY = [0.17, 0.17, 0.16], BAR = [0.22, 0.22, 0.21], HEAD = [0.98, 0.78, 0.46];
var TXT = [0.83, 0.82, 0.78], WHITE = [1, 1, 1];

// ---- setters ----
function setmode(m, l) { mode = String(m); focusLane = l | 0; }
function lane(l) { cells[l] = arrayfromargs(arguments).slice(1); }
function playhead(k, b) { head = [k, b]; }
function setheld() { held = arrayfromargs(arguments); }
function pages(k, b) { pageText = [String(k), String(b)]; }
function sel(k, b) { selected = [k, b]; }
function setinfo() { info = arrayfromargs(arguments).join(" "); }
function setpattern() { pattern = arrayfromargs(arguments); }
function setburst(span, chance) {
	var a = arrayfromargs(arguments).slice(2);
	burstSpan = Math.max(0.0625, span); burstChance = chance; burst = [];
	for (var i = 0; i + 2 < a.length; i += 3) burst.push([a[i], a[i + 1], a[i + 2]]);
}
function setslide(p, c, from, to) { slideP = p; slideC = c; slideFrom = from; slideTo = to; }
function setcc() {
	var a = arrayfromargs(arguments);
	cc = a.slice(0, 8); ccLocked = a.slice(8, 16);
}
function ccname(k) { ccNames[k] = arrayfromargs(arguments).slice(1).join(" "); }

// ---- drawing helpers ----
function rgb(c, a) { layer.set_source_rgba(c[0], c[1], c[2], a === undefined ? 1 : a); }
function rect(x, y, w, h) { layer.rectangle(x, y, w, h); layer.fill(); }
function frame(x, y, w, h, lw) { layer.set_line_width(lw || 2); layer.rectangle(x, y, w, h); layer.stroke(); }
function text(s, x, y, size, c, a, right) {
	layer.set_font_size(size);
	rgb(c, a);
	if (right) x -= layer.text_measure(s)[0];
	layer.move_to(x, y);
	layer.show_text(s);
}
function laneCol(l) { return l === 0 ? KICK : BASS; }
function curve(x, c) { // seq_model curveShape
	x = x < 0 ? 0 : x > 1 ? 1 : x;
	return c >= 0 ? Math.pow(x, 1 + 3 * c) : 1 - Math.pow(1 - x, 1 + 3 * -c);
}

// One lane's 32 steps of the viewed page.
function drawLane(l, y, h, dimOthers) {
	var col = laneCol(l), on = selected[l] && !dimOthers, x0 = 36, cw = 28, i;
	text(l === 0 ? "K" : "B", 8, y + h / 2 + 5, 13, col, on ? 1 : 0.4);
	for (i = 0; i < STEPS; i++) {
		var c = cells[l][i] | 0, x = x0 + i * cw;
		if (c === 5) { rgb(GREY, 0.35); rect(x, y + h / 2 - 1, cw - 4, 2); continue; }
		if (c === 1 || c === 3) rgb(col, on ? 1 : 0.45);
		else if (c === 2) rgb(col, 0.25);
		else rgb(i % 8 === 0 ? BAR : GREY);
		rect(x, y, cw - 4, h);
		if (c === 3) { rgb([0, 0, 0], 0.55); rect(x + 6, y + h - 6, cw - 16, 3); } // lock mark
		if (c === 4) { rgb(col, on ? 0.9 : 0.4); frame(x + 1, y + 1, cw - 6, h - 2); }
	}
	if (head[l] >= 0) { rgb(HEAD); frame(x0 + head[l] * cw - 2, y - 3, cw, h + 6); }
	for (i = 0; i < held.length; i++) { rgb(WHITE); frame(x0 + held[i] * cw - 3, y - 4, cw + 2, h + 8, 3); }
	text(pageText[l], 952, y + h / 2 + 5, 13, TXT, on ? 1 : 0.5, true);
}

function drawPage() {
	drawLane(0, TOP + 4, 28);
	drawLane(1, TOP + 42, 28);
}

// Euclid bank: the pattern (one cycle), then the lane's viewed page.
function drawEuclid() {
	var l = focusLane, col = laneCol(l), n = pattern.length, x0 = 36, w = 916;
	if (n > 0) {
		var cw = w / n, gap = cw > 8 ? 4 : 1;
		for (var i = 0; i < n; i++) {
			rgb(pattern[i] ? col : (i === 0 ? BAR : GREY));
			rect(x0 + i * cw, TOP + 2, cw - gap, 30);
		}
	}
	drawLane(l, TOP + 46, 20);
}

// Retrig bank: the held step's burst, time across, velocity up.
function drawRetrig() {
	var l = focusLane, col = laneCol(l), x0 = 36, w = 880, y0 = 128, hmax = 66;
	var span = Math.min(burstSpan, 32), sx = w / span, i;
	rgb(GREY);
	for (i = 0; i <= Math.floor(span + 1e-9); i++) rect(x0 + i * sx, y0 - hmax, 1, hmax); // step lines
	rgb(BAR); rect(x0, y0, w, 2);
	var bw = Math.max(2, Math.min(40, sx * (burst.length > 1 ? burst[1][0] - burst[0][0] : span) * 0.6));
	var a = burstChance / 100;
	for (i = 0; i < burst.length; i++) {
		var t = burst[i][0];
		if (t > span) break;
		var h = Math.max(3, hmax * burst[i][1] / 127);
		rgb(col, i === 0 || burst[i][2] ? 1 : 0.25 + 0.6 * a);
		rect(x0 + t * sx, y0 - h, bw, h);
	}
	if (burstSpan > 32) text("…", 924, y0 - 4, 13, TXT, 0.6);
}

// Slide bank: the pitch path from this note to the next.
function drawSlide() {
	var col = BASS, x0 = 36, w = 880, yA = TOP + 62, yB = TOP + 10;
	if (slideTo < slideFrom) { var t = yA; yA = yB; yB = t; }
	if (slideTo === slideFrom) yA = yB = TOP + 36;
	rgb(GREY); rect(x0, TOP + 70, w, 1);
	rgb(BAR); rect(x0 + w / 2, TOP, 1, 72); // the next note's step
	// p <= 1: glide over the last p of the gap; p > 1: from the note, (p-1) late
	var start = slideP <= 1 ? 1 - slideP : 0, end = slideP <= 1 ? 1 : slideP;
	layer.set_line_width(3);
	rgb(col);
	var X = function (g) { return x0 + Math.min(g, 2) * (w / 2); };
	layer.move_to(X(0), yA);
	layer.line_to(X(start), yA);
	for (var k = 1; k <= 40; k++) {
		var g = start + (end - start) * k / 40;
		layer.line_to(X(g), yA + (yB - yA) * curve(k / 40, slideC));
	}
	layer.line_to(X(2), yB);
	layer.stroke();
}

// CC Locks bank: one bar per encoder column, 64 = centre line.
function drawCC() {
	var col = laneCol(focusLane), y0 = 120, hmax = 62;
	for (var k = 0; k < 8; k++) {
		var x = k * 120 + 30, v = cc[k] === undefined ? 64 : cc[k];
		rgb(GREY); rect(x, y0 - hmax, 60, hmax);
		rgb(col, ccLocked[k] ? 1 : 0.35); rect(x, y0 - hmax * v / 127, 60, hmax * v / 127);
		rgb(TXT, 0.5); rect(x - 4, y0 - hmax * 64 / 127, 68, 1);
		if (ccNames[k]) {
			var s = ccNames[k];
			if (s.length > 15) s = s.slice(0, 14) + "…";
			text(s, k * 120 + 60 - Math.min(56, s.length * 3.3), 136, 11, TXT, 0.7);
		}
	}
}

function bang() {
	layer.identity_matrix();
	layer.select_font_face("Arial Bold");
	rgb([0, 0, 0]);
	rect(STRIP[0], STRIP[1], STRIP[2], STRIP[3]); // opaque black first (alpha blending)
	if (mode === "euclid") drawEuclid();
	else if (mode === "retrig") drawRetrig();
	else if (mode === "slide") drawSlide();
	else if (mode === "cclocks") drawCC();
	else drawPage();
	if (info && mode !== "cclocks") text(info, 36, 139, 11, TXT, 0.6);
	var img = new Image(layer);
	img.tonamedmatrix(outMatrix.name);
	outlet(0, "jit_matrix", outMatrix.name);
}
