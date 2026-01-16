import React, { useState, useMemo, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { usePalette } from '../context/PaletteContext';
import { writeClipboard } from '../utils/helpers';
import { generatePatternDef, renderPatternContent, getSlotFill } from '../utils/patternGenerator';

/**
 * Generate SVG pattern definition string for a slot
 */
function generatePatternSVG(slot, slotIndex) {
  const patternDef = generatePatternDef(slot, slotIndex);
  if (!patternDef) return null;

  const content = renderPatternContent(patternDef);
  
  // Handle staggered dots
  if (content.type === 'staggered-dots') {
    const shapes = content.shapes.map(shape => {
      switch (shape.shape) {
        case 'square':
          return `    <rect x="${shape.cx - shape.r}" y="${shape.cy - shape.r}" width="${shape.r * 2}" height="${shape.r * 2}" fill="${shape.fill}" fill-opacity="${shape.fillOpacity}" />`;
        case 'diamond':
          const dr = shape.r * 1.2;
          return `    <polygon points="${shape.cx},${shape.cy - dr} ${shape.cx + dr},${shape.cy} ${shape.cx},${shape.cy + dr} ${shape.cx - dr},${shape.cy}" fill="${shape.fill}" fill-opacity="${shape.fillOpacity}" />`;
        default:
          return `    <circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" fill="${shape.fill}" fill-opacity="${shape.fillOpacity}" />`;
      }
    }).join('\n');
    
    const transform = patternDef.angle ? ` patternTransform="rotate(${patternDef.angle})"` : '';
    return `  <pattern id="${patternDef.id}" width="${content.width}" height="${content.height}" patternUnits="userSpaceOnUse"${transform}>
    <rect width="${content.width}" height="${content.height}" fill="${patternDef.backgroundColor}" />
${shapes}
  </pattern>`;
  }

  // Handle path-based patterns (lines, crosshatch)
  if (content.type === 'path') {
    const transform = patternDef.angle ? ` patternTransform="rotate(${patternDef.angle})"` : '';
    return `  <pattern id="${patternDef.id}" width="${patternDef.width}" height="${patternDef.height}" patternUnits="userSpaceOnUse"${transform}>
    <rect width="${patternDef.width}" height="${patternDef.height}" fill="${patternDef.backgroundColor}" />
    <path d="${content.d}" stroke="${content.stroke}" stroke-width="${content.strokeWidth}" stroke-opacity="${content.strokeOpacity}" stroke-linecap="${content.strokeLinecap}" fill="none" />
  </pattern>`;
  }

  // Handle dots
  if (content.type === 'dot') {
    const transform = patternDef.angle ? ` patternTransform="rotate(${patternDef.angle})"` : '';
    let shapeElement;
    switch (content.shape) {
      case 'square':
        shapeElement = `    <rect x="${content.cx - content.r}" y="${content.cy - content.r}" width="${content.r * 2}" height="${content.r * 2}" fill="${content.fill}" fill-opacity="${content.fillOpacity}" />`;
        break;
      case 'diamond':
        const dr = content.r * 1.2;
        shapeElement = `    <polygon points="${content.cx},${content.cy - dr} ${content.cx + dr},${content.cy} ${content.cx},${content.cy + dr} ${content.cx - dr},${content.cy}" fill="${content.fill}" fill-opacity="${content.fillOpacity}" />`;
        break;
      default:
        shapeElement = `    <circle cx="${content.cx}" cy="${content.cy}" r="${content.r}" fill="${content.fill}" fill-opacity="${content.fillOpacity}" />`;
    }
    return `  <pattern id="${patternDef.id}" width="${patternDef.width}" height="${patternDef.height}" patternUnits="userSpaceOnUse"${transform}>
    <rect width="${patternDef.width}" height="${patternDef.height}" fill="${patternDef.backgroundColor}" />
${shapeElement}
  </pattern>`;
  }

  return null;
}

/**
 * Generate developer-friendly export data
 */
function generateDevExport(state, getActiveSlot) {
  const slots = [];
  const patternDefs = [];
  const fills = [];

  for (let i = 0; i < 8; i++) {
    const slot = getActiveSlot(i);
    slots.push(slot);
    fills.push(getSlotFill(slot, i));
    
    const patternSVG = generatePatternSVG(slot, i);
    if (patternSVG) {
      patternDefs.push(patternSVG);
    }
  }

  // Build the complete SVG defs block
  const svgDefs = patternDefs.length > 0 
    ? `<svg style={{ position: 'absolute', width: 0, height: 0 }}>
  <defs>
${patternDefs.join('\n')}
  </defs>
</svg>`
    : '<!-- No patterns defined - all slots are solid colors -->';

  // Build fills array for quick use
  const fillsArray = fills.map((fill, i) => {
    const slot = slots[i];
    const comment = slot.type === 'solid' 
      ? `// ${slot.label || `Slot ${i + 1}`} - solid color`
      : `// ${slot.label || `Slot ${i + 1}`} - ${slot.patternType} pattern`;
    return `  '${fill}', ${comment}`;
  }).join('\n');

  // Generate chart settings summary
  const chartSettings = state.chartSettings;

  // Build the full export object
  const exportData = {
    // Metadata
    exportedAt: new Date().toISOString(),
    version: state.schemaVersion,

    // Palette slots (the raw slot data for full re-import)
    palette: slots,

    // Quick-reference fills array (what you pass to Recharts fill prop)
    fills: fills,

    // Chart settings
    chartSettings: {
      global: chartSettings.global,
      columnBar: chartSettings.columnBar,
      line: chartSettings.line,
      area: chartSettings.area,
      pie: chartSettings.pie,
      donut: chartSettings.donut,
      funnel: chartSettings.funnel,
      gap: chartSettings.gap,
    },
  };

  // Build example code
  const exampleCode = `// ============================================
// RECHARTS PATTERN PALETTE - DEVELOPER EXPORT
// ============================================
// Generated: ${new Date().toLocaleString()}
//
// This export includes everything you need to recreate
// this palette in your Recharts application.

// --------------------------------------------
// 1. SVG PATTERN DEFINITIONS
// --------------------------------------------
// Add this hidden SVG to your component (before charts)
// These define the pattern fills referenced by url(#pattern-slot-X)

${svgDefs}

// --------------------------------------------
// 2. FILLS ARRAY
// --------------------------------------------
// Use these as the "fill" prop in Recharts components
// Solid colors are hex values, patterns are url() references

const CHART_FILLS = [
${fillsArray}
];

// --------------------------------------------
// 3. EXAMPLE USAGE
// --------------------------------------------

// Bar Chart Example:
<BarChart data={data}>
  <Bar dataKey="value1" fill={CHART_FILLS[0]} />
  <Bar dataKey="value2" fill={CHART_FILLS[1]} />
</BarChart>

// Pie Chart Example:
<PieChart>
  <Pie data={data} dataKey="value">
    {data.map((entry, index) => (
      <Cell key={index} fill={CHART_FILLS[index % CHART_FILLS.length]} />
    ))}
  </Pie>
</PieChart>

// Area Chart Example:
<AreaChart data={data}>
  <Area type="monotone" dataKey="value" fill={CHART_FILLS[0]} stroke={CHART_FILLS[0]} />
</AreaChart>

// --------------------------------------------
// 4. CHART SETTINGS REFERENCE
// --------------------------------------------
// These are the settings from the playground that you can apply

const CHART_SETTINGS = ${JSON.stringify(exportData.chartSettings, null, 2)};

// Column/Bar Chart Settings:
// - borderRadius: ${chartSettings.columnBar.borderRadius}px
// - barGap: ${chartSettings.columnBar.barGap}px

// Line Chart Settings:
// - lineWidth: ${chartSettings.line.lineWidth}px
// - curveType: "${chartSettings.line.curveType}"

// Area Chart Settings:
// - fillOpacity: ${chartSettings.area.fillOpacity}
// - curveType: "${chartSettings.area.curveType}"
// - gradientEnabled: ${chartSettings.area.gradientEnabled}

// Pie/Donut Settings:
// - pie.startAngle: ${chartSettings.pie.startAngle}°
// - donut.startAngle: ${chartSettings.donut.startAngle}°
// - donut.thickness: ${chartSettings.donut.thickness}px

// --------------------------------------------
// 5. FULL STATE (for re-importing)
// --------------------------------------------
// You can paste this JSON back into the playground to restore the state

/*
${JSON.stringify(state, null, 2)}
*/
`;

  return {
    code: exampleCode,
    json: JSON.stringify(state, null, 2),
    fills: fills,
  };
}

export function ExportPanel() {
  const { state, exportState, shareState, resetAll, importState, getActiveSlot } = usePalette();
  const [activeTab, setActiveTab] = useState('dev'); // 'dev' | 'json' | 'import'
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const devExport = useMemo(() => {
    return generateDevExport(state, getActiveSlot);
  }, [state, getActiveSlot]);

  const showFeedback = (message) => {
    setCopyFeedback(message);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleExportPNG = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isExporting) return;
    setIsExporting(true);
    
    try {
      const chartGrid = document.getElementById('chart-grid-capture');
      if (!chartGrid) {
        showFeedback('Could not find charts');
        return;
      }

      const canvas = await html2canvas(chartGrid, {
        backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `recharts-palette-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showFeedback('PNG exported!');
    } catch (err) {
      console.error('Export failed:', err);
      showFeedback('Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const handleCopyDevExport = async () => {
    const success = await writeClipboard(devExport.code);
    showFeedback(success ? 'Developer export copied!' : 'Failed to copy');
  };

  const handleCopyJSON = async () => {
    const json = exportState();
    const success = await writeClipboard(json);
    showFeedback(success ? 'JSON copied!' : 'Failed to copy');
  };

  const handleCopyFills = async () => {
    const fillsCode = `const CHART_FILLS = [\n${devExport.fills.map(f => `  '${f}',`).join('\n')}\n];`;
    const success = await writeClipboard(fillsCode);
    showFeedback(success ? 'Fills array copied!' : 'Failed to copy');
  };

  const handleShare = async () => {
    const url = shareState();
    const success = await writeClipboard(url);
    showFeedback(success ? 'Share link copied!' : 'Failed to copy');
  };

  const handleReset = () => {
    if (confirm('Reset all slots to defaults? This cannot be undone.')) {
      resetAll();
      showFeedback('Reset to defaults');
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importState(data);
      showFeedback('Imported successfully!');
    } catch (err) {
      showFeedback('Invalid JSON file');
    }
    e.target.value = '';
  };

  const handleImportText = () => {
    const textarea = document.getElementById('importText');
    if (textarea?.value) {
      try {
        const data = JSON.parse(textarea.value);
        importState(data);
        showFeedback('Imported successfully!');
        textarea.value = '';
      } catch {
        showFeedback('Invalid JSON');
      }
    }
  };

  return (
    <details className="export-panel">
      <summary className="export-panel-header">
        <span className="export-panel-title">Export / Import</span>
        {copyFeedback && <span className="copy-feedback">{copyFeedback}</span>}
        <button
          type="button"
          className="export-png-btn"
          onClick={handleExportPNG}
          disabled={isExporting}
          title="Export PNG"
          aria-label="Export charts as PNG image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M5 7L7 5L9.5 7.5L11 6L14 9V10H2V8L5 7Z" fill="currentColor" opacity="0.3"/>
            <circle cx="5" cy="5" r="1" fill="currentColor"/>
            <path d="M8 12V15M8 15L6 13M8 15L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </summary>

      <div className="export-panel-body">
        <div className="export-tabs-segmented">
          <button
            type="button"
            className={`export-tab-seg ${activeTab === 'dev' ? 'active' : ''}`}
            onClick={() => setActiveTab('dev')}
          >
            Developer
          </button>
          <button
            type="button"
            className={`export-tab-seg ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON
          </button>
          <button
            type="button"
            className={`export-tab-seg ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            Import
          </button>
        </div>

        {activeTab === 'dev' && (
          <div className="export-section">
            <p className="export-hint">
              Code snippets ready for your Recharts app.
            </p>
            <div className="export-actions">
              <button type="button" className="btn-sm primary" onClick={handleCopyDevExport}>
                Copy Full Export
              </button>
              <button type="button" className="btn-sm" onClick={handleCopyFills}>
                Fills Only
              </button>
            </div>
            <textarea
              className="export-preview"
              readOnly
              value={devExport.code}
              rows={10}
            />
          </div>
        )}

        {activeTab === 'json' && (
          <div className="export-section">
            <p className="export-hint">
              Full state as JSON for saving or sharing.
            </p>
            <div className="export-actions">
              <button type="button" className="btn-sm primary" onClick={handleCopyJSON}>
                Copy JSON
              </button>
              <button type="button" className="btn-sm" onClick={handleShare}>
                Share Link
              </button>
            </div>
            <textarea
              className="export-preview"
              readOnly
              value={devExport.json}
              rows={10}
            />
          </div>
        )}

        {activeTab === 'import' && (
          <div className="export-section">
            <p className="export-hint">
              Import a previously exported palette.
            </p>
            <div className="field">
              <label htmlFor="importFile">From file</label>
              <input
                id="importFile"
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
              />
            </div>
            <div className="field">
              <label htmlFor="importText">Or paste JSON</label>
              <textarea
                id="importText"
                rows={5}
                spellCheck={false}
                placeholder="Paste palette JSON here..."
              />
            </div>
            <div className="export-actions">
              <button type="button" className="btn-sm primary" onClick={handleImportText}>
                Load from Text
              </button>
            </div>
          </div>
        )}

        <div className="export-panel-footer">
          <button type="button" className="btn-sm danger" onClick={handleReset}>
            Reset All
          </button>
        </div>
      </div>
    </details>
  );
}

export default ExportPanel;
