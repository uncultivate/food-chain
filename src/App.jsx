import { useState, useEffect } from 'react';
import { useSimulationStore } from './store/simulationStore';
import { Sidebar } from './components/Sidebar';
import { SimulationView } from './components/SimulationView';
import { InfoTab } from './components/InfoTab';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import styles from './App.module.css';

const TABS = [
  { id: 'simulation', label: 'Simulation' },
  { id: 'info', label: 'Info' },
];

const THEME_KEY = 'foodChain_theme';

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('simulation');
  const [theme, setTheme] = useState(getStoredTheme);
  const ecosystem = useSimulationStore((s) => s.ecosystem);
  const reset = useSimulationStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  return (
    <div className={styles.app} data-ecosystem={ecosystem}>
      <OnboardingOverlay />
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <label className={styles.themeToggle}>
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')}
            />
            <span className={styles.themeLabel}>Light</span>
          </label>
        </div>
        <div className={styles.content}>
          {activeTab === 'simulation' && <SimulationView />}
          {activeTab === 'info' && <InfoTab />}
        </div>
      </main>
    </div>
  );
}
