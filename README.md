# kbSequencer — Push Kick + Bass Sequencer (M4L)

Spec: [Push Kick + Bass Sequencer (M4L) — Spec v1](https://claude.ai/artifact/721EGx12jMoBPRVUgvnkLW)

## Layout

| Path | What |
|---|---|
| `src/main.js` | Main device logic: Push takeover, pad UI, storage |
| `src/seq_model.js` | Sequence data model + save format (pure JS, tested) |
| `src/kbTakeover.js` | Step 1 takeover test logic (kept as a reference) |
| `device/` | **Generated** — `kbSequencer.amxd` + one bundled `kbSequencer.js` (and the takeover test). Don't edit. |
| `device/kbLane.amxd` | Receiving-track device: plays one lane (Kick/Bass) of the sequencer with the same Group |
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

## Step 3 — Playback ✅

Max runs all JavaScript in its low-priority thread, so notes are **not** sent
from the script. The patch does the timing: a `metro 16n @quantize 16n` on
Live's transport reads the song position each 1/16, looks up that step's
events in a `[coll]`, and sends them through `makenote` → `midiformat` →
`midiout`. The script keeps the coll filled 4 steps ahead (≈400 ms at
150 BPM) and refreshes it on every edit.

Lanes reach other tracks through **kbLane** (Max `send kb_<group>_<lane>` /
`receive`), not MIDI From routing. Give each kbSequencer its own **Group**
(a duplicated track keeps the same Group — change it). The sequencer's own
track output still carries both lanes on channels 1 and 2.

What plays: trigs on the kick lane (channel 1, note 36) and bass lane
(channel 2, the step's note), skipping muted steps, applying probability,
velocity and length (default: velocity 100, half a step). The pattern is
locked to the song position and loops over the loop pages (page 1 by
default; testfill sets pages 1–2). The playhead step shows white on Push.

Not yet: swing, microtime, conditions, fill, retrig, accent, slide/tie,
mono note cutting, CC locks (later build steps).

### Test

1. Make two other MIDI tracks. Put **kbLane** first on each, then the
   instrument: Lane **Kick** on one, **Bass** on the other, both Group 1
   (= the sequencer's Group). Leave **MIDI From** empty — nothing is routed
   through Live: Live drops the MIDI channel when routing one track into
   another, so each lane goes straight to its kbLane via Max send/receive.
2. Drop in the new `kbSequencer.amxd`, click **testfill**, press Play in Live.
3. Expect four-on-the-floor kick (one beat silent: step 13 is muted) and an
   offbeat bass line, looping every 2 bars. The white playhead moves on Push.
4. Enter or mute steps while it plays: the change is heard within a step or two.
5. Start playback from a different bar: the pattern stays aligned to the bar.
6. Change tempo: timing follows.

## Step 4 — Pad UI ✅

| Push | Does |
|---|---|
| Rows 1–4 | 32 steps of the viewed page (tap / Delete + tap as before; new bass trigs use the brush note) |
| Rows 5–6 | 16 page pads: viewed = white, playing (follow off) = green, in loop with trigs = mid grey, in loop empty = dim grey, outside loop = off |
| Hold a page pad + press another | Loop from the first page to the second |
| Long-press a page pad (½ s, alone) | Loop just that page |
| Tap a page pad (or Select + page pad) | View that page for editing without changing the loop; turns follow off |
| Rows 7–8 | Note keyboard: 16 notes of Live's scale (bottom row lower). Root = blue, others = dim white, brush = bright white; all dim when only kick is selected |
| Tap a note pad | Makes it the brush note and auditions it (kick only: auditions the kick) |
| Octave up / down | Shift the keyboard (lit while it can move further) |
| Lower display button 6 | Follow mode on/off: the viewed page follows the playhead |

Colours are still placeholders: use **palette 0** / **palette 64** to pick
indices, and send them back.

## Step 5 — Step gestures ✅

| Push | Does |
|---|---|
| Press an empty step | Creates the trig straight away (bass: brush note), so you can keep holding it to edit |
| Tap a lit / muted step | Mutes / unmutes it **on release** |
| Hold a step + turn an encoder | Releasing is no longer a tap: the step is not muted (the encoder sets p-locks in step 7) |
| Hold step(s) + tap a note pad | Sets or replaces the held bass steps' note (brush unchanged); the keyboard shows the held step's note in bright white |
| Hold Delete + tap a step | Wipes it (on press) |
| Hold Delete + tap a page pad | Wipes every step on that page (trigs, notes, p-locks) for the selected lanes; the loop is unchanged |

Follow mode pauses while a step is held, so the page doesn't change under your finger.

## Undo / redo

Step edits aren't Live parameters, so Live's own undo can't see them. The
device keeps its own history (last 50 edits; a page wipe, testfill or
clearall counts as one edit):

| Push | Does |
|---|---|
| Undo | Undo the last sequencer edit (lit while there is something to undo) |
| Shift + Undo | Redo |

This only applies while the sequencer has Push. When it releases Push,
Undo is Live's again. Loading a Set or preset starts a fresh history.
The device also has **undo** / **redo** buttons.

## Copy / paste

Uses Push's **Duplicate** button, like Push itself: while Duplicate is held,
the first pad you touch is the source and every pad after it is a paste
target. Releasing Duplicate forgets the copy. Copies take the selected
lanes, with notes, mutes and all p-locks.

| Push | Does |
|---|---|
| Hold Duplicate + tap a step | Copy that step |
| Hold Duplicate + hold a step + press another step | Copy the range between them |
| …then tap a step (Duplicate still held) | Paste starting there. A range runs on into the next page if needed |
| …tap a page pad (step copy) | View that page, to paste onto another page |
| Hold Duplicate + tap a page pad | Copy the whole page |
| …then tap other page pads | Paste the page over them |

A paste replaces the target exactly (empty steps in the copy clear the
target). The Duplicate light is on while something is copied. Each paste is
one Undo.
