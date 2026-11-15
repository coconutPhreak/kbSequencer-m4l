#!/usr/bin/env python3
"""Generates the Max for Live devices in device/ (.amxd, .js, plus a .maxpat twin).

    python3 tools/build.py                 # build into device/
    python3 tools/build.py --install DIR   # also copy the device files into DIR

Sources live in src/. Each device gets ONE self-contained .js (modules are
bundled in, no require()), so only the .amxd and its .js need copying.
Edit src/ and this file, never the generated files in device/.
"""
import argparse
import datetime
import json
import shutil
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "device"
AMXD_MIDI = int.from_bytes(b"mmmm", "big")  # 1835887981

# Shown on every device and printed to the Max Console at load, so it's easy
# to tell which build is running. VERSION: bump the minor per spec build step.
VERSION = "0.13.1"
BUILD = datetime.datetime.now().strftime("%m%d.%H%M")  # build time, MMDD.HHMM
STAMP = f"v{VERSION} · {BUILD}"


# Step 6: Push shows device parameters, never a custom screen. These are the
# display parameters: one per thing an encoder edits. The script sets their
# values ("set", no output) to show settings or the held step, and puts 8 of
# them in the device's one Push bank with live.banks. Their own outputs are
# not used: the encoders are grabbed and edit the sequence directly.
# (key, longname, shortname, kind, lo, hi, units / enum items)
CONDITIONS = ["always", "1st", "!1st", "pre", "!pre", "1:2", "2:2", "1:3", "2:3", "3:3",
              "1:4", "2:4", "3:4", "4:4", "1:8", "2:8", "3:8", "4:8", "5:8", "6:8", "7:8", "8:8"]
RETRIG_RATES = ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/8", "1/10", "1/12",
                "1/16", "1/20", "1/24", "1/32", "1/40", "1/48", "1/64", "1/80"]


def retrig_len_labels():
    """Same list and labels as RETRIG_LENS / RETRIG_LEN_LABELS in src/seq_model.js."""
    vals, v = [], 0.125
    while v <= 2 + 1e-9:
        vals.append(round(v, 4)); v += 0.0625
    for inc, top in [(0.125, 4), (0.25, 8), (0.5, 16), (1, 32), (2, 64), (4, 128)]:
        v = vals[-1] + inc
        while v <= top + 1e-9:
            vals.append(round(v, 4)); v += inc
    notes = {0.25: "1/64", 0.5: "1/32", 1: "1/16", 2: "1/8", 4: "1/4", 8: "1/2", 16: "1/1"}
    out = []
    for v in vals:
        if v in notes:
            out.append(notes[v]); continue
        d = 0 if v >= 100 else 1 if v >= 10 else 2 if v >= 1 else 3
        x = int(v * 10 ** d + 0.5 + 1e-9) / 10 ** d
        out.append(f"{x:g}")
    return out + ["INF"]


