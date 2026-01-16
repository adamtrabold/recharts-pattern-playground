import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DESIGN_SYSTEM_COLORS, COLOR_FAMILIES, findColorName } from '../utils/designSystemColors';

/**
 * ColorPicker component with design system color palette
 * Shows a clickable swatch that opens a dropdown with approved colors
 */
export function ColorPicker({ value, onChange, id, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const swatchRef = useRef(null);

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

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = 320; // max-height
      const dropdownWidth = 300; // approximate width
      
      let top = rect.bottom + 4;
      let left = rect.left;
      
      // If dropdown would go below viewport, position above
      if (top + dropdownHeight > viewportHeight - 10) {
        top = rect.top - dropdownHeight - 4;
      }
      
      // If dropdown would go past right edge, align to right
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      
      // Ensure we don't go past left edge
      if (left < 10) {
        left = 10;
      }
      
      setDropdownPos({ top, left });
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
          ref={swatchRef}
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
        <div 
          className="color-picker-dropdown" 
          ref={dropdownRef} 
          role="listbox"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
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
