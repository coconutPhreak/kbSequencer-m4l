# Push 3 hardware notes (confirmed on device, 2026-11-14)

From the step 1 takeover test (Push 3 tethered to a Mac).

## Control names used

| Role | Live API control name | Notes |
|---|---|---|
| Pad grid | `Button_Matrix` | value = `vel x y …`; x 0–7 left→right, **y 0 = top row, 7 = bottom** |
| Encoders (8) | `Track_Controls` | single elements also exist: `Track_Control_0..7` |
| Encoder touch | `Track_Control_Touches` | singles: `Track_Control_Touch_0..7` |
| Lower display buttons | `Track_State_Buttons` | singles: `Track_State_Button0..7` |
| Upper display buttons | `Track_Select_Buttons` | singles: `Track_Select_Button0..7` |
| Delete | `Delete_Button` | |
| Select | `Select_Button` | needed for Select + page pad |
| Octave | `Octave_Up_Button`, `Octave_Down_Button` | note keyboard octave |

Grab/release via `grab_control id N` / `release_control id N` on the
control surface works, and Push restores itself on release.

## `get_control_names` format

Returns `control_names <count> control <name> control <name> … done`;
strip `control`, the count and `done`.

## Pad row mapping vs spec

Spec rows 1–8 are top to bottom, so spec row r = matrix y (r − 1):
steps on y 0–3, page pads y 4–5, note keyboard y 6–7.