RETRIG_LEN_LABELS = retrig_len_labels()
OFF_ON = ["Off", "On"]
DISPLAY_PARAMS = (
    [("kickChannel", "KickCh", "Kick Ch", "int", 1, 16, None),
     ("bassChannel", "BassCh", "Bass Ch", "int", 1, 16, None),
     ("kickNote", "KickNote", "Kick Note", "note", 0, 127, None),
     ("bendRange", "BendRange", "Bend", "int", 1, 96, "%d st"),  # each way
     ("scaleFollow", "ScaleFollow", "Scale", "enum", 0, 1, OFF_ON),
     ("swing", "Swing", "Swing", "int", 50, 75, "%d %%")]
    + [(f"ccNum{n}", f"CCNum{n}", f"CC# {n}", "int", 0, 127, None) for n in range(1, 9)]
    + [("note", "Note", "Note", "note", 0, 127, None),
       ("velocity", "Velocity", "Velocity", "int", 0, 127, None),
       ("length", "Length", "Length", "enum", 0, 127, RETRIG_LEN_LABELS),  # gate + retrig LEN
       ("microtime", "Micro", "Micro", "int", -12, 12, "%d/24"),
       ("probability", "Prob", "Prob", "int", 0, 100, "%d %%"),
       ("accent", "Accent", "Accent", "enum", 0, 1, OFF_ON),
       ("slide", "Slide", "Slide", "enum", 0, 1, OFF_ON),
       ("tie", "Tie", "Tie", "enum", 0, 1, OFF_ON),
       ("fill", "Fill", "Fill", "enum", 0, 1, OFF_ON),
       ("condition", "Cond", "Cond", "enum", 0, len(CONDITIONS) - 1, CONDITIONS)]
    + [(f"cc{n}", f"CCLock{n}", f"CC {n}", "int", -1, 127, None) for n in range(1, 9)]
    # Retrig (as retrig-m4l): banks Retrig and Rt Chance
    + [("retrig", "Retrig", "RTRG", "enum", 0, 1, OFF_ON),
       ("retrigRate", "RtRate", "RATE", "enum", 0, 16, RETRIG_RATES),
       ("retrigFade", "RtVFade", "VFAD", "int", -100, 100, "%d %%"),
       ("retrigCurve", "RtCurve", "CRV", "int", 0, 100, "%d %%"),
       ("retrigProb", "RtProb", "PROB", "int", 0, 100, "%d %%"),
       ("retrigTRate", "RtTRate", "TRATE", "enum", 0, 17, ["Off"] + RETRIG_RATES),
       ("retrigGlide", "RtGlide", "GLIDE", "float", 0, 128, "%.2f st"),
       ("retrigLock", "RtLock", "LOCK", "enum", 0, 1, OFF_ON),
       ("retrigPMode", "RtPMode", "PMODE", "enum", 0, 2, ["Repeats", "Burst", "Note"]),
       ("retrigVoices", "RtVoices", "VOICES", "enum", 0, 7, ["Mono", "2", "3", "4", "5", "6", "7", "8"])]
    # Slide bank (bass)
    + [("slideTime", "SlTime", "Sl Time", "int", 0, 200, "%d %%"),
       ("slideCurve", "SlCurve", "Sl Curve", "int", -100, 100, None)]
    # Kick Euclid / Bass Euclid banks (nothing held): lane Length + generator
    + [item for lane, L in (("k", "K"), ("b", "B")) for item in (
        # Live Int parameters only span 0-255: Length (1-512) is a float shown as an int
        (f"{lane}Length", f"{L}Length", "Length", "wideint", 1, 512, None),
        (f"{lane}EuSteps", f"{L}EuSteps", "Steps", "int", 1, 64, None),
        (f"{lane}EuPulses", f"{L}EuPulses", "Pulses", "int", 0, 64, None),
        (f"{lane}EuRotate", f"{L}EuRotate", "Rotate", "int", 0, 63, None),
        (f"{lane}EuLayer", f"{L}EuLayer", "Layer", "enum", 0, 2, ["Manual", "Euclid", "Both"]),
        (f"{lane}EuVel", f"{L}EuVel", "Velocity", "int", 1, 127, None),
        (f"{lane}EuFollow", f"{L}EuFollow", "Follow", "enum", 0, 1, OFF_ON))]
    + [("bEuNote", "BEuNote", "Note", "note", 0, 127, None)])


def bundle(out_name, main, modules=()):
    """Writes device/<out_name>: each module as `var NAME = (function(){…})();`, then main."""
    dp = {k: {"longname": ln, "kind": kind, "lo": lo, "hi": hi,
              "items": len(extra) if kind == "enum" else 0}
          for k, ln, sn, kind, lo, hi, extra in DISPLAY_PARAMS}
    parts = [f"// GENERATED by tools/build.py from src/ — do not edit.\n",
             f'var BUILD_STAMP = "{STAMP}";\n',
             f"var DISPLAY_PARAMS = {json.dumps(dp)};\n"]
    for var, path in modules:
        parts.append(f"\n// ===== {path} =====\nvar {var} = (function () {{\nvar exports = {{}};\n")
        parts.append((SRC / path).read_text())
        parts.append("\n})();\n")
    parts.append(f"\n// ===== {main} =====\n")
    parts.append((SRC / main).read_text())
    OUT.mkdir(exist_ok=True)
    (OUT / out_name).write_text("".join(parts))
    print("wrote", OUT / out_name)


