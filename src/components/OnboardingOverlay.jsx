import { useState, useEffect } from 'react';
import styles from './OnboardingOverlay.module.css';

const STORAGE_KEY = 'foodChain_hasSeenOnboarding';

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-labelledby="onboarding-title">
      <div className={styles.content}>
        <h2 id="onboarding-title">Welcome to the Food Chain Simulation!</h2>
        <p>
          Build your ecosystem! Pick species from the sidebar, press Play, and watch
          populations change over time. Use the <strong>Quick start</strong> buttons
          to try Ocean Starter or Australian Bush.
        </p>
        <button type="button" className={styles.dismissBtn} onClick={dismiss}>
          Get started
        </button>
      </div>
    </div>
  );
}
