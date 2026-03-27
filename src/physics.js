export const FIXED_PUZZLES = {
  1: { r1: 330, r2: 470 },
  2: { r1: 220, r2: 560 },
  3: { emf: 4.5, r: 47 },
  4: { r1: 470, emf: 6.0, r2: 33 },
};

export function getPuzzle(level) {
  return FIXED_PUZZLES[level];
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
    return { current: 0, vBox: 0, vExt: 0, vBat: 0, rHidden, warning: null };
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

  if (hasNoExtResistor && hasNoExtBattery && current > 1) {
    warning = 'Short circuit through ammeter! In real life this would blow a fuse.';
  } else if (current > 1) {
    warning = 'Very high current! In a real circuit, this could damage components.';
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

export function computeLevel4(puzzle, s1, s2, rExternal, vExtBattery, isOpenCircuit) {
  const { r1, emf, r2 } = puzzle;
  const hasRext = rExternal > 0;
  const hasVext = vExtBattery > 0;

  // State 1: both open — no internal path
  if (!s1 && !s2) {
    return {
      current: 0, vBox: 0, vExt: 0, vExtBat: vExtBattery || 0,
      warning: null, isOpenCircuit: isOpenCircuit,
    };
  }

  // State 2: S1 closed, S2 open — pure resistor R1
  if (s1 && !s2) {
    if (isOpenCircuit) {
      return { current: 0, vBox: 0, vExt: 0, vExtBat: 0, warning: null, isOpenCircuit: true };
    }
    const vExt = vExtBattery || 0;
    if (vExt === 0 && !hasVext) {
      return { current: 0, vBox: 0, vExt: 0, vExtBat: 0, warning: null, isOpenCircuit: false };
    }
    const totalR = r1 + (rExternal || 0);
    if (totalR === 0) {
      return { current: Infinity, vBox: 0, vExt: 0, vExtBat: vExt, warning: 'Very high current!', isOpenCircuit: false };
    }
    const current = vExt / totalR;
    let warning = null;
    if (current > 1) warning = 'Very high current! In a real circuit, this could damage components.';
    if (!hasRext && hasVext) {
      if (current > 1) warning = 'Very high current! In a real circuit, this could damage components.';
    }
    return {
      current,
      vBox: current * r1,
      vExt: current * (rExternal || 0),
      vExtBat: vExt,
      warning,
      isOpenCircuit: false,
    };
  }

  // State 3: S1 open, S2 closed — battery ε + R2 (same as Level 3)
  if (!s1 && s2) {
    if (isOpenCircuit) {
      return { current: 0, vBox: emf, vExt: 0, vExtBat: 0, warning: null, isOpenCircuit: true };
    }
    const totalEmf = emf + (vExtBattery || 0);
    const totalR = r2 + (rExternal || 0);
    if (totalR === 0) {
      return { current: Infinity, vBox: 0, vExt: 0, vExtBat: vExtBattery || 0, warning: 'Very high current!', isOpenCircuit: false };
    }
    const current = totalEmf / totalR;
    let warning = null;
    if (!hasRext && !hasVext) {
      warning = 'Short circuit through ammeter! In real life this would blow a fuse.';
    } else if (current > 1) {
      warning = 'Very high current! In a real circuit, this could damage components.';
    }
    return {
      current,
      vBox: emf - current * r2,
      vExt: current * (rExternal || 0),
      vExtBat: vExtBattery || 0,
      warning,
      isOpenCircuit: false,
    };
  }

  // State 4: both closed — parallel paths with internal battery
  if (isOpenCircuit && !hasRext && !hasVext) {
    const vTerminal = emf * r1 / (r1 + r2);
    return { current: 0, vBox: vTerminal, vExt: 0, vExtBat: 0, warning: null, isOpenCircuit: true };
  }

  // Node voltage analysis: V = terminal voltage
  // KCL: (emf - V)/R2 + (vExt - V)/Rext = V/R1
  // If no ext battery: vExt = 0, current through Rext = -V/Rext (ammeter reads V/Rext)
  // If no ext resistor: only R1 and battery path
  const eExt = vExtBattery || 0;

  if (!hasRext) {
    // No external resistor: ammeter is a short across terminals
    // R1 in parallel with ammeter (0Ω) = 0Ω. Battery sees only R2.
    const current = (emf + eExt) / r2;
    let warning = 'Short circuit through ammeter! In real life this would blow a fuse.';
    if (current > 1) warning = 'Very high current! In a real circuit, this could damage components.';
    return {
      current,
      vBox: 0,
      vExt: 0,
      vExtBat: eExt,
      warning,
      isOpenCircuit: false,
    };
  }

  // General case: solve V = (emf/r2 + eExt/rExternal) / (1/r1 + 1/r2 + 1/rExternal)
  const V = (emf / r2 + eExt / rExternal) / (1 / r1 + 1 / r2 + 1 / rExternal);

  let iAmmeter;
  if (hasVext) {
    iAmmeter = (eExt - V) / rExternal;
  } else {
    iAmmeter = V / rExternal;
  }

  let warning = null;
  const reverseCurrent = hasVext && iAmmeter < 0;
  if (reverseCurrent) {
    warning = 'Current flows in reverse direction through external circuit.';
  }
  const absCurrent = Math.abs(iAmmeter);
  if (absCurrent > 1) {
    warning = 'Very high current! In a real circuit, this could damage components.';
  }

  return {
    current: absCurrent,
    vBox: V,
    vExt: absCurrent * rExternal,
    vExtBat: eExt,
    warning,
    isOpenCircuit: false,
    reverseCurrent,
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
