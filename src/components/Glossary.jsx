import { useState } from 'react';
import styles from './Glossary.module.css';

const TERMS = {
  producer: 'Organisms that make their own food from sunlight (e.g. plants, plankton, seaweed).',
  consumer: 'Animals that eat other organisms for energy. Herbivores eat plants; carnivores eat other animals.',
  trophic: 'A trophic level is a step in the food chain. Producers are level 0; apex predators are at the top.',
  equilibrium: 'When populations stay roughly the same over time because births and deaths balance out.',
  invasive: 'A species introduced to a new area that can harm the existing ecosystem.',
};

export function Glossary({ children, term }) {
  const [open, setOpen] = useState(false);
  const definition = TERMS[term];

  if (!definition) return children;

  return (
    <span className={styles.glossary}>
      <span
        className={styles.term}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      >
        {children}
      </span>
      {open && (
        <span className={styles.definition} role="tooltip">
          {definition}
        </span>
      )}
    </span>
  );
}