class Patch:
    def __init__(self, title, size=(350, 169)):
        self.title = title
        self.size = size
        self.boxes, self.lines, self.params, self.deps = [], [], {}, []

    def box(self, id_, maxclass, rect, pres=None, **kw):
        b = {"id": id_, "maxclass": maxclass, "patching_rect": rect}
        if pres:
            b["presentation"] = 1
            b["presentation_rect"] = pres
        b.update(kw)
        self.boxes.append({"box": b})

    def obj(self, id_, text, rect, ins, outs, outtypes=None, **kw):
        self.box(id_, "newobj", rect, text=text, numinlets=ins, numoutlets=outs,
                 outlettype=outtypes if outtypes is not None else [""] * outs, **kw)

    def wire(self, src, so, dst, di):
        self.lines.append({"patchline": {"source": [src, so], "destination": [dst, di]}})

    def comment(self, id_, text, rect, pres):
        self.box(id_, "comment", rect, pres, text=text, numinlets=1, numoutlets=0)

    def toggle(self, id_, rect, pres):
        self.box(id_, "toggle", rect, pres, numinlets=1, numoutlets=1,
                 outlettype=["int"], parameter_enable=0)

    def message(self, id_, text, rect, pres=None):
        self.box(id_, "message", rect, pres, text=text, numinlets=2, numoutlets=1,
                 outlettype=[""])

    def blob_pattr(self, id_, name, rect):
        """[pattr] as a hidden, stored-only Live blob parameter: saved with the Set.

        For object boxes (newobj) Max keeps parameter_enable in
        saved_object_attributes; at the top level of the box it is ignored and
        the pattr silently stays a non-parameter (nothing saved). Format
        checked against Max-saved devices.
        """
        self.obj(id_, f"pattr {name}", rect, 1, 3, ["", "", ""],
                 varname=name,
                 saved_object_attributes={"parameter_enable": 1, "parameter_mappable": 0},
                 saved_attribute_attributes={"valueof": {
                     "parameter_longname": name, "parameter_shortname": name,
                     "parameter_type": 3,        # blob
                     "parameter_invisible": 1,   # stored only, not automatable
                     "parameter_initial_enable": 0}})
        self.params[id_] = [name, name, 0]

    def int_param(self, id_, name, rect, pres, lo, hi, initial):
        """live.numbox as an int Live parameter (format checked against Max-saved devices)."""
        self.box(id_, "live.numbox", rect, pres, numinlets=1, numoutlets=2,
                 outlettype=["", "float"], parameter_enable=1, varname=name,
                 saved_attribute_attributes={"valueof": {
                     "parameter_longname": name, "parameter_shortname": name,
                     "parameter_type": 1, "parameter_mmin": lo, "parameter_mmax": hi,
                     "parameter_initial": [initial], "parameter_initial_enable": 1,
                     "parameter_unitstyle": 0}})
        self.params[id_] = [name, name, 0]

    def display_param(self, key, longname, shortname, kind, lo, hi, extra, rect):
        """One Push display parameter (see DISPLAY_PARAMS). Not in the presentation."""
        v = {"parameter_longname": longname, "parameter_shortname": shortname,
             "parameter_initial_enable": 0}
        if kind == "enum":
            v.update(parameter_type=2, parameter_enum=extra, parameter_mmax=len(extra) - 1)
            self.box("pv_" + key, "live.menu", rect, numinlets=1, numoutlets=3,
                     outlettype=["", "", "float"], parameter_enable=1, varname="pv_" + key,
                     saved_attribute_attributes={"valueof": v})
        else:
            # wideint: an int range wider than Live's Int type (0-255), as a float shown as an int
            v.update(parameter_type=0 if kind in ("float", "wideint") else 1, parameter_mmin=lo, parameter_mmax=hi,
                     parameter_unitstyle=8 if kind == "note" else (9 if extra else (1 if kind == "float" else 0)))
            if extra:
                v["parameter_units"] = extra
            self.box("pv_" + key, "live.numbox", rect, numinlets=1, numoutlets=2,
                     outlettype=["", "float"], parameter_enable=1, varname="pv_" + key,
                     saved_attribute_attributes={"valueof": v})
        self.params["pv_" + key] = [longname, shortname, 0]

    def patcher(self):
        p = {
            "fileversion": 1,
            "appversion": {"major": 8, "minor": 6, "revision": 0,
                           "architecture": "x64", "modernui": 1},
            "classnamespace": "box",
            "rect": [100, 100, 900, 520],
            "openrect": [0, 0, self.size[0], self.size[1]],
            "openinpresentation": 1,
            "default_fontsize": 10.0,
            "default_fontname": "Arial Bold",
            "gridsize": [8, 8],
            "boxes": self.boxes,
            "lines": self.lines,
            "dependency_cache": [{"name": d, "bootpath": ".", "type": "TEXT", "implicit": 1}
                                 for d in self.deps],
            "autosave": 0,
        }
        if self.params:
            p["parameters"] = dict(self.params, inherited_shortname=1)
        # Device project block, as Max writes it in a saved .amxd. Without it
        # Max logs "a project without a name is like a day without sunshine".
        p["project"] = {
            "version": 1, "creationdate": 3590052493, "modificationdate": 3590052493,
            "viewrect": [0.0, 0.0, 300.0, 500.0], "autoorganize": 1,
            "hideprojectwindow": 1, "showdependencies": 1, "autolocalize": 0,
            "contents": {"patchers": {}, "code": {d: {"kind": "javascript", "local": 1}
                                                   for d in self.deps}},
            "layout": {}, "searchpath": {}, "detailsvisible": 0,
            "amxdtype": AMXD_MIDI, "readonly": 0, "devpathtype": 0, "devpath": ".",
            "sortmode": 0, "viewmode": 0, "includepackages": 0,
        }
        return {"patcher": p}

    def write(self, stem):
        pj = self.patcher()
        body = json.dumps(pj, indent=1).encode("utf-8") + b"\n\x00"
        # ampf container: device type (mmmm = MIDI effect), meta, ptch(JSON)
        amxd = (b"ampf" + struct.pack("<I", 4) + b"mmmm"
                + b"meta" + struct.pack("<I", 4) + struct.pack("<I", 0)
                + b"ptch" + struct.pack("<I", len(body)) + body)
        OUT.mkdir(exist_ok=True)
        (OUT / f"{stem}.amxd").write_bytes(amxd)
        (OUT / f"{stem}.maxpat").write_text(json.dumps(pj, indent=1))
        print("wrote", OUT / f"{stem}.amxd")


