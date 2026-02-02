import { deepCopy, clamp, safeParseJSON, normalizeHexColor } from './helpers';

export const STORAGE_KEY = 'rechartsPatternPlayground:v1';
export const SCHEMA_VERSION = 1;

// Slot constraints
export const MIN_SLOTS = 1;
export const MAX_SLOTS = 12;

// Default colors for new slots (cycles through design system primary colors)
const DEFAULT_SLOT_COLORS = [
  '#00478F', '#006BD6', '#3FA1A6', '#7A45E5',
  '#DD1243', '#FF6119', '#FFC34E', '#04BA6E',
  '#0ECAD4', '#9064E9', '#E33962', '#80310D',
];

// Get default color for a slot index (cycles through palette)
export function getDefaultSlotColor(index) {
  return DEFAULT_SLOT_COLORS[index % DEFAULT_SLOT_COLORS.length];
}

// Create a new default slot for palette A
export function createDefaultSlot(index, id) {
  return {
    id,
    type: 'solid',
    label: `Slot ${index + 1}`,
    color: getDefaultSlotColor(index),
    lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null },
  };
}

// Create a new default slot for palette B
export function createDefaultSlotB(index, id) {
  const colors = ['#6baed6', '#fdae6b', '#74c476', '#fb6a4a', '#9e9ac8', '#fdd0a2', '#a1d99b', '#fcbba1'];
  return {
    id,
    type: 'solid',
    label: `Slot ${index + 1}`,
    color: colors[index % colors.length],
    lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null },
  };
}

