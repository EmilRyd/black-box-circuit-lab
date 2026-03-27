export default function MeasurementLog({ measurements, onClear, showSwitches }) {
  const handleExportCSV = () => {
    const headers = showSwitches
      ? ['#', 'S1', 'S2', 'Type', 'Terminals', 'Ext. Battery', 'Ext. Resistor', 'Ammeter', 'Voltmeter Across', 'Voltmeter']
      : ['#', 'Type', 'Terminals', 'Ext. Battery', 'Ext. Resistor', 'Ammeter', 'Voltmeter Across', 'Voltmeter'];
    const rows = measurements.map((m, i) => {
      const base = [i + 1];
      if (showSwitches) base.push(m.s1 ? 'ON' : 'OFF', m.s2 ? 'ON' : 'OFF');
      base.push(m.type, m.pair, m.vBat, m.rExt, m.ammeter, m.voltAcross, m.voltReading);
      return base;
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'measurements.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Measurement Log
          {measurements.length > 0 && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {measurements.length}
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          {measurements.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={onClear}
                className="px-3 py-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Log
              </button>
            </>
          )}
        </div>
      </div>

      {measurements.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No measurements yet. Take a reading to get started.</p>
      ) : (
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200 text-left">
                <th className="px-3 py-2 font-medium text-gray-500">#</th>
                {showSwitches && (
                  <>
                    <th className="px-3 py-2 font-medium text-gray-500">S1</th>
                    <th className="px-3 py-2 font-medium text-gray-500">S2</th>
                  </>
                )}
                <th className="px-3 py-2 font-medium text-gray-500">Type</th>
                <th className="px-3 py-2 font-medium text-gray-500">Terminals</th>
                <th className="px-3 py-2 font-medium text-gray-500">Ext. Battery</th>
                <th className="px-3 py-2 font-medium text-gray-500">Ext. Resistor</th>
                <th className="px-3 py-2 font-medium text-gray-500">Ammeter</th>
                <th className="px-3 py-2 font-medium text-gray-500">V Across</th>
                <th className="px-3 py-2 font-medium text-gray-500">Reading</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m, i) => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-400 font-mono text-xs">{i + 1}</td>
                  {showSwitches && (
                    <>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${m.s1 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {m.s1 ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${m.s2 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {m.s2 ? 'ON' : 'OFF'}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                      ${m.type === 'Ohmmeter' ? 'bg-emerald-50 text-emerald-700' :
                        m.type === 'Open-circuit voltage' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono">{m.pair}</td>
                  <td className="px-3 py-2 font-mono">{m.vBat}</td>
                  <td className="px-3 py-2 font-mono">{m.rExt}</td>
                  <td className="px-3 py-2 font-mono font-medium text-red-600">{m.ammeter}</td>
                  <td className="px-3 py-2 text-gray-600">{m.voltAcross}</td>
                  <td className="px-3 py-2 font-mono font-medium text-blue-600">{m.voltReading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
