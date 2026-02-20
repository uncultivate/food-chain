import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { PopulationChart } from './PopulationChart';
import { TrophicPyramid } from './TrophicPyramid';
import { DataPrompts } from './DataPrompts';
import { ECOSYSTEMS } from '../simulation/ecosystems';
import styles from './SimulationView.module.css';

export function SimulationView() {
  const {
    ecosystem,
    currentTick,
    maxTicks,
    isPlaying,
    speed,
    runOneTick,
    play,
    pause,
    reset,
    getCurrentPopulations,
    getPopulationTrends,
  } = useSimulationStore();

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const delay = 1000 / speed;
    intervalRef.current = setInterval(() => {
      runOneTick();
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, runOneTick]);

  const populations = getCurrentPopulations();
  const trends = getPopulationTrends();
  const eco = ECOSYSTEMS[ecosystem];

  return (
    <div className={styles.simulation}>
      <div className={styles.header}>
        <h1>{eco.name} Food Web Simulation</h1>
        <div className={styles.headerRight}>
          <div className={styles.controls}>
          <button onClick={play} disabled={isPlaying} aria-label="Play simulation">
            Play
          </button>
          <button onClick={pause} disabled={!isPlaying} aria-label="Pause simulation">
            Pause
          </button>
          <button onClick={reset}>Start Over</button>
          <span className={styles.speed}>
            Speed:{' '}
            <select
              value={String(speed)}
              onChange={(e) => useSimulationStore.setState({ speed: Number(e.target.value) })}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="5">5x</option>
            </select>
          </span>
        </div>
        </div>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.progress}>
          Tick {currentTick} / {maxTicks}
        </span>
        {!isPlaying && currentTick === maxTicks && currentTick > 0 && populations.length > 0 && (
          populations.every((p) => p.population >= 1) ? (
            <span className={styles.successIndicator}>
              All species survived! Your ecosystem is healthy.
            </span>
          ) : (
            <span className={styles.extinctIndicator}>
              Some species went extinct.
            </span>
          )
        )}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.chart}>
          <PopulationChart />
          <DataPrompts />
        </div>
        <div className={styles.pyramidContainer}>
          <TrophicPyramid />
        </div>
      </div>

      <div className={styles.populations}>
        <h3>Current Populations</h3>
        <div className={styles.popGrid}>
          {populations.map((p) => {
            const trend = trends[p.id];
            return (
              <div key={p.id} className={styles.popItem} data-trend={trend}>
                <span className={styles.popName}>{p.name}</span>
                <span className={styles.popVal}>
                  {p.population.toFixed(1)}
                  {trend === 'up' && <span className={styles.trend} aria-label="increasing">↑</span>}
                  {trend === 'down' && <span className={styles.trend} aria-label="decreasing">↓</span>}
                  {trend === 'stable' && <span className={styles.trend} aria-label="stable">→</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
