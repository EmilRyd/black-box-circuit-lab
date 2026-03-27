export default function BlackBox({ level, terminalPair, s1, s2, onToggleS1, onToggleS2 }) {
  const isLevel3 = level === 3;
  const isLevel4 = level === 4;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">The Black Box</h2>
      <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
        <defs>
          <filter id="boxShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        <rect x="60" y="30" width="280" height="120" rx="12" fill="#1f2937" filter="url(#boxShadow)" />
        <rect x="62" y="32" width="276" height="116" rx="10" fill="none" stroke="#374151" strokeWidth="1" />

        <text x="200" y={isLevel4 ? 65 : 95} textAnchor="middle" fill="#6b7280" fontSize="13" fontFamily="monospace" fontWeight="500">
          SEALED
        </text>

        {isLevel3 || isLevel4 ? (
          <>
            <circle cx="100" cy="90" r="10" fill="#dc2626" stroke="#fca5a5" strokeWidth="2" />
            <text x="100" y="94" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">+</text>
            <line x1="100" y1="100" x2="100" y2="175" stroke="#dc2626" strokeWidth="2.5" />
            <circle cx="100" cy="178" r="4" fill="#dc2626" />
            <text x="100" y="14" textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">+</text>

            <circle cx="300" cy="90" r="10" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />
            <text x="300" y="94" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">−</text>
            <line x1="300" y1="100" x2="300" y2="175" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="300" cy="178" r="4" fill="#2563eb" />
            <text x="300" y="14" textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">−</text>

            {isLevel4 && (
              <>
                {/* S1 switch */}
                <g onClick={onToggleS1} className="cursor-pointer">
                  <rect x="145" y="85" width="44" height="22" rx="11" fill={s1 ? '#10b981' : '#6b7280'} />
                  <circle cx={s1 ? 178 : 156} cy="96" r="8" fill="white" />
                  <text x="167" y="123" textAnchor="middle" fill="#d1d5db" fontSize="10" fontWeight="600">S1</text>
                </g>
                {/* S2 switch */}
                <g onClick={onToggleS2} className="cursor-pointer">
                  <rect x="215" y="85" width="44" height="22" rx="11" fill={s2 ? '#10b981' : '#6b7280'} />
                  <circle cx={s2 ? 248 : 226} cy="96" r="8" fill="white" />
                  <text x="237" y="123" textAnchor="middle" fill="#d1d5db" fontSize="10" fontWeight="600">S2</text>
                </g>
              </>
            )}
          </>
        ) : (
          <>
            {[
              { label: 'A', x: 110, color: '#dc2626', ring: '#fca5a5' },
              { label: 'B', x: 200, color: '#f59e0b', ring: '#fde68a' },
              { label: 'C', x: 290, color: '#2563eb', ring: '#93c5fd' },
            ].map(t => {
              const active = terminalPair.includes(t.label);
              return (
                <g key={t.label}>
                  <circle cx={t.x} cy="90" r="10"
                    fill={active ? t.color : '#4b5563'}
                    stroke={active ? t.ring : '#6b7280'}
                    strokeWidth="2"
                  />
                  <text x={t.x} y="94" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                    {t.label}
                  </text>
                  <line x1={t.x} y1="100" x2={t.x} y2="175" stroke={active ? t.color : '#6b7280'} strokeWidth="2.5" />
                  <circle cx={t.x} cy="178" r="4" fill={active ? t.color : '#6b7280'} />
                  <text x={t.x} y="14" textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">
                    {t.label}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>
    </div>
  );
}
