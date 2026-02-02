import React from 'react';
import SlotList from './SlotList';
import PatternControls from './PatternControls';
import ChartSettings from './ChartSettings';
import ExportPanel from './ExportPanel';
import { usePalette } from '../context/PaletteContext';
import { MAX_SLOTS } from '../utils/storage';

export function PaletteEditor() {
  const { state, addSlot } = usePalette();
  const slotCount = state.palette.length;
  const canAddSlot = slotCount < MAX_SLOTS;

  return (
    <div className="controls-sidebar">
      <aside className="controls-panel">
        <div className="controls-header">
          <h2>Palette</h2>
          {canAddSlot && (
            <button
              type="button"
              className="add-slot-btn"
              onClick={addSlot}
              aria-label="Add new slot"
              title="Add slot"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
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
