import { useState } from 'react';
import { HINTS } from '../physics';

export default function HintsPanel({ level }) {
  const [revealed, setRevealed] = useState(0);
  const hints = HINTS[level];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <button
        onClick={() => { if (revealed < hints.length) setRevealed(r => r + 1); }}
        disabled={revealed >= hints.length}
        className="text-sm font-medium text-amber-600 hover:text-amber-700 disabled:text-gray-400 transition-colors"
      >
        {revealed === 0 ? 'Need a hint?' : revealed < hints.length ? 'Show next hint' : 'No more hints'}
      </button>
      {revealed > 0 && (
        <ol className="mt-3 space-y-2">
          {hints.slice(0, revealed).map((h, i) => (
            <li key={i} className="text-sm text-gray-600 pl-5 relative">
              <span className="absolute left-0 text-amber-500 font-mono text-xs">{i + 1}.</span>
              {h}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