def common(p, js_text, js_outs, wire_init=True):
    """MIDI thru, live.thisdevice, js, takeover toggles, status + event readouts."""
    p.obj("midiin", "midiin", [30, 20, 45, 22], 1, 1, ["int"])
    p.obj("midiout", "midiout", [30, 60, 55, 22], 1, 0)
    p.wire("midiin", 0, "midiout", 0)

    p.obj("thisdevice", "live.thisdevice", [200, 20, 85, 22], 1, 3, ["bang", "int", "int"])
    p.obj("js", js_text, [200, 260, 130, 22], 1, js_outs)
    if wire_init:
        p.wire("thisdevice", 0, "js", 0)

    for key, msg, label, x, y in (("en", "enable", "Takeover", 320, 24),
                                  ("af", "autofocus", "Only when track selected", 430, 48)):
        p.obj(f"lm_{key}", "loadmess 1", [x, 20, 65, 22], 1, 1)
        p.toggle(f"tgl_{key}", [x, 60, 24, 24], [10, y, 20, 20])
        p.obj(f"pre_{key}", f"prepend {msg}", [x, 100, 105, 22], 1, 1)
        p.wire(f"lm_{key}", 0, f"tgl_{key}", 0)
        p.wire(f"tgl_{key}", 0, f"pre_{key}", 0)
        p.wire(f"pre_{key}", 0, "js", 0)
        p.comment(f"c_{key}", label, [x + 30, 60, 140, 20], [34, y, 140, 20])

    for key, outlet, x, y in (("st", 0, 200, 104), ("ev", 1, 520, 130)):
        p.obj(f"pre_{key}", "prepend set", [x, 300, 75, 22], 1, 1)
        p.message(f"msg_{key}", "", [x, 340, 300, 22], [10, y, 330, 22])
        p.wire("js", outlet, f"pre_{key}", 0)
        p.wire(f"pre_{key}", 0, f"msg_{key}", 0)

    p.comment("c_title", f"{p.title}   {STAMP}", [30, 460, 360, 20], [10, 2, 400, 20])


def buttons(p, items, x0=190, y0=24):
    """Message buttons in the presentation, two per column."""
    for n, text in enumerate(items):
        col, row = divmod(n, 2)
        bid = "msg_" + text.replace(" ", "_").replace("-", "m")
        p.message(bid, text, [660 + col * 70, 140 + row * 30, 60, 22],
                  [x0 + col * 64, y0 + row * 24, 58, 22])
        p.wire(bid, 0, "js", 0)


ap = argparse.ArgumentParser()
ap.add_argument("--install", metavar="DIR", help="also copy device files into DIR")
args = ap.parse_args()

# ---- step 1: takeover test ----
bundle("kbTakeover.js", "kbTakeover.js")
t = Patch("kbSequencer · Push takeover test")
common(t, "js kbTakeover.js", 2)
t.obj("lm_col", "loadmess 5", [560, 20, 65, 22], 1, 1)
t.box("num_col", "number", [560, 60, 50, 22], [10, 74, 44, 22], numinlets=1, numoutlets=2,
      outlettype=["", "bang"], minimum=0, maximum=127, parameter_enable=0)
t.obj("pre_col", "prepend color", [560, 100, 85, 22], 1, 1)
t.wire("lm_col", 0, "num_col", 0)
t.wire("num_col", 0, "pre_col", 0)
t.wire("pre_col", 0, "js", 0)
t.comment("c_col", "Pad colour", [615, 60, 70, 20], [58, 74, 70, 20])
buttons(t, ["rescan", "dump"])
t.deps = ["kbTakeover.js"]
t.write("kbTakeover")

