const LEVELS = [
  { id: 1, label: 'Learning to Swim' },
  { id: 2, label: 'Trying Out the Waters' },
  { id: 3, label: 'Exploring the Deep' },
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
          {level === lv.id && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-t" />
          )}
        </button>
      ))}
    </div>
  );
}
