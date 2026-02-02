import React from 'react';
import { usePalette } from '../context/PaletteContext';
import { clamp } from '../utils/helpers';
import ColorPicker from './ColorPicker';
import { CHART_DEFAULTS } from '../utils/chartDefaults';

// Reusable toggle switch component
function ToggleSwitch({ id, checked, onChange, label }) {
  return (
    <label className="cs-switch" htmlFor={id}>
      <span className="cs-switch-label">{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="cs-switch-track">
        <span className="cs-switch-thumb" />
      </span>
      <span className="cs-switch-state">{checked ? 'On' : 'Off'}</span>
    </label>
  );
}

export function ChartSettings() {
  const { state, updateChartSettings, triggerAnimationPreview } = usePalette();
  const { global, gap, columnBar, line, area, pie, donut, funnel, stacked, axis, legend, referenceLine, brush, animation, grid, tooltip } = state.chartSettings;

  // Helper to update nested applyTo object
  const updateGapApplyTo = (chartType, value) => {
    updateChartSettings('gap', { 
      applyTo: { ...gap?.applyTo, [chartType]: value } 
    });
  };

  // Helper to update synced thickness values (gap, line, area)
  const isSyncEnabled = gap?.syncThickness ?? false;
  const isMarkerSyncEnabled = gap?.syncMarkers ?? false;
  
  // Compute effective marker state for each chart type
  const getEffectiveMarkerEnabled = (override) => {
    if (override === null || override === undefined) return global.markersEnabled;
    return override;
  };
  const lineMarkersEnabled = getEffectiveMarkerEnabled(line.markerOverride);
  const areaMarkersEnabled = getEffectiveMarkerEnabled(area.markerOverride);
  
  const updateSyncedThickness = (value) => {
    // Clamp to valid range for all (1-8 is the common range)
    const clamped = clamp(value, 1, 8);
    updateChartSettings('gap', { thickness: clamped });
    updateChartSettings('line', { lineWidth: clamped });
    updateChartSettings('area', { lineWidth: clamped });
  };

  const handleGapThicknessChange = (value) => {
    if (isSyncEnabled) {
      updateSyncedThickness(value);
    } else {
      updateChartSettings('gap', { thickness: clamp(value, 1, 10) });
    }
  };

  const handleLineWidthChange = (value) => {
    if (isSyncEnabled) {
      updateSyncedThickness(value);
    } else {
      updateChartSettings('line', { lineWidth: clamp(value, 1, 8) });
    }
  };

  const handleAreaLineWidthChange = (value) => {
    if (isSyncEnabled) {
      updateSyncedThickness(value);
    } else {
      updateChartSettings('area', { lineWidth: clamp(value, 0, 8) });
    }
  };

  // Synced marker override handlers
  const handleLineMarkerOverrideChange = (value) => {
    const override = value === 'global' ? null : value === 'on';
    if (isMarkerSyncEnabled) {
      updateChartSettings('line', { markerOverride: override });
      updateChartSettings('area', { markerOverride: override });
    } else {
      updateChartSettings('line', { markerOverride: override });
    }
  };

  const handleAreaMarkerOverrideChange = (value) => {
    const override = value === 'global' ? null : value === 'on';
    if (isMarkerSyncEnabled) {
      updateChartSettings('line', { markerOverride: override });
      updateChartSettings('area', { markerOverride: override });
    } else {
      updateChartSettings('area', { markerOverride: override });
    }
  };

  const handleLineMarkerRadiusChange = (value) => {
    const clamped = clamp(value, 2, 10);
    if (isMarkerSyncEnabled) {
      updateChartSettings('line', { markerRadius: clamped });
      updateChartSettings('area', { markerRadius: clamped });
    } else {
      updateChartSettings('line', { markerRadius: clamped });
    }
  };

  const handleAreaMarkerRadiusChange = (value) => {
    const clamped = clamp(value, 2, 10);
    if (isMarkerSyncEnabled) {
      updateChartSettings('line', { markerRadius: clamped });
      updateChartSettings('area', { markerRadius: clamped });
    } else {
      updateChartSettings('area', { markerRadius: clamped });
    }
  };

  // Helper to get override select value
  const getOverrideValue = (override) => {
    if (override === null || override === undefined) return 'global';
    return override ? 'on' : 'off';
  };

  // Derived states for cleaner conditionals
  const animationEnabled = global.animation;
  const legendEnabled = global.legend;
  const gridEnabled = global.gridLines;
  const referenceLineEnabled = referenceLine?.enabled ?? false;
  const brushEnabled = brush?.enabled ?? false;
  const gapEnabled = gap?.enabled ?? false;

  return (
    <div className="chart-settings-container">
      {/* ===== GLOBAL SETTINGS GROUP ===== */}
      <details className="chart-settings-card" open>
        <summary className="chart-settings-header">Global</summary>

        {/* Global Toggles */}
        <details className="cs-type-section" open>
          <summary>Toggles</summary>
        <div className="cs-type-body">
          <div className="cs-switch-list">
            <ToggleSwitch
              id="cs-toggle-animation"
              checked={animationEnabled}
              onChange={(v) => updateChartSettings('global', { animation: v })}
              label="Animation"
            />
            <ToggleSwitch
              id="cs-toggle-legend"
              checked={legendEnabled}
              onChange={(v) => updateChartSettings('global', { legend: v })}
              label="Legend"
            />
            <ToggleSwitch
              id="cs-toggle-tooltip"
              checked={global.tooltip}
              onChange={(v) => updateChartSettings('global', { tooltip: v })}
              label="Tooltips"
            />
            <ToggleSwitch
              id="cs-toggle-grid"
              checked={gridEnabled}
              onChange={(v) => updateChartSettings('global', { gridLines: v })}
              label="Grid"
            />
            <ToggleSwitch
              id="cs-toggle-axisLabels"
              checked={global.axisLabels}
              onChange={(v) => updateChartSettings('global', { axisLabels: v })}
              label="Axis Labels"
            />
            <ToggleSwitch
              id="cs-toggle-dataLabels"
              checked={global.dataLabels}
              onChange={(v) => updateChartSettings('global', { dataLabels: v })}
              label="Data Labels"
            />
            <ToggleSwitch
              id="cs-toggle-markers"
              checked={global.markersEnabled}
              onChange={(v) => updateChartSettings('global', { markersEnabled: v })}
              label="Markers"
            />
            {global.markersEnabled && (
              <label className="cs-toggle cs-toggle-indent">
                <input
                  type="checkbox"
                  checked={isMarkerSyncEnabled}
                  onChange={(e) => {
                    updateChartSettings('gap', { syncMarkers: e.target.checked });
                    if (e.target.checked) {
                      updateChartSettings('area', { 
                        markerOverride: line.markerOverride,
                        markerRadius: line.markerRadius
                      });
                    }
                  }}
                />
                Sync Line/Area markers
              </label>
            )}
            <ToggleSwitch
              id="cs-toggle-referenceLine"
              checked={referenceLineEnabled}
              onChange={(v) => updateChartSettings('referenceLine', { enabled: v })}
              label="Reference Line"
            />
            <ToggleSwitch
              id="cs-toggle-brush"
              checked={brushEnabled}
              onChange={(v) => updateChartSettings('brush', { enabled: v })}
              label="Brush"
            />
            <ToggleSwitch
              id="cs-toggle-gaps"
              checked={gapEnabled}
              onChange={(v) => updateChartSettings('gap', { enabled: v })}
              label="Gaps"
            />
          </div>
          
          {/* Label color picker - shown when data labels enabled */}
          {global.dataLabels && (
            <div className="field" style={{ marginTop: '12px' }}>
              <label htmlFor="cs-global-labelColor">Label text color</label>
              <ColorPicker
                id="cs-global-labelColor"
                value={global.labelColor ?? 'CHART_DEFAULTS.labelColor'}
                onChange={(color) => updateChartSettings('global', { labelColor: color })}
              />
            </div>
          )}

        </div>
      </details>

      {/* Tooltip Settings */}
      {global.tooltip && (
        <details className="cs-type-section">
          <summary>Tooltip</summary>
          <div className="cs-type-body">
            <div className="field">
              <label htmlFor="cs-tooltip-trigger">Trigger</label>
              <select
                id="cs-tooltip-trigger"
                value={tooltip?.trigger ?? 'hover'}
                onChange={(e) => updateChartSettings('tooltip', { trigger: e.target.value })}
              >
                <option value="hover">Hover</option>
                <option value="click">Click</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-separator">Separator</label>
              <input
                id="cs-tooltip-separator"
                type="text"
                className="text-input"
                value={tooltip?.separator ?? ' : '}
                onChange={(e) => updateChartSettings('tooltip', { separator: e.target.value })}
                style={{ width: '60px' }}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-offset">Offset</label>
              <div className="range-input-combo">
                <input
                  id="cs-tooltip-offset"
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={tooltip?.offset ?? 10}
                  onChange={(e) => updateChartSettings('tooltip', { offset: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={0}
                  max={30}
                  step={1}
                  value={tooltip?.offset ?? 10}
                  onChange={(e) => updateChartSettings('tooltip', { offset: clamp(Number(e.target.value), 0, 30) })}
                />
                <span className="unit">px</span>
              </div>
            </div>
            <label className="cs-toggle">
              <input
                type="checkbox"
                checked={tooltip?.cursor ?? true}
                onChange={(e) => updateChartSettings('tooltip', { cursor: e.target.checked })}
              />
              Show cursor
            </label>
            {(tooltip?.cursor ?? true) && (
              <div className="field">
                <label htmlFor="cs-tooltip-cursorStyle">Cursor style</label>
                <select
                  id="cs-tooltip-cursorStyle"
                  value={tooltip?.cursorStyle ?? 'default'}
                  onChange={(e) => updateChartSettings('tooltip', { cursorStyle: e.target.value })}
                >
                  <option value="default">Default</option>
                  <option value="line">Line</option>
                  <option value="cross">Cross</option>
                </select>
              </div>
            )}
            <div className="field">
              <label htmlFor="cs-tooltip-animDuration">Animation duration</label>
              <div className="range-input-combo">
                <input
                  id="cs-tooltip-animDuration"
                  type="range"
                  min="0"
                  max="500"
                  step="50"
                  value={tooltip?.animationDuration ?? 200}
                  onChange={(e) => updateChartSettings('tooltip', { animationDuration: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={0}
                  max={500}
                  step={50}
                  value={tooltip?.animationDuration ?? 200}
                  onChange={(e) => updateChartSettings('tooltip', { animationDuration: clamp(Number(e.target.value), 0, 500) })}
                />
                <span className="unit">ms</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-animEasing">Animation easing</label>
              <select
                id="cs-tooltip-animEasing"
                value={tooltip?.animationEasing ?? 'ease'}
                onChange={(e) => updateChartSettings('tooltip', { animationEasing: e.target.value })}
              >
                <option value="ease">Ease</option>
                <option value="linear">Linear</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>

            {/* Content Styling */}
            <h4 className="cs-subsection-title">Content Style</h4>
            <div className="field">
              <label htmlFor="cs-tooltip-bgColor">Background</label>
              <ColorPicker
                id="cs-tooltip-bgColor"
                value={tooltip?.backgroundColor ?? 'CHART_DEFAULTS.backgroundColor'}
                onChange={(color) => updateChartSettings('tooltip', { backgroundColor: color })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-borderColor">Border color</label>
              <ColorPicker
                id="cs-tooltip-borderColor"
                value={tooltip?.borderColor ?? 'CHART_DEFAULTS.borderColor'}
                onChange={(color) => updateChartSettings('tooltip', { borderColor: color })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-borderWidth">Border width</label>
              <div className="range-input-combo">
                <input
                  id="cs-tooltip-borderWidth"
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={tooltip?.borderWidth ?? 1}
                  onChange={(e) => updateChartSettings('tooltip', { borderWidth: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={0}
                  max={4}
                  step={1}
                  value={tooltip?.borderWidth ?? 1}
                  onChange={(e) => updateChartSettings('tooltip', { borderWidth: clamp(Number(e.target.value), 0, 4) })}
                />
                <span className="unit">px</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-borderRadius">Border radius</label>
              <div className="range-input-combo">
                <input
                  id="cs-tooltip-borderRadius"
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={tooltip?.borderRadius ?? 4}
                  onChange={(e) => updateChartSettings('tooltip', { borderRadius: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={0}
                  max={12}
                  step={1}
                  value={tooltip?.borderRadius ?? 4}
                  onChange={(e) => updateChartSettings('tooltip', { borderRadius: clamp(Number(e.target.value), 0, 12) })}
                />
                <span className="unit">px</span>
              </div>
            </div>

            {/* Label Styling */}
            <h4 className="cs-subsection-title">Label Style</h4>
            <div className="field">
              <label htmlFor="cs-tooltip-labelColor">Label color</label>
              <ColorPicker
                id="cs-tooltip-labelColor"
                value={tooltip?.labelColor ?? 'CHART_DEFAULTS.labelColor'}
                onChange={(color) => updateChartSettings('tooltip', { labelColor: color })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-tooltip-labelFontWeight">Label weight</label>
              <select
                id="cs-tooltip-labelFontWeight"
                value={tooltip?.labelFontWeight ?? 'bold'}
                onChange={(e) => updateChartSettings('tooltip', { labelFontWeight: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            {/* Item Styling */}
            <h4 className="cs-subsection-title">Item Style</h4>
            <div className="field">
              <label htmlFor="cs-tooltip-itemColor">Item color</label>
              <ColorPicker
                id="cs-tooltip-itemColor"
                value={tooltip?.itemColor ?? 'CHART_DEFAULTS.tooltipItemColor'}
                onChange={(color) => updateChartSettings('tooltip', { itemColor: color })}
              />
            </div>
          </div>
        </details>
      )}

      {/* Animation Settings */}
      {animationEnabled && (
        <details className="cs-type-section">
          <summary>Animation</summary>
          <div className="cs-type-body">
            <div className="field">
              <label htmlFor="cs-animation-duration">Duration</label>
              <div className="range-input-combo">
                <input
                  id="cs-animation-duration"
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={animation?.duration ?? 1500}
                  onChange={(e) => updateChartSettings('animation', { duration: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={0}
                  max={3000}
                  step={100}
                  value={animation?.duration ?? 1500}
                  onChange={(e) => updateChartSettings('animation', { duration: clamp(Number(e.target.value), 0, 3000) })}
                />
                <span className="unit">ms</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cs-animation-easing">Easing</label>
              <select
                id="cs-animation-easing"
                value={animation?.easing ?? 'ease'}
                onChange={(e) => updateChartSettings('animation', { easing: e.target.value })}
              >
                <option value="ease">Ease</option>
                <option value="linear">Linear</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-animation-delay">Delay</label>
              <div className="range-input-combo">
                <input
                  id="cs-animation-delay"
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={animation?.delay ?? 0}
                  onChange={(e) => updateChartSettings('animation', { delay: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={0}
                  max={1000}
                  step={50}
                  value={animation?.delay ?? 0}
                  onChange={(e) => updateChartSettings('animation', { delay: clamp(Number(e.target.value), 0, 1000) })}
                />
                <span className="unit">ms</span>
              </div>
            </div>
            <button 
              type="button" 
              className="cs-preview-btn"
              onClick={triggerAnimationPreview}
            >
              ▶ Preview
            </button>
          </div>
        </details>
      )}

      {/* Legend Settings */}
      {legendEnabled && (
        <details className="cs-type-section">
          <summary>Legend</summary>
          <div className="cs-type-body">
            <div className="field">
              <label htmlFor="cs-legend-position">Position</label>
              <select
                id="cs-legend-position"
                value={legend?.position ?? 'bottom'}
                onChange={(e) => updateChartSettings('legend', { position: e.target.value })}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-legend-align">Align</label>
              <select
                id="cs-legend-align"
                value={legend?.align ?? 'center'}
                onChange={(e) => updateChartSettings('legend', { align: e.target.value })}
              >
                {(legend?.position === 'left' || legend?.position === 'right') ? (
                  <>
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </>
                ) : (
                  <>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </>
                )}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-legend-layout">Layout</label>
              <select
                id="cs-legend-layout"
                value={legend?.layout ?? 'horizontal'}
                onChange={(e) => updateChartSettings('legend', { layout: e.target.value })}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-legend-iconType">Icon type</label>
              <select
                id="cs-legend-iconType"
                value={legend?.iconType ?? 'square'}
                onChange={(e) => updateChartSettings('legend', { iconType: e.target.value })}
              >
                <option value="line">Line</option>
                <option value="square">Square</option>
                <option value="rect">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="cross">Cross</option>
                <option value="diamond">Diamond</option>
                <option value="star">Star</option>
                <option value="triangle">Triangle</option>
                <option value="wye">Wye</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-legend-textColor">Text color</label>
              <ColorPicker
                id="cs-legend-textColor"
                value={legend?.textColor ?? 'CHART_DEFAULTS.labelColor'}
                onChange={(color) => updateChartSettings('legend', { textColor: color })}
              />
            </div>
          </div>
        </details>
      )}

      {/* Grid Settings */}
      {gridEnabled && (
        <details className="cs-type-section">
          <summary>Grid</summary>
          <div className="cs-type-body">
            <div className="cs-toggles">
              <label className="cs-toggle">
                <input
                  type="checkbox"
                  checked={grid?.horizontal ?? true}
                  onChange={(e) => updateChartSettings('grid', { horizontal: e.target.checked })}
                />
                Horizontal lines
              </label>
              <label className="cs-toggle">
                <input
                  type="checkbox"
                  checked={grid?.vertical ?? true}
                  onChange={(e) => updateChartSettings('grid', { vertical: e.target.checked })}
                />
                Vertical lines
              </label>
            </div>
            <div className="field">
              <label htmlFor="cs-grid-stroke">Line color</label>
              <ColorPicker
                id="cs-grid-stroke"
                value={grid?.stroke ?? '#ccc'}
                onChange={(color) => updateChartSettings('grid', { stroke: color })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-grid-dashStyle">Dash style</label>
              <select
                id="cs-grid-dashStyle"
                value={grid?.strokeDasharray ?? '3 3'}
                onChange={(e) => updateChartSettings('grid', { strokeDasharray: e.target.value })}
              >
                <option value="">Solid</option>
                <option value="3 3">Dashed (3 3)</option>
                <option value="5 5">Dashed (5 5)</option>
                <option value="2 2">Dotted</option>
                <option value="5 2 2 2">Dash-Dot</option>
                <option value="10 5">Long Dash</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-grid-opacity">Opacity</label>
              <div className="range-input-combo">
                <input
                  id="cs-grid-opacity"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={grid?.strokeOpacity ?? 1}
                  onChange={(e) => updateChartSettings('grid', { strokeOpacity: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={10}
                  max={100}
                  step={5}
                  value={Math.round((grid?.strokeOpacity ?? 1) * 100)}
                  onChange={(e) => updateChartSettings('grid', { strokeOpacity: clamp(Number(e.target.value) / 100, 0.1, 1) })}
                />
                <span className="unit">%</span>
              </div>
            </div>
          </div>
        </details>
      )}

      {/* Reference Line Settings */}
      {referenceLineEnabled && (
        <details className="cs-type-section">
          <summary>Reference Line</summary>
          <div className="cs-type-body">
            <div className="field">
              <label htmlFor="cs-refline-yValue">Y Value</label>
              <input
                id="cs-refline-yValue"
                type="number"
                className="num-input"
                value={referenceLine?.yValue ?? 5}
                onChange={(e) => updateChartSettings('referenceLine', { yValue: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-refline-color">Color</label>
              <ColorPicker
                id="cs-refline-color"
                value={referenceLine?.color ?? 'CHART_DEFAULTS.referenceLineColor'}
                onChange={(color) => updateChartSettings('referenceLine', { color })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-refline-strokeWidth">Stroke width</label>
              <div className="range-input-combo">
                <input
                  id="cs-refline-strokeWidth"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={referenceLine?.strokeWidth ?? 1}
                  onChange={(e) => updateChartSettings('referenceLine', { strokeWidth: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={1}
                  max={5}
                  step={1}
                  value={referenceLine?.strokeWidth ?? 1}
                  onChange={(e) => updateChartSettings('referenceLine', { strokeWidth: clamp(Number(e.target.value), 1, 5) })}
                />
                <span className="unit">px</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cs-refline-dashStyle">Dash style</label>
              <select
                id="cs-refline-dashStyle"
                value={referenceLine?.dashStyle ?? 'dashed'}
                onChange={(e) => updateChartSettings('referenceLine', { dashStyle: e.target.value })}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cs-refline-label">Label</label>
              <input
                id="cs-refline-label"
                type="text"
                className="text-input"
                value={referenceLine?.label ?? ''}
                onChange={(e) => updateChartSettings('referenceLine', { label: e.target.value })}
                placeholder="Optional label"
              />
            </div>
          </div>
        </details>
      )}

      {/* Brush Settings */}
      {brushEnabled && (
        <details className="cs-type-section">
          <summary>Brush</summary>
          <div className="cs-type-body">
            <div className="field">
              <label htmlFor="cs-brush-height">Height</label>
              <div className="range-input-combo">
                <input
                  id="cs-brush-height"
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={brush?.height ?? 30}
                  onChange={(e) => updateChartSettings('brush', { height: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="num-input"
                  min={20}
                  max={60}
                  step={5}
                  value={brush?.height ?? 30}
                  onChange={(e) => updateChartSettings('brush', { height: clamp(Number(e.target.value), 20, 60) })}
                />
                <span className="unit">px</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cs-brush-stroke">Stroke color</label>
              <ColorPicker
                id="cs-brush-stroke"
                value={brush?.stroke ?? 'CHART_DEFAULTS.brushStroke'}
                onChange={(color) => updateChartSettings('brush', { stroke: color })}
              />
            </div>
            <p className="cs-hint">
              Applies to Column, Line, and Area charts. Drag handles to zoom.
            </p>
          </div>
        </details>
      )}

      {/* Gap Settings */}
      {gapEnabled && (
        <details className="cs-type-section">
          <summary>Gaps</summary>
          <div className="cs-type-body">
            <label className="cs-toggle">
              <input
                type="checkbox"
                checked={gap?.useAngle ?? true}
                onChange={(e) => updateChartSettings('gap', { useAngle: e.target.checked })}
              />
              Use angle
            </label>
            {(gap?.useAngle ?? true) ? (
              <div className="field">
                <label htmlFor="cs-gap-angle">Angle</label>
                <div className="range-input-combo">
                  <input
                    id="cs-gap-angle"
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={gap?.angle ?? 2}
                    onChange={(e) => updateChartSettings('gap', { angle: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="num-input"
                    min={1}
                    max={15}
                    step={1}
                    value={gap?.angle ?? 2}
                    onChange={(e) => updateChartSettings('gap', { angle: clamp(Number(e.target.value), 1, 15) })}
                  />
                  <span className="unit">°</span>
                </div>
              </div>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="cs-gap-thickness">Thickness</label>
                  <div className="range-input-combo">
                    <input
                      id="cs-gap-thickness"
                      type="range"
                      min="1"
                      max={isSyncEnabled ? 8 : 10}
                      step="1"
                      value={gap?.thickness ?? 2}
                      onChange={(e) => handleGapThicknessChange(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className="num-input"
                      min={1}
                      max={isSyncEnabled ? 8 : 10}
                      step={1}
                      value={gap?.thickness ?? 2}
                      onChange={(e) => handleGapThicknessChange(Number(e.target.value))}
                    />
                    <span className="unit">px</span>
                  </div>
                </div>
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={isSyncEnabled}
                    onChange={(e) => {
                      updateChartSettings('gap', { syncThickness: e.target.checked });
                      if (e.target.checked) {
                        const currentThickness = clamp(gap?.thickness ?? 2, 1, 8);
                        updateChartSettings('gap', { thickness: currentThickness });
                        updateChartSettings('line', { lineWidth: currentThickness });
                        updateChartSettings('area', { lineWidth: currentThickness });
                      }
                    }}
                  />
                  Sync with line widths
                </label>
                <div className="field">
                  <label htmlFor="cs-gap-color">Color</label>
                  <ColorPicker
                    id="cs-gap-color"
                    value={gap?.color ?? 'CHART_DEFAULTS.backgroundColor'}
                    onChange={(color) => updateChartSettings('gap', { color })}
                  />
                </div>
              </>
            )}
            <div className="field">
              <label>Apply to:</label>
              <div className="cs-toggles">
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={gap?.applyTo?.pie ?? true}
                    onChange={(e) => updateGapApplyTo('pie', e.target.checked)}
                  />
                  Pie
                </label>
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={gap?.applyTo?.donut ?? true}
                    onChange={(e) => updateGapApplyTo('donut', e.target.checked)}
                  />
                  Donut
                </label>
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={gap?.applyTo?.funnel ?? true}
                    onChange={(e) => updateGapApplyTo('funnel', e.target.checked)}
                  />
                  Funnel
                </label>
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={gap?.applyTo?.area ?? false}
                    onChange={(e) => updateGapApplyTo('area', e.target.checked)}
                  />
                  Area
                </label>
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={gap?.applyTo?.stackedArea ?? false}
                    onChange={(e) => updateGapApplyTo('stackedArea', e.target.checked)}
                  />
                  Stacked Area
                </label>
                <label className="cs-toggle">
                  <input
                    type="checkbox"
                    checked={gap?.applyTo?.stackedBar ?? false}
                    onChange={(e) => updateGapApplyTo('stackedBar', e.target.checked)}
                  />
                  Stacked Bar
                </label>
              </div>
            </div>
          </div>
        </details>
      )}
      </details>

      {/* ===== CHART TYPES GROUP ===== */}
      <details className="chart-settings-card">
        <summary className="chart-settings-header">Chart Types</summary>

        {/* Axis Settings */}
        <details className="cs-type-section">
          <summary>Axis</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-axis-yScale">Y Scale</label>
            <select
              id="cs-axis-yScale"
              value={axis?.yScale ?? 'linear'}
              onChange={(e) => updateChartSettings('axis', { yScale: e.target.value })}
            >
              <option value="linear">Linear</option>
              <option value="log">Logarithmic</option>
              <option value="sqrt">Square Root</option>
            </select>
          </div>
          <label className="cs-toggle" style={{ marginTop: '8px' }}>
            <input
              type="checkbox"
              checked={axis?.yDomainAuto ?? true}
              onChange={(e) => updateChartSettings('axis', { yDomainAuto: e.target.checked })}
            />
            Auto Y domain
          </label>
        {!(axis?.yDomainAuto ?? true) && (
          <>
            <div className="field">
              <label htmlFor="cs-axis-yMin">Y Min</label>
              <input
                id="cs-axis-yMin"
                type="number"
                className="num-input"
                value={axis?.yDomainMin ?? 0}
                onChange={(e) => updateChartSettings('axis', { yDomainMin: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label htmlFor="cs-axis-yMax">Y Max</label>
              <input
                id="cs-axis-yMax"
                type="number"
                className="num-input"
                value={axis?.yDomainMax ?? 10}
                onChange={(e) => updateChartSettings('axis', { yDomainMax: Number(e.target.value) })}
              />
            </div>
          </>
        )}
          <div className="field">
            <label htmlFor="cs-axis-yTickCount">Y Tick count</label>
            <div className="range-input-combo">
              <input
                id="cs-axis-yTickCount"
                type="range"
                min="0"
                max="15"
                step="1"
                value={axis?.yTickCount ?? 0}
                onChange={(e) => updateChartSettings('axis', { yTickCount: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={0}
                max={15}
                step={1}
                value={axis?.yTickCount ?? 0}
                onChange={(e) => updateChartSettings('axis', { yTickCount: clamp(Number(e.target.value), 0, 15) })}
              />
              <span className="unit">{(axis?.yTickCount ?? 0) === 0 ? 'auto' : ''}</span>
            </div>
          </div>
        </div>
      </details>

      {/* Column/Bar Settings */}
      <details className="cs-type-section">
        <summary>Column / Bar</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-cb-borderRadius">Border radius</label>
            <div className="range-input-combo">
              <input
                id="cs-cb-borderRadius"
                type="range"
                min="0"
                max="20"
                step="1"
                value={columnBar.borderRadius}
                onChange={(e) => updateChartSettings('columnBar', { borderRadius: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={0}
                max={20}
                step={1}
                value={columnBar.borderRadius}
                onChange={(e) => updateChartSettings('columnBar', { borderRadius: clamp(Number(e.target.value), 0, 20) })}
              />
              <span className="unit">px</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-cb-barGap">Bar gap</label>
            <div className="range-input-combo">
              <input
                id="cs-cb-barGap"
                type="range"
                min="0"
                max="20"
                step="1"
                value={columnBar.barGap ?? 4}
                onChange={(e) => updateChartSettings('columnBar', { barGap: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={0}
                max={20}
                step={1}
                value={columnBar.barGap ?? 4}
                onChange={(e) => updateChartSettings('columnBar', { barGap: clamp(Number(e.target.value), 0, 20) })}
              />
              <span className="unit">%</span>
            </div>
          </div>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={columnBar.hoverEnabled ?? true}
              onChange={(e) => updateChartSettings('columnBar', { hoverEnabled: e.target.checked })}
            />
            Hover highlight
          </label>
          {(columnBar.hoverEnabled ?? true) && (
            <>
              <div className="field">
                <label htmlFor="cs-cb-hoverColor">Hover color</label>
                <ColorPicker
                  id="cs-cb-hoverColor"
                  value={columnBar.hoverColor ?? 'CHART_DEFAULTS.hoverColor'}
                  onChange={(color) => updateChartSettings('columnBar', { hoverColor: color })}
                />
              </div>
              <div className="field">
                <label htmlFor="cs-cb-hoverOpacity">Hover opacity</label>
                <div className="range-input-combo">
                  <input
                    id="cs-cb-hoverOpacity"
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={columnBar.hoverOpacity ?? 0.1}
                    onChange={(e) => updateChartSettings('columnBar', { hoverOpacity: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="num-input"
                    min={5}
                    max={50}
                    step={5}
                    value={Math.round((columnBar.hoverOpacity ?? 0.1) * 100)}
                    onChange={(e) => updateChartSettings('columnBar', { hoverOpacity: clamp(Number(e.target.value) / 100, 0.05, 0.5) })}
                  />
                  <span className="unit">%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </details>

      {/* Line Settings */}
      <details className="cs-type-section">
        <summary>Line</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-line-lineWidth">
              Line width
              {isSyncEnabled && <span className="sync-indicator" title="Synced with gap thickness"> ⟷</span>}
            </label>
            <div className="range-input-combo">
              <input
                id="cs-line-lineWidth"
                type="range"
                min="1"
                max="8"
                step="1"
                value={line.lineWidth}
                onChange={(e) => handleLineWidthChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="num-input"
                min={1}
                max={8}
                step={1}
                value={line.lineWidth}
                onChange={(e) => handleLineWidthChange(Number(e.target.value))}
              />
              <span className="unit">px</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-line-curveType">Curve type</label>
            <select
              id="cs-line-curveType"
              value={line.curveType}
              onChange={(e) => updateChartSettings('line', { curveType: e.target.value })}
            >
              <option value="linear">Linear</option>
              <option value="monotone">Monotone</option>
              <option value="cardinal">Cardinal</option>
              <option value="natural">Natural</option>
              <option value="basis">Basis</option>
              <option value="step">Step</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="cs-line-dashStyle">Dash style</label>
            <select
              id="cs-line-dashStyle"
              value={line.dashStyle}
              onChange={(e) => updateChartSettings('line', { dashStyle: e.target.value })}
            >
              <option value="solid">Solid</option>
              <option value="Dash">Dash</option>
              <option value="Dot">Dot</option>
              <option value="DashDot">Dash-Dot</option>
              <option value="LongDash">Long Dash</option>
              <option value="ShortDash">Short Dash</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="cs-line-markerOverride">
              Markers
              {isMarkerSyncEnabled && <span className="sync-indicator" title="Synced with area"> ⟷</span>}
            </label>
            <select
              id="cs-line-markerOverride"
              value={getOverrideValue(line.markerOverride)}
              onChange={(e) => handleLineMarkerOverrideChange(e.target.value)}
            >
              <option value="global">Global ({global.markersEnabled ? 'On' : 'Off'})</option>
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
          {lineMarkersEnabled && (
            <>
              <div className="field">
                <label htmlFor="cs-line-markerRadius">
                  Marker radius
                  {isMarkerSyncEnabled && <span className="sync-indicator" title="Synced with area"> ⟷</span>}
                </label>
                <div className="range-input-combo">
                  <input
                    id="cs-line-markerRadius"
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={line.markerRadius}
                    onChange={(e) => handleLineMarkerRadiusChange(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="num-input"
                    min={2}
                    max={10}
                    step={1}
                    value={line.markerRadius}
                    onChange={(e) => handleLineMarkerRadiusChange(Number(e.target.value))}
                  />
                  <span className="unit">px</span>
                </div>
              </div>
              <div className="field">
                <label htmlFor="cs-line-dotShape">Dot shape</label>
                <select
                  id="cs-line-dotShape"
                  value={line.dotShape ?? 'circle'}
                  onChange={(e) => updateChartSettings('line', { dotShape: e.target.value })}
                >
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="diamond">Diamond</option>
                  <option value="cross">Cross</option>
                  <option value="star">Star</option>
                  <option value="triangle">Triangle</option>
                  <option value="wye">Wye</option>
                </select>
              </div>
            </>
          )}
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={line.connectNulls ?? false}
              onChange={(e) => updateChartSettings('line', { connectNulls: e.target.checked })}
            />
            Connect nulls
          </label>
        </div>
      </details>

      {/* Area Settings */}
      <details className="cs-type-section">
        <summary>Area</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-area-fillOpacity">Fill opacity</label>
            <div className="range-input-combo">
              <input
                id="cs-area-fillOpacity"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={area.fillOpacity}
                onChange={(e) => updateChartSettings('area', { fillOpacity: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={10}
                max={100}
                step={5}
                value={Math.round(area.fillOpacity * 100)}
                onChange={(e) => updateChartSettings('area', { fillOpacity: clamp(Number(e.target.value) / 100, 0.1, 1) })}
              />
              <span className="unit">%</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-area-lineWidth">
              Line width
              {isSyncEnabled && <span className="sync-indicator" title="Synced with gap thickness"> ⟷</span>}
            </label>
            <div className="range-input-combo">
              <input
                id="cs-area-lineWidth"
                type="range"
                min={isSyncEnabled ? 1 : 0}
                max="8"
                step="1"
                value={area.lineWidth}
                onChange={(e) => handleAreaLineWidthChange(Number(e.target.value))}
              />
              <input
                type="number"
                className="num-input"
                min={isSyncEnabled ? 1 : 0}
                max={8}
                step={1}
                value={area.lineWidth}
                onChange={(e) => handleAreaLineWidthChange(Number(e.target.value))}
              />
              <span className="unit">px</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-area-curveType">Curve type</label>
            <select
              id="cs-area-curveType"
              value={area.curveType}
              onChange={(e) => updateChartSettings('area', { curveType: e.target.value })}
            >
              <option value="linear">Linear</option>
              <option value="monotone">Monotone</option>
              <option value="cardinal">Cardinal</option>
              <option value="natural">Natural</option>
              <option value="basis">Basis</option>
              <option value="step">Step</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="cs-area-markerOverride">
              Markers
              {isMarkerSyncEnabled && <span className="sync-indicator" title="Synced with line"> ⟷</span>}
            </label>
            <select
              id="cs-area-markerOverride"
              value={getOverrideValue(area.markerOverride)}
              onChange={(e) => handleAreaMarkerOverrideChange(e.target.value)}
            >
              <option value="global">Global ({global.markersEnabled ? 'On' : 'Off'})</option>
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
          {areaMarkersEnabled && (
            <>
              <div className="field">
                <label htmlFor="cs-area-markerType">Marker type</label>
                <select
                  id="cs-area-markerType"
                  value={area.markerType}
                  onChange={(e) => updateChartSettings('area', { markerType: e.target.value })}
                >
                  <option value="cursor">Cursor line</option>
                  <option value="marker">Markers</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {(area.markerType === 'cursor' || area.markerType === 'both') && (
                <>
                  <div className="field">
                    <label htmlFor="cs-area-cursorStyle">Cursor style</label>
                    <select
                      id="cs-area-cursorStyle"
                      value={area.cursorStyle}
                      onChange={(e) => updateChartSettings('area', { cursorStyle: e.target.value })}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="cs-area-cursorColor">Cursor color</label>
                    <ColorPicker
                      id="cs-area-cursorColor"
                      value={area.cursorColor}
                      onChange={(color) => updateChartSettings('area', { cursorColor: color })}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="cs-area-cursorWidth">Cursor width</label>
                    <div className="range-input-combo">
                      <input
                        id="cs-area-cursorWidth"
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={area.cursorWidth}
                        onChange={(e) => updateChartSettings('area', { cursorWidth: Number(e.target.value) })}
                      />
                      <input
                        type="number"
                        className="num-input"
                        min={1}
                        max={5}
                        step={1}
                        value={area.cursorWidth}
                        onChange={(e) => updateChartSettings('area', { cursorWidth: clamp(Number(e.target.value), 1, 5) })}
                      />
                      <span className="unit">px</span>
                    </div>
                  </div>
                </>
              )}
              {(area.markerType === 'marker' || area.markerType === 'both') && (
                <>
                  <div className="field">
                    <label htmlFor="cs-area-markerRadius">
                      Marker radius
                      {isMarkerSyncEnabled && <span className="sync-indicator" title="Synced with line"> ⟷</span>}
                    </label>
                    <div className="range-input-combo">
                      <input
                        id="cs-area-markerRadius"
                        type="range"
                        min="2"
                        max="10"
                        step="1"
                        value={area.markerRadius}
                        onChange={(e) => handleAreaMarkerRadiusChange(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        className="num-input"
                        min={2}
                        max={10}
                        step={1}
                        value={area.markerRadius}
                        onChange={(e) => handleAreaMarkerRadiusChange(Number(e.target.value))}
                      />
                      <span className="unit">px</span>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="cs-area-dotShape">Dot shape</label>
                    <select
                      id="cs-area-dotShape"
                      value={area.dotShape ?? 'circle'}
                      onChange={(e) => updateChartSettings('area', { dotShape: e.target.value })}
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="diamond">Diamond</option>
                      <option value="cross">Cross</option>
                      <option value="star">Star</option>
                      <option value="triangle">Triangle</option>
                      <option value="wye">Wye</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={area.connectNulls ?? false}
              onChange={(e) => updateChartSettings('area', { connectNulls: e.target.checked })}
            />
            Connect nulls
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={area.gradientEnabled}
              onChange={(e) => updateChartSettings('area', { gradientEnabled: e.target.checked })}
            />
            Enable gradient
          </label>
          {area.gradientEnabled && (
            <>
              <div className="field">
                <label htmlFor="cs-area-gradientMode">Gradient mode</label>
                <select
                  id="cs-area-gradientMode"
                  value={area.gradientMode}
                  onChange={(e) => updateChartSettings('area', { gradientMode: e.target.value })}
                >
                  <option value="shared">Shared</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              {area.gradientMode === 'shared' && (
                <>
                  <div className="field field-full">
                    <label htmlFor="cs-area-sharedAngle">Gradient angle</label>
                    <div className="angle-control">
                      <div className="range-input-combo">
                        <input
                          id="cs-area-sharedAngle"
                          type="range"
                          min="0"
                          max="360"
                          step="15"
                          value={area.sharedAngle}
                          onChange={(e) => updateChartSettings('area', { sharedAngle: Number(e.target.value) })}
                        />
                        <input
                          type="number"
                          className="num-input"
                          min={0}
                          max={360}
                          step={15}
                          value={area.sharedAngle}
                          onChange={(e) => updateChartSettings('area', { sharedAngle: clamp(Number(e.target.value), 0, 360) })}
                        />
                        <span className="unit">°</span>
                      </div>
                      <div className="snap-buttons">
                        {[0, 45, 90, 135, 180, 270].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateChartSettings('area', { sharedAngle: val })}
                            className={area.sharedAngle === val ? 'active' : ''}
                          >
                            {val}°
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="cs-area-topOpacity">Top opacity</label>
                    <div className="range-input-combo">
                      <input
                        id="cs-area-topOpacity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={area.sharedTopOpacity}
                        onChange={(e) => updateChartSettings('area', { sharedTopOpacity: Number(e.target.value) })}
                      />
                      <input
                        type="number"
                        className="num-input"
                        min={0}
                        max={100}
                        step={5}
                        value={Math.round(area.sharedTopOpacity * 100)}
                        onChange={(e) => updateChartSettings('area', { sharedTopOpacity: clamp(Number(e.target.value) / 100, 0, 1) })}
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="cs-area-bottomOpacity">Bottom opacity</label>
                    <div className="range-input-combo">
                      <input
                        id="cs-area-bottomOpacity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={area.sharedBottomOpacity}
                        onChange={(e) => updateChartSettings('area', { sharedBottomOpacity: Number(e.target.value) })}
                      />
                      <input
                        type="number"
                        className="num-input"
                        min={0}
                        max={100}
                        step={5}
                        value={Math.round(area.sharedBottomOpacity * 100)}
                        onChange={(e) => updateChartSettings('area', { sharedBottomOpacity: clamp(Number(e.target.value) / 100, 0, 1) })}
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </details>

      {/* Stacked Settings */}
      <details className="cs-type-section">
        <summary>Stacked</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-stacked-stackOffset">Stack offset</label>
            <select
              id="cs-stacked-stackOffset"
              value={stacked?.stackOffset ?? 'none'}
              onChange={(e) => updateChartSettings('stacked', { stackOffset: e.target.value })}
            >
              <option value="none">None (default)</option>
              <option value="expand">Expand (0-100%)</option>
              <option value="wiggle">Wiggle (streamgraph)</option>
              <option value="silhouette">Silhouette (centered)</option>
            </select>
          </div>
          <p className="cs-hint">
            Affects Stacked Bar and Stacked Area charts.
          </p>
        </div>
      </details>

      {/* Pie Settings */}
      <details className="cs-type-section">
        <summary>Pie</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-pie-startAngle">Start angle</label>
            <div className="range-input-combo">
              <input
                id="cs-pie-startAngle"
                type="range"
                min="-180"
                max="180"
                step="5"
                value={pie.startAngle}
                onChange={(e) => updateChartSettings('pie', { startAngle: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={-180}
                max={180}
                step={5}
                value={pie.startAngle}
                onChange={(e) => updateChartSettings('pie', { startAngle: clamp(Number(e.target.value), -180, 180) })}
              />
              <span className="unit">°</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-pie-cornerRadius">Corner radius</label>
            <div className="range-input-combo">
              <input
                id="cs-pie-cornerRadius"
                type="range"
                min="0"
                max="20"
                step="1"
                value={pie.cornerRadius ?? 0}
                onChange={(e) => updateChartSettings('pie', { cornerRadius: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={0}
                max={20}
                step={1}
                value={pie.cornerRadius ?? 0}
                onChange={(e) => updateChartSettings('pie', { cornerRadius: clamp(Number(e.target.value), 0, 20) })}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
      </details>

      {/* Donut Settings */}
      <details className="cs-type-section">
        <summary>Donut</summary>
        <div className="cs-type-body">
          <div className="field">
            <label htmlFor="cs-donut-startAngle">Start angle</label>
            <div className="range-input-combo">
              <input
                id="cs-donut-startAngle"
                type="range"
                min="-180"
                max="180"
                step="5"
                value={donut.startAngle}
                onChange={(e) => updateChartSettings('donut', { startAngle: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={-180}
                max={180}
                step={5}
                value={donut.startAngle}
                onChange={(e) => updateChartSettings('donut', { startAngle: clamp(Number(e.target.value), -180, 180) })}
              />
              <span className="unit">°</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-donut-thickness">Thickness</label>
            <div className="range-input-combo">
              <input
                id="cs-donut-thickness"
                type="range"
                min="10"
                max="60"
                step="5"
                value={donut.thickness}
                onChange={(e) => updateChartSettings('donut', { thickness: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={10}
                max={60}
                step={5}
                value={donut.thickness}
                onChange={(e) => updateChartSettings('donut', { thickness: clamp(Number(e.target.value), 10, 60) })}
              />
              <span className="unit">px</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cs-donut-cornerRadius">Corner radius</label>
            <div className="range-input-combo">
              <input
                id="cs-donut-cornerRadius"
                type="range"
                min="0"
                max="20"
                step="1"
                value={donut.cornerRadius ?? 0}
                onChange={(e) => updateChartSettings('donut', { cornerRadius: Number(e.target.value) })}
              />
              <input
                type="number"
                className="num-input"
                min={0}
                max={20}
                step={1}
                value={donut.cornerRadius ?? 0}
                onChange={(e) => updateChartSettings('donut', { cornerRadius: clamp(Number(e.target.value), 0, 20) })}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
      </details>

      {/* Funnel Settings */}
      <details className="cs-type-section">
        <summary>Funnel</summary>
        <div className="cs-type-body">
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={funnel.reversed}
              onChange={(e) => updateChartSettings('funnel', { reversed: e.target.checked })}
            />
            Reversed (pyramid)
          </label>
        </div>
      </details>
      </details>
    </div>
  );
}

export default ChartSettings;