# ---- main device ----
bundle("kbSequencer.js", "main.js", modules=[("S", "seq_model.js")])
s = Patch("kbSequencer · CC locks", size=(420, 169))
common(s, "js kbSequencer.js", 5, wire_init=False)
s.blob_pattr("pattr", "kbData", [200, 400, 100, 22])
# On device init: first bang pattr so the stored sequence reaches the script
# (right outlet fires first), then init the script.
s.obj("t_init", "t b b", [200, 200, 40, 22], 1, 2, ["bang", "bang"])
s.wire("thisdevice", 0, "t_init", 0)
s.wire("t_init", 1, "pattr", 0)
s.wire("t_init", 0, "js", 0)
s.obj("pre_restore", "prepend restore", [200, 440, 95, 22], 1, 1)
s.wire("js", 2, "pattr", 0)
s.wire("pattr", 0, "pre_restore", 0)
s.wire("pre_restore", 0, "js", 0)

# ---- playback clock (high priority; see "playback" in src/main.js) ----
# metro on Live's transport fires every 1/16; read the song position in ticks
# (only while the transport runs), turn it into an absolute step, look up the
# events the script prepared for that step and send them as MIDI.
SLOTS = 64  # must match SLOTS in src/main.js
s.obj("clk_metro", "metro 16n @quantize 16n @active 1", [30, 520, 190, 22], 2, 1, ["bang"])
s.obj("clk_tr", "transport", [30, 550, 70, 22], 2, 9)
s.obj("clk_sel", "sel 1", [30, 580, 40, 22], 2, 2, ["bang", ""])
s.obj("clk_f", "f", [30, 610, 30, 22], 2, 1, ["float"])
s.obj("clk_step", "expr int(($f1 + 60.) / 120.)", [30, 640, 160, 22], 1, 1)
s.obj("clk_t", "t i i", [30, 670, 40, 22], 1, 2, ["int", "int"])
s.wire("clk_metro", 0, "clk_tr", 0)
s.wire("clk_tr", 7, "clk_f", 1)    # raw ticks (fires before state: right to left)
s.wire("clk_tr", 6, "clk_sel", 0)  # transport state; 1 = running
s.wire("clk_sel", 0, "clk_f", 0)
s.wire("clk_f", 0, "clk_step", 0)
# Each abs step plays once: the start detector below and the metro can both
# land on the first step. Reset on stop so playing again from the same spot works.
s.obj("clk_once", "change -1", [30, 655, 70, 22], 1, 3, ["", "int", "int"])
s.wire("clk_step", 0, "clk_once", 0)
s.wire("clk_once", 0, "clk_t", 0)
# Start detector. A transport-locked metro starts at the NEXT 1/16 after the
# transport starts, so the step under the start position (the downbeat) was
# never played on the first pass. A free 2 ms poll of the transport state
# catches the start and reads the position at once (high priority).
s.obj("clk_poll", "metro 2 @active 1", [250, 520, 110, 22], 2, 1, ["bang"])
s.obj("clk_tr2", "transport", [250, 550, 70, 22], 2, 9)
s.obj("clk_run", "change", [250, 580, 50, 22], 1, 3, ["", "int", "int"])
s.obj("clk_edge", "sel 1 0", [250, 610, 50, 22], 3, 3, ["bang", "bang", ""])
s.message("clk_reset", "set -1", [310, 640, 50, 22])
s.wire("clk_poll", 0, "clk_tr2", 0)
s.wire("clk_tr2", 6, "clk_run", 0)
s.wire("clk_run", 0, "clk_edge", 0)
s.wire("clk_edge", 0, "clk_tr", 0)    # started: read ticks + state now
s.wire("clk_edge", 1, "clk_reset", 0) # stopped
s.wire("clk_reset", 0, "clk_once", 0)
# right outlet first: play this step's MIDI, then tell the script (low priority)
s.obj("clk_mod", f"% {SLOTS}", [120, 700, 40, 22], 2, 1, ["int"])
s.obj("ev_coll", "coll", [120, 730, 50, 22], 1, 4, ["", "", "", "bang"])
s.obj("ev_iter", "zl iter 6", [120, 760, 60, 22], 2, 2)
# Each event: offMs lane pitch vel durMs ch. [pipe] holds it offMs after its
# step's tick (retrig hits inside the step; high priority, so timing is exact).
s.obj("ev_t", "t l l", [120, 775, 40, 22], 1, 2, ["", ""])
s.obj("ev_off", "zl nth 1", [200, 775, 55, 22], 2, 2)
s.obj("ev_rest", "zl slice 1", [120, 790, 60, 22], 2, 2)
s.obj("ev_pipe", "pipe 0 0 0 0 0 0", [120, 805, 120, 22], 6, 5, ["int"] * 5)
s.obj("ev_pack", "pack 0 0 0 0 0", [120, 820, 110, 22], 5, 1)
s.wire("ev_t", 0, "ev_rest", 0)
s.wire("ev_t", 1, "ev_off", 0)
s.wire("ev_off", 0, "ev_pipe", 5)
s.wire("ev_rest", 1, "ev_pipe", 0)
for k in range(5):
    s.wire("ev_pipe", k, "ev_pack", k)