export const DEFAULT_STATE = {
  schemaVersion: SCHEMA_VERSION,
  ui: {
    darkTheme: false,
    grayscale: false,
    lowContrast: false,
    selectedSlot: 0,
    activeVersions: ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
    animationKey: 0,
    slotIdCounter: 8, // Next ID to assign when adding a slot
  },
  palette: [
    { id: 0, type: 'solid', label: 'Slot 1', color: '#00478F', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 1, type: 'solid', label: 'Slot 2', color: '#006BD6', lineStyle: { dashStyle: 'Dash', lineWidth: null, curveType: null } },
    { id: 2, type: 'solid', label: 'Slot 3', color: '#3FA1A6', lineStyle: { dashStyle: 'Dot', lineWidth: null, curveType: null } },
    { id: 3, type: 'solid', label: 'Slot 4', color: '#7A45E5', lineStyle: { dashStyle: 'DashDot', lineWidth: null, curveType: null } },
    {
      id: 4,
      type: 'pattern',
      label: 'Slot 5',
      backgroundColor: '#AACEF1',
      inkColor: '#00478F',
      patternType: 'lines',
      spacing: 14,
      strokeWidth: 4,
      opacity: 1,
      angle: 45,
      invert: false,
      roundCaps: true,
      lineStyle: { dashStyle: 'LongDash', lineWidth: null, curveType: null },
    },
    {
      id: 5,
      type: 'pattern',
      label: 'Slot 6',
      backgroundColor: '#006BD6',
      inkColor: '#FFFFFF',
      patternType: 'crosshatch',
      spacing: 16,
      strokeWidth: 3,
      opacity: 1,
      angle: 45,
      invert: false,
      roundCaps: false,
      lineStyle: { dashStyle: 'ShortDash', lineWidth: null, curveType: null },
    },
    {
      id: 6,
      type: 'pattern',
      label: 'Slot 7',
      backgroundColor: '#AFEDF1',
      inkColor: '#3FA1A6',
      patternType: 'dots',
      spacing: 8,
      strokeWidth: 2,
      opacity: 1,
      angle: 0,
      invert: false,
      roundCaps: true,
      dotShape: 'circle',
      dotOffsetX: 0,
      dotOffsetY: 0,
      dotStaggered: true,
      lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null },
    },
    {
      id: 7,
      type: 'pattern',
      label: 'Slot 8',
      backgroundColor: '#E9E0FB',
      inkColor: '#7A45E5',
      patternType: 'lines',
      spacing: 12,
      strokeWidth: 3,
      opacity: 1,
      angle: 0,
      invert: false,
      roundCaps: false,
      lineStyle: { dashStyle: 'Dash', lineWidth: null, curveType: null },
    },
  ],
  paletteB: [
    { id: 0, type: 'solid', label: 'Slot 1', color: '#6baed6', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 1, type: 'solid', label: 'Slot 2', color: '#fdae6b', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 2, type: 'solid', label: 'Slot 3', color: '#74c476', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 3, type: 'solid', label: 'Slot 4', color: '#fb6a4a', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 4, type: 'solid', label: 'Slot 5', color: '#9e9ac8', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 5, type: 'solid', label: 'Slot 6', color: '#fdd0a2', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 6, type: 'solid', label: 'Slot 7', color: '#a1d99b', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
    { id: 7, type: 'solid', label: 'Slot 8', color: '#fcbba1', lineStyle: { dashStyle: 'solid', lineWidth: null, curveType: null } },
  ],
  chartSettings: {
    global: {
      animation: false,
      legend: false,
      tooltip: true,
      gridLines: true,
      axisLabels: true,
      dataLabels: false,
      markersEnabled: false,
      labelColor: '#333333',
    },
    gap: {
      enabled: false,
      useAngle: true,
      angle: 2,
      thickness: 2,
      color: '#ffffff',
      syncThickness: false,
      syncMarkers: false,
      applyTo: {
        pie: true,
        donut: true,
        funnel: true,
        area: false,
        stackedArea: false,
        stackedBar: false,
      },
    },
    columnBar: {
      borderRadius: 4,
      barGap: 4,
      hoverEnabled: false,
      hoverColor: '#000000',
      hoverOpacity: 0.1,
    },
    line: {
      lineWidth: 2,
      markerOverride: null,
      markerRadius: 4,
      dotShape: 'circle', // circle, square, diamond, cross, star, triangle, wye
      dashStyle: 'solid',
      curveType: 'linear',
      connectNulls: false,
    },
    area: {
      fillOpacity: 1,
      lineWidth: 2,
      markerOverride: null,
      markerType: 'marker',
      markerRadius: 4,
      dotShape: 'circle', // circle, square, diamond, cross, star, triangle, wye
      cursorStyle: 'solid',
      cursorColor: '#666666',
      cursorWidth: 1,
      curveType: 'linear',
      connectNulls: false,
      gradientEnabled: false,
      gradientMode: 'shared',
      sharedAngle: 90,
      sharedTopColor: null,
      sharedTopOpacity: 1,
      sharedBottomColor: null,
      sharedBottomOpacity: 1,
    },
    pie: {
      startAngle: 0,
      cornerRadius: 0,
    },
    donut: {
      startAngle: 0,
      thickness: 30,
      cornerRadius: 0,
    },
    funnel: {
      reversed: false,
    },
    stacked: {
      stackOffset: 'none', // none, expand, wiggle, silhouette
    },
    axis: {
      yDomainAuto: true,
      yDomainMin: 0,
      yDomainMax: 10,
      xTickCount: 0, // 0 = auto
      yTickCount: 0, // 0 = auto
      yScale: 'linear', // linear, log, sqrt
    },
    legend: {
      position: 'bottom', // top, bottom, left, right
      align: 'center', // left, center, right (for top/bottom), or top, middle, bottom (for left/right)
      layout: 'horizontal', // horizontal, vertical
      iconType: 'square', // line, square, rect, circle, cross, diamond, star, triangle, wye
      textColor: '#333333',
    },
    referenceLine: {
      enabled: false,
      yValue: 5,
      color: '#ff0000',
      strokeWidth: 1,
      dashStyle: 'dashed', // solid, dashed, dotted
      label: '',
    },
    brush: {
      enabled: false,
      height: 30,
      stroke: '#8884d8',
      startIndex: 0,
      endIndex: null, // null = auto (data length - 1)
    },
    animation: {
      enabled: false, // master toggle (also global.animation for backwards compat)
      duration: 1500,
      easing: 'ease', // ease, linear, ease-in, ease-out, ease-in-out
      delay: 0,
    },
    grid: {
      horizontal: true,
      vertical: true,
      stroke: '#ccc',
      strokeDasharray: '3 3', // solid, dashed, dotted, or custom
      strokeOpacity: 1,
    },
    tooltip: {
      trigger: 'hover', // hover, click
      separator: ' : ',
      offset: 10,
      cursor: true,
      cursorStyle: 'default', // default, line, cross, none
      animationDuration: 200,
      animationEasing: 'ease',
      // Content styling
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderRadius: 4,
      borderWidth: 1,
      // Label styling
      labelColor: '#333333',
      labelFontWeight: 'bold', // normal, bold
      // Item styling
      itemColor: '#666666',
    },
  },
};

