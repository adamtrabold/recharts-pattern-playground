import React from 'react';
import { usePalette } from '../context/PaletteContext';
import { clamp } from '../utils/helpers';
import ColorPicker from './ColorPicker';

export function ChartSettings() {
  const { state, updateChartSettings } = usePalette();
  const { global, gap, columnBar, line, area, pie, donut, funnel } = state.chartSettings;

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

  return (
    <details className="chart-settings-card">
      <summary className="chart-settings-header">Chart Settings</summary>

      {/* Global Settings */}
      <fieldset className="cs-fieldset">
        <legend>Global</legend>
        <div className="cs-toggles">
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.animation}
              onChange={(e) => updateChartSettings('global', { animation: e.target.checked })}
            />
            Animation
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.legend}
              onChange={(e) => updateChartSettings('global', { legend: e.target.checked })}
            />
            Legend
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.tooltip}
              onChange={(e) => updateChartSettings('global', { tooltip: e.target.checked })}
            />
            Tooltip
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.gridLines}
              onChange={(e) => updateChartSettings('global', { gridLines: e.target.checked })}
            />
            Grid lines
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.axisLabels}
              onChange={(e) => updateChartSettings('global', { axisLabels: e.target.checked })}
            />
            Axis labels
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.dataLabels}
              onChange={(e) => updateChartSettings('global', { dataLabels: e.target.checked })}
            />
            Data labels
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={global.markersEnabled}
              onChange={(e) => updateChartSettings('global', { markersEnabled: e.target.checked })}
            />
            Show markers
          </label>
          <label className="cs-toggle">
            <input
              type="checkbox"
              checked={isMarkerSyncEnabled}
              onChange={(e) => {
                updateChartSettings('gap', { syncMarkers: e.target.checked });
                // When enabling sync, sync area markers to line markers
                if (e.target.checked) {
                  updateChartSettings('area', { 
                    markerOverride: line.markerOverride,
                    markerRadius: line.markerRadius
                  });
                }
              }}
            />
            Sync markers (Line/Area)
          </label>
        </div>
      </fieldset>

      {/* Gap Settings */}
      <fieldset className="cs-fieldset">
        <legend>Gap</legend>
        <label className="cs-toggle">
          <input
            type="checkbox"
            checked={gap?.enabled ?? false}
            onChange={(e) => updateChartSettings('gap', { enabled: e.target.checked })}
          />
          Enable gaps
        </label>
        {(gap?.enabled ?? false) && (
          <div className="cs-gap-options">
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
                      // When enabling sync, sync all values to current gap thickness
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
                    value={gap?.color ?? '#ffffff'}
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
        )}
      </fieldset>

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
                  value={columnBar.hoverColor ?? '#000000'}
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
          )}
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
              )}
            </>
          )}
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
  );
}

export default ChartSettings;
