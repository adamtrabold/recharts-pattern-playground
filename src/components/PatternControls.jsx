import React from 'react';
import { usePalette } from '../context/PaletteContext';
import { clamp } from '../utils/helpers';
import ColorPicker from './ColorPicker';

export function PatternControls() {
  const { state, updateSlot, updateSlotB, getActiveSlot, setActiveVersion, resetSlot, copySlot } = usePalette();
  const { selectedSlot, activeVersions } = state.ui;
  const currentVersion = activeVersions[selectedSlot];
  const slot = getActiveSlot(selectedSlot);

  const handleUpdate = (updates) => {
    if (currentVersion === 'b') {
      updateSlotB(selectedSlot, updates);
    } else {
      updateSlot(selectedSlot, updates);
    }
  };

  const handleModeChange = (e) => {
    const newType = e.target.value;
    if (newType === 'solid') {
      handleUpdate({
        type: 'solid',
        color: slot.backgroundColor || slot.color || '#999999',
      });
    } else {
      handleUpdate({
        type: 'pattern',
        backgroundColor: slot.color || '#ffffff',
        inkColor: '#000000',
        patternType: 'lines',
        spacing: 14,
        strokeWidth: 3,
        opacity: 0.8,
        angle: 45,
        invert: false,
        roundCaps: false,
      });
    }
  };

  const isPattern = slot.type === 'pattern';
  const isDots = isPattern && slot.patternType === 'dots';

  return (
    <form className="editor" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
      {/* Label and Mode */}
      <div className="editor-row">
        <div className="field">
          <label htmlFor="slotName">Label</label>
          <input
            id="slotName"
            type="text"
            maxLength={32}
            value={slot.label || ''}
            onChange={(e) => handleUpdate({ label: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="slotMode">Mode</label>
          <select
            id="slotMode"
            value={slot.type}
            onChange={handleModeChange}
          >
            <option value="solid">Solid</option>
            <option value="pattern">Pattern</option>
          </select>
        </div>
      </div>

      {/* Color inputs */}
      <div className="editor-row">
        {!isPattern && (
          <div className="field">
            <label htmlFor="solidColor">Color</label>
            <ColorPicker
              id="solidColor"
              value={slot.color || '#999999'}
              onChange={(color) => handleUpdate({ color })}
            />
          </div>
        )}
        {isPattern && (
          <>
            <div className="field">
              <label htmlFor="backgroundColor">Background</label>
              <ColorPicker
                id="backgroundColor"
                value={slot.backgroundColor || '#ffffff'}
                onChange={(color) => handleUpdate({ backgroundColor: color })}
              />
            </div>
            <div className="field">
              <label htmlFor="inkColor">Ink</label>
              <ColorPicker
                id="inkColor"
                value={slot.inkColor || '#000000'}
                onChange={(color) => handleUpdate({ inkColor: color })}
              />
            </div>
          </>
        )}
      </div>

      {/* Pattern Type & Options */}
      {isPattern && (
        <>
          <div className="editor-row">
            <div className="field">
              <label htmlFor="patternType">Pattern</label>
              <select
                id="patternType"
                value={slot.patternType}
                onChange={(e) => handleUpdate({ patternType: e.target.value })}
              >
                <option value="lines">Lines</option>
                <option value="crosshatch">Crosshatch</option>
                <option value="dots">Dots</option>
              </select>
            </div>
            <div className="field field-grow">
              <label htmlFor="opacity">Opacity</label>
              <div className="range-input-combo">
                <input
                  id="opacity"
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={slot.opacity || 0.8}
                  onChange={(e) => handleUpdate({ opacity: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={5}
                  max={100}
                  step={5}
                  value={Math.round((slot.opacity || 0.8) * 100)}
                  onChange={(e) => handleUpdate({ opacity: clamp(Number(e.target.value) / 100, 0.05, 1) })}
                />
                <span className="unit">%</span>
              </div>
            </div>
          </div>

          {/* Spacing & Stroke */}
          <div className="editor-row">
            <div className="field">
              <label htmlFor="spacing">Spacing</label>
              <div className="range-input-combo">
                <input
                  id="spacing"
                  type="range"
                  min="4"
                  max="40"
                  step="1"
                  value={slot.spacing || 14}
                  onChange={(e) => handleUpdate({ spacing: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={4}
                  max={40}
                  step={1}
                  value={slot.spacing || 14}
                  onChange={(e) => handleUpdate({ spacing: clamp(Number(e.target.value), 4, 40) })}
                />
                <span className="unit">px</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="strokeWidth">{isDots ? 'Size' : 'Stroke'}</label>
              <div className="range-input-combo">
                <input
                  id="strokeWidth"
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={slot.strokeWidth || 3}
                  onChange={(e) => handleUpdate({ strokeWidth: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={1}
                  max={12}
                  step={1}
                  value={slot.strokeWidth || 3}
                  onChange={(e) => handleUpdate({ strokeWidth: clamp(Number(e.target.value), 1, 12) })}
                />
                <span className="unit">px</span>
              </div>
            </div>
          </div>

          {/* Angle (for lines/crosshatch) */}
          {!isDots && (
            <div className="editor-row">
              <div className="field field-full">
                <label htmlFor="angle">Angle</label>
                <div className="angle-control">
                  <div className="range-input-combo">
                    <input
                      id="angle"
                      type="range"
                      min="0"
                      max="180"
                      step="5"
                      value={slot.angle || 0}
                      onChange={(e) => handleUpdate({ angle: Number(e.target.value) })}
                    />
                    <input
                      type="number"
                      className="num-input"
                      min={0}
                      max={180}
                      step={5}
                      value={slot.angle || 0}
                      onChange={(e) => handleUpdate({ angle: clamp(Number(e.target.value), 0, 180) })}
                    />
                    <span className="unit">°</span>
                  </div>
                  <div className="snap-buttons">
                    {[0, 45, 90, 135, 180].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleUpdate({ angle: val })}
                        className={slot.angle === val ? 'active' : ''}
                      >
                        {val}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dots-specific options */}
          {isDots && (
            <div className="editor-row">
              <div className="field">
                <label htmlFor="dotShape">Shape</label>
                <select
                  id="dotShape"
                  value={slot.dotShape || 'circle'}
                  onChange={(e) => handleUpdate({ dotShape: e.target.value })}
                >
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="diamond">Diamond</option>
                </select>
              </div>
              <div className="field icon-toggles">
                <label>Style</label>
                <div className="toggle-row">
                  <button
                    type="button"
                    className={`icon-toggle labeled ${slot.dotStaggered ? 'active' : ''}`}
                    onClick={() => handleUpdate({ dotStaggered: !slot.dotStaggered })}
                  >
                    <span>Stagger</span>
                  </button>
                  <button
                    type="button"
                    className={`icon-toggle labeled ${slot.invert ? 'active' : ''}`}
                    onClick={() => handleUpdate({ invert: !slot.invert })}
                  >
                    <span>Invert</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Style toggles for lines/crosshatch */}
          {!isDots && (
            <div className="editor-row">
              <div className="field icon-toggles">
                <label>Style</label>
                <div className="toggle-row">
                  <button
                    type="button"
                    className={`icon-toggle labeled ${slot.invert ? 'active' : ''}`}
                    onClick={() => handleUpdate({ invert: !slot.invert })}
                  >
                    <span>Invert</span>
                  </button>
                  <button
                    type="button"
                    className={`icon-toggle labeled ${slot.roundCaps ? 'active' : ''}`}
                    onClick={() => handleUpdate({ roundCaps: !slot.roundCaps })}
                  >
                    <span>Round</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Version Controls */}
      <div className="editor-section version-section">
        <div className="version-controls">
          <div className="ab-toggle">
            <button
              type="button"
              className={`ab-btn ${currentVersion === 'a' ? 'active' : ''}`}
              onClick={() => setActiveVersion(selectedSlot, 'a')}
            >
              A
            </button>
            <button
              type="button"
              className={`ab-btn ${currentVersion === 'b' ? 'active' : ''}`}
              onClick={() => setActiveVersion(selectedSlot, 'b')}
            >
              B
            </button>
          </div>
          <div className="version-actions">
            <button
              type="button"
              className="btn-sm ghost"
              onClick={() => {
                const sourceSlot = state.palette[selectedSlot];
                updateSlotB(selectedSlot, { ...sourceSlot });
              }}
            >
              A→B
            </button>
            <button
              type="button"
              className="btn-sm ghost"
              onClick={() => {
                const sourceSlot = state.paletteB[selectedSlot];
                updateSlot(selectedSlot, { ...sourceSlot });
              }}
            >
              B→A
            </button>
          </div>
        </div>
        <button
          type="button"
          className="btn-sm ghost"
          onClick={() => resetSlot(selectedSlot, currentVersion)}
        >
          Reset
        </button>
      </div>

      {/* Copy to Other Slots */}
      <div className="editor-section copy-section">
        <span className="copy-label">Copy to</span>
        <div className="copy-targets" role="group" aria-label="Copy to slot">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((targetIndex) => (
            <button
              key={targetIndex}
              type="button"
              className={`copy-btn ${targetIndex === selectedSlot ? 'current' : ''}`}
              disabled={targetIndex === selectedSlot}
              onClick={() => copySlot(selectedSlot, targetIndex, currentVersion)}
            >
              {targetIndex + 1}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

export default PatternControls;
