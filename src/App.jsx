import { useState, useCallback, useMemo } from 'react';
import { getPuzzle } from './physics';
import LevelSelector from './components/LevelSelector';
import Workspace from './components/Workspace';

export default function App() {
  const [level, setLevel] = useState(1);

  const teacherMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('teacher') === '1';
  }, []);

  const puzzle = getPuzzle(level);

  const handleLevelChange = useCallback((newLevel) => {
    setLevel(newLevel);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="8" rx="1" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="6" cy="8" r="1" fill="white" />
                <circle cx="10" cy="8" r="1" fill="white" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Black Box Circuit Lab</h1>
          </div>
        </div>
        <LevelSelector level={level} onChange={handleLevelChange} />
      </header>

      {teacherMode && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="px-4 py-3 rounded-lg bg-violet-50 border border-violet-200 text-violet-800 text-sm font-mono">
            <span className="font-semibold">Teacher mode</span>
            {' — '}
            {level === 4
              ? <>R₁ = {puzzle.r1} Ω, ε = {puzzle.emf} V, R₂ = {puzzle.r2} Ω</>
              : level === 3
              ? <>ε = {puzzle.emf} V, r = {puzzle.r} Ω</>
              : <>R₁ = {puzzle.r1} Ω, R₂ = {puzzle.r2} Ω</>
            }
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Workspace key={level} level={level} puzzle={puzzle} />
      </main>
    </div>
  );
}