s.obj("ev_route", "route 0 1 2 3 4", [120, 790, 90, 22], 1, 6)
s.wire("clk_t", 1, "clk_mod", 0)
s.wire("clk_mod", 0, "ev_coll", 0)
s.wire("js", 3, "ev_coll", 0)
s.wire("ev_coll", 0, "ev_iter", 0)
s.wire("ev_iter", 0, "ev_t", 0)
s.wire("ev_pack", 0, "ev_route", 0)
# Transport stop drops hits still waiting in the pipe.
s.message("ev_clear", "clear", [260, 805, 40, 22])
s.wire("clk_edge", 1, "ev_clear", 0)
s.wire("ev_clear", 0, "ev_pipe", 0)
s.wire("js", 4, "ev_iter", 0)  # audition notes join the same lane chains
s.obj("clk_defer", "deferlow", [30, 700, 60, 22], 1, 1)
s.obj("clk_pre", "prepend tick", [30, 730, 75, 22], 1, 1)
s.wire("clk_t", 0, "clk_defer", 0)
s.wire("clk_defer", 0, "clk_pre", 0)
s.wire("clk_pre", 0, "js", 0)
# Diagnostic readouts: channel of the last kick / bass status byte sent.
s.obj("dbg_split", "split 128 239", [480, 920, 80, 22], 3, 2, ["int", "int"])
s.obj("dbg_and", "& 15", [480, 950, 40, 22], 2, 1, ["int"])
s.obj("dbg_plus", "+ 1", [480, 980, 30, 22], 2, 1, ["int"])
s.box("dbg_out", "number", [480, 1010, 40, 22], [376, 104, 36, 20], numinlets=1, numoutlets=2,
      outlettype=["", "bang"], parameter_enable=0, ignoreclick=1)
s.comment("c_dbg", "Out ch", [530, 1010, 50, 20], [344, 104, 34, 20])
s.wire("dbg_split", 0, "dbg_and", 0)
s.wire("dbg_and", 0, "dbg_plus", 0)
s.wire("dbg_plus", 0, "dbg_out", 0)

# ---- lane outputs to other tracks ----
# Live drops the MIDI channel when one track's MIDI is routed into another
# (confirmed on hardware: all arrives as ch 1), so lanes can't be split by
# channel there. Every MIDI byte of each lane also goes to ONE fixed
# [send kbLanes] as "byte group lane"; each kbLane device on a receiving
# track passes the bytes whose group+lane match its settings. Fixed names on
# purpose: renaming send/receive at runtime proved fragile.
# Channels are still kept on this track's own output.
s.int_param("group", "Group", [600, 820, 44, 15], [58, 76, 40, 15], 1, 16, 1)
s.comment("c_group", "Group", [650, 820, 40, 20], [10, 74, 46, 18])
s.wire("t_init", 0, "group", 0)  # make Group report its value at device init
s.obj("lane_send", "send kbLanes", [600, 960, 80, 22], 1, 0)
for lane in (0, 1):
    # left (byte) is hot; group and lane ride along
    s.obj(f"lane_pack{lane}", f"pack 0 1 {lane}", [600 + lane * 120, 920, 90, 22], 3, 1)
    s.wire("group", 0, f"lane_pack{lane}", 1)
    s.wire(f"lane_pack{lane}", 0, "lane_send", 0)

# one chain per lane: "pitch vel durMs channel"; unpack fires right to left,
# so the channel is set before the note goes out.
for lane, x in ((0, 120), (1, 300)):
    u, mk, pk, mf = (f"{n}{lane}" for n in ("ev_unpack", "ev_mk", "ev_pack", "ev_mf"))
    s.obj(u, "unpack 0 0 0 0", [x, 830, 90, 22], 1, 4, ["int"] * 4)
    s.obj(mk, "makenote 100 100", [x, 860, 100, 22], 3, 2, ["float", "float"])
    s.obj(pk, "pack 0 0", [x, 890, 55, 22], 2, 1)
    s.obj(mf, "midiformat", [x, 920, 110, 22], 7, 2, ["int", ""])
    s.wire("ev_route", lane, u, 0)
    s.wire(u, 0, mk, 0)
    s.wire(u, 1, mk, 1)
    s.wire(u, 2, mk, 2)
    s.wire(u, 3, mf, 6)
    s.wire(mk, 0, pk, 0)
    s.wire(mk, 1, pk, 1)
    s.wire(pk, 0, mf, 0)
    s.wire(mf, 0, "midiout", 0)
    s.wire(mf, 0, f"lane_pack{lane}", 0)
    s.wire(mf, 0, "dbg_split", 0)

