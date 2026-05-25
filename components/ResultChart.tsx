'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { Attempt } from '@/store/simStore';

interface ResultChartProps {
  attempts: Attempt[];
}

function barColor(reactionMs: number, missed: boolean): string {
  if (missed) return '#9ca3af';
  const s = reactionMs / 1000;
  if (s < 10) return '#22c55e';
  if (s < 20) return '#f59e0b';
  return '#ef4444';
}

export default function ResultChart({ attempts }: ResultChartProps) {
  if (attempts.length < 2) return null;

  const data = attempts.map((a) => ({
    name: `#${a.attemptNumber}`,
    secs: a.section === null ? 0 : parseFloat((a.reactionMs / 1000).toFixed(1)),
    missed: a.section === null,
    raw: a,
  }));

  const completedAttempts = attempts.filter((a) => a.section !== null);
  const best = completedAttempts.length
    ? Math.min(...completedAttempts.map((a) => a.reactionMs / 1000))
    : null;

  return (
    <div className="w-full" style={{ height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="s" width={35} />
          <Tooltip
            formatter={(val: number, _: string, props: { payload?: { raw?: Attempt } }) => {
              const raw = props.payload?.raw;
              if (!raw) return [val + 's', 'Reaction'];
              return raw.section === null
                ? ['Missed', 'Result']
                : [val + 's', 'Reaction'];
            }}
          />
          {best !== null && (
            <ReferenceLine
              y={best}
              stroke="#6366f1"
              strokeDasharray="4 2"
              label={{ value: 'best', position: 'insideTopRight', fontSize: 10, fill: '#6366f1' }}
            />
          )}
          <Bar dataKey="secs" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColor(entry.raw.reactionMs, entry.missed)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