const VALID_DASH_STYLES = ['solid', 'Dash', 'Dot', 'DashDot', 'LongDash', 'ShortDash'];
const VALID_CURVE_TYPES = ['linear', 'monotone', 'cardinal', 'natural', 'basis', 'step'];

function normalizeSlot(slot, defaultSlot, index, id) {
  if (!slot || typeof slot !== 'object') {
    const copy = deepCopy(defaultSlot);
    copy.id = id;
    return copy;
  }
  
  const result = {
    id: typeof slot.id === 'number' ? slot.id : id,
    type: slot.type === 'pattern' ? 'pattern' : 'solid',
    label: typeof slot.label === 'string' ? slot.label.slice(0, 32) : `Slot ${index + 1}`,
  };
  
  if (result.type === 'solid') {
    result.color = normalizeHexColor(slot.color, defaultSlot.color || '#999999');
  } else {
    result.backgroundColor = normalizeHexColor(slot.backgroundColor, '#ffffff');
    result.inkColor = normalizeHexColor(slot.inkColor, '#000000');
    result.patternType = ['lines', 'crosshatch', 'dots'].includes(slot.patternType) 
      ? slot.patternType 
      : 'lines';
    result.spacing = clamp(Number(slot.spacing) || 14, 4, 40);
    result.strokeWidth = clamp(Number(slot.strokeWidth) || 3, 1, 12);
    result.opacity = clamp(Number(slot.opacity) || 1, 0.05, 1);
    result.angle = clamp(Number(slot.angle) || 0, 0, 180);
    result.invert = !!slot.invert;
    result.roundCaps = !!slot.roundCaps;
    result.dotShape = ['circle', 'square', 'diamond'].includes(slot.dotShape) 
      ? slot.dotShape 
      : 'circle';
    result.dotOffsetX = clamp(Number(slot.dotOffsetX) || 0, 0, 100);
    result.dotOffsetY = clamp(Number(slot.dotOffsetY) || 0, 0, 100);
    result.dotStaggered = !!slot.dotStaggered;
  }
  
  // Line style settings (applies to both solid and pattern)
  const ls = slot.lineStyle || {};
  result.lineStyle = {
    dashStyle: VALID_DASH_STYLES.includes(ls.dashStyle) ? ls.dashStyle : 'solid',
    lineWidth: ls.lineWidth != null ? clamp(Number(ls.lineWidth), 1, 8) : null,
    curveType: VALID_CURVE_TYPES.includes(ls.curveType) ? ls.curveType : null,
  };
  
  return result;
}

