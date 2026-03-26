import { useState } from 'react';
import { checkAnswer } from '../physics';

export default function AnswerPanel({ level, puzzle, solved, setSolved, measurementCount }) {
  const [guess, setGuess] = useState({});
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);

  const isLevel3 = level === 3;

  const handleCheck = () => {
    let g;
    if (isLevel3) {
      g = { emf: parseFloat(guess.emf) || 0, r: parseFloat(guess.r) || 0 };
    } else {
      g = { r1: parseFloat(guess.r1) || 0, r2: parseFloat(guess.r2) || 0 };
    }
    const res = checkAnswer(level, puzzle, g);
    setResult(res);
    if (res.correct) setSolved(true);
  };

  const pedagogicalMessages = {
    1: "Nice work! That was straightforward with a resistance meter. But what if you didn't have one? Try Level 2 — same kind of box, but now you'll need to figure out the resistances using only voltage and current.",
    2: "Great — you figured out resistances without ever measuring them directly, just by using Ohm's law. Now for the real challenge: what if the box has its own power source? Try Level 3.",
    3: "Excellent! You identified both the hidden EMF and internal resistance using only external measurements. You've mastered the black box technique!",
  };

  if (solved) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Result</h2>
        <div className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          Correct! You solved it in {measurementCount} measurement{measurementCount !== 1 ? 's' : ''}.
          {level <= 2 && measurementCount <= 3 && <span className="block text-xs mt-1">Optimal — the minimum is 2–3 measurements.</span>}
          {level === 3 && measurementCount <= 2 && <span className="block text-xs mt-1">Optimal — the minimum is 2 measurements.</span>}
        </div>
        <RevealedCircuit level={level} puzzle={puzzle} />
        <p className="text-sm text-gray-600 italic leading-relaxed">{pedagogicalMessages[level]}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Check My Answer</h2>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-4">
          <p className="text-xs text-gray-400">Think you know what's inside? Enter your guess below.</p>

          <div className="grid grid-cols-2 gap-3">
            {isLevel3 ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Hidden EMF ε (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={guess.emf || ''}
                    onChange={e => setGuess(g => ({ ...g, emf: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. 4.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Hidden resistance r (Ω)</label>
                  <input
                    type="number"
                    step="1"
                    value={guess.r || ''}
                    onChange={e => setGuess(g => ({ ...g, r: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. 47"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">R₁ (Ω) — between A and B</label>
                  <input
                    type="number"
                    step="1"
                    value={guess.r1 || ''}
                    onChange={e => setGuess(g => ({ ...g, r1: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. 330"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">R₂ (Ω) — between B and C</label>
                  <input
                    type="number"
                    step="1"
                    value={guess.r2 || ''}
                    onChange={e => setGuess(g => ({ ...g, r2: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. 470"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCheck}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Check Answer
            </button>
            <button
              onClick={() => setRevealed(true)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Reveal
            </button>
          </div>

          {result && !result.correct && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              Not quite right. Keep measuring and try again!
              {isLevel3 ? (
                <span className="block mt-1 text-xs text-red-500">
                  (ε: {result.emfOk ? '✓' : '✗'}, r: {result.rOk ? '✓' : '✗'})
                </span>
              ) : (
                <span className="block mt-1 text-xs text-red-500">
                  (R₁: {result.r1ok ? '✓' : '✗'}, R₂: {result.r2ok ? '✓' : '✗'})
                </span>
              )}
            </div>
          )}

          {revealed && (
            <div className="space-y-3">
              <div className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm">
                Answer revealed — try a new puzzle to test yourself!
              </div>
              <RevealedCircuit level={level} puzzle={puzzle} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RevealedCircuit({ level, puzzle }) {
  const isLevel3 = level === 3;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Hidden Circuit</p>
      <svg viewBox="0 0 400 80" className="w-full">
        {isLevel3 ? (
          <>
            <circle cx="30" cy="40" r="8" fill="#dc2626" />
            <text x="30" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">+</text>
            <line x1="38" y1="40" x2="100" y2="40" stroke="#374151" strokeWidth="2" />

            <line x1="120" y1="25" x2="120" y2="55" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="130" y1="30" x2="130" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="125" y="18" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="500">{puzzle.emf} V</text>
            <line x1="100" y1="40" x2="120" y2="40" stroke="#374151" strokeWidth="2" />
            <line x1="130" y1="40" x2="200" y2="40" stroke="#374151" strokeWidth="2" />

            <polyline
              points="220,40 225,28 235,52 245,28 255,52 265,28 275,52 280,40"
              fill="none" stroke="#6366f1" strokeWidth="2"
            />
            <text x="250" y="18" textAnchor="middle" fill="#4338ca" fontSize="10" fontWeight="500">{puzzle.r} Ω</text>
            <line x1="200" y1="40" x2="220" y2="40" stroke="#374151" strokeWidth="2" />
            <line x1="280" y1="40" x2="340" y2="40" stroke="#374151" strokeWidth="2" />

            <circle cx="370" cy="40" r="8" fill="#2563eb" />
            <text x="370" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">−</text>
            <line x1="340" y1="40" x2="362" y2="40" stroke="#374151" strokeWidth="2" />
          </>
        ) : (
          <>
            <circle cx="30" cy="40" r="8" fill="#dc2626" />
            <text x="30" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">A</text>
            <line x1="38" y1="40" x2="80" y2="40" stroke="#374151" strokeWidth="2" />

            <polyline
              points="80,40 85,28 95,52 105,28 115,52 125,28 135,52 140,40"
              fill="none" stroke="#6366f1" strokeWidth="2"
            />
            <text x="110" y="18" textAnchor="middle" fill="#4338ca" fontSize="10" fontWeight="500">{puzzle.r1} Ω</text>
            <line x1="140" y1="40" x2="180" y2="40" stroke="#374151" strokeWidth="2" />

            <circle cx="200" cy="40" r="8" fill="#f59e0b" />
            <text x="200" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">B</text>
            <line x1="208" y1="40" x2="240" y2="40" stroke="#374151" strokeWidth="2" />

            <polyline
              points="240,40 245,28 255,52 265,28 275,52 285,28 295,52 300,40"
              fill="none" stroke="#6366f1" strokeWidth="2"
            />
            <text x="270" y="18" textAnchor="middle" fill="#4338ca" fontSize="10" fontWeight="500">{puzzle.r2} Ω</text>
            <line x1="300" y1="40" x2="340" y2="40" stroke="#374151" strokeWidth="2" />

            <circle cx="370" cy="40" r="8" fill="#2563eb" />
            <text x="370" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C</text>
            <line x1="340" y1="40" x2="362" y2="40" stroke="#374151" strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
}
