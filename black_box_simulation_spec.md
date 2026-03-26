# Black Box Circuit Simulation — Full Spec

## Purpose

A browser-based simulation for physics students who know Ohm's law, batteries, and resistors. Students are presented with a sealed "black box" that has hidden components inside. Their goal is to figure out what's inside using only external measurements. There are three difficulty levels, each removing a tool or adding complexity.

| Level | What's hidden | Terminals | Resistance meter? | Core skill |
|---|---|---|---|---|
| 1 — Easy | Two resistors (series) | 3 (A, B, C) | Yes | Direct measurement |
| 2 — Medium | Two resistors (series) | 3 (A, B, C) | No | Deriving R from V and I |
| 3 — Difficult | Battery + resistor | 2 (+, −) | No | Solving simultaneous equations |

---

## General UI Layout

The app is a single-page web app (React preferred, but vanilla HTML/JS is fine). It should be clean, minimal, and work on both desktop and tablets.

### Top-level structure

1. **Level selector** — three tabs or buttons at the top: "Level 1: Easy", "Level 2: Medium", "Level 3: Difficult". Switching levels resets the workspace. Each tab should show a one-line description of what changes (e.g., "No resistance meter!").
2. **Black box area** (left/center) — a visual representation of the sealed box with its external terminals clearly labeled.
3. **Workbench / circuit builder area** (right or below) — where students build their external test circuit and take measurements. The available tools change per level.
4. **Measurement log** (bottom or sidebar) — a running table of every measurement the student has taken.
5. **"Check my answer" button** — students enter their guess for the hidden component values.

---

## Level 1: Easy — Hidden Resistors, With Resistance Meter

### What's inside the box

Two resistors in a simple series chain across three terminals:

```
Terminal A ---[ R1 ]--- Terminal B ---[ R2 ]--- Terminal C
```

Randomly generated using E12 series values between 100 Ω and 1 kΩ (e.g., 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000 Ω).

### External terminals

The black box graphic shows **three** terminals labeled **A**, **B**, and **C**, each with a small wire stub coming out.

### What students can do

1. **Select a terminal pair** to work with (A–B, B–C, or A–C) via dropdown or by clicking terminals.
2. **Use the resistance meter (ohmmeter):** Click "Measure Resistance" and the simulation directly displays the resistance between the selected terminal pair. This is the primary tool for this level.
3. **Optionally build an external circuit** (same tools as Level 2 below — battery, resistor, ammeter, voltmeter). These are available but not required. Students who want to cross-check their ohmmeter readings with V/I measurements can do so.
4. **Take a reading** — each measurement (whether ohmmeter or V/I) is logged.

### Physics engine (Level 1)

Ohmmeter readings:
- A–B: R1
- B–C: R2
- A–C: R1 + R2

V/I circuit engine (if student uses it) is the same as Level 2 below.

### Answer submission

Student enters guesses for R1 and R2. Accept if both values are within ±5% of the true values. Show success/failure. On success, reveal the internal circuit diagram.

### Pedagogical note displayed to students

After solving Level 1, show a message like: *"Nice work! That was straightforward with a resistance meter. But what if you didn't have one? Try Level 2 — same kind of box, but now you'll need to figure out the resistances using only voltage and current."*

---

## Level 2: Medium — Hidden Resistors, No Resistance Meter

### What's inside the box

Identical setup to Level 1:

```
Terminal A ---[ R1 ]--- Terminal B ---[ R2 ]--- Terminal C
```

Same random generation rules (E12, 100–1000 Ω). A new puzzle is generated when entering this level (not the same values as Level 1).

### External terminals

Same as Level 1: three terminals **A**, **B**, **C**.

### What students can do

The resistance meter is **gone**. The student must now determine R1 and R2 by building external circuits and measuring V and I.

1. **Select a terminal pair** to work with (A–B, B–C, or A–C).
2. **Build an external circuit** between the selected pair. The external circuit is a simple series loop consisting of:
   - An **external battery** (required — without it, no current flows since the box is purely passive). Student sets the voltage: provide preset buttons for common values (1.5 V, 3 V, 4.5 V, 9 V) and a free-entry field.
   - An optional **external resistor** (student enters a value in Ω). This is not required — omitting it means the only resistance in the loop is the hidden resistance.
3. **Measurement instruments** (always present in the circuit):
   - **Ammeter** — in series in the loop. Always shows the current reading.
   - **Voltmeter** — student chooses what to measure across: the external battery, the external resistor, or the black box terminal pair. Shows the voltage reading.
4. **Take a reading** — click "Measure" to calculate and display V and I. The reading is added to the measurement log.

### Physics engine (Level 2)

The full loop for a selected terminal pair (say A–C) is:

```
I = V_battery / (R_external + R_hidden_between_pair)
```

Where `R_hidden_between_pair` is:
- A–B: R1
- B–C: R2
- A–C: R1 + R2

