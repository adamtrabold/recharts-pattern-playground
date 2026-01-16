import { deepCopy, clamp, safeParseJSON, normalizeHexColor } from './helpers';

export const STORAGE_KEY = 'rechartsPatternPlayground:v1';
export const SCHEMA_VERSION = 1;

export const DEFAULT_STATE = {
  schemaVersion: SCHEMA_VERSION,
  ui: {
    darkTheme: false,
    grayscale: false,
    lowContrast: false,
    selectedSlot: 0,
    activeVersions: ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
  },
  palette: [
    { type: 'solid', label: 'Slot 1', color: '#00478F' },
    { type: 'solid', label: 'Slot 2', color: '#006BD6' },
    { type: 'solid', label: 'Slot 3', color: '#3FA1A6' },
    { type: 'solid', label: 'Slot 4', color: '#7A45E5' },
    {
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
    },
    {
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
    },
    {
      type: 'pattern',
      label: 'Slot 7',
      backgroundColor: '#AFEDF1',
      inkColor: '#3FA1A6',
      patternType: 'dots',
      spacing: 14,
      strokeWidth: 5,
      opacity: 1,
      angle: 0,
      invert: false,
      roundCaps: true,
      dotShape: 'circle',
      dotOffsetX: 0,
      dotOffsetY: 0,
      dotStaggered: false,
    },
    {
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
    },
  ],
  paletteB: [
    { type: 'solid', label: 'Slot 1', color: '#6baed6' },
    { type: 'solid', label: 'Slot 2', color: '#fdae6b' },
    { type: 'solid', label: 'Slot 3', color: '#74c476' },
    { type: 'solid', label: 'Slot 4', color: '#fb6a4a' },
    { type: 'solid', label: 'Slot 5', color: '#9e9ac8' },
    { type: 'solid', label: 'Slot 6', color: '#fdd0a2' },
    { type: 'solid', label: 'Slot 7', color: '#a1d99b' },
    { type: 'solid', label: 'Slot 8', color: '#fcbba1' },
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
      hoverEnabled: true,
      hoverColor: '#000000',
      hoverOpacity: 0.1,
    },
    line: {
      lineWidth: 2,
      markerOverride: null,
      markerRadius: 4,
      dashStyle: 'solid',
      curveType: 'linear',
    },
    area: {
      fillOpacity: 1,
      lineWidth: 2,
      markerOverride: null,
      markerType: 'marker',
      markerRadius: 4,
      cursorStyle: 'solid',
      cursorColor: '#666666',
      cursorWidth: 1,
      curveType: 'linear',
      gradientEnabled: false,
      gradientMode: 'shared',
      sharedAngle: 90,
      sharedTopColor: null,
      sharedTopOpacity: 1,
      sharedBottomColor: null,
      sharedBottomOpacity: 0.1,
    },
    pie: {
      startAngle: 0,
    },
    donut: {
      startAngle: 0,
      thickness: 30,
    },
    funnel: {
      reversed: false,
    },
  },
};

function normalizeSlot(slot, defaultSlot, index) {
  if (!slot || typeof slot !== 'object') return deepCopy(defaultSlot);
  
  const result = {
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
  state.ui.selectedSlot = clamp(Number(ui.selectedSlot || 0), 0, 7);
  state.ui.activeVersions = Array.isArray(ui.activeVersions) && ui.activeVersions.length === 8
    ? ui.activeVersions.map(v => v === 'b' ? 'b' : 'a')
    : ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'];
  
  if (Array.isArray(raw.palette) && raw.palette.length === 8) {
    state.palette = raw.palette.map((slot, i) => normalizeSlot(slot, DEFAULT_STATE.palette[i], i));
  }
  
  if (Array.isArray(raw.paletteB) && raw.paletteB.length === 8) {
    state.paletteB = raw.paletteB.map((slot, i) => normalizeSlot(slot, DEFAULT_STATE.paletteB[i], i));
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
