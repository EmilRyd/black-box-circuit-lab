export default function CircuitDiagram({ state }) {
  const { level, terminalPair, vBattery, rExternal, voltmeterTarget, mode } = state;
  const isLevel3 = level === 3;
  const isOhmmeter = level === 1 && mode === 'ohmmeter';

  const leftLabel = isLevel3 ? '+' : terminalPair.split('-')[0];
  const rightLabel = isLevel3 ? '−' : terminalPair.split('-')[1];

  const hasExtBat = vBattery > 0;
  const hasExtRes = rExternal > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Circuit Schematic</h2>
      <svg viewBox="0 0 520 300" className="w-full">
        {/* Black box at bottom */}
        <rect x="160" y="210" width="200" height="60" rx="8" fill="#1f2937" />
        <text x="260" y="245" textAnchor="middle" fill="#6b7280" fontSize="12" fontFamily="monospace">BLACK BOX</text>

        {/* Terminal labels on box */}
        <circle cx="180" cy="210" r="8" fill="#dc2626" />
        <text x="180" y="214" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{leftLabel}</text>
        <circle cx="340" cy="210" r="8" fill="#2563eb" />
        <text x="340" y="214" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{rightLabel}</text>

        {/* Left vertical wire */}
        <line x1="180" y1="202" x2="180" y2="60" stroke="#374151" strokeWidth="2" />
        {/* Right vertical wire */}
        <line x1="340" y1="202" x2="340" y2="60" stroke="#374151" strokeWidth="2" />

        {isOhmmeter ? (
          <>
            {/* Ohmmeter in the middle top */}
            <line x1="180" y1="60" x2="238" y2="60" stroke="#374151" strokeWidth="2" />
            <circle cx="260" cy="60" r="22" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
            <text x="260" y="65" textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="bold">Ω</text>
            <line x1="282" y1="60" x2="340" y2="60" stroke="#374151" strokeWidth="2" />
          </>
        ) : (
          <>
            {/* Top wire */}
            <line x1="180" y1="60" x2="340" y2="60" stroke="#374151" strokeWidth="2" />

            {/* External battery */}
            {hasExtBat && (
              <g>
                <line x1="195" y1="60" x2="210" y2="60" stroke="#374151" strokeWidth="2" />
                {/* Battery symbol */}
                <line x1="215" y1="45" x2="215" y2="75" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="222" y1="50" x2="222" y2="70" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="218" y="38" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="500">
                  {vBattery} V
                </text>
                <text x="209" y="64" textAnchor="middle" fill="#b45309" fontSize="9">+</text>
                <text x="229" y="64" textAnchor="middle" fill="#b45309" fontSize="9">−</text>
                <line x1="227" y1="60" x2="240" y2="60" stroke="#374151" strokeWidth="2" />
              </g>
            )}

            {/* External resistor */}
            {hasExtRes && (
              <g>
                {(() => {
                  const rx = hasExtBat ? 275 : 235;
                  return (
                    <>
                      <polyline
                        points={`${rx - 20},60 ${rx - 15},48 ${rx - 10},72 ${rx - 5},48 ${rx},72 ${rx + 5},48 ${rx + 10},72 ${rx + 15},48 ${rx + 20},60`}
                        fill="none" stroke="#6366f1" strokeWidth="2"
                      />
                      <text x={rx} y="38" textAnchor="middle" fill="#4338ca" fontSize="10" fontWeight="500">
                        {rExternal} Ω
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* Ammeter — centered on top wire */}
            {(() => {
              const ax = hasExtBat && hasExtRes ? 320
                : hasExtBat ? 300
                : hasExtRes ? 300
                : 260;
              return (
                <>
                  <circle cx={ax} cy="60" r="14" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
                  <text x={ax} y="65" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">A</text>
                </>
              );
            })()}

            {/* Voltmeter with leads to both wires */}
            {(() => {
              const leftWire = 180;
              const rightWire = 340;
              let vx, vy, wireY;
              if (voltmeterTarget === 'box') {
                vx = 260; vy = 180; wireY = 202;
              } else if (voltmeterTarget === 'resistor' && hasExtRes) {
                const rx = hasExtBat ? 275 : 235;
                vx = rx; vy = 105; wireY = 60;
              } else if (voltmeterTarget === 'battery' && hasExtBat) {
                vx = 218; vy = 105; wireY = 60;
              } else {
                vx = 260; vy = 180; wireY = 202;
              }
              const isBelow = vy > wireY;
              return (
                <g>
                  {/* Left lead: vertical stub down/up from wire, then horizontal to voltmeter */}
                  <line x1={leftWire} y1={wireY} x2={leftWire} y2={vy} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />
                  <line x1={leftWire} y1={vy} x2={vx - 14} y2={vy} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />
                  {/* Right lead: horizontal from voltmeter, then vertical stub to wire */}
                  <line x1={vx + 14} y1={vy} x2={rightWire} y2={vy} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />
                  <line x1={rightWire} y1={vy} x2={rightWire} y2={wireY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />
                  {/* Voltmeter circle */}
                  <circle cx={vx} cy={vy} r="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x={vx} y={vy + 5} textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="bold">V</text>
                </g>
              );
            })()}
          </>
        )}

        {/* Current direction arrow */}
        {!isOhmmeter && (
          <g>
            <text x="175" y="140" textAnchor="middle" fill="#9ca3af" fontSize="10" fontStyle="italic">I</text>
            <polygon points="170,128 175,118 180,128" fill="#9ca3af" />
          </g>
        )}
      </svg>
    </div>
  );
}
