import { useEffect, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { ECOSYSTEMS } from '../simulation/ecosystems';
import styles from './Sidebar.module.css';

const PRESETS = [
  {
    id: 'oceanStarter',
    label: 'Ocean Starter',
    ecosystem: 'ocean',
    species: ['plankton', 'fish'],
  },
  {
    id: 'ausBush',
    label: 'Australian Bush',
    ecosystem: 'ausNative',
    species: ['grasses', 'kangaroo', 'dingo'],
  },
  {
    id: 'fullWeb',
    label: 'Full Web',
    ecosystem: null,
    species: null,
  },
];

export function Sidebar() {
  const {
    ecosystem,
    selectedSpecies,
    maxTicks,
    invaderEnabled,
    invaderSpecies,
    invaderPopulation,
    setEcosystem,
    setSelectedSpecies,
    setMaxTicks,
    setInvaderEnabled,
    setInvaderSpecies,
    setInvaderPopulation,
    reset,
  } = useSimulationStore();

  const [invaderTooltip, setInvaderTooltip] = useState(false);

  const eco = ECOSYSTEMS[ecosystem];
  const speciesOptions = eco.organisms.map((o) => ({ id: o.id, name: o.name }));
  const invaderOptions = speciesOptions.filter((s) => !selectedSpecies.includes(s.id));

  useEffect(() => {
    if (!invaderEnabled) return;
    if (invaderOptions.length === 0) {
      setInvaderSpecies(null);
    } else if (invaderSpecies && selectedSpecies.includes(invaderSpecies)) {
      setInvaderSpecies(invaderOptions[0]?.id ?? null);
    } else if (!invaderOptions.some((s) => s.id === invaderSpecies)) {
      setInvaderSpecies(invaderOptions[0]?.id ?? null);
    }
  }, [invaderEnabled, invaderSpecies, selectedSpecies, invaderOptions, setInvaderSpecies]);

  const toggleSpecies = (id) => {
    if (selectedSpecies.includes(id)) {
      setSelectedSpecies(selectedSpecies.filter((s) => s !== id));
    } else {
      setSelectedSpecies([...selectedSpecies, id]);
    }
  };

  const applyPreset = (preset) => {
    if (preset.id === 'fullWeb') {
      setSelectedSpecies(eco.organisms.map((o) => o.id));
    } else {
      if (preset.ecosystem) setEcosystem(preset.ecosystem);
      if (preset.species) setSelectedSpecies(preset.species);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h2>Controls</h2>

      <div className={styles.field}>
        <label>Quick start</label>
        <div className={styles.presets}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.presetBtn}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label>Ecosystem</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="ecosystem"
              value="ocean"
              checked={ecosystem === 'ocean'}
              onChange={() => setEcosystem('ocean')}
            />
            Ocean
          </label>
          <label>
            <input
              type="radio"
              name="ecosystem"
              value="ausNative"
              checked={ecosystem === 'ausNative'}
              onChange={() => setEcosystem('ausNative')}
            />
            Australian Native
          </label>
        </div>
      </div>

      <div className={styles.field}>
        <label>Species</label>
        <div className={styles.checkboxList}>
          {speciesOptions.map((s) => (
            <label key={s.id} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedSpecies.includes(s.id)}
                onChange={() => toggleSpecies(s.id)}
              />
              <span>{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label>How long to run? {maxTicks} ticks</label>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={maxTicks}
          onChange={(e) => setMaxTicks(Number(e.target.value))}
        />
      </div>

      <div className={styles.field}>
        <label
          className={styles.invaderLabel}
          onMouseEnter={() => setInvaderTooltip(true)}
          onMouseLeave={() => setInvaderTooltip(false)}
        >
          <input
            type="checkbox"
            checked={invaderEnabled}
            onChange={(e) => setInvaderEnabled(e.target.checked)}
          />
          Add invasive species
          <span className={styles.helpIcon} aria-label="What is an invasive species?">
            ?
          </span>
          {invaderTooltip && (
            <span className={styles.invaderHint}>
              An invasive species arrives halfway through—watch how it affects the ecosystem!
            </span>
          )}
        </label>
      </div>

      {invaderEnabled && (
        <>
          <div className={styles.field}>
            <label>Invasive species</label>
            {invaderOptions.length > 0 ? (
              <select
                value={invaderOptions.some((s) => s.id === invaderSpecies) ? invaderSpecies : invaderOptions[0]?.id ?? ''}
                onChange={(e) => setInvaderSpecies(e.target.value)}
              >
                {invaderOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className={styles.muted}>No species available (all selected)</span>
            )}
          </div>
          <div className={styles.field}>
            <label>Starting population of invader: {invaderPopulation}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={invaderPopulation}
              onChange={(e) => setInvaderPopulation(Number(e.target.value))}
            />
          </div>
        </>
      )}

      <button className={styles.resetBtn} onClick={reset}>
        Start Over
      </button>
    </aside>
  );
}