Voltmeter readings depend on what the student is measuring across:
- Across the black box terminal pair: `V_box = I × R_hidden_between_pair`
- Across the external resistor: `V_ext = I × R_external`
- Across the external battery: `V_bat = V_battery` (ideal battery, no internal resistance for the student's external battery)

If no external battery is connected, current is 0. Display "0 mA" and "0 V" and show a message: *"No voltage source in circuit — no current will flow. Add a battery to your external circuit."*

If no external resistor is connected (R_external = 0), current = V_battery / R_hidden. This is fine.

### Answer submission

Same as Level 1. Student enters guesses for R1 and R2. Accept within ±5%. On success, reveal the internal circuit.

### Pedagogical note displayed to students

After solving Level 2, show: *"Great — you figured out resistances without ever measuring them directly, just by using Ohm's law. Now for the real challenge: what if the box has its own power source? Try Level 3."*

---

## Level 3: Difficult — Hidden Battery + Resistor, No Resistance Meter

### What's inside the box

A battery (EMF = ε) in series with a resistor (internal resistance = r):

```
Terminal + ---[ battery ε ]---[ resistor r ]--- Terminal −
```

Randomly generate:
- ε: pick from {1.5, 3.0, 4.5, 6.0, 9.0} V.
- r: pick from E12 values between 10 Ω and 100 Ω (e.g., 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100 Ω).

### External terminals

The black box graphic shows **two** terminals labeled **+** and **−**.

### What students can do

1. **Open-circuit voltage measurement** — student can place a voltmeter directly across the + and − terminals with nothing else connected. This should be an explicit, prominent option (e.g., a "Measure open-circuit voltage" button, or a toggle that says "Voltmeter only, no external circuit"). The reading will be ε. This is the key "aha" moment — the box has voltage even with nothing connected.
2. **Build an external circuit** between + and −:
   - An optional **external battery** (student sets voltage). Allowed but makes the math harder.
   - An optional **external resistor** (student enters value in Ω).
3. **Measurement instruments:**
   - **Ammeter** — in series in the loop. Shows current.
   - **Voltmeter** — student chooses to measure across: the external battery, the external resistor, or the black box terminals.
4. **Take a reading** — click "Measure" and log the result.

### Physics engine (Level 3)

Total EMF in the loop = ε_hidden + ε_external (assume external battery always aids the hidden battery — same polarity direction. If you want to implement a polarity toggle, see the bonus features section).

Total resistance = r_hidden + R_external.

```
I = (ε_hidden + ε_external) / (r_hidden + R_external)
```

If ε_external = 0 (no external battery):
```
I = ε_hidden / (r_hidden + R_external)
```

Voltmeter readings:
- Across the black box terminals: `V_box = ε_hidden − I × r_hidden`
- Across the external resistor: `V_ext = I × R_external`
- Across the external battery: `V_ext_bat = ε_external` (ideal)

Open-circuit case (no external resistor, no external battery): I = 0, V_box = ε_hidden.

If student connects no external resistor but does connect an external battery (effectively a short through the box):
- I = (ε_hidden + ε_external) / r_hidden — could be very high.
- Cap the display at "> 1 A" and show a warning: *"Very high current! In a real circuit, this could damage components."*

If student connects no external resistor and no external battery, but tries to take an ammeter reading: current = ε_hidden / r_hidden through the ammeter (short circuit through the box). Display the value but show a warning: *"Short circuit through ammeter! In real life this would blow a fuse."*

### Answer submission

Student enters guesses for ε (in volts) and r (in ohms). Accept if ε is within ±0.5 V and r is within ±10% of the true value. Show success/failure and reveal the internal circuit on success.

---

## Measurement Log

All three levels share the same log format. Every time the student clicks "Measure," a row is added:

| # | Measurement type | Terminal pair | Ext. battery (V) | Ext. resistor (Ω) | Ammeter (mA) | Voltmeter across | Voltmeter (V) |
|---|---|---|---|---|---|---|---|

Where "Measurement type" is one of:
- "Ohmmeter" (Level 1 only)
- "V/I circuit"
- "Open-circuit voltage" (Level 3 only)

The log should be:
- Scrollable if it gets long.
- Clearable with a "Clear log" button.
- Persistent within the current puzzle (resets when switching levels or generating a new puzzle).

---

## Circuit Visualization

As the student builds their external circuit, show a **live schematic** of what they've wired. This does not need to be a drag-and-drop circuit builder — a simple dynamic SVG diagram is ideal.

### What to show

- The **black box** as a dark rounded rectangle with labeled terminals.
- The **external battery** (if added) as a standard cell symbol with its voltage label.
- The **external resistor** (if added) as a zigzag symbol with its value label.
- The **ammeter** as a circle with "A" inside, in series in the loop.
- The **voltmeter** as a circle with "V" inside, connected in parallel across whichever element the student selected. Draw dotted lines from the voltmeter to the correct nodes.
- **Wires** connecting everything in a loop.
- In Level 1, also show the **ohmmeter** as a circle with "Ω" inside when that mode is active.

### Layout

The schematic should read left-to-right or as a rectangular loop:

```
    ┌── [ Ext. Battery ] ── [ Ext. Resistor ] ── (A) ammeter ──┐
    │                                                            │
 Terminal X                                              Terminal Y
    │                                                            │
    └──────────────── [ BLACK BOX ] ────────────────────────────┘
                          (V) voltmeter across selected element
```

The diagram updates reactively as the student adds/removes components or changes the voltmeter target.

---

## "New Puzzle" Button

Available at all times. Generates new random hidden values for the current level and resets the workspace and log.

---

## Hints System

A collapsible "Need a hint?" panel with progressive hints. Each click reveals the next hint.

### Level 1 hints
1. "Try measuring the resistance between each pair of terminals."
2. "You should get three readings. How do they relate to each other?"
3. "If R_AC = R_AB + R_BC, that tells you the resistors are in series."

### Level 2 hints
1. "You need a battery to push current through the box. Try connecting one."
2. "Use Ohm's law: if you know V and I, you can calculate R = V / I."
3. "Measure across each terminal pair with the same battery. Compare the currents."
4. "The resistance between A and C should be the sum of A–B and B–C."

### Level 3 hints
1. "Start by measuring voltage across the terminals with nothing else connected. What do you notice?"
2. "The box has its own voltage source! Now connect a known resistor and measure the current."
3. "You have two unknowns: the hidden voltage (ε) and the hidden resistance (r)."
4. "Take two measurements with two different external resistors. Set up two equations: ε = I₁ × (r + R₁) and ε = I₂ × (r + R₂)."
5. "Subtract one equation from the other to eliminate ε and solve for r first."

---

## Visual Design Notes

- The black box should look like a physical sealed box — dark grey or black rectangle with a subtle shadow, small colored dots or binding-post icons for terminals.
- Use a clean, educational aesthetic. Think physics textbook, not gaming UI.
- Color-code instruments: ammeter in **red**, voltmeter in **blue**, ohmmeter in **green**.
- Display all values with appropriate units and 3 significant figures (e.g., "I = 24.3 mA", "V = 4.71 V", "R = 330 Ω").
- The level selector tabs should visually indicate progression — e.g., a subtle "recommended after Level 1" note on Level 2, etc. But don't actually lock the levels — students should be able to jump to any level.
- Mobile-friendly is a plus but desktop-first is fine.

---

## Tech Preferences

- Single-page app, no backend needed. All physics calculations happen client-side.
- React + Tailwind CSS preferred, but any framework is fine.
- The SVG circuit diagram should be generated programmatically (not a static image).
- No external physics libraries needed — the math is just Ohm's law.

---

## Summary of Hidden Values Per Level

| Level | Hidden components | Random ranges |
|---|---|---|
| 1 — Easy | R1, R2 | 100–1000 Ω, E12 series |
| 2 — Medium | R1, R2 | 100–1000 Ω, E12 series |
| 3 — Difficult | ε, r | ε ∈ {1.5, 3, 4.5, 6, 9} V; r ∈ 10–100 Ω, E12 series |

---

## Edge Cases to Handle

1. **No battery and no internal source (Levels 1 & 2):** No current flows. Show "0 mA" and "0 V". Show message: *"No voltage source in circuit — no current will flow."*
2. **R_external = 0 with external battery (Levels 1 & 2):** Current = V_battery / R_hidden. Valid measurement, allow it.
3. **Short circuit (Level 3, no external resistor, no external battery):** If the student has the ammeter connected but nothing else, current = ε / r through the ammeter. Show the reading but warn: *"Short circuit through ammeter! In real life this would blow a fuse."*
4. **Very high current (Level 3):** If (ε_hidden + ε_external) / (r_hidden + R_external) exceeds 1 A, cap display at "> 1 A" and warn.
5. **External battery opposes hidden battery (Level 3, if polarity toggle is implemented):** Net EMF could be zero or negative. Display negative current as positive with note: *"Current flows in reverse direction."*
6. **Student enters 0 for external resistor explicitly:** Treat the same as omitting it.
7. **Student enters very large external resistor (> 1 MΩ):** Current will be tiny. Display in μA if below 1 mA.

---

## Bonus Features (Optional)

These are not required but would enhance the experience:

1. **Polarity toggle for external battery (Level 3):** Let the student flip the direction. Adds realism and an extra conceptual layer.
2. **"Reveal answer" button:** For students who are stuck. Shows the hidden circuit without requiring a correct guess. Separate from the success state.
3. **Timer / move counter:** Track how many measurements the student needed. Display "You solved it in N measurements!" on success. Could highlight efficiency (e.g., "The minimum for this level is 2 measurements").
4. **Teacher mode:** A URL parameter or toggle that reveals the hidden values to the teacher, so they can guide a live class through the exercise without solving it themselves.
5. **Export log as CSV:** Let students download their measurement table for a lab report.
