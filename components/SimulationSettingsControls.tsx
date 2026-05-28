'use client';
import type { ReactNode } from 'react';
import DifficultyCard from '@/components/DifficultyCard';
import { Difficulty, getWindowDuration, useSimStore } from '@/store/simStore';

interface SimulationSettingsControlsProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export default function SimulationSettingsControls({
  title = 'Simulation Settings',
  description = 'Choose how long the live section-selection window should stay open.',
  actions,
  className = '',
}: SimulationSettingsControlsProps) {
  const { difficulty, setDifficulty, customWindowTime, setCustomWindowTime } = useSimStore();
  const windowDuration = getWindowDuration(difficulty, customWindowTime);

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`.trim()}>
      <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          <span>Selection window</span>
          <span>{windowDuration}s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(['easy', 'normal', 'hard', 'custom'] as Difficulty[]).map((mode) => (
          <DifficultyCard
            key={mode}
            difficulty={mode}
            selected={difficulty === mode}
            onClick={() => setDifficulty(mode)}
          />
        ))}
      </div>

      {difficulty === 'custom' && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-slate-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-700">Duration (seconds)</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
              {customWindowTime}s
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={customWindowTime}
            onChange={(e) => setCustomWindowTime(Number(e.target.value))}
            className="w-full cursor-pointer accent-blue-600"
          />
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>1s (Impossible)</span>
            <span>30s (Very Relaxed)</span>
          </div>
        </div>
      )}

      {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}