# Bass pitch bend: event "2 value 0 0 channel" -> raw bytes E0+ch, LSB, MSB,
# to the track output and the bass kbLane (same path as the bass notes).
s.obj("pb_unpack", "unpack 0 0 0 0", [480, 830, 90, 22], 1, 4, ["int"] * 4)
s.obj("pb_pack", "pack 0 1", [480, 860, 55, 22], 2, 1)
s.obj("pb_t", "t l l l", [480, 890, 50, 22], 1, 3, ["", "", ""])
s.obj("pb_st", "expr 223 + $i2", [480, 920, 90, 22], 2, 1)
s.obj("pb_lsb", "expr $i1 & 127", [580, 920, 90, 22], 2, 1)
s.obj("pb_msb", "expr ($i1 >> 7) & 127", [680, 920, 120, 22], 2, 1)
s.obj("pb_bytes", "pack 0 0 0", [480, 950, 70, 22], 3, 1)
s.obj("pb_iter", "iter", [480, 980, 35, 22], 1, 1)
s.wire("ev_route", 2, "pb_unpack", 0)
s.wire("pb_unpack", 3, "pb_pack", 1)
s.wire("pb_unpack", 0, "pb_pack", 0)
s.wire("pb_pack", 0, "pb_t", 0)
s.wire("pb_t", 2, "pb_msb", 0)
s.wire("pb_t", 1, "pb_lsb", 0)
s.wire("pb_t", 0, "pb_st", 0)
s.wire("pb_msb", 0, "pb_bytes", 2)
s.wire("pb_lsb", 0, "pb_bytes", 1)
s.wire("pb_st", 0, "pb_bytes", 0)
s.wire("pb_bytes", 0, "pb_iter", 0)
s.wire("pb_iter", 0, "midiout", 0)
s.wire("pb_iter", 0, "lane_pack1", 0)

# CC locks: event "3|4 controller value 0 channel" (kick / bass) -> raw bytes
# B0+ch, controller, value, to the track output and that lane's kbLane.
for lane in (0, 1):
    p, x = f"cc{lane}_", 820 + lane * 200
    # unpack fires right to left: channel (stored), value, then controller,
    # which bangs the status byte last into the hot inlet of the byte list.
    s.obj(p + "unpack", "unpack 0 0 0 0", [x, 830, 90, 22], 1, 4, ["int"] * 4)
    s.obj(p + "ch", "i 1", [x + 100, 860, 30, 22], 2, 1, ["int"])
    s.obj(p + "t", "t b i", [x, 860, 40, 22], 1, 2, ["bang", "int"])
    s.obj(p + "st", "expr 175 + $i1", [x, 890, 85, 22], 2, 1)
    s.obj(p + "bytes", "pack 0 0 0", [x, 920, 70, 22], 3, 1)
    s.obj(p + "iter", "iter", [x, 950, 35, 22], 1, 1)
    s.wire("ev_route", 3 + lane, p + "unpack", 0)
    s.wire(p + "unpack", 3, p + "ch", 1)       # channel
    s.wire(p + "unpack", 1, p + "bytes", 2)    # value
    s.wire(p + "unpack", 0, p + "t", 0)        # controller
    s.wire(p + "t", 1, p + "bytes", 1)
    s.wire(p + "t", 0, p + "ch", 0)
    s.wire(p + "ch", 0, p + "st", 0)
    s.wire(p + "st", 0, p + "bytes", 0)
    s.wire(p + "bytes", 0, p + "iter", 0)
    s.wire(p + "iter", 0, "midiout", 0)
    s.wire(p + "iter", 0, f"lane_pack{lane}", 0)

buttons(s, ["rescan", "dump", "testfill", "clearall", "palette 0", "palette -1", "undo", "redo"])

# ---- step 6: Push display parameters + the one Push bank ----
for n, dp in enumerate(DISPLAY_PARAMS):
    col, row = divmod(n, 12)
    s.display_param(*dp, rect=[1000 + col * 90, 20 + row * 24, 80, 15])
