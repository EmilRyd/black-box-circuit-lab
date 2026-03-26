import { formatValue } from '../physics';

const BATTERY_PRESETS = [1.5, 3, 4.5, 9];
const PAIR_OPTIONS_12 = ['A-B', 'B-C', 'A-C'];

export default function CircuitControls({
  level, terminalPair, setTerminalPair,
  vBattery, setVBattery, rExternal, setRExternal,
  voltmeterTarget, setVoltmeterTarget,
  mode, setMode,
  onMeasureResistance, onMeasureOpenCircuit, onMeasureCircuit,
  lastResult,
}) {
  const isLevel3 = level === 3;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Workbench</h2>

      {!isLevel3 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Terminal Pair</label>
          <div className="flex gap-2">
            {PAIR_OPTIONS_12.map(p => (
              <button
                key={p}
                onClick={() => setTerminalPair(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${terminalPair === p
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {level === 1 && (
        <button
          onClick={onMeasureResistance}
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          Measure Resistance ({terminalPair})
        </button>
      )}

      {isLevel3 && (
        <button
          onClick={onMeasureOpenCircuit}
          className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          Measure Open-Circuit Voltage (voltmeter only, no external circuit)
        </button>
      )}

      {level !== 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              External Battery (V)
              {isLevel3 && <span className="text-gray-400 font-normal"> — optional</span>}
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {BATTERY_PRESETS.map(v => (
                <button
                  key={v}
                  onClick={() => setVBattery(v)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                    ${vBattery === v
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    }`}
                >
                  {v} V
                </button>
              ))}
              <button
                onClick={() => setVBattery(0)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                  ${vBattery === 0
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                None
              </button>
            </div>
            <input
              type="number"
              min="0"
              step="0.1"
              value={vBattery || ''}
              onChange={e => setVBattery(parseFloat(e.target.value) || 0)}
              placeholder="Custom voltage..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              External Resistor (Ω)
              <span className="text-gray-400 font-normal"> — optional</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={rExternal || ''}
              onChange={e => setRExternal(parseFloat(e.target.value) || 0)}
              placeholder="Enter resistance value..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voltmeter Across</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'box', label: isLevel3 ? 'Box (+/−)' : `Box (${terminalPair})` },
                { id: 'resistor', label: 'Ext. Resistor' },
                { id: 'battery', label: 'Ext. Battery' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setVoltmeterTarget(t.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                    ${voltmeterTarget === t.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onMeasureCircuit}
            className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Measure
          </button>
        </>
      )}

      {lastResult && <ReadoutDisplay lastResult={lastResult} level={level} mode={mode} />}

      {lastResult && lastResult.warning && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          ⚠ {lastResult.warning}
        </div>
      )}
    </div>
  );
}

function ReadoutDisplay({ lastResult, level, mode }) {
  if (lastResult.type === 'ohmmeter') {
    return (
      <div className="rounded-lg bg-gray-950 p-4 text-center border-2 border-emerald-500/30">
        <p className="text-xs text-emerald-400 uppercase tracking-widest mb-1 font-medium">Ohmmeter Reading</p>
        <p className="text-3xl font-mono font-bold text-emerald-400">
          {formatValue(lastResult.rHidden, 'Ω')}
        </p>
      </div>
    );
  }

  if (lastResult.isOpenCircuit) {
    return (
      <div className="rounded-lg bg-gray-950 p-4 text-center border-2 border-blue-500/30">
        <p className="text-xs text-blue-400 uppercase tracking-widest mb-1 font-medium">Open-Circuit Voltage</p>
        <p className="text-3xl font-mono font-bold text-blue-400">
          {formatValue(lastResult.vBox, 'V')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-950 p-4 border-2 border-gray-700">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium text-center">Instrument Readings</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-[10px] text-red-400 uppercase tracking-widest mb-0.5">Ammeter</p>
          <p className="text-xl font-mono font-bold text-red-400">{lastResult.displayCurrent}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-0.5">Voltmeter — {lastResult.displayVoltLabel}</p>
          <p className="text-xl font-mono font-bold text-blue-400">{lastResult.displayVolt}</p>
        </div>
      </div>
    </div>
  );
}
