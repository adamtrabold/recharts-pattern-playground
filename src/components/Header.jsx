import React from 'react';
import { usePalette } from '../context/PaletteContext';

export function Header() {
  const { state, updateUI, resetAll } = usePalette();
  const { darkTheme, grayscale, lowContrast } = state.ui;

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults? This will clear your saved palette and chart settings.')) {
      resetAll();
      // Also clear the URL hash if present
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <div className="header-row">
          <h1 className="title">Recharts Pattern Playground</h1>
          <div className="header-actions" role="group" aria-label="View toggles">
            <label className="toggle">
              <input
                type="checkbox"
                checked={darkTheme}
                onChange={(e) => updateUI({ darkTheme: e.target.checked })}
              />
              <span>Dark</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={grayscale}
                onChange={(e) => updateUI({ grayscale: e.target.checked })}
              />
              <span>Grayscale</span>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={lowContrast}
                onChange={(e) => updateUI({ lowContrast: e.target.checked })}
              />
              <span>Low contrast</span>
            </label>
            <button 
              type="button" 
              className="reset-btn"
              onClick={handleReset}
              title="Reset all settings to defaults"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
