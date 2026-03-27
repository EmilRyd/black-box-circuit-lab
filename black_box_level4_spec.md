# Black Box Circuit Simulation — Level 4 Addition

## Context

This document specifies **Level 4**, which extends the existing 3-level simulation (see `black_box_simulation_spec.md`). The Level selector should now show four tabs. Everything from the existing spec (UI layout, measurement log, circuit visualization, design notes, tech preferences) applies here too — this document only covers what's new.

---

## Level 4: Expert — Hidden Battery, Resistors, and Switches

### Concept

The box now has **two external switches** (S1 and S2) that the student can toggle, in addition to the two terminals. The switches change the internal wiring, so the box behaves differently in each of the four switch combinations. The student must figure out the full internal topology and all component values.

This is hard because:
- The student doesn't know what each switch connects or disconnects.
- Some switch states produce a passive circuit, others an active one.
- The "both closed" state creates a two-path circuit with a source that drives internal current even with no external load — something students haven't seen in Levels 1–3.
- There are **three unknowns** (R1, ε, R2) instead of two.

### What's inside the box

Two parallel paths between the terminals, each gated by a switch:

```
       ┌── S1 ──── R1 ────┐
(+) ───┤                   ├─── (-)
       └── S2 ── ε ── R2 ──┘
```

- **Path 1** (controlled by S1): A resistor R1. Purely passive.
- **Path 2** (controlled by S2): A battery ε in series with resistor R2. Active source with internal resistance.

S1 and S2 are ideal switches — zero resistance when closed, infinite resistance when open.

### Random generation

- R1: E12 series, 100–1000 Ω (same pool as Levels 1–2).
- R2: E12 series, 10–100 Ω (same pool as Level 3 internal resistance).
- ε: pick from {1.5, 3.0, 4.5, 6.0, 9.0} V.

### External terminals and controls

The black box shows:
- **Two terminals** labeled **+** and **−** (same as Level 3).
- **Two toggle switches** on the box surface, labeled **S1** and **S2**. These are clickable and visually show on/off state (e.g., a toggle lever or a sliding switch). They start in the **open (off)** position.

### What students can do

