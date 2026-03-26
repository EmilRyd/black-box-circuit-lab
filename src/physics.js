const E12_100_1000 = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000];
const E12_10_100 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100];
const BATTERY_VALUES = [1.5, 3.0, 4.5, 6.0, 9.0];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePuzzle(level) {
  if (level === 1 || level === 2) {
    return { r1: pick(E12_100_1000), r2: pick(E12_100_1000) };
  }
  return { emf: pick(BATTERY_VALUES), r: pick(E12_10_100) };
}

export function getHiddenResistance(puzzle, pair) {
  switch (pair) {
    case 'A-B': return puzzle.r1;
    case 'B-C': return puzzle.r2;
    case 'A-C': return puzzle.r1 + puzzle.r2;
    default: return 0;
  }
}

export function computeLevel12(puzzle, pair, vBattery, rExternal) {
  const rHidden = getHiddenResistance(puzzle, pair);
  if (!vBattery || vBattery === 0) {
    return { current: 0, vBox: 0, vExt: 0, vBat: 0, rHidden, warning: 'No voltage source in circuit — no current will flow. Add a battery to your external circuit.' };
  }
  const rTotal = rExternal + rHidden;
  const current = vBattery / rTotal;
  return {
    current,
    vBox: current * rHidden,
    vExt: current * rExternal,
    vBat: vBattery,
    rHidden,
    warning: null,
  };
}

export function computeLevel3(puzzle, rExternal, vExtBattery, isOpenCircuit) {
  const { emf, r } = puzzle;

  if (isOpenCircuit) {
    return { current: 0, vBox: emf, vExt: 0, vExtBat: 0, rHidden: r, warning: null, isOpenCircuit: true };
  }

  const totalEmf = emf + (vExtBattery || 0);
  const totalR = r + (rExternal || 0);

  if (totalR === 0) {
    return { current: Infinity, vBox: 0, vExt: 0, vExtBat: vExtBattery || 0, rHidden: r, warning: 'Division by zero — infinite current.', isOpenCircuit: false };
  }

  const current = totalEmf / totalR;

  const hasNoExtResistor = !rExternal || rExternal === 0;
  const hasNoExtBattery = !vExtBattery || vExtBattery === 0;
  let warning = null;

  if (current > 1) {
    warning = 'Very high current! In a real circuit, this could damage components.';
  }

  if (hasNoExtResistor && hasNoExtBattery) {
    warning = 'Short circuit through ammeter! In real life this would blow a fuse.';
  } else if (hasNoExtResistor && !hasNoExtBattery) {
    if (current > 1) {
      warning = 'Very high current! In a real circuit, this could damage components.';
    }
  }

  return {
    current,
    vBox: emf - current * r,
    vExt: current * (rExternal || 0),
    vExtBat: vExtBattery || 0,
    rHidden: r,
    warning,
    isOpenCircuit: false,
  };
}

export function formatValue(value, unit) {
  if (value === Infinity || value > 1e6) return '> 1 A';

  if (unit === 'A' || unit === 'mA') {
    const absVal = Math.abs(value);
    if (absVal === 0) return `0 mA`;
    if (absVal < 0.001) return `${(value * 1e6).toPrecision(3)} μA`;
    if (absVal <= 1) return `${(value * 1000).toPrecision(3)} mA`;
    return `> 1 A`;
  }

  if (unit === 'V') {
    return `${Number(value.toPrecision(3))} V`;
  }

  if (unit === 'Ω') {
    if (value >= 1e6) return `${(value / 1e6).toPrecision(3)} MΩ`;
    if (value >= 1e3) return `${(value / 1e3).toPrecision(3)} kΩ`;
    return `${Number(value.toPrecision(3))} Ω`;
  }

  return String(Number(value.toPrecision(3)));
}

export function checkAnswer(level, puzzle, guess) {
  if (level === 1 || level === 2) {
    const r1ok = Math.abs(guess.r1 - puzzle.r1) / puzzle.r1 <= 0.05;
    const r2ok = Math.abs(guess.r2 - puzzle.r2) / puzzle.r2 <= 0.05;
    return { correct: r1ok && r2ok, r1ok, r2ok };
  }
  const emfOk = Math.abs(guess.emf - puzzle.emf) <= 0.5;
  const rOk = Math.abs(guess.r - puzzle.r) / puzzle.r <= 0.1;
  return { correct: emfOk && rOk, emfOk, rOk };
}

export const HINTS = {
  1: [
    'Try measuring the resistance between each pair of terminals.',
    'You should get three readings. How do they relate to each other?',
    'If R_AC = R_AB + R_BC, that tells you the resistors are in series.',
  ],
  2: [
    'You need a battery to push current through the box. Try connecting one.',
    'Use Ohm\'s law: if you know V and I, you can calculate R = V / I.',
    'Measure across each terminal pair with the same battery. Compare the currents.',
    'The resistance between A and C should be the sum of A–B and B–C.',
  ],
  3: [
    'Start by measuring voltage across the terminals with nothing else connected. What do you notice?',
    'The box has its own voltage source! Now connect a known resistor and measure the current.',
    'You have two unknowns: the hidden voltage (ε) and the hidden resistance (r).',
    'Take two measurements with two different external resistors. Set up two equations: ε = I₁ × (r + R₁) and ε = I₂ × (r + R₂).',
    'Subtract one equation from the other to eliminate ε and solve for r first.',
  ],
};
