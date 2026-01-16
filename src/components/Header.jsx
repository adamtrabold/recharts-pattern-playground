import React from 'react';
import { usePalette } from '../context/PaletteContext';

export function Header() {
  const { state, updateUI } = usePalette();
  const { darkTheme, grayscale, lowContrast } = state.ui;

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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