export function migrateState(raw) {
  if (!raw || typeof raw !== 'object') return deepCopy(DEFAULT_STATE);
  
  const schemaVersion = Number(raw.schemaVersion || 0);
  if (schemaVersion !== SCHEMA_VERSION) {
    return deepCopy(DEFAULT_STATE);
  }
  
  const state = deepCopy(DEFAULT_STATE);
  
  const ui = raw.ui && typeof raw.ui === 'object' ? raw.ui : {};
  state.ui.darkTheme = !!ui.darkTheme;
  state.ui.grayscale = !!ui.grayscale;
  state.ui.lowContrast = !!ui.lowContrast;
  
  // Handle dynamic palette arrays (1 to MAX_SLOTS)
  let paletteLength = 8; // default
  if (Array.isArray(raw.palette) && raw.palette.length >= MIN_SLOTS && raw.palette.length <= MAX_SLOTS) {
    paletteLength = raw.palette.length;
  }
  
  state.ui.selectedSlot = clamp(Number(ui.selectedSlot || 0), 0, paletteLength - 1);
  
  // Handle activeVersions with dynamic length
  if (Array.isArray(ui.activeVersions) && ui.activeVersions.length >= MIN_SLOTS) {
    // Take up to paletteLength versions, padding with 'a' if needed
    state.ui.activeVersions = Array.from({ length: paletteLength }, (_, i) => 
      ui.activeVersions[i] === 'b' ? 'b' : 'a'
    );
  } else {
    state.ui.activeVersions = Array.from({ length: paletteLength }, () => 'a');
  }
  
  // Determine the max ID from existing slots to set the counter
  let maxId = paletteLength - 1;
  if (Array.isArray(raw.palette)) {
    raw.palette.forEach(slot => {
      if (slot && typeof slot.id === 'number' && slot.id > maxId) {
        maxId = slot.id;
      }
    });
  }
  state.ui.slotIdCounter = typeof ui.slotIdCounter === 'number' ? ui.slotIdCounter : maxId + 1;
  
  // Migrate palette with dynamic length
  if (Array.isArray(raw.palette) && raw.palette.length >= MIN_SLOTS && raw.palette.length <= MAX_SLOTS) {
    state.palette = raw.palette.map((slot, i) => {
      const defaultSlot = DEFAULT_STATE.palette[i % DEFAULT_STATE.palette.length];
      const slotId = (slot && typeof slot.id === 'number') ? slot.id : i;
      return normalizeSlot(slot, defaultSlot, i, slotId);
    });
  }
  
  // Migrate paletteB with dynamic length (must match palette length)
  if (Array.isArray(raw.paletteB) && raw.paletteB.length >= MIN_SLOTS) {
    // Ensure paletteB has same length as palette
    state.paletteB = Array.from({ length: paletteLength }, (_, i) => {
      const slot = raw.paletteB[i];
      const defaultSlot = DEFAULT_STATE.paletteB[i % DEFAULT_STATE.paletteB.length];
      const slotId = (slot && typeof slot.id === 'number') ? slot.id : i;
      return normalizeSlot(slot, defaultSlot, i, slotId);
    });
  } else {
    // Create paletteB matching palette length
    state.paletteB = Array.from({ length: paletteLength }, (_, i) => {
      const defaultSlot = DEFAULT_STATE.paletteB[i % DEFAULT_STATE.paletteB.length];
      return { ...deepCopy(defaultSlot), id: i };
    });
  }
  
  if (raw.chartSettings && typeof raw.chartSettings === 'object') {
    Object.keys(state.chartSettings).forEach(key => {
      if (raw.chartSettings[key] && typeof raw.chartSettings[key] === 'object') {
        state.chartSettings[key] = { ...state.chartSettings[key], ...raw.chartSettings[key] };
      }
    });
  }
  
  return state;
}

export function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = safeParseJSON(stored);
    return parsed.ok ? parsed.value : null;
  } catch {
    return null;
  }
}

export function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function encodeStateToHash(state) {
  try {
    const json = JSON.stringify(state);
    const encoded = btoa(encodeURIComponent(json));
    return '#' + encoded;
  } catch {
    return '#';
  }
}

export function decodeStateFromHash(hash) {
  try {
    if (!hash || hash.length <= 1) return null;
    const encoded = hash.slice(1);
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