Everything from Level 3, plus:
1. **Toggle S1 and S2** independently by clicking them. Each toggle immediately changes the internal circuit. If the student already has an external circuit connected, the readings update (but are not shown until they click "Measure" again — don't auto-display results, to encourage deliberate experimentation).
2. All other tools are the same: optional external battery, optional external resistor, ammeter, voltmeter, open-circuit voltage measurement, "Measure" button.
3. The **measurement log** should now include a column for switch state (e.g., "S1: ON, S2: OFF").

---

## Physics Engine — Level 4

The physics depends on which switches are closed. Below, "external battery" = ε_ext, "external resistor" = R_ext. V = terminal voltage (voltage from + to −).

### State 1: S1 open, S2 open

No internal path exists. The box is completely disconnected internally.

- **No current can flow** through the box, regardless of what the student connects externally.
- Ammeter reading: 0 mA.
- Voltmeter across terminals: 0 V (no source, no path).
- If the student has an external battery and external resistor, current still cannot flow because the circuit is incomplete — the box provides no path between (+) and (−).
- Message to show: *"No current flowing. The circuit appears to be open inside the box."*

### State 2: S1 closed, S2 open

Only the R1 path is active. The box behaves as a **pure resistor** between (+) and (−). This is identical to a Level 2 single-resistor box.

- Open-circuit voltage: **0 V** (no source).
- No current flows unless the student provides an external battery.
- With external battery ε_ext and external resistor R_ext:

```
I = ε_ext / (R_ext + R1)
```

- Voltage across terminals (across R1): `V = I × R1`
- Voltage across external resistor: `V_ext = I × R_ext`

### State 3: S1 open, S2 closed

Only the ε + R2 path is active. The box behaves as a **battery with internal resistance**. This is identical to Level 3.

- Open-circuit voltage: **ε** (this is the "aha" moment — flipping S2 makes voltage appear).
- With external resistor R_ext only (no external battery):

```
I = ε / (R2 + R_ext)
V_terminal = ε − I × R2 = I × R_ext
```

- With external battery ε_ext (aiding) and R_ext:

```
I = (ε + ε_ext) / (R2 + R_ext)
```

### State 4: S1 closed, S2 closed (the hard one)

Both paths are connected in parallel between (+) and (−). The battery in Path 2 drives current through both paths.

**This is the key new physics.** Even with no external circuit, current flows internally in a loop: out of ε, through R2, to the (−) terminal, through R1 (from − to +), back to the battery. The terminal voltage is no longer equal to ε.

#### No external circuit connected

Internal loop current:

```
I_internal = ε / (R1 + R2)
```

Terminal voltage (voltage drop across R1, or equivalently ε minus drop across R2):

```
V_terminal = ε × R1 / (R1 + R2)
```

This is a critical observation for the student: the open-circuit voltage is **less than ε** when both switches are closed, whereas it was exactly ε when only S2 was closed. This should make them realize S1 is providing an internal load.

#### External resistor R_ext connected (no external battery)

Path 2 (battery path) drives current. The load seen by the battery is R2 in series with (R1 ∥ R_ext).

```
R_parallel = (R1 × R_ext) / (R1 + R_ext)
I_total = ε / (R2 + R_parallel)
V_terminal = I_total × R_parallel
I_through_R_ext = V_terminal / R_ext    ← this is what the ammeter reads
I_through_R1 = V_terminal / R1
```

The ammeter is in the external circuit, so it reads I_through_R_ext, not I_total.

#### External resistor R_ext and external battery ε_ext connected (both aiding)

This gets complex. Use superposition or node voltage analysis:

Let V = terminal voltage (unknown to solve for).

Current from battery path into (+): `I_bat = (ε − V) / R2`
Current from external battery path into (+): `I_ext = (ε_ext − V) / R_ext` (if external battery aids; if no external battery, `I_ext = −V / R_ext`)
Current leaving (+) through R1: `I_R1 = V / R1`

KCL at the (+) node:

```
(ε − V) / R2 + (ε_ext − V) / R_ext = V / R1
```

Solve for V:

```
V = (ε/R2 + ε_ext/R_ext) / (1/R1 + 1/R2 + 1/R_ext)
```

If no external battery (ε_ext = 0):

```
V = (ε/R2) / (1/R1 + 1/R2 + 1/R_ext)
```

Ammeter reading (current through external circuit):

```
I_ammeter = (V − 0) / R_ext = V / R_ext    [no external battery]
I_ammeter = (ε_ext − V) / R_ext             [with external battery; could be negative if V > ε_ext]
```

If I_ammeter is negative, current flows backwards through the external circuit (the internal battery is "winning"). Display as a positive number with the note: *"Current flows in reverse direction through external circuit."*

---

## Solving Strategy (for hint system)

The intended solving path:

1. **Both switches open:** Confirm no permanent connection exists (0 V, 0 A regardless of external circuit).
2. **Toggle S1 alone:** No voltage appears → passive path. Connect external battery and resistor, use V/I to find R1. (Level 2 technique.)
3. **Toggle S2 alone (S1 open):** Voltage appears with nothing connected → active path with source. Use open-circuit voltage to get ε. Then connect known resistors and use Level 3 technique to find R2.
4. **Both switches closed:** Open-circuit voltage drops below ε. Student can verify: V_oc = ε × R1 / (R1 + R2). Using their known ε, R1, and R2, check if this matches. Or, if they couldn't solve State 3 fully, the combined state gives them additional equations to work with.

**Minimum measurements to solve:**
- State 2: 1 measurement → R1 (connect battery, measure I, compute R1 = V/I)
- State 3: 1 open-circuit voltage → ε, then 1 load measurement → R2
- Total: 3 measurements minimum, across 2 switch states. State 4 is for verification.

---

## Answer Submission — Level 4

Student enters guesses for **three values**:
- R1 (Ω)
- ε (V)
- R2 (Ω)

Additionally, the student should identify the **topology** — which switch controls which path. Present this as a multiple-choice question:

> "Which switch controls the battery path?"
> ○ S1  ○ S2

Accept component values if:
- R1 within ±5%
- R2 within ±10%
- ε within ±0.5 V
- Correct switch-to-path assignment

On success, reveal the full internal circuit diagram with all components and switch connections labeled.

---

## Hints — Level 4

Progressive hints:

1. "Try each switch individually first. What happens when only S1 is on? What about only S2?"
2. "One switch reveals a passive circuit (no voltage on its own). The other reveals an active circuit (voltage appears!). Which is which?"
3. "With the passive switch closed, use an external battery to find the resistance — just like Level 2."
4. "With the active switch closed, measure the open-circuit voltage. That gives you ε directly — just like Level 3."
5. "Now close both switches and measure the open-circuit voltage again. It should be less than ε. Why? Because the resistor from the other path is now providing an internal load."
6. "You can verify your answer: with both switches closed, V_oc should equal ε × R1 / (R1 + R2)."

---

## Updated Measurement Log Columns

The log for Level 4 adds a switch-state column:

| # | S1 | S2 | Measurement type | Ext. battery (V) | Ext. resistor (Ω) | Ammeter (mA) | Voltmeter across | Voltmeter (V) |
|---|---|---|---|---|---|---|---|---|

Where S1 and S2 are displayed as "ON" or "OFF".

---

## Circuit Visualization Updates

The dynamic SVG schematic for Level 4 should show:

- The **black box** rectangle, now slightly larger to accommodate internal visual hints.
- **Two toggle switches** on the box surface, visually reflecting their current state (lever up/down, or colored green/red).
- The external circuit elements (battery, resistor, ammeter, voltmeter) as in previous levels.
- When a switch is open, the corresponding wire in the schematic could show a gap or a greyed-out section to hint that the path is broken. But **do not reveal** what's on each path — the box interior remains hidden.

---

## Edge Cases — Level 4

All edge cases from Levels 1–3 apply, plus:

1. **Both switches open, student tries to measure:** Everything reads 0. Show: *"No current flowing. Both internal paths are disconnected."*
2. **Both switches open, student connects external battery + resistor:** Still 0 current. The box provides no path. Show: *"Circuit incomplete — the box has no internal connection in this switch configuration."*
3. **Both closed, no external components, ammeter only (short circuit through ammeter):** I = ε / (R2 + R1∥0). Since ammeter has ~0 resistance, R1∥0 ≈ 0, so I ≈ ε/R2. This is a lot of current. Show the value but warn: *"Short circuit through ammeter! In real life this would blow a fuse."*
4. **State 4 with very small R_ext:** Current through R_ext could be very high. Cap at "> 1 A" with warning if exceeded.
5. **Student only tests one switch state and tries to submit:** They'll likely get values wrong. The hints should guide them to test multiple states.
6. **Reverse current in State 4 with external battery:** If student's external battery opposes the internal one and the external voltage exceeds V_terminal, current flows backwards. Display positive value with note: *"Current flows in reverse direction."*

---

## Updated Summary Table

| Level | Hidden components | Unknowns | Terminals | Switches | Resistance meter? |
|---|---|---|---|---|---|
| 1 — Easy | R1, R2 (series) | 2 | 3 (A, B, C) | 0 | Yes |
| 2 — Medium | R1, R2 (series) | 2 | 3 (A, B, C) | 0 | No |
| 3 — Difficult | ε, r | 2 | 2 (+, −) | 0 | No |
| 4 — Expert | R1, ε, R2 (two switched parallel paths) | 3 + topology | 2 (+, −) | 2 (S1, S2) | No |

---

## Pedagogical Note After Solving Level 3

Update the Level 3 success message to: *"Excellent — you identified a hidden power source using only external measurements. Ready for the final challenge? Level 4 adds switches to the box. The circuit inside changes depending on the switch positions, and you'll need to figure out the full topology."*

## Pedagogical Note After Solving Level 4

*"Congratulations! You've mastered black box circuit analysis. You identified three unknown components and figured out how switches route current through different internal paths — all without ever opening the box. This is essentially how real engineers characterize unknown circuits and how physicists probe systems they can't directly observe."*
