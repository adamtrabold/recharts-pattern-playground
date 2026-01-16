import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DESIGN_SYSTEM_COLORS, COLOR_FAMILIES, findColorName } from '../utils/designSystemColors';

/**
 * ColorPicker component with design system color palette
 * Shows a clickable swatch that opens a dropdown with approved colors
 */
export function ColorPicker({ value, onChange, id, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Normalize the hex value
  const normalizedValue = (value || '').replace('#', '').toUpperCase();
  const displayHex = normalizedValue || '';
  const colorName = findColorName(value);

  // Sync input value when external value changes
  useEffect(() => {
    setInputValue(displayHex);
  }, [displayHex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  // Handle color selection from dropdown
  const handleSelectColor = (color) => {
    onChange('#' + color.hex.replace('#', ''));
    setInputValue(color.hex.replace('#', '').toUpperCase());
    setIsOpen(false);
  };

  // Handle manual hex input
  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setInputValue(newValue.toUpperCase());
  };

  // Apply the manual input on blur or enter
  const applyInputValue = () => {
    if (inputValue && inputValue.length >= 3) {
      onChange('#' + inputValue);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyInputValue();
      e.target.blur();
    }
  };

  return (
    <div className="color-picker" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && <label htmlFor={id}>{label}</label>}
      
      <div className="color-picker-input-row">
        {/* Clickable color swatch */}
        <button
          type="button"
          className="color-swatch-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          style={{ backgroundColor: value || '#ffffff' }}
          title={colorName || 'Select color'}
        >
          <span className="sr-only">Select color</span>
        </button>

        {/* Hex input field */}
        <div className="hex-input">
          <span className="hash">#</span>
          <input
            id={id}
            type="text"
            maxLength={6}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={applyInputValue}
            onKeyDown={handleInputKeyDown}
            placeholder="000000"
          />
        </div>
      </div>

      {/* Design system name display */}
      {colorName && (
        <span className="color-token-name">{colorName}</span>
      )}

      {/* Color dropdown */}
      {isOpen && (
        <div className="color-picker-dropdown" ref={dropdownRef} role="listbox">
          {Object.entries(COLOR_FAMILIES).map(([familyName, colors]) => (
            <div key={familyName} className="color-family">
              <div className="color-family-name">{familyName}</div>
              <div className="color-family-swatches">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`color-option ${normalizedValue === color.hex.replace('#', '').toUpperCase() ? 'selected' : ''}`}
                    onClick={() => handleSelectColor(color)}
                    role="option"
                    aria-selected={normalizedValue === color.hex.replace('#', '').toUpperCase()}
                    title={`${color.name}: ${color.hex}`}
                  >
                    <span 
                      className="color-option-swatch" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="color-option-name">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