s.obj("banks", "live.banks", [1000, 330, 70, 22], 1, 1, varname="banks")
s.obj("pre_banks", "prepend banks", [1000, 360, 90, 22], 1, 1)
s.wire("banks", 0, "pre_banks", 0)
s.wire("pre_banks", 0, "js", 0)
s.deps = ["kbSequencer.js"]
s.write("kbSequencer")

# ---- kbLane: put first on each receiving track ----
# [receive kbLanes] gets "byte group lane" from every kbSequencer; bytes
# whose group+lane match this device's settings go out as MIDI on this track,
# so no MIDI From routing is needed. Patch objects only: high priority.
# [t l l] fires right first: the gate is set before the byte arrives.
f = Patch("kbLane", size=(120, 169))
f.obj("midiin", "midiin", [30, 20, 45, 22], 1, 1, ["int"])
f.obj("midiout", "midiout", [30, 330, 55, 22], 1, 0)
f.wire("midiin", 0, "midiout", 0)  # this track's own input still passes
f.obj("thisdevice", "live.thisdevice", [150, 20, 85, 22], 1, 3, ["bang", "int", "int"])
f.int_param("group", "Group", [150, 60, 44, 15], [50, 24, 44, 15], 1, 16, 1)
f.box("lane", "live.menu", [220, 60, 60, 15], [50, 44, 54, 15], numinlets=1, numoutlets=3,
      outlettype=["", "", "float"], parameter_enable=1, varname="Lane",
      saved_attribute_attributes={"valueof": {
          "parameter_longname": "Lane", "parameter_shortname": "Lane",
          "parameter_type": 2, "parameter_enum": ["Kick", "Bass"], "parameter_mmax": 1,
          "parameter_initial": [0.0], "parameter_initial_enable": 1}})
f.params["lane"] = ["Lane", "Lane", 0]
f.wire("thisdevice", 0, "group", 0)  # report values at init, not only on change
f.wire("thisdevice", 0, "lane", 0)
f.obj("recv", "receive kbLanes", [30, 100, 95, 22], 1, 1)
f.obj("t", "t l l", [30, 140, 40, 22], 1, 2, ["", ""])
f.obj("match", "expr ($i2 == $i4) && ($i3 == $i5)", [120, 180, 200, 22], 5, 1)
f.obj("first", "zl slice 1", [30, 220, 65, 22], 2, 2)
f.obj("gate", "gate 1 0", [30, 280, 50, 22], 2, 1)
f.wire("recv", 0, "t", 0)
f.wire("t", 1, "match", 0)
f.wire("group", 0, "match", 3)
f.wire("lane", 0, "match", 4)
f.wire("match", 0, "gate", 0)
f.wire("t", 0, "first", 0)
f.wire("first", 0, "gate", 1)
f.wire("gate", 0, "midiout", 0)
# Diagnostic: group and lane of the last message heard (any device).
f.obj("heard_g", "zl nth 2", [340, 140, 55, 22], 2, 2)
f.obj("heard_l", "zl nth 3", [400, 140, 55, 22], 2, 2)
f.box("heard_gn", "number", [340, 180, 36, 22], [50, 64, 30, 18], numinlets=1, numoutlets=2,
      outlettype=["", "bang"], parameter_enable=0, ignoreclick=1)
f.box("heard_ln", "number", [400, 180, 36, 22], [82, 64, 30, 18], numinlets=1, numoutlets=2,
      outlettype=["", "bang"], parameter_enable=0, ignoreclick=1)
f.wire("t", 1, "heard_g", 0)
f.wire("t", 1, "heard_l", 0)
f.wire("heard_g", 0, "heard_gn", 0)
f.wire("heard_l", 0, "heard_ln", 0)
f.comment("c_title", "kbLane", [300, 20, 60, 20], [6, 2, 100, 20])
f.comment("c_stamp", STAMP, [300, 160, 110, 20], [6, 146, 112, 18])
f.comment("c_group", "Group", [300, 60, 40, 20], [6, 22, 44, 18])
f.comment("c_lane", "Lane", [300, 80, 40, 20], [6, 42, 44, 18])
f.comment("c_heard", "Heard", [300, 100, 40, 20], [6, 64, 44, 18])
f.comment("c_heard2", "group · lane (0 kick, 1 bass)", [300, 120, 160, 20], [6, 84, 112, 30])
f.write("kbLane")

if args.install:
    dest = Path(args.install).expanduser()
    for name in ("kbTakeover.amxd", "kbTakeover.js", "kbSequencer.amxd", "kbSequencer.js",
                 "kbLane.amxd"):
        shutil.copy2(OUT / name, dest / name)
        print("installed", dest / name)
