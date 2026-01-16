import React from 'react';
import SlotList from './SlotList';
import PatternControls from './PatternControls';
import ChartSettings from './ChartSettings';
import ExportPanel from './ExportPanel';

export function PaletteEditor() {
  return (
    <div className="controls-sidebar">
      <aside className="controls-panel">
        <div className="controls-header">
          <h2>Palette</h2>
        </div>

        <SlotList />
        <PatternControls />
      </aside>

      <ChartSettings />

      <ExportPanel />
    </div>
  );
}

export default PaletteEditor;
