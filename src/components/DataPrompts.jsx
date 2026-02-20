import { useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import styles from './DataPrompts.module.css';

const PROMPTS = [
  'Which species reached its highest population first?',
  'Did any species go extinct? What might have caused it?',
  'Do you see a pattern where one species rises when another falls?',
  'How long did it take for the ecosystem to stabilise (or did it)?',
  'If you added an invader, which species was affected most?',
];

export function DataPrompts() {
  const [open, setOpen] = useState(false);
  const currentTick = useSimulationStore((s) => s.currentTick);
  const maxTicks = useSimulationStore((s) => s.maxTicks);
  const hasRun = currentTick > 0;

  if (!hasRun) return null;

  return (
    <div className={styles.prompts}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        Questions to think about
        <span className={styles.chevron}>{open ? '▼' : '▶'}</span>
      </button>
      {open && (
        <ul className={styles.list}>
          {PROMPTS.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
