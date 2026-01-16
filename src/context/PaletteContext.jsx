import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { STORAGE_KEY, SCHEMA_VERSION, DEFAULT_STATE, migrateState, loadFromStorage, saveToStorage, encodeStateToHash, decodeStateFromHash } from '../utils/storage';
import { deepCopy, clamp } from '../utils/helpers';

const PaletteContext = createContext(null);

// Action types
const ACTIONS = {
  SET_STATE: 'SET_STATE',
  UPDATE_UI: 'UPDATE_UI',
  UPDATE_SLOT: 'UPDATE_SLOT',
  UPDATE_SLOT_B: 'UPDATE_SLOT_B',
  UPDATE_CHART_SETTINGS: 'UPDATE_CHART_SETTINGS',
  COPY_SLOT: 'COPY_SLOT',
  RESET_SLOT: 'RESET_SLOT',
  RESET_ALL: 'RESET_ALL',
  IMPORT_STATE: 'IMPORT_STATE',
};

function paletteReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STATE:
      return { ...state, ...action.payload };
    
    case ACTIONS.UPDATE_UI:
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };
    
    case ACTIONS.UPDATE_SLOT: {
      const { index, updates } = action.payload;
      const newPalette = [...state.palette];
      newPalette[index] = { ...newPalette[index], ...updates };
      return { ...state, palette: newPalette };
    }
    
    case ACTIONS.UPDATE_SLOT_B: {
      const { index, updates } = action.payload;
      const newPaletteB = [...state.paletteB];
      newPaletteB[index] = { ...newPaletteB[index], ...updates };
      return { ...state, paletteB: newPaletteB };
    }
    
    case ACTIONS.UPDATE_CHART_SETTINGS: {
      const { category, updates } = action.payload;
      return {
        ...state,
        chartSettings: {
          ...state.chartSettings,
          [category]: { ...state.chartSettings[category], ...updates },
        },
      };
    }
    
    case ACTIONS.COPY_SLOT: {
      const { fromIndex, toIndex, version = 'a' } = action.payload;
      const sourceSlot = version === 'b' ? state.paletteB[fromIndex] : state.palette[fromIndex];
      if (version === 'b') {
        const newPaletteB = [...state.paletteB];
        newPaletteB[toIndex] = deepCopy(sourceSlot);
        return { ...state, paletteB: newPaletteB };
      } else {
        const newPalette = [...state.palette];
        newPalette[toIndex] = deepCopy(sourceSlot);
        return { ...state, palette: newPalette };
      }
    }
    
    case ACTIONS.RESET_SLOT: {
      const { index, version = 'a' } = action.payload;
      if (version === 'b') {
        const newPaletteB = [...state.paletteB];
        newPaletteB[index] = deepCopy(DEFAULT_STATE.paletteB[index]);
        return { ...state, paletteB: newPaletteB };
      } else {
        const newPalette = [...state.palette];
        newPalette[index] = deepCopy(DEFAULT_STATE.palette[index]);
        return { ...state, palette: newPalette };
      }
    }
    
    case ACTIONS.RESET_ALL:
      return deepCopy(DEFAULT_STATE);
    
    case ACTIONS.IMPORT_STATE:
      return migrateState(action.payload);
    
    default:
      return state;
  }
}

export function PaletteProvider({ children }) {
  const [state, dispatch] = useReducer(paletteReducer, null, () => {
    // Initialize: check URL hash first, then localStorage, then defaults
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const decoded = decodeStateFromHash(hash);
      if (decoded) return migrateState(decoded);
    }
    
    const stored = loadFromStorage();
    if (stored) return migrateState(stored);
    
    return deepCopy(DEFAULT_STATE);
  });
  
  // Persist to localStorage on state changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveToStorage(state);
    }, 200);
    return () => clearTimeout(timeout);
  }, [state]);
  
  // Apply theme class to body
  useEffect(() => {
    document.body.classList.toggle('dark', state.ui.darkTheme);
    document.body.classList.toggle('grayscale', state.ui.grayscale);
    document.body.classList.toggle('low-contrast', state.ui.lowContrast);
  }, [state.ui.darkTheme, state.ui.grayscale, state.ui.lowContrast]);
  
  // Action creators
  const updateUI = useCallback((updates) => {
    dispatch({ type: ACTIONS.UPDATE_UI, payload: updates });
  }, []);
  
  const updateSlot = useCallback((index, updates) => {
    dispatch({ type: ACTIONS.UPDATE_SLOT, payload: { index, updates } });
  }, []);
  
  const updateSlotB = useCallback((index, updates) => {
    dispatch({ type: ACTIONS.UPDATE_SLOT_B, payload: { index, updates } });
  }, []);
  
  const updateChartSettings = useCallback((category, updates) => {
    dispatch({ type: ACTIONS.UPDATE_CHART_SETTINGS, payload: { category, updates } });
  }, []);
  
  const copySlot = useCallback((fromIndex, toIndex, version = 'a') => {
    dispatch({ type: ACTIONS.COPY_SLOT, payload: { fromIndex, toIndex, version } });
  }, []);
  
  const resetSlot = useCallback((index, version = 'a') => {
    dispatch({ type: ACTIONS.RESET_SLOT, payload: { index, version } });
  }, []);
  
  const resetAll = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_ALL });
  }, []);
  
  const importState = useCallback((data) => {
    dispatch({ type: ACTIONS.IMPORT_STATE, payload: data });
  }, []);
  
  const exportState = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);
  
  const shareState = useCallback(() => {
    const hash = encodeStateToHash(state);
    window.history.replaceState(null, '', hash);
    return window.location.href;
  }, [state]);
  
  const getActiveSlot = useCallback((index) => {
    const version = state.ui.activeVersions[index];
    return version === 'b' ? state.paletteB[index] : state.palette[index];
  }, [state.ui.activeVersions, state.palette, state.paletteB]);
  
  const setActiveVersion = useCallback((index, version) => {
    const newVersions = [...state.ui.activeVersions];
    newVersions[index] = version;
    dispatch({ type: ACTIONS.UPDATE_UI, payload: { activeVersions: newVersions } });
  }, [state.ui.activeVersions]);
  
  const triggerAnimationPreview = useCallback(() => {
    dispatch({ type: ACTIONS.UPDATE_UI, payload: { animationKey: (state.ui.animationKey ?? 0) + 1 } });
  }, [state.ui.animationKey]);
  
  const value = {
    state,
    dispatch,
    updateUI,
    updateSlot,
    updateSlotB,
    updateChartSettings,
    copySlot,
    resetSlot,
    resetAll,
    importState,
    exportState,
    shareState,
    getActiveSlot,
    setActiveVersion,
    triggerAnimationPreview,
  };
  
  return (
    <PaletteContext.Provider value={value}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
}
