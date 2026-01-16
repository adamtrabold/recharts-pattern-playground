import React from 'react';
import { usePalette } from '../context/PaletteContext';
import SlotList from './SlotList';
import PatternControls from './PatternControls';
import ChartSettings from './ChartSettings';
import { writeClipboard } from '../utils/helpers';

export function PaletteEditor() {
  const { exportState, shareState, resetAll, importState } = usePalette();

  const handleExport = async () => {
    const json = exportState();
    const success = await writeClipboard(json);
    if (success) {
      alert('Palette copied to clipboard!');
    } else {
      // Fallback: show in a text area
      const textarea = document.createElement('textarea');
      textarea.value = json;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Palette copied to clipboard!');
    }
  };

  const handleShare = async () => {
    const url = shareState();
    const success = await writeClipboard(url);
    if (success) {
      alert('Share link copied to clipboard!');
    } else {
      alert('Could not copy link to clipboard.');
    }
  };

  const handleReset = () => {
    if (confirm('Reset all slots to defaults? This cannot be undone.')) {
      resetAll();
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importState(data);
      alert('Palette imported successfully!');
    } catch (err) {
      alert('Invalid JSON file.');
    }
    e.target.value = '';
  };

  return (
    <div className="controls-sidebar">
      <aside className="controls-panel">
        <div className="controls-header">
          <h2>Palette</h2>
          <div className="controls-actions">
            <button type="button" className="btn-sm" onClick={handleExport}>
              Export
            </button>
            <button type="button" className="btn-sm" onClick={handleShare}>
              Share
            </button>
            <button type="button" className="btn-sm danger" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <SlotList />
        <PatternControls />
      </aside>

      <ChartSettings />

      <details className="import-card">
        <summary className="import-card-header">Import / Export</summary>
        <div className="import-card-body">
          <div className="field">
            <label htmlFor="importFile">JSON file</label>
            <input
              id="importFile"
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
            />
          </div>
          <div className="field">
            <label htmlFor="importText">Paste JSON</label>
            <textarea
              id="importText"
              rows={3}
              spellCheck={false}
              placeholder="Paste palette JSON here..."
            />
          </div>
          <div className="import-actions">
            <button
              type="button"
              className="btn-sm"
              onClick={() => {
                const textarea = document.getElementById('importText');
                if (textarea?.value) {
                  try {
                    const data = JSON.parse(textarea.value);
                    importState(data);
                    alert('Palette imported successfully!');
                    textarea.value = '';
                  } catch {
                    alert('Invalid JSON.');
                  }
                }
              }}
            >
              Load JSON
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}

export default PaletteEditor;
