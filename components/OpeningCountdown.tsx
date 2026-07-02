interface OpeningCountdownProps {
  remainingMs: number;
  totalDurationMs: number;
  opensAt: number;
}

export default function OpeningCountdown({
  remainingMs,
  totalDurationMs,
  opensAt,
}: OpeningCountdownProps) {
  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const seconds = String(remainingSeconds % 60).padStart(2, '0');
  const elapsedPercent = totalDurationMs > 0
    ? Math.min(100, Math.max(0, ((totalDurationMs - remainingMs) / totalDurationMs) * 100))
    : 100;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-[#3f688e] mb-2">
        Selection portal opens in
      </p>
      <div
        role="timer"
        aria-live="polite"
        aria-label={`${remainingSeconds} seconds until selection opens`}
        className="font-mono text-5xl font-bold tracking-widest text-[#003366] tabular-nums"
      >
        {minutes}:{seconds}
      </div>
      <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#3f688e] transition-[width] duration-300"
          style={{ width: `${elapsedPercent}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-gray-600">
        Scheduled opening: <span className="font-bold text-[#003366]">
          {new Date(opensAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </p>
    </div>
  );
}
