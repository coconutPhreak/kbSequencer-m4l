# kbSequencer — Push Kick + Bass Sequencer (M4L)

Spec: [Push Kick + Bass Sequencer (M4L) — Spec v1](https://claude.ai/artifact/721EGx12jMoBPRVUgvnkLW)

## Layout

| Path | What |
|---|---|
| `src/main.js` | Main device logic: Push takeover, pad UI, storage |
| `src/seq_model.js` | Sequence data model + save format (pure JS, tested) |
| `src/kbTakeover.js` | Step 1 takeover test logic (kept as a reference) |
| `device/` | **Generated** — `kbSequencer.amxd` + one bundled `kbSequencer.js` (and the takeover test). Don't edit. |
| `docs/push3-notes.md` | Confirmed Push 3 control names and pad orientation |
| `tools/build.py` | Bundles src/ into device/ and generates the .amxd/.maxpat files |
| `tools/test_model.js` | Model tests (run with osascript, no Node needed) |

Each device is just two files, the `.amxd` and its `.js`, kept in the same
folder. Build and install into the User Library folder in one go:

```bash
python3 tools/build.py --install "$HOME/Music/Ableton/User Library/m4l devices"
```

```bash
osascript -l JavaScript tools/test_model.js "$PWD/src/seq_model.js"
```

## Step 1 — Push takeover test ✅

Confirmed on Push 3: grab, release, pads, encoders, touches, display
buttons and Delete all work. Details in `docs/push3-notes.md`.

## Step 2 — Step data and storage ✅

The sequence (2 lanes × 512 steps, p-locks, settings, loop, CC numbers) lives
in `seq_model.js`. It is saved as a flat number list in a hidden
`[pattr kbData]` blob parameter, which Live stores with the Set and with
device presets.

A minimal pad UI is included so you can enter data by hand:

| Push | Does |
|---|---|
| Rows 1–4 | 32 steps of the viewed page. Tap empty → trig, lit → mute, muted → unmute |
| Hold Delete + tap step | Wipe the step |
| Select + page pad (rows 5–6) | View that page |
| Lower display buttons 1 / 2 | Toggle kick / bass lane (both allowed) |

Device buttons: **testfill** (writes a known pattern on pages 1–2),
**dump** (prints the sequence to the Max Console), **clearall**,
**palette 0** / **palette -1** (palette test on/off, see below), **rescan**.

### Test

1. Drag `device/kbSequencer.amxd` onto a MIDI track and select the track.
2. Enter some steps on Push on two different pages and both lanes, mute one, wipe one.
3. Click **dump**: the console shows what you entered.
4. Save the Set, close it, reopen it. Select the track: the pads show the
   same steps, and **dump** prints the same thing. The console should show
   `kbSequencer: restored N kick + M bass trigs`.
5. Also try: **testfill** → save → reopen → **dump** (includes p-locks and
   loop range that the pads can't enter yet).
6. Duplicate the track: the copy should carry the same sequence.

### Palette test (for the final colours)

**palette 0** shows palette indices 0–63 on the grid (top-left = 0,
left→right, top→bottom); **palette 64** shows 64–127. Pressing a pad prints
its index. Send back the indices you want for orange (kick), blue (bass),
purple (both), a dim orange / dim blue (muted), white and two greys.
**palette -1** returns to the sequencer.
