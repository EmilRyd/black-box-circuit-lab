const BATTERY_PRESETS = [1.5, 3, 4.5, 9];
const PAIR_OPTIONS_12 = ['A-B', 'B-C', 'A-C'];

export default function CircuitControls({
  level, terminalPair, setTerminalPair,
  vBattery, setVBattery, rExternal, setRExternal,
  voltmeterTarget, setVoltmeterTarget,
  mode, setMode,
  onMeasureResistance, onMeasureOpenCircuit, onMeasureCircuit,
  lastResult, solved,
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
        <div className="flex gap-2">
          <button
            onClick={() => setMode('ohmmeter')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${mode === 'ohmmeter'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
          >
            Ω Resistance Meter
          </button>
          <button
            onClick={() => setMode('circuit')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${mode === 'circuit'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            V/I Circuit
          </button>
        </div>
      )}

      {isLevel3 && (
        <button
          onClick={onMeasureOpenCircuit}
          disabled={solved}
          className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          Measure Open-Circuit Voltage (voltmeter only, no external circuit)
        </button>
      )}

      {level === 1 && mode === 'ohmmeter' ? (
        <button
          onClick={onMeasureResistance}
          disabled={solved}
          className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          Measure Resistance ({terminalPair})
        </button>
      ) : (
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

          {!(level === 1 && mode === 'ohmmeter') && (
            <button
              onClick={onMeasureCircuit}
              disabled={solved}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Measure
            </button>
          )}
        </>
      )}

      {lastResult && lastResult.warning && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          ⚠ {lastResult.warning}
        </div>
      )}
    </div>
  );
}
