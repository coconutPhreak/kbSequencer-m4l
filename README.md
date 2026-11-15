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
| Hold a page pad + press another | Loop from the first page to the second (sets both lanes' Length to those pages) |
| Long-press a page pad (½ s, alone) | Loop just that page, on release (not if an encoder was turned: that's a page lock) |
| Tap a page pad (or Select + page pad) | View that page for editing without changing the loop; turns follow off |
| Rows 7–8 | Note keyboard: 16 notes of Live's scale (bottom row lower). Root = blue, others = dim white, brush = bright white; all dim when only kick is selected |
| Tap a note pad | Makes it the brush note and auditions it (kick only: auditions the kick) |
| Octave up / down | Shift the keyboard (lit while it can move further) |
| Tap the playing (green) page pad, or Shift + any page pad | Follow mode back on (tapping another page turns it off). No dedicated button since v0.8.2 |

Colours are still placeholders: use **palette 0** / **palette 64** to pick
indices, and send them back.

## Step 5 — Step gestures ✅

| Push | Does |
|---|---|
| Press an empty step | Creates the trig straight away (bass: brush note), so you can keep holding it to edit |
| Tap a lit / muted step | Mutes / unmutes it **on release**, only for a quick tap (under 0.3 s) |
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
| Hold Duplicate + hold a page pad + press another page pad | Copy that range of pages |
| …then tap other page pads | Paste the page(s) starting there. Pages past page 16 are dropped |

A paste replaces the target exactly (empty steps in the copy clear the
target). The Duplicate light is on while something is copied. Each paste is
one Undo.

## Step 6 — Encoders and banks ✅

Push can't show a custom screen, so the device has 35 small **display
parameters** (one per value an encoder edits) and **one Push bank**, which
the script rewrites with `live.banks` to hold the 8 that matter right now.
The encoders stay grabbed and edit the sequence directly; the script sets
the display parameters only so Push shows the values. Push must be showing
kbSequencer (Device mode, device selected) to see the bank.

| Context | Display buttons 3–8 (the row under the knobs) | Encoders |
|---|---|---|
| Nothing held | 3 **Settings**, 4 **CC Setup**, 5 **Kick Euclid**, 6 **Bass Euclid** (7–8 free) | Edit them (one Undo per turn) |
| Step or page held | 3 **Step**, 4 **Retrig**, 5 **Rt Chance**, 6 **More** (Fill, Cond: not played yet), 7 **CC Locks**, 8 **Slide** | Show and lock the held step's values |

- Settings: Kick Ch, Bass Ch, Kick Note, Bend, Scale (follow), Swing.
- CC Setup: CC number of the 8 slots. CC Locks: the held step's lock per slot (-1 = none).
- Step: Note, Velocity, Length (retrig's LEN list: 0.125 … 128 steps, INF), Micro (1/24 step), Prob, Accent, Slide, Tie.
  Note and Slide are hidden when bass isn't selected.
- More: Retrig, Rt Rate, Rt Fade, Fill, Cond.
- CC Setup / CC Locks use the first selected lane (kick when both are selected).
- **Shift + turn = fine adjust**: 4× the turning per value, and never more
  than one value per encoder message (works for step locks and settings;
  menus are unaffected). Short menus (up to 4 items, e.g. Layer) always move
  one item at a time.
- The last bank picked in each context is remembered. The selected bank's
  button is bright, the other available ones dim.
- The first 6 encoder messages are printed to the Max Console
  (`encoder raw …`), to check the format Push sends.

## Step 7 — P-locks ✅

| Push | Does |
|---|---|
| Hold step(s) + turn an encoder | Locks that parameter on the held steps (selected lanes); the value moves on screen |
| Hold step(s) + Delete + touch an encoder | Clears that parameter's lock (the default plays again) |
| Hold a page pad + turn an encoder | Page lock: every trig on the page (muted ones too) jumps to the first trig's value, then they move together |
| Hold a page pad + Delete + touch an encoder | Clears that lock on every trig of the page |
| While holding a step or page pad, tap Delete once | Clear mode latches (Delete lit) until you let go of the pad: touch encoders to clear their locks, no need to keep Delete held |

- A page pad shows the page's values on Push after ⅓ s of holding (or at the
  first turn), so quick taps don't flicker the screen.
- Page pad on its own is now judged on release: quick tap = view, long hold =
  loop that page, any turn or touch = page lock only.
- After a page lock, any single step can still be overridden.
- CC locks: turning up from "-1" (none) starts a lock at 0; turning below 0 clears it.
- One Undo takes back one encoder turn (edits within 0.6 s are grouped).
- Playback already uses velocity, length and probability locks; accent,
  slide, tie, retrig, microtime and CC locks now play too (later steps);
  fill and condition are stored and shown but don't play (nice to have).
- The first 4 touch messages are printed to the Max Console (`touch raw …`).

## Retrig (from retrig-m4l)

Every retrig control from [retrig-m4l](../retrig-m4l) as per-step p-locks,
on two banks while a step (or page) is held:

| Display button | Bank | Encoders |
|---|---|---|
| 4 | **Retrig** | RTRG, RATE, Length (LEN), VFAD, CRV, PROB, TRATE, GLIDE |
| 5 | **Rt Chance** | PROB, LOCK, PMODE, VOICES |

(The **More** bank keeps Fill and Cond.) Values, defaults and behaviour
follow retrig-m4l's REQUIREMENTS.md:

- **Length** is one value for both: a plain note's gate and a retrig
  burst's LEN, from retrig's list (0.125 … 128 steps, INF). It's on the Step
  bank and in the LEN slot of the Retrig bank (same value). Default 1/32
  (half a step), so raise it when turning RTRG on. A plain note at INF is
  held until the lane's next note. Sets saved before v0.8.1 are converted to
  the nearest entry.
- **RTRG** on makes the step a burst: hits at RATE (1/1 … 1/80) for Length.
  Hit 0 is the step itself. Each hit is held until the next one.
- **VFAD / CRV**: velocity fade from the step's velocity, landing exactly on
  the last hit; CRV blends linear → exponential. No fade with INF.
- **PROB / LOCK / PMODE**: Repeats = each repeat rolls (first hit always
  plays); Burst = one roll for all repeats; Note = one roll decides if the
  step plays at all. LOCK ignores PROB. The step's own Prob is rolled first.
- **TRATE / GLIDE**: speed fade from RATE to TRATE over GLIDE steps (even
  ratio per time), then holds TRATE. 256-hit cap with TRATE on and finite LEN.
- **VOICES**: Mono = the next note on the lane cuts the burst (INF runs until
  then). 2–8 = bursts overlap; a new note stops the oldest only when that many
  are running. Every note counts, read from the new step (plain steps default
  to Mono, so they cut).

Timing: bursts are worked out ahead by the script (deterministic, so
refills give the same rolls) and each hit is held in a `[pipe]` until its
time inside the step, in Max's high-priority thread. Bursts never reach back
past where playback started. Stopping the transport drops waiting hits.

Not carried over: retrigs while the transport is stopped (there's nothing
to play by hand here), Shift for fine encoder steps. Lane defaults for the
retrig controls can't be edited yet (same open question as the other step
parameters).

## Slides, ties and mono lanes

| Slide bank (button 8) | Values | Default | |
|---|---|---|---|
| Slide | Off / On | Off | Bass: this note slides into the lane's next unmuted step, if that step starts before the note ends (its Length). A step after that plays as a normal note |
| Tie | Off / On | Off | Holds into the next step; on bass it jumps to that step's pitch with no glide |
| Sl Time | 0–200 % | 100 % | Glide time as a % of the gap to the next note. ≤ 100 %: waits, then glides over the last part of the gap and lands on the next note's beat. > 100 %: starts at once and arrives late |
| Sl Curve | −100 … +100 | 0 | −100 fast start, 0 straight, +100 slow start |

- Slides are pitch bend on the bass channel (14-bit, a message every 5 ms while gliding). Set the instrument's pitch-bend range to **Bend** in Settings (default ±24 semitones, up to ±96). A target further than that plays as a new note.
- The connected step gives only its **note** and its own **Slide / Tie** (so chains continue: A → B → C is one held note). Its velocity, Length, retrig, CC and other locks don't apply.
- The **first note** of a chain sets velocity, Sl Time, Sl Curve and **Length**: the whole held note lasts the first note's Length from its start (a short Length ends before the slide is heard; the next new note still cuts it).
- The bend returns to centre right before every new bass note.
- Retrig steps don't slide. Kick has Tie (holds the note) but no Slide.
- Lanes are **mono**: a new note cuts the previous one (unless Slide/Tie connects them, or a retrig VOICES setting above Mono lets them overlap).

## Step 9 — CC locks ✅

Each lane's 8 CC slots are sent on that lane's MIDI channel, with the step's
note and just before it (same timing as the note), to the track output and
that lane's kbLane.

- Set the CC number of each slot in the **CC Setup** bank (nothing held).
  Defaults: kick CC 20–27, bass CC 70–77.
- Lock a value on a step in the **CC Locks** bank (step held). Unlocked
  slots ("-1") send nothing, so the instrument keeps its last value.
- In the instrument, MIDI-learn the CC (plugins), or map it with a mapper
  on the receiving track (stock Live devices can't learn CCs from another
  track's MIDI).
- A CC lock goes out only when the step's note plays: not when muted, when
  its probability fails, or on a step that a slide connects into. A retrig
  burst sends it once, with its first hit.

## Step 10 — Microtime ✅

**Micro** (Step bank) moves a step's note off the grid in 1/24-step
amounts, −12/24 to +12/24 (half a step either way). Everything that belongs
to the note moves with it: its CC locks and bend reset, retrig hits, the
Length (counted from the moved start) and slide timing (glides are measured
from the moved start). Steps a slide connects into stay on the grid.

- An early note (negative Micro) plays in the step before. On the step where
  play starts it plays at once, since nothing ran before it.
- On a mono lane an early next note cuts the current one sooner; two notes
  landing at the same moment play once.

### Nice to have (not built)

- **Fill**: a step plays only while a Fill button is held.
- **Condition**: Elektron-style trig conditions (1st, 1:2, 3:4…).

Both are already stored and shown in the **More** bank, so patterns that
use them keep their values; they just don't change playback yet.

## Euclidean generator and lane Length

Each lane has its own **Length** (1–512 steps, counted from the loop's
start page; any number, not only whole pages) and its own **Euclid** layer:
a generated pattern kept apart from the manual steps.

| Bank (nothing held) | Encoders |
|---|---|
| 5 **Kick Euclid** | Length, Steps, Pulses, Rotate, Layer, Velocity, Follow |
| 6 **Bass Euclid** | Length, Steps, Pulses, Rotate, Layer, Velocity, Follow, Note |

- **Steps** (1–64): the pattern length. It repeats through the lane and
  restarts with each pass of the Length, so Steps ≠ Length gives
  polyrhythms. **Follow** On makes Steps equal the lane's Length (and
  track it as Length changes), so the pulses spread over the whole lane;
  the Steps value is kept for when Follow is off. **Pulses** are spread as evenly as possible over Steps
  (first hit on the first step); **Rotate** shifts them later.
- **Layer**: what plays on that lane: **Manual**, **Euclid** or **Both**
  (default). In Both a manual step wins over a Euclid hit on the same step,
  with its locks; a muted manual step silences the hit there.
- Euclid hits play with the Euclid Velocity (and Note on bass) and the
  lane's defaults for everything else. They have no locks of their own.
- Pads: Euclid hits on steps with no manual step show in a dimmer lane
  colour (`col euKick / euBass / euBoth <index>` to tune). Page pads count
  them as trigs. Each lane has its own playhead.
- **Shift + Duplicate: Print.** Writes the selected lanes' Euclid hits
  (over each lane's Length) onto the manual steps. A hit on an existing
  step un-mutes it and takes the Euclid note (bass), keeping its locks; a
  new step gets the Euclid velocity. Steps without a hit are left alone.
  One Undo.
- Setting a page loop (long-press or two page pads) sets both lanes' Length
  to those pages. The loop's last page follows the longer lane. Follow
  mode follows the first selected lane.
- Saved in the set (save format v3; older sets load with Length = their
  loop pages).
