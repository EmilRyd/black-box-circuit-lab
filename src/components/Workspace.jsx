import { useState, useCallback } from 'react';
import BlackBox from './BlackBox';
import CircuitControls from './CircuitControls';
import CircuitDiagram from './CircuitDiagram';
import MeasurementLog from './MeasurementLog';
import { computeLevel12, computeLevel3, getHiddenResistance, formatValue } from '../physics';

export default function Workspace({ level, puzzle }) {
  const [terminalPair, setTerminalPair] = useState(level === 3 ? '+−' : 'A-B');
  const [vBattery, setVBattery] = useState(0);
  const [rExternal, setRExternal] = useState(0);
  const [voltmeterTarget, setVoltmeterTarget] = useState('box');
  const [measurements, setMeasurements] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [mode, setMode] = useState(level === 1 ? 'ohmmeter' : 'circuit');

  const handleMeasureResistance = useCallback(() => {
    const rHidden = getHiddenResistance(puzzle, terminalPair);
    const entry = {
      id: Date.now(),
      type: 'Ohmmeter',
      pair: terminalPair,
      vBat: '—',
      rExt: '—',
      ammeter: '—',
      voltAcross: '—',
      voltReading: formatValue(rHidden, 'Ω'),
    };
    setMeasurements(m => [...m, entry]);
    setLastResult({ type: 'ohmmeter', rHidden });
  }, [puzzle, terminalPair]);

  const handleMeasureOpenCircuit = useCallback(() => {
    const result = computeLevel3(puzzle, 0, 0, true);
    const entry = {
      id: Date.now(),
      type: 'Open-circuit voltage',
      pair: '+/−',
      vBat: '—',
      rExt: '—',
      ammeter: '—',
      voltAcross: 'Box terminals',
      voltReading: formatValue(result.vBox, 'V'),
    };
    setMeasurements(m => [...m, entry]);
    setLastResult(result);
  }, [puzzle]);

  const handleMeasureCircuit = useCallback(() => {
    let result;
    if (level === 3) {
      result = computeLevel3(puzzle, rExternal, vBattery, false);
    } else {
      result = computeLevel12(puzzle, terminalPair, vBattery, rExternal);
    }

    let voltReading;
    let voltAcross;
    if (voltmeterTarget === 'box') {
      voltReading = formatValue(result.vBox, 'V');
      voltAcross = level === 3 ? 'Box terminals' : `Box (${terminalPair})`;
    } else if (voltmeterTarget === 'resistor') {
      voltReading = formatValue(result.vExt, 'V');
      voltAcross = 'Ext. resistor';
    } else {
      voltReading = formatValue(level === 3 ? result.vExtBat : result.vBat, 'V');
      voltAcross = 'Ext. battery';
    }

    const currentDisplay = result.current > 1
      ? '> 1 A'
      : formatValue(result.current, 'mA');

    const entry = {
      id: Date.now(),
      type: 'V/I circuit',
      pair: level === 3 ? '+/−' : terminalPair,
      vBat: vBattery ? `${vBattery} V` : '—',
      rExt: rExternal ? `${rExternal} Ω` : '—',
      ammeter: currentDisplay,
      voltAcross,
      voltReading,
    };
    setMeasurements(m => [...m, entry]);
    setLastResult({ ...result, displayVolt: voltReading, displayVoltLabel: voltAcross, displayCurrent: currentDisplay });
  }, [level, puzzle, terminalPair, vBattery, rExternal, voltmeterTarget]);

  const circuitState = {
    level, terminalPair, vBattery, rExternal, voltmeterTarget, mode, lastResult,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <BlackBox level={level} terminalPair={terminalPair} />
          <CircuitDiagram state={circuitState} />
        </div>

        <div className="space-y-6">
          <CircuitControls
            level={level}
            terminalPair={terminalPair}
            setTerminalPair={setTerminalPair}
            vBattery={vBattery}
            setVBattery={setVBattery}
            rExternal={rExternal}
            setRExternal={setRExternal}
            voltmeterTarget={voltmeterTarget}
            setVoltmeterTarget={setVoltmeterTarget}
            mode={mode}
            setMode={setMode}
            onMeasureResistance={handleMeasureResistance}
            onMeasureOpenCircuit={handleMeasureOpenCircuit}
            onMeasureCircuit={handleMeasureCircuit}
            lastResult={lastResult}
          />
        </div>
      </div>

      <MeasurementLog
        measurements={measurements}
        onClear={() => setMeasurements([])}
      />
    </div>
  );
}
