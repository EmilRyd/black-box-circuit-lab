const LEVELS = [
  { id: 1, label: 'Level 1: Easy', desc: 'Resistance meter available' },
  { id: 2, label: 'Level 2: Medium', desc: 'No resistance meter!' },
  { id: 3, label: 'Level 3: Difficult', desc: 'Hidden battery + resistor' },
];

export default function LevelSelector({ level, onChange }) {
  return (
    <div className="flex border-t border-gray-100">
      {LEVELS.map((lv) => (
        <button
          key={lv.id}
          onClick={() => onChange(lv.id)}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative
            ${level === lv.id
              ? 'text-gray-900 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          <span className="block">{lv.label}</span>
          <span className="block text-xs mt-0.5 font-normal text-gray-400">{lv.desc}</span>
          {level === lv.id && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-t" />
          )}
        </button>
      ))}
    </div>
  );
}
