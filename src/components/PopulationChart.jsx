import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSimulationStore } from '../store/simulationStore';
import styles from './PopulationChart.module.css';

const COLORS = [
  '#0ea5e9',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

export function PopulationChart() {
  const organisms = useSimulationStore((s) => s.organisms);
  const currentTick = useSimulationStore((s) => s.currentTick);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let data = [];
  let seriesKeys = [];
  try {
    data = useSimulationStore.getState().getChartData();
    seriesKeys = data.length > 0 ? Object.keys(data[0]).filter((k) => k !== 'time') : [];
  } catch (err) {
    console.error('[PopulationChart] getChartData error:', err);
  }

  if (seriesKeys.length === 0 || data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Select species and press Play to run the simulation</p>
      </div>
    );
  }

  return (
    <div className={styles.chartWrapper}>
      <p className={styles.caption}>
        This graph shows how each species&apos; population changes over time. Look for patterns—do some species rise and fall together?
      </p>
      <div className={styles.chartInner}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #334155)" />
            <XAxis
              dataKey="time"
              stroke="var(--text-muted, #94a3b8)"
            />
            <YAxis
              yAxisId="left"
              stroke="var(--text-muted, #94a3b8)"
              label={{ value: 'Population', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }}
            />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted, #94a3b8)" />
        <Tooltip
          contentStyle={{
            background: 'var(--card-bg, #1e293b)',
            border: '1px solid var(--border, #334155)',
            borderRadius: 8,
          }}
          labelStyle={{ color: 'var(--text, #e2e8f0)' }}
          formatter={(value, name) => [Math.round(Number(value) || 0), name]}
        />
        <Legend />
        {seriesKeys.map((name, i) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            yAxisId="left"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reducedMotion}
          />
        ))}
        {/* Invisible line to populate right Y-axis with same scale */}
        <Line
          type="monotone"
          dataKey={seriesKeys[0]}
          yAxisId="right"
          stroke="transparent"
          strokeWidth={0}
          dot={false}
          isAnimationActive={false}
          legendType="none"
        />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
