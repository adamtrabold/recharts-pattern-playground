import React from 'react';
import { usePalette } from '../context/PaletteContext';
import { swatchBackgroundCSS, getSlotDescription } from '../utils/patternGenerator';

export function SlotList() {
  const { state, updateUI, getActiveSlot } = usePalette();
  const { selectedSlot } = state.ui;

  const handleSlotClick = (index) => {
    updateUI({ selectedSlot: index });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(7, index + 1);
      updateUI({ selectedSlot: next });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(0, index - 1);
      updateUI({ selectedSlot: prev });
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateUI({ selectedSlot: 0 });
    } else if (e.key === 'End') {
      e.preventDefault();
      updateUI({ selectedSlot: 7 });
    }
  };

  return (
    <div 
      className="slot-list" 
      role="listbox" 
      aria-label="Palette slots"
      aria-activedescendant={`slot-option-${selectedSlot}`}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
        const slot = getActiveSlot(index);
        const isSelected = selectedSlot === index;
        const version = state.ui.activeVersions[index];
        
        return (
          <div
            key={index}
            id={`slot-option-${index}`}
            role="option"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className={`slot-option ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSlotClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div 
              className="slot-swatch"
              style={swatchBackgroundCSS(slot)}
            />
            <div className="slot-info">
              <span className="slot-label">{slot.label}</span>
              <span className="slot-description">{getSlotDescription(slot)}</span>
            </div>
            {version === 'b' && <span className="slot-version-badge">B</span>}
          </div>
        );
      })}
    </div>
  );
}

export default SlotList;
