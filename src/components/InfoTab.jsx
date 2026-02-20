import { useState } from 'react';
import { Glossary } from './Glossary';
import styles from './InfoTab.module.css';

function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className={styles.sectionIcon}>{icon}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.chevron}>{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className={styles.sectionContent}>{children}</div>}
    </section>
  );
}

function FoodChainDiagram() {
  return (
    <div className={styles.diagram} aria-hidden="true">
      <svg viewBox="0 0 280 120" className={styles.diagramSvg}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
          </marker>
        </defs>
        <rect x="20" y="40" width="60" height="40" rx="6" className={styles.diagramBox} />
        <text x="50" y="65" textAnchor="middle" className={styles.diagramText}>Sun + Plants</text>
        <text x="50" y="78" textAnchor="middle" className={styles.diagramLabel}>Producers</text>

        <line x1="90" y1="60" x2="120" y2="60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <rect x="130" y="40" width="60" height="40" rx="6" className={styles.diagramBox} />
        <text x="160" y="65" textAnchor="middle" className={styles.diagramText}>Herbivores</text>
        <text x="160" y="78" textAnchor="middle" className={styles.diagramLabel}>Primary Consumers</text>

        <line x1="200" y1="60" x2="230" y2="60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <rect x="230" y="40" width="50" height="40" rx="6" className={styles.diagramBox} />
        <text x="255" y="65" textAnchor="middle" className={styles.diagramText}>Predators</text>
        <text x="255" y="78" textAnchor="middle" className={styles.diagramLabel}>Apex</text>
      </svg>
    </div>
  );
}

export function InfoTab() {
  const [simpleMode, setSimpleMode] = useState(false);

  return (
    <div className={styles.info}>
      <div className={styles.header}>
        <h1>Learn About Food Chains</h1>
        <label className={styles.modeToggle}>
          <span className={styles.modeLabel}>Simple</span>
          <span className={styles.toggleWrap}>
            <input
              type="checkbox"
              checked={!simpleMode}
              onChange={() => setSimpleMode(!simpleMode)}
            />
            <span className={styles.toggleSlider} />
          </span>
          <span className={styles.modeLabel}>Detailed</span>
        </label>
      </div>

      <Section title="What is a Food Chain?" icon="🌿" defaultOpen={true}>
        <FoodChainDiagram />
        {simpleMode ? (
          <p>
            A food chain shows who eats whom. <Glossary term="producer">Producers</Glossary> (like plants and plankton)
            make food from sunlight. <Glossary term="consumer">Consumers</Glossary> (animals) eat other organisms.
            Apex predators are at the top—nothing eats them!
          </p>
        ) : (
          <p>
            A food chain describes how energy flows through an ecosystem. <Glossary term="producer">Primary producers</Glossary>—
            such as plankton, seaweed, or grasses—convert sunlight into energy. <Glossary term="consumer">Consumers</Glossary> obtain
            energy by eating other organisms: herbivores eat producers, carnivores eat other consumers.
            <Glossary term="trophic"> Trophic levels</Glossary> organise species by their position in the chain,
            with apex predators at the top (no natural predators).
          </p>
        )}
      </Section>

      <Section title="How the Simulation Works" icon="⚙️" defaultOpen={true}>
        <p>Choose an ecosystem, pick which species to include, and press Play. Each tick, the simulation runs:</p>
        <ul>
          <li>
            <strong>Grow</strong>: Producers grow toward a maximum (they get energy from sunlight).
          </li>
          <li>
            <strong>Eat</strong>: Consumers eat their prey proportionally. If a fish eats jellyfish and plankton,
            it takes more from whichever prey is more abundant.
          </li>
          <li>
            <strong>Starve</strong>: If there isn&apos;t enough food, the population drops by 20%.
          </li>
          <li>
            <strong>Die</strong>: All populations lose 5% each tick (natural death).
          </li>
        </ul>
      </Section>

      <Section title="Reading the Chart" icon="📊" defaultOpen={true}>
        <p>
          The line chart shows how each species&apos; population changes over time. The horizontal axis is time (ticks);
          the vertical axis is population. Look for patterns—do some species rise and fall together?
          When one drops, does another rise? That&apos;s the food chain in action!
        </p>
        {!simpleMode && (
          <p>
            Over time, many ecosystems reach <Glossary term="equilibrium">equilibrium</Glossary>—populations
            stabilise. Introducing an <Glossary term="invasive">invasive species</Glossary> can disrupt this balance.
          </p>
        )}
      </Section>

      <Section title="Try These Experiments" icon="🔬" defaultOpen={true}>
        <p>Test your predictions with the simulation:</p>
        <ul className={styles.experiments}>
          <li>What happens if you remove all sharks (or dingoes)?</li>
          <li>Add an invader and watch the chart—which species drops first?</li>
          <li>Does your ecosystem reach equilibrium? How long does it take?</li>
          <li>Try &quot;Full Web&quot; vs a simple chain—which is more stable?</li>
        </ul>
      </Section>
    </div>
  );
}
