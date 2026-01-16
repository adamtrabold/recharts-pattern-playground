(() => {
  "use strict";

  const STORAGE_KEY = "highchartsPatternPlayground:v1";
  const SCHEMA_VERSION = 1;

  const $body = document.body;
  const $slotList = document.getElementById("slotList");

  const $toggleTheme = document.getElementById("toggleTheme");
  const $toggleGrayscale = document.getElementById("toggleGrayscale");
  const $toggleLowContrast = document.getElementById("toggleLowContrast");

  const $btnExport = document.getElementById("btnExport");
  const $btnShare = document.getElementById("btnShare");
  const $btnResetAll = document.getElementById("btnResetAll");
  const $btnClearSaved = document.getElementById("btnClearSaved");

  const $slotName = document.getElementById("slotName");
  const $slotMode = document.getElementById("slotMode");
  const $solidColor = document.getElementById("solidColor");
  const $backgroundColor = document.getElementById("backgroundColor");
  const $inkColor = document.getElementById("inkColor");

  const $patternType = document.getElementById("patternType");
  const $spacing = document.getElementById("spacing");
  const $strokeWidth = document.getElementById("strokeWidth");
  const $opacity = document.getElementById("opacity");
  const $angle = document.getElementById("angle");
  const $invert = document.getElementById("invert");
  const $roundCaps = document.getElementById("roundCaps");
  const $dotStaggered = document.getElementById("dotStaggered");
  const $invertDots = document.getElementById("invertDots");


  const $dotShape = document.getElementById("dotShape");
  const $dotOffsetX = document.getElementById("dotOffsetX");
  const $dotOffsetY = document.getElementById("dotOffsetY");

  // Number inputs for pattern settings
  const $spacingNum = document.getElementById("spacingNum");
  const $strokeWidthNum = document.getElementById("strokeWidthNum");
  const $opacityNum = document.getElementById("opacityNum");
  const $angleNum = document.getElementById("angleNum");
  const $dotOffsetXNum = document.getElementById("dotOffsetXNum");
  const $dotOffsetYNum = document.getElementById("dotOffsetYNum");

  // Dots-specific duplicates (shown when dots pattern selected)
  const $spacingDots = document.getElementById("spacing-dots");
  const $spacingNumDots = document.getElementById("spacingNum-dots");
  const $strokeWidthDots = document.getElementById("strokeWidth-dots");
  const $strokeWidthNumDots = document.getElementById("strokeWidthNum-dots");
  const $opacityDots = document.getElementById("opacity-dots");
  const $opacityNumDots = document.getElementById("opacityNum-dots");

  const $btnVersionA = document.getElementById("btnVersionA");
  const $btnVersionB = document.getElementById("btnVersionB");
  const $btnCopyAtoB = document.getElementById("btnCopyAtoB");
  const $btnCopyBtoA = document.getElementById("btnCopyBtoA");

  const $btnResetSlot = document.getElementById("btnResetSlot");

  const $importFile = document.getElementById("importFile");
  const $importText = document.getElementById("importText");
  const $btnImportText = document.getElementById("btnImportText");

  const $btnLoadMap = document.getElementById("btnLoadMap");
  const $mapStatus = document.getElementById("mapStatus");
  const $mapContainer = document.getElementById("chart-map");

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function safeParseJSON(text) {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  function debounce(fn, ms) {
    let t = 0;
    return (...args) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => fn(...args), ms);
    };
  }

  function supportsPatternFill() {
    return !!(window.Highcharts && window.Highcharts.SVGRenderer && window.Highcharts.SVGRenderer.prototype.addPattern);
  }

  function normalizeHexColor(input, fallback) {
    if (typeof input !== "string") return fallback;
    const v = input.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    return fallback;
  }

  const DEFAULT_STATE = {
    schemaVersion: SCHEMA_VERSION,
    ui: {
      darkTheme: false,
      grayscale: false,
      lowContrast: false,
      selectedSlot: 0,
      activeVersions: ["a", "a", "a", "a", "a", "a", "a", "a"],
    },
    palette: [
      { type: "solid", label: "Slot 1", color: "#00478F" },
      { type: "solid", label: "Slot 2", color: "#006BD6" },
      { type: "solid", label: "Slot 3", color: "#3FA1A6" },
      { type: "solid", label: "Slot 4", color: "#7A45E5" },
      {
        type: "pattern",
        label: "Slot 5",
        backgroundColor: "#AACEF1",
        inkColor: "#00478F",
        patternType: "lines",
        spacing: 14,
        strokeWidth: 4,
        opacity: 0.85,
        angle: 45,
        invert: false,
        roundCaps: true,
      },
      {
        type: "pattern",
        label: "Slot 6",
        backgroundColor: "#006BD6",
        inkColor: "#FFFFFF",
        patternType: "crosshatch",
        spacing: 16,
        strokeWidth: 3,
        opacity: 0.75,
        angle: 45,
        invert: false,
        roundCaps: false,
      },
      {
        type: "pattern",
        label: "Slot 7",
        backgroundColor: "#AFEDF1",
        inkColor: "#3FA1A6",
        patternType: "dots",
        spacing: 14,
        strokeWidth: 5,
        opacity: 0.85,
        angle: 0,
        invert: false,
        roundCaps: true,
        dotShape: "circle",
        dotOffsetX: 0,
        dotOffsetY: 0,
        dotStaggered: false,
      },
      {
        type: "pattern",
        label: "Slot 8",
        backgroundColor: "#E9E0FB",
        inkColor: "#7A45E5",
        patternType: "lines",
        spacing: 12,
        strokeWidth: 3,
        opacity: 0.85,
        angle: 0,
        invert: false,
        roundCaps: false,
      },
    ],
    paletteB: [
      { type: "solid", label: "Slot 1", color: "#6baed6" },
      { type: "solid", label: "Slot 2", color: "#fdae6b" },
      { type: "solid", label: "Slot 3", color: "#74c476" },
      { type: "solid", label: "Slot 4", color: "#fb6a4a" },
      { type: "solid", label: "Slot 5", color: "#9e9ac8" },
      { type: "solid", label: "Slot 6", color: "#fdd0a2" },
      { type: "solid", label: "Slot 7", color: "#a1d99b" },
      { type: "solid", label: "Slot 8", color: "#fcbba1" },
    ],
    chartSettings: {
      global: {
        animation: false,
        legend: false,
        tooltip: true,
        gridLines: true,
        axisLabels: true,
        dataLabels: false,
      },
      columnBar: {
        borderRadius: 0,
        pointPadding: 0.1,
        groupPadding: 0.2,
        borderWidth: 0,
      },
      line: {
        lineWidth: 2,
        markerEnabled: false,
        markerRadius: 4,
        dashStyle: "Solid",
      },
      area: {
        fillOpacity: 0.65,
        lineWidth: 2,
        markerEnabled: false,
        gradientEnabled: false,
        sharedBottomColor: null,
        sharedBottomOpacity: 0.1,
      },
      pie: {
        startAngle: 0,
        dataLabelDistance: 30,
        slicedOffset: 10,
        borderWidth: 0,
      },
      funnel: {
        neckWidthPercent: 30,
        neckHeightPercent: 25,
        reversed: false,
      },
    },
  };

  function migrateState(raw) {
    if (!raw || typeof raw !== "object") return deepCopy(DEFAULT_STATE);
    const schemaVersion = Number(raw.schemaVersion || 0);
    if (schemaVersion !== SCHEMA_VERSION) {
      return deepCopy(DEFAULT_STATE);
    }

    const state = deepCopy(DEFAULT_STATE);

    const ui = raw.ui && typeof raw.ui === "object" ? raw.ui : {};
    state.ui.darkTheme = !!ui.darkTheme;
    state.ui.grayscale = !!ui.grayscale;
    state.ui.lowContrast = !!ui.lowContrast;
    state.ui.selectedSlot = clamp(Number(ui.selectedSlot || 0), 0, 7);
    state.ui.activeVersions = Array.isArray(ui.activeVersions) && ui.activeVersions.length === 8
      ? ui.activeVersions.map(v => v === "b" ? "b" : "a")
      : ["a", "a", "a", "a", "a", "a", "a", "a"];

    if (Array.isArray(raw.palette) && raw.palette.length === 8) {
      state.palette = raw.palette.map((slot, i) => normalizeSlot(slot, DEFAULT_STATE.palette[i], i));
    }

    if (Array.isArray(raw.paletteB) && raw.paletteB.length === 8) {
      state.paletteB = raw.paletteB.map((slot, i) => normalizeSlot(slot, DEFAULT_STATE.paletteB[i], i));
    }

    // Migrate chart settings
    if (raw.chartSettings && typeof raw.chartSettings === "object") {
      const cs = raw.chartSettings;
      const def = DEFAULT_STATE.chartSettings;

      if (cs.global && typeof cs.global === "object") {
        state.chartSettings.global.animation = !!cs.global.animation;
        state.chartSettings.global.legend = !!cs.global.legend;
        state.chartSettings.global.tooltip = cs.global.tooltip !== false;
        state.chartSettings.global.gridLines = cs.global.gridLines !== false;
        state.chartSettings.global.axisLabels = cs.global.axisLabels !== false;
        state.chartSettings.global.dataLabels = !!cs.global.dataLabels;
      }

      if (cs.columnBar && typeof cs.columnBar === "object") {
        state.chartSettings.columnBar.borderRadius = clamp(Number(cs.columnBar.borderRadius ?? def.columnBar.borderRadius), 0, 20);
        state.chartSettings.columnBar.pointPadding = clamp(Number(cs.columnBar.pointPadding ?? def.columnBar.pointPadding), 0, 0.5);
        state.chartSettings.columnBar.groupPadding = clamp(Number(cs.columnBar.groupPadding ?? def.columnBar.groupPadding), 0, 0.5);
        state.chartSettings.columnBar.borderWidth = clamp(Number(cs.columnBar.borderWidth ?? def.columnBar.borderWidth), 0, 5);
      }

      if (cs.line && typeof cs.line === "object") {
        state.chartSettings.line.lineWidth = clamp(Number(cs.line.lineWidth ?? def.line.lineWidth), 1, 8);
        state.chartSettings.line.markerEnabled = !!cs.line.markerEnabled;
        state.chartSettings.line.markerRadius = clamp(Number(cs.line.markerRadius ?? def.line.markerRadius), 2, 10);
        state.chartSettings.line.dashStyle = normalizeDashStyle(cs.line.dashStyle, def.line.dashStyle);
      }

      if (cs.area && typeof cs.area === "object") {
        state.chartSettings.area.fillOpacity = clamp(Number(cs.area.fillOpacity ?? def.area.fillOpacity), 0.1, 1);
        state.chartSettings.area.lineWidth = clamp(Number(cs.area.lineWidth ?? def.area.lineWidth), 0, 8);
        state.chartSettings.area.markerEnabled = !!cs.area.markerEnabled;
        // Migrate old syncBottomGradient to new gradientEnabled
        state.chartSettings.area.gradientEnabled = !!(cs.area.gradientEnabled ?? cs.area.syncBottomGradient);
        state.chartSettings.area.sharedBottomColor = cs.area.sharedBottomColor === null ? null : normalizeHexColor(cs.area.sharedBottomColor, null);
        state.chartSettings.area.sharedBottomOpacity = clamp(Number(cs.area.sharedBottomOpacity ?? def.area.sharedBottomOpacity), 0, 1);
      }

      if (cs.pie && typeof cs.pie === "object") {
        state.chartSettings.pie.startAngle = clamp(Number(cs.pie.startAngle ?? def.pie.startAngle), -180, 180);
        state.chartSettings.pie.dataLabelDistance = clamp(Number(cs.pie.dataLabelDistance ?? def.pie.dataLabelDistance), -50, 80);
        state.chartSettings.pie.slicedOffset = clamp(Number(cs.pie.slicedOffset ?? def.pie.slicedOffset), 0, 40);
        state.chartSettings.pie.borderWidth = clamp(Number(cs.pie.borderWidth ?? def.pie.borderWidth), 0, 10);
      }

      if (cs.funnel && typeof cs.funnel === "object") {
        state.chartSettings.funnel.neckWidthPercent = clamp(Number(cs.funnel.neckWidthPercent ?? def.funnel.neckWidthPercent), 0, 100);
        state.chartSettings.funnel.neckHeightPercent = clamp(Number(cs.funnel.neckHeightPercent ?? def.funnel.neckHeightPercent), 0, 100);
        state.chartSettings.funnel.reversed = !!cs.funnel.reversed;
      }
    }

    return state;
  }

  function normalizeDashStyle(v, fallback) {
    const allowed = new Set(["Solid", "Dash", "Dot", "DashDot", "LongDash", "ShortDash"]);
    if (typeof v === "string" && allowed.has(v)) return v;
    return fallback;
  }

  function normalizeAreaGradient(raw) {
    const defaults = {
      enabled: false,
      angle: 90,
      topColor: null,
      topOpacity: 1,
      bottomColor: null,
      bottomOpacity: 0.1,
    };
    if (!raw || typeof raw !== "object") return defaults;
    return {
      enabled: !!raw.enabled,
      angle: clamp(Number(raw.angle ?? defaults.angle), 0, 360),
      topColor: raw.topColor === null ? null : normalizeHexColor(raw.topColor, null),
      topOpacity: clamp(Number(raw.topOpacity ?? defaults.topOpacity), 0, 1),
      bottomColor: raw.bottomColor === null ? null : normalizeHexColor(raw.bottomColor, null),
      bottomOpacity: clamp(Number(raw.bottomOpacity ?? defaults.bottomOpacity), 0, 1),
    };
  }

  function normalizeSlot(rawSlot, fallbackSlot, index) {
    if (!rawSlot || typeof rawSlot !== "object") return deepCopy(fallbackSlot);
    const type = rawSlot.type === "pattern" ? "pattern" : "solid";

    const areaGradient = normalizeAreaGradient(rawSlot.areaGradient);

    if (type === "solid") {
      return {
        type: "solid",
        label: typeof rawSlot.label === "string" ? rawSlot.label.slice(0, 32) : `Slot ${index + 1}`,
        color: normalizeHexColor(rawSlot.color, fallbackSlot.color || "#000000"),
        areaGradient,
      };
    }

    return {
      type: "pattern",
      label: typeof rawSlot.label === "string" ? rawSlot.label.slice(0, 32) : `Slot ${index + 1}`,
      backgroundColor: normalizeHexColor(rawSlot.backgroundColor, fallbackSlot.backgroundColor || "#ffffff"),
      inkColor: normalizeHexColor(rawSlot.inkColor, fallbackSlot.inkColor || "#000000"),
      patternType: normalizePatternType(rawSlot.patternType, fallbackSlot.patternType || "lines"),
      spacing: clamp(Number(rawSlot.spacing ?? fallbackSlot.spacing ?? 14), 4, 40),
      strokeWidth: clamp(Number(rawSlot.strokeWidth ?? fallbackSlot.strokeWidth ?? 3), 1, 12),
      opacity: clamp(Number(rawSlot.opacity ?? fallbackSlot.opacity ?? 0.8), 0.05, 1),
      angle: clamp(Number(rawSlot.angle ?? fallbackSlot.angle ?? 0), 0, 180),
      invert: !!rawSlot.invert,
      roundCaps: !!rawSlot.roundCaps,
      dotShape: normalizeDotShape(rawSlot.dotShape, "circle"),
      dotOffsetX: clamp(Number(rawSlot.dotOffsetX ?? 0), 0, 100),
      dotOffsetY: clamp(Number(rawSlot.dotOffsetY ?? 0), 0, 100),
      dotStaggered: !!rawSlot.dotStaggered,
      areaGradient,
    };
  }

  function normalizePatternType(v, fallback) {
    // Migrate old types to new
    if (v === "diagonal" || v === "vertical" || v === "horizontal") return "lines";
    const allowed = new Set(["lines", "crosshatch", "dots"]);
    if (typeof v === "string" && allowed.has(v)) return v;
    return fallback;
  }

  function normalizeDotShape(v, fallback) {
    const allowed = new Set(["circle", "square", "diamond"]);
    if (typeof v === "string" && allowed.has(v)) return v;
    return fallback;
  }

  function encodeStateToHash(state) {
    const json = JSON.stringify(state);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return `#state=${encodeURIComponent(btoa(binary))}`;
  }

  function decodeStateFromHash() {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#state=")) return null;
    const encoded = hash.slice("#state=".length);
    try {
      const binary = atob(decodeURIComponent(encoded));
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      const parsed = safeParseJSON(json);
      if (!parsed.ok) return null;
      return parsed.value;
    } catch {
      return null;
    }
  }

  function saveToLocalStorage(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = safeParseJSON(raw);
      return parsed.ok ? parsed.value : null;
    } catch {
      return null;
    }
  }

  const debouncedSave = debounce((state) => saveToLocalStorage(state), 220);

  let state = (() => {
    const fromHash = decodeStateFromHash();
    if (fromHash) return migrateState(fromHash);
    const fromStorage = loadFromLocalStorage();
    if (fromStorage) return migrateState(fromStorage);
    return deepCopy(DEFAULT_STATE);
  })();

  function setBodyModesFromState() {
    $body.classList.toggle("theme-dark", !!state.ui.darkTheme);
    $body.classList.toggle("preview-grayscale", !!state.ui.grayscale);
    $body.classList.toggle("preview-low-contrast", !!state.ui.lowContrast);
  }

  function setState(mutator) {
    mutator(state);
    state.ui.selectedSlot = clamp(Number(state.ui.selectedSlot || 0), 0, 7);
    debouncedSave(state);
    renderAll();
  }

  function getSelectedSlot() {
    const idx = state.ui.selectedSlot;
    const version = state.ui.activeVersions[idx];
    return version === "b" ? state.paletteB[idx] : state.palette[idx];
  }

  function getActiveSlot(idx) {
    const version = state.ui.activeVersions[idx];
    return version === "b" ? state.paletteB[idx] : state.palette[idx];
  }

  function getActiveVersion(idx) {
    return state.ui.activeVersions[idx] || "a";
  }

  function setSelectedSlot(index) {
    setState((s) => {
      s.ui.selectedSlot = clamp(index, 0, 7);
    });
    focusSlotOption(state.ui.selectedSlot);
  }

  function focusSlotOption(index) {
    const el = document.getElementById(`slot-option-${index}`);
    if (el) el.focus();
  }

  function slotToHighchartsColor(slot) {
    if (!slot || slot.type === "solid") return slot?.color || "#999999";
    if (!supportsPatternFill()) return slot.backgroundColor || "#999999";

    const spacing = clamp(Number(slot.spacing || 14), 4, 40);
    const strokeWidth = clamp(Number(slot.strokeWidth || 3), 1, 12);
    const opacity = clamp(Number(slot.opacity || 0.8), 0.05, 1);
    const angle = clamp(Number(slot.angle || 0), 0, 180);

    let bg = normalizeHexColor(slot.backgroundColor, "#ffffff");
    let ink = normalizeHexColor(slot.inkColor, "#000000");
    if (slot.invert) {
      const tmp = bg;
      bg = ink;
      ink = tmp;
    }

    const s = spacing;
    const cx = s / 2;
    const cy = s / 2;

    let path;

    // For seamless tiling with rotation, we draw lines that extend beyond tile boundaries
    switch (slot.patternType) {
      case "crosshatch": {
        // Two sets of parallel lines at 90 degrees to each other
        const ext = s * 2;
        path = { 
          d: `M 0 0 L ${s} ${s} M ${-ext} 0 L ${s} ${s + ext} M 0 ${-ext} L ${s + ext} ${s} M 0 ${s} L ${s} 0 M ${-ext} ${s} L ${s} ${-ext} M 0 ${s + ext} L ${s + ext} 0`, 
          strokeWidth, 
          stroke: ink 
        };
        break;
      }
      case "dots": {
        const dotRadius = clamp(strokeWidth, 1, 10);
        const shape = slot.dotShape || "circle";
        const staggered = !!slot.dotStaggered;
        const offsetX = clamp(Number(slot.dotOffsetX || 0), 0, 100) / 100;
        const offsetY = clamp(Number(slot.dotOffsetY || 0), 0, 100) / 100;
        
        // Helper to generate shape at position
        const makeShape = (x, y) => {
          if (shape === "square") {
            const size = dotRadius * 2;
            return `<rect x="${x - dotRadius}" y="${y - dotRadius}" width="${size}" height="${size}" fill="${ink}"/>`;
          } else if (shape === "diamond") {
            const r = dotRadius * 1.2;
            return `<polygon points="${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}" fill="${ink}"/>`;
          } else {
            return `<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="${ink}"/>`;
          }
        };
        
        // For staggered, use 2x2 tile with honeycomb pattern
        // Draw extra dots at edges to handle tiling/clipping
        if (staggered) {
          const w = s * 2;
          const h = s * 2;
          const ox = offsetX * s;
          const oy = offsetY * s;
          
          // Main grid of dots - each row offset by s/2
          // Row 0 (y = s/2): dots at x = s/2, 3s/2
          // Row 1 (y = 3s/2): dots at x = 0, s, 2s (edges need duplication)
          const shapes = [
            // Row 0
            makeShape(s/2 + ox, s/2 + oy),
            makeShape(3*s/2 + ox, s/2 + oy),
            // Row 1 - center dot
            makeShape(s + ox, 3*s/2 + oy),
            // Row 1 - edge dots (draw at both 0 and 2s for proper tiling)
            makeShape(0 + ox, 3*s/2 + oy),
            makeShape(2*s + ox, 3*s/2 + oy),
          ];
          
          // Use overflow:visible on SVG to prevent clipping
          return {
            pattern: {
              width: w,
              height: h,
              backgroundColor: bg,
              opacity,
              image: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" style="overflow:visible"><rect width="${w}" height="${h}" fill="${bg}"/>${shapes.join('')}</svg>`)}`,
            }
          };
        }
        
        // Non-staggered: simple grid
        const dx = cx + (offsetX * s);
        const dy = cy + (offsetY * s);
        
        return {
          pattern: {
            width: s,
            height: s,
            backgroundColor: bg,
            opacity,
            image: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect width="${s}" height="${s}" fill="${bg}"/>${makeShape(dx, dy)}</svg>`)}`,
          }
        };
      }
      case "lines":
      default: {
        // Draw a vertical line - rotation is handled by patternTransform
        // Multiple lines ensure seamless tiling at any angle
        const ext = s * 2;
        path = { 
          d: `M ${cx} ${-ext} L ${cx} ${s + ext}`, 
          strokeWidth, 
          stroke: ink 
        };
        break;
      }
    }

    if (slot.roundCaps) {
      path.linecap = "round";
    }

    const pattern = {
      path,
      width: s,
      height: s,
      color: ink,
      backgroundColor: bg,
      opacity,
    };

    if (Number.isFinite(angle) && angle !== 0) {
      pattern.patternTransform = `rotate(${angle})`;
    }

    return { pattern };
  }

  function swatchBackgroundCSS(slot) {
    if (!slot) return "#999";
    if (slot.type === "solid") return slot.color;

    const bg = slot.invert ? slot.inkColor : slot.backgroundColor;
    const ink = slot.invert ? slot.backgroundColor : slot.inkColor;
    const opacity = clamp(Number(slot.opacity || 0.8), 0.05, 1);
    const spacing = clamp(Number(slot.spacing || 14), 4, 40);
    const strokeWidth = clamp(Number(slot.strokeWidth || 3), 1, 12);
    const angle = clamp(Number(slot.angle || 0), 0, 180);

    const inkRgba = hexToRgba(ink, opacity);
    const bgRgba = hexToRgba(bg, 1);

    if (slot.patternType === "dots") {
      const r = clamp(strokeWidth, 1, 10);
      const shape = slot.dotShape || "circle";
      const staggered = !!slot.dotStaggered;
      const offsetX = clamp(Number(slot.dotOffsetX || 0), 0, 100) / 100 * spacing;
      const offsetY = clamp(Number(slot.dotOffsetY || 0), 0, 100) / 100 * spacing;
      
      const cx = spacing / 2 + offsetX;
      const cy = spacing / 2 + offsetY;
      
      if (staggered) {
        // Staggered pattern - honeycomb layout using 2x2 tile
        const w = spacing * 2;
        const h = spacing * 2;
        
        // Same positions as Highcharts pattern
        const makeShapeSvg = (x, y) => {
          if (shape === "square") {
            return `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" fill="${ink}" opacity="${opacity}"/>`;
          } else if (shape === "diamond") {
            const d = r * 1.2;
            return `<polygon points="${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}" fill="${ink}" opacity="${opacity}"/>`;
          } else {
            return `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink}" opacity="${opacity}"/>`;
          }
        };
        
        const shapes = [
          makeShapeSvg(spacing/2 + offsetX, spacing/2 + offsetY),
          makeShapeSvg(3*spacing/2 + offsetX, spacing/2 + offsetY),
          makeShapeSvg(spacing + offsetX, 3*spacing/2 + offsetY),
          makeShapeSvg(0 + offsetX, 3*spacing/2 + offsetY),
          makeShapeSvg(2*spacing + offsetX, 3*spacing/2 + offsetY),
        ].join('');
        
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" style="overflow:visible"><rect width="${w}" height="${h}" fill="${bg}"/>${shapes}</svg>`;
        return {
          background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          backgroundSize: `${w}px ${h}px`,
        };
      }
      
      // Non-staggered
      if (shape === "square") {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spacing}" height="${spacing}"><rect width="${spacing}" height="${spacing}" fill="${bg}"/><rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="${ink}" opacity="${opacity}"/></svg>`;
        return {
          background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          backgroundSize: `${spacing}px ${spacing}px`,
        };
      } else if (shape === "diamond") {
        const d = r * 1.2;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spacing}" height="${spacing}"><rect width="${spacing}" height="${spacing}" fill="${bg}"/><polygon points="${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}" fill="${ink}" opacity="${opacity}"/></svg>`;
        return {
          background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          backgroundSize: `${spacing}px ${spacing}px`,
        };
      } else {
        return {
          background: `radial-gradient(circle ${r}px at ${cx}px ${cy}px, ${inkRgba} 0, ${inkRgba} ${r}px, transparent ${r}px)`,
          backgroundColor: bgRgba,
          backgroundSize: `${spacing}px ${spacing}px`,
        };
      }
    }

    // Simple CSS gradients for swatch preview
    if (slot.patternType === "crosshatch") {
      const a1 = 45 + angle;
      const a2 = -45 + angle;
      return `repeating-linear-gradient(${a1}deg, ${inkRgba} 0, ${inkRgba} ${strokeWidth}px, transparent ${strokeWidth}px, transparent ${spacing}px),
        repeating-linear-gradient(${a2}deg, ${inkRgba} 0, ${inkRgba} ${strokeWidth}px, transparent ${strokeWidth}px, transparent ${spacing}px),
        ${bgRgba}`;
    }

    // Lines - angle directly controls the gradient direction
    return `repeating-linear-gradient(${90 + angle}deg, ${inkRgba} 0, ${inkRgba} ${strokeWidth}px, transparent ${strokeWidth}px, transparent ${spacing}px), ${bgRgba}`;
  }

  function hexToRgba(hex, alpha) {
    const h = normalizeHexColor(hex, "#000000").slice(1);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
  }

  function hexToRgb(hex) {
    const h = normalizeHexColor(hex, "#000000").slice(1);
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  function getSlotBaseColor(slot) {
    if (!slot) return "#999999";
    if (slot.type === "solid") return slot.color || "#999999";
    return slot.backgroundColor || "#999999";
  }

  function buildAreaGradient(slot, slotIndex) {
    const ar = state.chartSettings.area;
    
    // Gradient only works if globally enabled
    if (!ar.gradientEnabled) return null;

    const grad = slot.areaGradient || {};
    const baseColor = getSlotBaseColor(slot);

    // Top color: use specified or slot color
    const topHex = grad.topColor || baseColor;
    const topRgb = hexToRgb(topHex);
    const topOpacity = grad.topOpacity ?? 1;

    // Bottom color: use shared settings or per-slot settings
    const bottomHex = ar.sharedBottomColor || grad.bottomColor || baseColor;
    const bottomOpacity = ar.sharedBottomOpacity ?? grad.bottomOpacity ?? 0.1;
    const bottomRgb = hexToRgb(bottomHex);

    // Calculate x1, y1, x2, y2 from angle
    // angle 0 = left to right, 90 = top to bottom, 180 = right to left, 270 = bottom to top
    const gradAngle = grad.angle ?? 90;
    const angleRad = (gradAngle * Math.PI) / 180;
    const x1 = 0.5 - Math.cos(angleRad) * 0.5;
    const y1 = 0.5 - Math.sin(angleRad) * 0.5;
    const x2 = 0.5 + Math.cos(angleRad) * 0.5;
    const y2 = 0.5 + Math.sin(angleRad) * 0.5;

    return {
      linearGradient: { x1, y1, x2, y2 },
      stops: [
        [0, `rgba(${topRgb.r}, ${topRgb.g}, ${topRgb.b}, ${topOpacity})`],
        [1, `rgba(${bottomRgb.r}, ${bottomRgb.g}, ${bottomRgb.b}, ${bottomOpacity})`],
      ],
    };
  }

  function applySwatchBackground(el, slot) {
    const css = swatchBackgroundCSS(slot);
    if (typeof css === "string") {
      el.style.background = css;
      el.style.backgroundSize = "";
    } else if (css && typeof css === "object") {
      el.style.background = css.background || "";
      el.style.backgroundColor = css.backgroundColor || "";
      el.style.backgroundSize = css.backgroundSize || "";
    }
  }

  let draggedSlotIndex = null;

  function renderSlotList() {
    $slotList.innerHTML = "";
    $slotList.setAttribute("aria-activedescendant", `slot-option-${state.ui.selectedSlot}`);

    for (let i = 0; i < 8; i++) {
      const slot = getActiveSlot(i);
      const version = getActiveVersion(i);
      
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = `slot-option-${i}`;
      btn.className = "slot-option";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", String(i === state.ui.selectedSlot));
      btn.tabIndex = i === state.ui.selectedSlot ? 0 : -1;
      btn.draggable = true;
      btn.dataset.slotIndex = String(i);

      btn.addEventListener("click", () => setSelectedSlot(i));

      btn.addEventListener("keydown", (e) => {
        const key = e.key;
        if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) {
          e.preventDefault();
          let next = state.ui.selectedSlot;
          if (key === "ArrowRight" || key === "ArrowDown") next = (next + 1) % 8;
          if (key === "ArrowLeft" || key === "ArrowUp") next = (next + 7) % 8;
          if (key === "Home") next = 0;
          if (key === "End") next = 7;
          setSelectedSlot(next);
        }
      });

      // Drag and drop handlers
      btn.addEventListener("dragstart", (e) => {
        draggedSlotIndex = i;
        btn.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(i));
      });

      btn.addEventListener("dragend", () => {
        btn.classList.remove("dragging");
        draggedSlotIndex = null;
        document.querySelectorAll(".slot-option.drag-over").forEach((el) => el.classList.remove("drag-over"));
      });

      btn.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (draggedSlotIndex !== null && draggedSlotIndex !== i) {
          btn.classList.add("drag-over");
        }
      });

      btn.addEventListener("dragleave", () => {
        btn.classList.remove("drag-over");
      });

      btn.addEventListener("drop", (e) => {
        e.preventDefault();
        btn.classList.remove("drag-over");
        if (draggedSlotIndex !== null && draggedSlotIndex !== i) {
          swapSlots(draggedSlotIndex, i);
        }
      });

      const sw = document.createElement("div");
      sw.className = "slot-swatch";
      applySwatchBackground(sw, slot);

      const label = document.createElement("span");
      label.className = "slot-label";
      label.textContent = String(i + 1);

      // Show version indicator if using B
      if (version === "b") {
        const versionBadge = document.createElement("span");
        versionBadge.className = "slot-version";
        versionBadge.textContent = "B";
        btn.appendChild(versionBadge);
      }

      btn.appendChild(sw);
      btn.appendChild(label);

      $slotList.appendChild(btn);
    }
  }

  function swapSlots(fromIndex, toIndex) {
    setState((s) => {
      // Swap in palette A
      const tempA = s.palette[fromIndex];
      s.palette[fromIndex] = s.palette[toIndex];
      s.palette[toIndex] = tempA;

      // Swap in palette B
      const tempB = s.paletteB[fromIndex];
      s.paletteB[fromIndex] = s.paletteB[toIndex];
      s.paletteB[toIndex] = tempB;

      // Swap active versions
      const tempVersion = s.ui.activeVersions[fromIndex];
      s.ui.activeVersions[fromIndex] = s.ui.activeVersions[toIndex];
      s.ui.activeVersions[toIndex] = tempVersion;

      // Update selected slot if needed
      if (s.ui.selectedSlot === fromIndex) {
        s.ui.selectedSlot = toIndex;
      } else if (s.ui.selectedSlot === toIndex) {
        s.ui.selectedSlot = fromIndex;
      }
    });
  }

  function setEditorVisibilityForMode(mode, patternType) {
    document.querySelectorAll("[data-only]").forEach((el) => {
      const only = el.getAttribute("data-only");
      el.style.display = only === mode ? "" : "none";
    });
    
    // Handle dots-specific visibility
    const isDots = patternType === "dots";
    document.querySelectorAll("[data-show='dots']").forEach((el) => {
      el.style.display = isDots ? "" : "none";
    });
    document.querySelectorAll("[data-hide='dots']").forEach((el) => {
      el.style.display = isDots ? "none" : "";
    });
  }

  function renderEditor() {
    const slot = getSelectedSlot();
    if (!slot) return;

    $slotName.value = slot.label || `Slot ${state.ui.selectedSlot + 1}`;
    $slotMode.value = slot.type;

    // Don't update focused inputs to avoid interrupting typing
    const activeEl = document.activeElement;
    
    if (slot.type === "solid") {
      if (activeEl !== $solidColor) $solidColor.value = normalizeHexColor(slot.color, "#999999").slice(1);
      if (activeEl !== $backgroundColor) $backgroundColor.value = normalizeHexColor(slot.color, "#999999").slice(1);
      setEditorVisibilityForMode("solid", null);
    } else {
      if (activeEl !== $backgroundColor) $backgroundColor.value = normalizeHexColor(slot.backgroundColor, "#ffffff").slice(1);
      if (activeEl !== $inkColor) $inkColor.value = normalizeHexColor(slot.inkColor, "#000000").slice(1);
      if (activeEl !== $solidColor) $solidColor.value = normalizeHexColor(slot.backgroundColor, "#ffffff").slice(1);

      $patternType.value = slot.patternType;
      $spacing.value = String(slot.spacing);
      $strokeWidth.value = String(slot.strokeWidth);
      $opacity.value = String(slot.opacity);
      $angle.value = String(slot.angle);
      $invert.classList.toggle("active", !!slot.invert);
      $roundCaps.classList.toggle("active", !!slot.roundCaps);

      // Update number inputs (skip if focused to avoid interrupting typing)
      if (activeEl !== $spacingNum) $spacingNum.value = slot.spacing;
      if (activeEl !== $strokeWidthNum) $strokeWidthNum.value = slot.strokeWidth;
      if (activeEl !== $opacityNum) $opacityNum.value = Math.round(slot.opacity * 100);
      if (activeEl !== $angleNum) $angleNum.value = slot.angle;

      // Dots-specific controls
      $dotShape.value = slot.dotShape || "circle";
      $dotOffsetX.value = String(slot.dotOffsetX || 0);
      $dotOffsetY.value = String(slot.dotOffsetY || 0);
      $dotStaggered.classList.toggle("active", !!slot.dotStaggered);
      $invertDots.classList.toggle("active", !!slot.invert);
      if (activeEl !== $dotOffsetXNum) $dotOffsetXNum.value = slot.dotOffsetX || 0;
      if (activeEl !== $dotOffsetYNum) $dotOffsetYNum.value = slot.dotOffsetY || 0;

      // Sync dots-specific duplicate inputs
      if ($spacingDots) $spacingDots.value = String(slot.spacing);
      if ($spacingNumDots && activeEl !== $spacingNumDots) $spacingNumDots.value = slot.spacing;
      if ($strokeWidthDots) $strokeWidthDots.value = String(slot.strokeWidth);
      if ($strokeWidthNumDots && activeEl !== $strokeWidthNumDots) $strokeWidthNumDots.value = slot.strokeWidth;
      if ($opacityDots) $opacityDots.value = String(slot.opacity);
      if ($opacityNumDots && activeEl !== $opacityNumDots) $opacityNumDots.value = Math.round(slot.opacity * 100);

      setEditorVisibilityForMode("pattern", slot.patternType);
    }

    // Update copy buttons - mark current slot
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      const slotIdx = Number(btn.dataset.slot);
      btn.classList.toggle("current", slotIdx === state.ui.selectedSlot);
    });

    // Update A/B toggle
    const currentVersion = getActiveVersion(state.ui.selectedSlot);
    $btnVersionA.classList.toggle("active", currentVersion === "a");
    $btnVersionB.classList.toggle("active", currentVersion === "b");
  }

  const charts = [];
  const CATEGORIES = ["A", "B", "C", "D", "E", "F", "G", "H"];

  function buildPaletteColors() {
    return state.ui.activeVersions.map((v, i) => 
      slotToHighchartsColor(v === "b" ? state.paletteB[i] : state.palette[i])
    );
  }

  function buildPointSeriesData(paletteColors) {
    const values = [8, 6, 7, 4, 9, 5, 3, 7];
    return CATEGORIES.map((name, i) => ({
      name,
      y: values[i],
      color: paletteColors[i],
    }));
  }

  function buildStackedSeries(paletteColors, kind) {
    const base = kind === "area" ? [2, 3, 2, 4, 3, 2, 3, 2] : [2, 3, 2];
    const categories = kind === "area" ? CATEGORIES : ["Group 1", "Group 2", "Group 3"];

    const series = state.palette.map((slot, i) => {
      const seed = i + 1;
      const data = categories.map((_, x) => Math.max(1, Math.round(base[x % base.length] + (seed % 3) + (x % 2))));
      return {
        id: `slot-${i}`,
        name: slot.label || `Slot ${i + 1}`,
        color: paletteColors[i],
        data,
      };
    });

    return { categories, series };
  }

  function makeBaseChartOptions() {
    const g = state.chartSettings.global;
    return {
      title: { text: null },
      credits: { enabled: false },
      accessibility: { enabled: true },
      legend: { enabled: g.legend },
      xAxis: { 
        title: { text: null }, 
        labels: { enabled: g.axisLabels, style: { fontSize: "10px" } },
        gridLineWidth: g.gridLines ? 1 : 0,
      },
      yAxis: { 
        title: { text: null }, 
        labels: { enabled: g.axisLabels, style: { fontSize: "10px" } },
        gridLineWidth: g.gridLines ? 1 : 0,
      },
      tooltip: { enabled: g.tooltip, shared: false },
      chart: {
        backgroundColor: "transparent",
        spacing: [8, 8, 8, 8],
        style: { fontFamily: "inherit" },
        animation: g.animation,
      },
      exporting: { enabled: false },
    };
  }

  function initCharts() {
    if (!window.Highcharts) return;
    charts.splice(0, charts.length);

    const paletteColors = buildPaletteColors();

    // Column
    {
      const id = "chart-column";
      const cb = state.chartSettings.columnBar;
      const g = state.chartSettings.global;
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "column" },
        xAxis: { ...makeBaseChartOptions().xAxis, categories: CATEGORIES },
        plotOptions: { 
          series: { 
            animation: g.animation, 
            borderWidth: cb.borderWidth,
            borderRadius: cb.borderRadius,
            pointPadding: cb.pointPadding,
            groupPadding: cb.groupPadding,
            dataLabels: { enabled: g.dataLabels },
          } 
        },
        series: [{ name: "Values", data: buildPointSeriesData(paletteColors) }],
      });
      charts.push({
        id,
        chart,
        type: "columnBar",
        update: () => {
          const colors = buildPaletteColors();
          chart.series[0].setData(buildPointSeriesData(colors), true, false, false);
        },
      });
    }

    // Bar
    {
      const id = "chart-bar";
      const cb = state.chartSettings.columnBar;
      const g = state.chartSettings.global;
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "bar" },
        xAxis: { ...makeBaseChartOptions().xAxis, categories: CATEGORIES },
        plotOptions: { 
          series: { 
            animation: g.animation, 
            borderWidth: cb.borderWidth,
            borderRadius: cb.borderRadius,
            pointPadding: cb.pointPadding,
            groupPadding: cb.groupPadding,
            dataLabels: { enabled: g.dataLabels },
          } 
        },
        series: [{ name: "Values", data: buildPointSeriesData(paletteColors) }],
      });
      charts.push({
        id,
        chart,
        type: "columnBar",
        update: () => {
          const colors = buildPaletteColors();
          chart.series[0].setData(buildPointSeriesData(colors), true, false, false);
        },
      });
    }

    // Stacked bar
    {
      const id = "chart-stacked-bar";
      const stacked = buildStackedSeries(paletteColors, "bar");
      const cb = state.chartSettings.columnBar;
      const g = state.chartSettings.global;
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "bar" },
        xAxis: { ...makeBaseChartOptions().xAxis, categories: stacked.categories },
        plotOptions: { 
          series: { 
            stacking: "normal", 
            animation: g.animation, 
            borderWidth: cb.borderWidth,
            borderRadius: cb.borderRadius,
            dataLabels: { enabled: g.dataLabels },
          } 
        },
        series: stacked.series,
      });
      charts.push({
        id,
        chart,
        type: "columnBar",
        update: () => {
          const colors = buildPaletteColors();
          state.palette.forEach((slot, i) => {
            const s = chart.get(`slot-${i}`);
            if (s) s.update({ name: slot.label || `Slot ${i + 1}`, color: colors[i] }, false);
          });
          chart.redraw();
        },
      });
    }

    // Line
    {
      const id = "chart-line";
      const ln = state.chartSettings.line;
      const g = state.chartSettings.global;
      const series = state.palette.map((slot, i) => ({
        id: `slot-${i}`,
        name: slot.label || `Slot ${i + 1}`,
        color: paletteColors[i],
        data: CATEGORIES.map((_, x) => clamp(Math.round(3 + (i % 4) + (x % 3)), 1, 10)),
      }));
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "line" },
        xAxis: { ...makeBaseChartOptions().xAxis, categories: CATEGORIES },
        plotOptions: { 
          series: { 
            animation: g.animation, 
            lineWidth: ln.lineWidth,
            dashStyle: ln.dashStyle,
            marker: { enabled: ln.markerEnabled, radius: ln.markerRadius },
            dataLabels: { enabled: g.dataLabels },
          } 
        },
        series,
      });
      charts.push({
        id,
        chart,
        type: "line",
        update: () => {
          const colors = buildPaletteColors();
          state.palette.forEach((slot, i) => {
            const s = chart.get(`slot-${i}`);
            if (s) s.update({ name: slot.label || `Slot ${i + 1}`, color: colors[i] }, false);
          });
          chart.redraw();
        },
      });
    }

    // Area
    {
      const id = "chart-area";
      const ar = state.chartSettings.area;
      const g = state.chartSettings.global;
      const series = state.palette.map((slot, i) => {
        const activeSlot = getActiveSlot(i);
        const gradient = buildAreaGradient(activeSlot, i);
        return {
          id: `slot-${i}`,
          name: slot.label || `Slot ${i + 1}`,
          color: paletteColors[i],
          fillColor: gradient || undefined,
          fillOpacity: gradient ? 1 : ar.fillOpacity,
          data: CATEGORIES.map((_, x) => clamp(Math.round(2 + (i % 4) + (x % 3)), 1, 10)),
        };
      });
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "area" },
        xAxis: { ...makeBaseChartOptions().xAxis, categories: CATEGORIES },
        plotOptions: { 
          series: { 
            animation: g.animation, 
            lineWidth: ar.lineWidth,
            marker: { enabled: ar.markerEnabled },
            dataLabels: { enabled: g.dataLabels },
          } 
        },
        series,
      });
      charts.push({
        id,
        chart,
        type: "area",
        update: () => {
          const colors = buildPaletteColors();
          const arSettings = state.chartSettings.area;
          state.palette.forEach((slot, i) => {
            const s = chart.get(`slot-${i}`);
            if (s) {
              const activeSlot = getActiveSlot(i);
              const gradient = buildAreaGradient(activeSlot, i);
              s.update({ 
                name: slot.label || `Slot ${i + 1}`, 
                color: colors[i],
                fillColor: gradient || undefined,
                fillOpacity: gradient ? 1 : arSettings.fillOpacity,
              }, false);
            }
          });
          chart.redraw();
        },
      });
    }

    // Stacked area
    {
      const id = "chart-stacked-area";
      const stacked = buildStackedSeries(paletteColors, "area");
      const ar = state.chartSettings.area;
      const g = state.chartSettings.global;
      // Add gradient support to stacked series
      const seriesWithGradient = stacked.series.map((s, i) => {
        const activeSlot = getActiveSlot(i);
        const gradient = buildAreaGradient(activeSlot, i);
        return {
          ...s,
          fillColor: gradient || undefined,
          fillOpacity: gradient ? 1 : ar.fillOpacity,
        };
      });
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "area" },
        xAxis: { ...makeBaseChartOptions().xAxis, categories: stacked.categories },
        plotOptions: { 
          series: { 
            stacking: "normal", 
            animation: g.animation, 
            lineWidth: ar.lineWidth,
            marker: { enabled: ar.markerEnabled }, 
            dataLabels: { enabled: g.dataLabels },
          } 
        },
        series: seriesWithGradient,
      });
      charts.push({
        id,
        chart,
        type: "area",
        update: () => {
          const colors = buildPaletteColors();
          const arSettings = state.chartSettings.area;
          state.palette.forEach((slot, i) => {
            const s = chart.get(`slot-${i}`);
            if (s) {
              const activeSlot = getActiveSlot(i);
              const gradient = buildAreaGradient(activeSlot, i);
              s.update({ 
                name: slot.label || `Slot ${i + 1}`, 
                color: colors[i],
                fillColor: gradient || undefined,
                fillOpacity: gradient ? 1 : arSettings.fillOpacity,
              }, false);
            }
          });
          chart.redraw();
        },
      });
    }

    // Pie
    {
      const id = "chart-pie";
      const pi = state.chartSettings.pie;
      const g = state.chartSettings.global;
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "pie" },
        plotOptions: { 
          pie: { 
            animation: g.animation, 
            startAngle: pi.startAngle,
            slicedOffset: pi.slicedOffset,
            borderWidth: pi.borderWidth,
            borderColor: state.ui.darkTheme ? "#0f1a2f" : "#f8fafc",
            dataLabels: { 
              enabled: g.dataLabels,
              distance: pi.dataLabelDistance,
            } 
          } 
        },
        series: [{ name: "Share", data: buildPointSeriesData(paletteColors) }],
      });
      charts.push({
        id,
        chart,
        type: "pie",
        update: () => {
          const colors = buildPaletteColors();
          chart.series[0].setData(buildPointSeriesData(colors), true, false, false);
        },
      });
    }

    // Donut
    {
      const id = "chart-donut";
      const pi = state.chartSettings.pie;
      const g = state.chartSettings.global;
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "pie" },
        plotOptions: { 
          pie: { 
            innerSize: "55%", 
            animation: g.animation,
            startAngle: pi.startAngle,
            slicedOffset: pi.slicedOffset,
            borderWidth: pi.borderWidth,
            borderColor: state.ui.darkTheme ? "#0f1a2f" : "#f8fafc",
            dataLabels: { 
              enabled: g.dataLabels,
              distance: pi.dataLabelDistance,
            } 
          } 
        },
        series: [{ name: "Share", data: buildPointSeriesData(paletteColors) }],
      });
      charts.push({
        id,
        chart,
        type: "pie",
        update: () => {
          const colors = buildPaletteColors();
          chart.series[0].setData(buildPointSeriesData(colors), true, false, false);
        },
      });
    }

    // Funnel
    {
      const id = "chart-funnel";
      const fn = state.chartSettings.funnel;
      const g = state.chartSettings.global;
      const data = buildPointSeriesData(paletteColors).map((p) => [p.name, p.y, p.color]);
      const chart = Highcharts.chart(id, {
        ...makeBaseChartOptions(),
        chart: { ...makeBaseChartOptions().chart, type: "funnel" },
        plotOptions: { 
          series: { 
            animation: g.animation, 
            neckWidth: fn.neckWidthPercent + "%",
            neckHeight: fn.neckHeightPercent + "%",
            reversed: fn.reversed,
            dataLabels: { enabled: g.dataLabels } 
          } 
        },
        series: [{ name: "Funnel", data: data.map(([name, y, color]) => ({ name, y, color })) }],
      });
      charts.push({
        id,
        chart,
        type: "funnel",
        update: () => {
          const colors = buildPaletteColors();
          const updated = buildPointSeriesData(colors).map((p) => ({ name: p.name, y: p.y, color: p.color }));
          chart.series[0].setData(updated, true, false, false);
        },
      });
    }
  }

  function updateCharts() {
    charts.forEach((c) => {
      try {
        c.update();
      } catch {
        // ignore
      }
    });

    if (mapChart) {
      try {
        renderMapChart();
      } catch {
        // ignore
      }
    }
  }

  function applyChartSettings() {
    const g = state.chartSettings.global;
    const cb = state.chartSettings.columnBar;
    const ln = state.chartSettings.line;
    const ar = state.chartSettings.area;
    const pi = state.chartSettings.pie;
    const fn = state.chartSettings.funnel;

    charts.forEach((c) => {
      try {
        const baseUpdate = {
          legend: { enabled: g.legend },
          tooltip: { enabled: g.tooltip },
          chart: { animation: g.animation },
          xAxis: { 
            labels: { enabled: g.axisLabels },
            gridLineWidth: g.gridLines ? 1 : 0,
          },
          yAxis: { 
            labels: { enabled: g.axisLabels },
            gridLineWidth: g.gridLines ? 1 : 0,
          },
        };

        if (c.type === "columnBar") {
          c.chart.update({
            ...baseUpdate,
            plotOptions: {
              series: {
                animation: g.animation,
                borderWidth: cb.borderWidth,
                borderRadius: cb.borderRadius,
                pointPadding: cb.pointPadding,
                groupPadding: cb.groupPadding,
                dataLabels: { enabled: g.dataLabels },
              },
            },
          }, true, false, false);
        } else if (c.type === "line") {
          c.chart.update({
            ...baseUpdate,
            plotOptions: {
              series: {
                animation: g.animation,
                lineWidth: ln.lineWidth,
                dashStyle: ln.dashStyle,
                marker: { enabled: ln.markerEnabled, radius: ln.markerRadius },
                dataLabels: { enabled: g.dataLabels },
              },
            },
          }, true, false, false);
        } else if (c.type === "area") {
          c.chart.update({
            ...baseUpdate,
            plotOptions: {
              series: {
                animation: g.animation,
                lineWidth: ar.lineWidth,
                fillOpacity: ar.fillOpacity,
                marker: { enabled: ar.markerEnabled },
                dataLabels: { enabled: g.dataLabels },
              },
            },
          }, true, false, false);
        } else if (c.type === "pie") {
          c.chart.update({
            ...baseUpdate,
            plotOptions: {
              pie: {
                animation: g.animation,
                startAngle: pi.startAngle,
                slicedOffset: pi.slicedOffset,
                borderWidth: pi.borderWidth,
                borderColor: state.ui.darkTheme ? "#0f1a2f" : "#f8fafc",
                dataLabels: { 
                  enabled: g.dataLabels,
                  distance: pi.dataLabelDistance,
                },
              },
            },
          }, true, false, false);
        } else if (c.type === "funnel") {
          c.chart.update({
            ...baseUpdate,
            plotOptions: {
              series: {
                animation: g.animation,
                neckWidth: fn.neckWidthPercent + "%",
                neckHeight: fn.neckHeightPercent + "%",
                reversed: fn.reversed,
                dataLabels: { enabled: g.dataLabels },
              },
            },
          }, true, false, false);
        }
      } catch {
        // ignore
      }
    });
  }

  function renderAll() {
    syncToggleInputs();
    setBodyModesFromState();
    renderSlotList();
    renderEditor();
    renderGradientControls();
    renderChartSettings();
    updateCharts();
  }

  function resetSlotToDefault(index) {
    const version = getActiveVersion(index);
    setState((s) => {
      if (version === "b") {
        s.paletteB[index] = deepCopy(DEFAULT_STATE.paletteB[index]);
      } else {
        s.palette[index] = deepCopy(DEFAULT_STATE.palette[index]);
      }
    });
  }

  function replaceSlot(index, nextSlot) {
    const version = getActiveVersion(index);
    setState((s) => {
      if (version === "b") {
        s.paletteB[index] = normalizeSlot(nextSlot, DEFAULT_STATE.paletteB[index], index);
      } else {
        s.palette[index] = normalizeSlot(nextSlot, DEFAULT_STATE.palette[index], index);
      }
    });
  }

  function setSlotVersion(index, version) {
    setState((s) => {
      s.ui.activeVersions[index] = version;
    });
  }

  function copySlotAtoB(index) {
    setState((s) => {
      s.paletteB[index] = deepCopy(s.palette[index]);
    });
  }

  function copySlotBtoA(index) {
    setState((s) => {
      s.palette[index] = deepCopy(s.paletteB[index]);
    });
  }

  function wireSnapButtons() {
    document.querySelectorAll(".snap-buttons").forEach((container) => {
      const targetId = container.dataset.target;
      const targetInput = document.getElementById(targetId);
      const targetNumInput = document.getElementById(targetId + "Num");
      if (!targetInput) return;

      container.querySelectorAll("button[data-value]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const value = Number(btn.dataset.value);
          targetInput.value = String(value);
          if (targetNumInput) targetNumInput.value = String(value);
          targetInput.dispatchEvent(new Event("input", { bubbles: true }));
        });
      });
    });
  }


  // Keyboard handler for number inputs - handles arrow up/down for increment/decrement
  function handleNumInputKeydown(e) {
    const numEl = e.target;
    const step = Number(numEl.step) || 1;
    const min = Number(numEl.min);
    const max = Number(numEl.max);
    let val = Number(numEl.value) || min;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      val = clamp(val + step, min, max);
      numEl.value = val;
      numEl.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      val = clamp(val - step, min, max);
      numEl.value = val;
      numEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function wireUI() {
    const $slotEditor = document.getElementById("slotEditor");
    $slotEditor.addEventListener("submit", (e) => e.preventDefault());

    // Wire snap buttons for all angle controls
    wireSnapButtons();

    $toggleTheme.addEventListener("change", () => setState((s) => (s.ui.darkTheme = $toggleTheme.checked)));
    $toggleGrayscale.addEventListener("change", () => setState((s) => (s.ui.grayscale = $toggleGrayscale.checked)));
    $toggleLowContrast.addEventListener("change", () => setState((s) => (s.ui.lowContrast = $toggleLowContrast.checked)));

    // A/B version controls
    $btnVersionA.addEventListener("click", () => setSlotVersion(state.ui.selectedSlot, "a"));
    $btnVersionB.addEventListener("click", () => setSlotVersion(state.ui.selectedSlot, "b"));
    $btnCopyAtoB.addEventListener("click", () => copySlotAtoB(state.ui.selectedSlot));
    $btnCopyBtoA.addEventListener("click", () => copySlotBtoA(state.ui.selectedSlot));

    $slotName.addEventListener("input", () =>
      setState((s) => {
        const idx = s.ui.selectedSlot;
        const slot = s.ui.activeVersions[idx] === "b" ? s.paletteB[idx] : s.palette[idx];
        slot.label = ($slotName.value || "").slice(0, 32);
      }),
    );

    $slotMode.addEventListener("change", () =>
      setState((s) => {
        const i = s.ui.selectedSlot;
        const isB = s.ui.activeVersions[i] === "b";
        const palette = isB ? s.paletteB : s.palette;
        const defaults = isB ? DEFAULT_STATE.paletteB : DEFAULT_STATE.palette;
        const prev = palette[i];
        const nextType = $slotMode.value === "pattern" ? "pattern" : "solid";
        if (prev.type === nextType) return;

        if (nextType === "solid") {
          const color = prev.type === "pattern" ? prev.backgroundColor : prev.color;
          palette[i] = normalizeSlot({ type: "solid", label: prev.label || `Slot ${i + 1}`, color }, defaults[i], i);
          return;
        }

        const bg = prev.type === "solid" ? prev.color : prev.backgroundColor;
        palette[i] = normalizeSlot(
          {
            type: "pattern",
            label: prev.label || `Slot ${i + 1}`,
            backgroundColor: bg,
            inkColor: "#ffffff",
            patternType: "lines",
            spacing: 14,
            strokeWidth: 4,
            opacity: 0.85,
            angle: 45,
            invert: false,
            roundCaps: true,
          },
          defaults[i],
          i,
        );
      }),
    );

    // Helper to get the active slot for editing
    const getEditSlot = (s) => {
      const i = s.ui.selectedSlot;
      return s.ui.activeVersions[i] === "b" ? s.paletteB[i] : s.palette[i];
    };

    $solidColor.addEventListener("input", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        const c = normalizeHexColor("#" + $solidColor.value, slot.type === "solid" ? slot.color : slot.backgroundColor);
        if (slot.type === "solid") slot.color = c;
        if (slot.type === "pattern") slot.backgroundColor = c;
      }),
    );

    $backgroundColor.addEventListener("input", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        const c = normalizeHexColor("#" + $backgroundColor.value, slot.type === "solid" ? slot.color : slot.backgroundColor);
        if (slot.type === "solid") slot.color = c;
        if (slot.type === "pattern") slot.backgroundColor = c;
      }),
    );

    $inkColor.addEventListener("input", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.inkColor = normalizeHexColor("#" + $inkColor.value, slot.inkColor);
      }),
    );

    $patternType.addEventListener("change", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.patternType = normalizePatternType($patternType.value, slot.patternType);
      }),
    );

    // Wire spacing range + number input pair
    const handleSpacingChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.spacing = clamp(val, 4, 40);
      });
    };
    $spacing.addEventListener("input", () => {
      $spacingNum.value = $spacing.value;
      handleSpacingChange(Number($spacing.value));
    });
    $spacingNum.addEventListener("input", () => {
      const val = clamp(Number($spacingNum.value) || 4, 4, 40);
      $spacing.value = val;
      handleSpacingChange(val);
    });
    $spacingNum.addEventListener("blur", () => {
      const val = clamp(Number($spacingNum.value) || 4, 4, 40);
      $spacingNum.value = val;
      $spacing.value = val;
    });
    $spacingNum.addEventListener("keydown", handleNumInputKeydown);

    // Wire dots-specific spacing controls
    if ($spacingDots && $spacingNumDots) {
      $spacingDots.addEventListener("input", () => {
        $spacingNumDots.value = $spacingDots.value;
        handleSpacingChange(Number($spacingDots.value));
      });
      $spacingNumDots.addEventListener("input", () => {
        const val = clamp(Number($spacingNumDots.value) || 4, 4, 40);
        $spacingDots.value = val;
        handleSpacingChange(val);
      });
      $spacingNumDots.addEventListener("blur", () => {
        const val = clamp(Number($spacingNumDots.value) || 4, 4, 40);
        $spacingNumDots.value = val;
        $spacingDots.value = val;
      });
      $spacingNumDots.addEventListener("keydown", handleNumInputKeydown);
    }

    // Wire strokeWidth range + number input pair
    const handleStrokeWidthChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.strokeWidth = clamp(val, 1, 12);
      });
    };
    $strokeWidth.addEventListener("input", () => {
      $strokeWidthNum.value = $strokeWidth.value;
      handleStrokeWidthChange(Number($strokeWidth.value));
    });
    $strokeWidthNum.addEventListener("input", () => {
      const val = clamp(Number($strokeWidthNum.value) || 1, 1, 12);
      $strokeWidth.value = val;
      handleStrokeWidthChange(val);
    });
    $strokeWidthNum.addEventListener("blur", () => {
      const val = clamp(Number($strokeWidthNum.value) || 1, 1, 12);
      $strokeWidthNum.value = val;
      $strokeWidth.value = val;
    });
    $strokeWidthNum.addEventListener("keydown", handleNumInputKeydown);

    // Wire dots-specific stroke width (labeled "Size" in UI)
    if ($strokeWidthDots && $strokeWidthNumDots) {
      $strokeWidthDots.addEventListener("input", () => {
        $strokeWidthNumDots.value = $strokeWidthDots.value;
        handleStrokeWidthChange(Number($strokeWidthDots.value));
      });
      $strokeWidthNumDots.addEventListener("input", () => {
        const val = clamp(Number($strokeWidthNumDots.value) || 1, 1, 12);
        $strokeWidthDots.value = val;
        handleStrokeWidthChange(val);
      });
      $strokeWidthNumDots.addEventListener("blur", () => {
        const val = clamp(Number($strokeWidthNumDots.value) || 1, 1, 12);
        $strokeWidthNumDots.value = val;
        $strokeWidthDots.value = val;
      });
      $strokeWidthNumDots.addEventListener("keydown", handleNumInputKeydown);
    }

    // Wire opacity range + number input pair (converts between 0-1 and 0-100%)
    const handleOpacityChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.opacity = clamp(val, 0.05, 1);
      });
    };
    $opacity.addEventListener("input", () => {
      $opacityNum.value = Math.round(Number($opacity.value) * 100);
      handleOpacityChange(Number($opacity.value));
    });
    $opacityNum.addEventListener("input", () => {
      const pct = clamp(Number($opacityNum.value) || 5, 5, 100);
      const val = pct / 100;
      $opacity.value = val;
      handleOpacityChange(val);
    });
    $opacityNum.addEventListener("blur", () => {
      const pct = clamp(Number($opacityNum.value) || 5, 5, 100);
      $opacityNum.value = pct;
      $opacity.value = pct / 100;
    });
    $opacityNum.addEventListener("keydown", handleNumInputKeydown);

    // Wire dots-specific opacity
    if ($opacityDots && $opacityNumDots) {
      $opacityDots.addEventListener("input", () => {
        $opacityNumDots.value = Math.round(Number($opacityDots.value) * 100);
        handleOpacityChange(Number($opacityDots.value));
      });
      $opacityNumDots.addEventListener("input", () => {
        const pct = clamp(Number($opacityNumDots.value) || 5, 5, 100);
        const val = pct / 100;
        $opacityDots.value = val;
        handleOpacityChange(val);
      });
      $opacityNumDots.addEventListener("blur", () => {
        const pct = clamp(Number($opacityNumDots.value) || 5, 5, 100);
        $opacityNumDots.value = pct;
        $opacityDots.value = pct / 100;
      });
      $opacityNumDots.addEventListener("keydown", handleNumInputKeydown);
    }

    // Wire angle range + number input pair
    const handleAngleChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.angle = clamp(val, 0, 180);
      });
    };
    $angle.addEventListener("input", () => {
      $angleNum.value = $angle.value;
      handleAngleChange(Number($angle.value));
    });
    $angleNum.addEventListener("input", () => {
      const val = clamp(Number($angleNum.value) || 0, 0, 180);
      $angle.value = val;
      handleAngleChange(val);
    });
    $angleNum.addEventListener("blur", () => {
      const val = clamp(Number($angleNum.value) || 0, 0, 180);
      $angleNum.value = val;
      $angle.value = val;
    });
    $angleNum.addEventListener("keydown", handleNumInputKeydown);

    $invert.addEventListener("click", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.invert = !slot.invert;
      }),
    );

    $roundCaps.addEventListener("click", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.roundCaps = !slot.roundCaps;
      }),
    );

    // Dots-specific controls
    $dotShape.addEventListener("change", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern" || slot.patternType !== "dots") return;
        slot.dotShape = normalizeDotShape($dotShape.value, "circle");
      }),
    );

    // Wire dotOffsetX range + number input pair
    const handleDotOffsetXChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern" || slot.patternType !== "dots") return;
        slot.dotOffsetX = clamp(val, 0, 100);
      });
    };
    $dotOffsetX.addEventListener("input", () => {
      $dotOffsetXNum.value = $dotOffsetX.value;
      handleDotOffsetXChange(Number($dotOffsetX.value));
    });
    $dotOffsetXNum.addEventListener("input", () => {
      const val = clamp(Number($dotOffsetXNum.value) || 0, 0, 100);
      $dotOffsetX.value = val;
      handleDotOffsetXChange(val);
    });
    $dotOffsetXNum.addEventListener("blur", () => {
      const val = clamp(Number($dotOffsetXNum.value) || 0, 0, 100);
      $dotOffsetXNum.value = val;
      $dotOffsetX.value = val;
    });
    $dotOffsetXNum.addEventListener("keydown", handleNumInputKeydown);

    // Wire dotOffsetY range + number input pair
    const handleDotOffsetYChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern" || slot.patternType !== "dots") return;
        slot.dotOffsetY = clamp(val, 0, 100);
      });
    };
    $dotOffsetY.addEventListener("input", () => {
      $dotOffsetYNum.value = $dotOffsetY.value;
      handleDotOffsetYChange(Number($dotOffsetY.value));
    });
    $dotOffsetYNum.addEventListener("input", () => {
      const val = clamp(Number($dotOffsetYNum.value) || 0, 0, 100);
      $dotOffsetY.value = val;
      handleDotOffsetYChange(val);
    });
    $dotOffsetYNum.addEventListener("blur", () => {
      const val = clamp(Number($dotOffsetYNum.value) || 0, 0, 100);
      $dotOffsetYNum.value = val;
      $dotOffsetY.value = val;
    });
    $dotOffsetYNum.addEventListener("keydown", handleNumInputKeydown);

    $dotStaggered.addEventListener("click", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern" || slot.patternType !== "dots") return;
        slot.dotStaggered = !slot.dotStaggered;
      }),
    );

    $invertDots.addEventListener("click", () =>
      setState((s) => {
        const slot = getEditSlot(s);
        if (slot.type !== "pattern") return;
        slot.invert = !slot.invert;
      }),
    );

    $btnResetSlot.addEventListener("click", () => resetSlotToDefault(state.ui.selectedSlot));

    // Copy to slot buttons
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = clamp(Number(btn.dataset.slot), 0, 7);
        if (target === state.ui.selectedSlot) return; // Can't copy to self
        const src = deepCopy(getSelectedSlot());
        replaceSlot(target, src);
      });
    });

    $btnExport.addEventListener("click", async () => {
      const payload = JSON.stringify(state, null, 2);
      const ok = await writeClipboard(payload);
      if (!ok) {
        window.alert("Could not copy to clipboard. Your export JSON is in the Import panel textarea.");
        $importText.value = payload;
        document.getElementById("importPanel").open = true;
        $importText.focus();
        $importText.select();
      }
    });

    $btnShare.addEventListener("click", async () => {
      const hash = encodeStateToHash(state);
      window.history.replaceState(null, "", hash);
      const url = window.location.href;
      const ok = await writeClipboard(url);
      if (!ok) window.alert("Could not copy link to clipboard.");
    });

    $btnResetAll.addEventListener("click", () => {
      setState((s) => {
        Object.assign(s, deepCopy(DEFAULT_STATE));
      });
    });

    $btnClearSaved.addEventListener("click", () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      window.alert("Saved state cleared.");
    });

    $importFile.addEventListener("change", async () => {
      const file = $importFile.files && $importFile.files[0];
      if (!file) return;
      const text = await file.text();
      const parsed = safeParseJSON(text);
      if (!parsed.ok) return window.alert("Invalid JSON file.");
      setState((s) => Object.assign(s, migrateState(parsed.value)));
      window.alert("Imported palette.");
    });

    $btnImportText.addEventListener("click", () => {
      const parsed = safeParseJSON($importText.value || "");
      if (!parsed.ok) return window.alert("Invalid JSON.");
      setState((s) => Object.assign(s, migrateState(parsed.value)));
      window.alert("Imported palette.");
    });

    $btnLoadMap.addEventListener("click", async () => {
      $btnLoadMap.disabled = true;
      $mapStatus.textContent = "Loading…";
      try {
        await loadScriptOnce("https://code.highcharts.com/maps/highmaps.js");
        await loadScriptOnce("https://code.highcharts.com/mapdata/custom/world.js");
        $mapStatus.textContent = "";
        $mapContainer.hidden = false;
        renderMapChart();
      } catch (e) {
        $mapStatus.textContent = "Failed to load map.";
      } finally {
        $btnLoadMap.disabled = false;
      }
    });

    // Chart settings controls
    wireChartSettings();

    // Gradient controls
    wireGradientControls();
  }

  function wireChartSettings() {
    // Global settings
    const globalToggles = ["animation", "legend", "tooltip", "gridLines", "axisLabels", "dataLabels"];
    globalToggles.forEach((key) => {
      const el = document.getElementById(`cs-global-${key}`);
      if (el) {
        el.addEventListener("change", () => {
          setState((s) => {
            s.chartSettings.global[key] = el.checked;
          });
          applyChartSettings();
        });
      }
    });

    // Column/Bar settings - wire range + number input pairs
    const cbRanges = [
      { id: "cs-cb-borderRadius", key: "borderRadius", min: 0, max: 20, unit: "px" },
      { id: "cs-cb-pointPadding", key: "pointPadding", min: 0, max: 0.5, isDecimal: true },
      { id: "cs-cb-groupPadding", key: "groupPadding", min: 0, max: 0.5, isDecimal: true },
      { id: "cs-cb-borderWidth", key: "borderWidth", min: 0, max: 5, unit: "px" },
    ];
    cbRanges.forEach(({ id, key, min, max, isDecimal }) => {
      const el = document.getElementById(id);
      const numEl = document.getElementById(id + "Num");
      const handler = (val) => {
        setState((s) => {
          s.chartSettings.columnBar[key] = clamp(val, min, max);
        });
        applyChartSettings();
        renderChartSettingsValues();
      };
      if (el) {
        el.addEventListener("input", () => {
          const val = Number(el.value);
          if (numEl) numEl.value = isDecimal ? val.toFixed(2) : val;
          handler(val);
        });
      }
      if (numEl) {
        numEl.addEventListener("input", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          if (el) el.value = val;
          handler(val);
        });
        numEl.addEventListener("blur", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          numEl.value = isDecimal ? val.toFixed(2) : val;
          if (el) el.value = val;
        });
        numEl.addEventListener("keydown", handleNumInputKeydown);
      }
    });

    // Line settings - wire range + number input pairs
    const lineRanges = [
      { id: "cs-line-lineWidth", key: "lineWidth", min: 1, max: 8 },
      { id: "cs-line-markerRadius", key: "markerRadius", min: 2, max: 10 },
    ];
    lineRanges.forEach(({ id, key, min, max }) => {
      const el = document.getElementById(id);
      const numEl = document.getElementById(id + "Num");
      const handler = (val) => {
        setState((s) => {
          s.chartSettings.line[key] = clamp(val, min, max);
        });
        applyChartSettings();
        renderChartSettingsValues();
      };
      if (el) {
        el.addEventListener("input", () => {
          const val = Number(el.value);
          if (numEl) numEl.value = val;
          handler(val);
        });
      }
      if (numEl) {
        numEl.addEventListener("input", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          if (el) el.value = val;
          handler(val);
        });
        numEl.addEventListener("blur", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          numEl.value = val;
          if (el) el.value = val;
        });
        numEl.addEventListener("keydown", handleNumInputKeydown);
      }
    });

    const lineMarkerEnabled = document.getElementById("cs-line-markerEnabled");
    if (lineMarkerEnabled) {
      lineMarkerEnabled.addEventListener("change", () => {
        setState((s) => {
          s.chartSettings.line.markerEnabled = lineMarkerEnabled.checked;
        });
        applyChartSettings();
      });
    }

    const lineDashStyle = document.getElementById("cs-line-dashStyle");
    if (lineDashStyle) {
      lineDashStyle.addEventListener("change", () => {
        setState((s) => {
          s.chartSettings.line.dashStyle = normalizeDashStyle(lineDashStyle.value, "Solid");
        });
        applyChartSettings();
      });
    }

    // Area settings - wire range + number input pairs
    const areaRanges = [
      { id: "cs-area-fillOpacity", key: "fillOpacity", min: 0.1, max: 1, isPercent: true },
      { id: "cs-area-lineWidth", key: "lineWidth", min: 0, max: 8 },
    ];
    areaRanges.forEach(({ id, key, min, max, isPercent }) => {
      const el = document.getElementById(id);
      const numEl = document.getElementById(id + "Num");
      const handler = (val) => {
        setState((s) => {
          s.chartSettings.area[key] = clamp(val, min, max);
        });
        applyChartSettings();
        renderChartSettingsValues();
      };
      if (el) {
        el.addEventListener("input", () => {
          const val = Number(el.value);
          if (numEl) numEl.value = isPercent ? Math.round(val * 100) : val;
          handler(val);
        });
      }
      if (numEl) {
        numEl.addEventListener("input", () => {
          const numMin = isPercent ? Math.round(min * 100) : min;
          const numMax = isPercent ? Math.round(max * 100) : max;
          const numVal = clamp(Number(numEl.value) || numMin, numMin, numMax);
          const val = isPercent ? numVal / 100 : numVal;
          if (el) el.value = val;
          handler(val);
        });
        numEl.addEventListener("blur", () => {
          const numMin = isPercent ? Math.round(min * 100) : min;
          const numMax = isPercent ? Math.round(max * 100) : max;
          const numVal = clamp(Number(numEl.value) || numMin, numMin, numMax);
          numEl.value = numVal;
          if (el) el.value = isPercent ? numVal / 100 : numVal;
        });
        numEl.addEventListener("keydown", handleNumInputKeydown);
      }
    });

    const areaMarkerEnabled = document.getElementById("cs-area-markerEnabled");
    if (areaMarkerEnabled) {
      areaMarkerEnabled.addEventListener("change", () => {
        setState((s) => {
          s.chartSettings.area.markerEnabled = areaMarkerEnabled.checked;
        });
        applyChartSettings();
      });
    }

    // Pie settings - wire range + number input pairs
    const pieRanges = [
      { id: "cs-pie-startAngle", key: "startAngle", min: -180, max: 180 },
      { id: "cs-pie-dataLabelDistance", key: "dataLabelDistance", min: -50, max: 80 },
      { id: "cs-pie-slicedOffset", key: "slicedOffset", min: 0, max: 40 },
      { id: "cs-pie-borderWidth", key: "borderWidth", min: 0, max: 10 },
    ];
    pieRanges.forEach(({ id, key, min, max }) => {
      const el = document.getElementById(id);
      const numEl = document.getElementById(id + "Num");
      const handler = (val) => {
        setState((s) => {
          s.chartSettings.pie[key] = clamp(val, min, max);
        });
        applyChartSettings();
        renderChartSettingsValues();
      };
      if (el) {
        el.addEventListener("input", () => {
          const val = Number(el.value);
          if (numEl) numEl.value = val;
          handler(val);
        });
      }
      if (numEl) {
        numEl.addEventListener("input", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          if (el) el.value = val;
          handler(val);
        });
        numEl.addEventListener("blur", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          numEl.value = val;
          if (el) el.value = val;
        });
        numEl.addEventListener("keydown", handleNumInputKeydown);
      }
    });

    // Funnel settings - wire range + number input pairs
    const funnelRanges = [
      { id: "cs-funnel-neckWidthPercent", key: "neckWidthPercent", min: 0, max: 100 },
      { id: "cs-funnel-neckHeightPercent", key: "neckHeightPercent", min: 0, max: 100 },
    ];
    funnelRanges.forEach(({ id, key, min, max }) => {
      const el = document.getElementById(id);
      const numEl = document.getElementById(id + "Num");
      const handler = (val) => {
        setState((s) => {
          s.chartSettings.funnel[key] = clamp(val, min, max);
        });
        applyChartSettings();
        renderChartSettingsValues();
      };
      if (el) {
        el.addEventListener("input", () => {
          const val = Number(el.value);
          if (numEl) numEl.value = val;
          handler(val);
        });
      }
      if (numEl) {
        numEl.addEventListener("input", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          if (el) el.value = val;
          handler(val);
        });
        numEl.addEventListener("blur", () => {
          const val = clamp(Number(numEl.value) || min, min, max);
          numEl.value = val;
          if (el) el.value = val;
        });
        numEl.addEventListener("keydown", handleNumInputKeydown);
      }
    });

    const funnelReversed = document.getElementById("cs-funnel-reversed");
    if (funnelReversed) {
      funnelReversed.addEventListener("change", () => {
        setState((s) => {
          s.chartSettings.funnel.reversed = funnelReversed.checked;
        });
        applyChartSettings();
      });
    }
  }

  function renderChartSettings() {
    const g = state.chartSettings.global;
    const cb = state.chartSettings.columnBar;
    const ln = state.chartSettings.line;
    const ar = state.chartSettings.area;
    const pi = state.chartSettings.pie;
    const fn = state.chartSettings.funnel;

    // Global toggles
    const globalToggles = { animation: g.animation, legend: g.legend, tooltip: g.tooltip, gridLines: g.gridLines, axisLabels: g.axisLabels, dataLabels: g.dataLabels };
    Object.entries(globalToggles).forEach(([key, val]) => {
      const el = document.getElementById(`cs-global-${key}`);
      if (el) el.checked = val;
    });

    // Column/Bar ranges
    const activeEl = document.activeElement;
    const cbVals = { borderRadius: cb.borderRadius, pointPadding: cb.pointPadding, groupPadding: cb.groupPadding, borderWidth: cb.borderWidth };
    Object.entries(cbVals).forEach(([key, val]) => {
      const el = document.getElementById(`cs-cb-${key}`);
      if (el) el.value = String(val);
      const numEl = document.getElementById(`cs-cb-${key}Num`);
      if (numEl && activeEl !== numEl) {
        numEl.value = (key === "pointPadding" || key === "groupPadding") ? val.toFixed(2) : val;
      }
    });

    // Line
    const lnEl = document.getElementById("cs-line-lineWidth");
    if (lnEl) lnEl.value = String(ln.lineWidth);
    const lnElNum = document.getElementById("cs-line-lineWidthNum");
    if (lnElNum && activeEl !== lnElNum) lnElNum.value = ln.lineWidth;
    const lnMrEl = document.getElementById("cs-line-markerRadius");
    if (lnMrEl) lnMrEl.value = String(ln.markerRadius);
    const lnMrElNum = document.getElementById("cs-line-markerRadiusNum");
    if (lnMrElNum && activeEl !== lnMrElNum) lnMrElNum.value = ln.markerRadius;
    const lnMeEl = document.getElementById("cs-line-markerEnabled");
    if (lnMeEl) lnMeEl.checked = ln.markerEnabled;
    const lnDsEl = document.getElementById("cs-line-dashStyle");
    if (lnDsEl) lnDsEl.value = ln.dashStyle;

    // Area
    const arFoEl = document.getElementById("cs-area-fillOpacity");
    if (arFoEl) arFoEl.value = String(ar.fillOpacity);
    const arFoElNum = document.getElementById("cs-area-fillOpacityNum");
    if (arFoElNum && activeEl !== arFoElNum) arFoElNum.value = Math.round(ar.fillOpacity * 100);
    const arLwEl = document.getElementById("cs-area-lineWidth");
    if (arLwEl) arLwEl.value = String(ar.lineWidth);
    const arLwElNum = document.getElementById("cs-area-lineWidthNum");
    if (arLwElNum && activeEl !== arLwElNum) arLwElNum.value = ar.lineWidth;
    const arMeEl = document.getElementById("cs-area-markerEnabled");
    if (arMeEl) arMeEl.checked = ar.markerEnabled;

    // Pie
    const piSaEl = document.getElementById("cs-pie-startAngle");
    if (piSaEl) piSaEl.value = String(pi.startAngle);
    const piSaElNum = document.getElementById("cs-pie-startAngleNum");
    if (piSaElNum && activeEl !== piSaElNum) piSaElNum.value = pi.startAngle;
    const piDdEl = document.getElementById("cs-pie-dataLabelDistance");
    if (piDdEl) piDdEl.value = String(pi.dataLabelDistance);
    const piDdElNum = document.getElementById("cs-pie-dataLabelDistanceNum");
    if (piDdElNum && activeEl !== piDdElNum) piDdElNum.value = pi.dataLabelDistance;
    const piSoEl = document.getElementById("cs-pie-slicedOffset");
    if (piSoEl) piSoEl.value = String(pi.slicedOffset);
    const piSoElNum = document.getElementById("cs-pie-slicedOffsetNum");
    if (piSoElNum && activeEl !== piSoElNum) piSoElNum.value = pi.slicedOffset;
    const piBwEl = document.getElementById("cs-pie-borderWidth");
    if (piBwEl) piBwEl.value = String(pi.borderWidth);
    const piBwElNum = document.getElementById("cs-pie-borderWidthNum");
    if (piBwElNum && activeEl !== piBwElNum) piBwElNum.value = pi.borderWidth;

    // Funnel
    const fnNwEl = document.getElementById("cs-funnel-neckWidthPercent");
    if (fnNwEl) fnNwEl.value = String(fn.neckWidthPercent);
    const fnNwElNum = document.getElementById("cs-funnel-neckWidthPercentNum");
    if (fnNwElNum && activeEl !== fnNwElNum) fnNwElNum.value = fn.neckWidthPercent;
    const fnNhEl = document.getElementById("cs-funnel-neckHeightPercent");
    if (fnNhEl) fnNhEl.value = String(fn.neckHeightPercent);
    const fnNhElNum = document.getElementById("cs-funnel-neckHeightPercentNum");
    if (fnNhElNum && activeEl !== fnNhElNum) fnNhElNum.value = fn.neckHeightPercent;
    const fnRvEl = document.getElementById("cs-funnel-reversed");
    if (fnRvEl) fnRvEl.checked = fn.reversed;

    renderChartSettingsValues();
  }

  function renderChartSettingsValues() {
    const cb = state.chartSettings.columnBar;
    const ln = state.chartSettings.line;
    const ar = state.chartSettings.area;
    const pi = state.chartSettings.pie;
    const fn = state.chartSettings.funnel;

    // Update displayed values
    const vals = {
      "cs-cb-borderRadius-val": cb.borderRadius + "px",
      "cs-cb-pointPadding-val": cb.pointPadding.toFixed(2),
      "cs-cb-groupPadding-val": cb.groupPadding.toFixed(2),
      "cs-cb-borderWidth-val": cb.borderWidth + "px",
      "cs-line-lineWidth-val": ln.lineWidth + "px",
      "cs-line-markerRadius-val": ln.markerRadius + "px",
      "cs-area-fillOpacity-val": Math.round(ar.fillOpacity * 100) + "%",
      "cs-area-lineWidth-val": ar.lineWidth + "px",
      "cs-area-sharedBottomOpacity-val": Math.round(ar.sharedBottomOpacity * 100) + "%",
      "cs-pie-startAngle-val": pi.startAngle + "°",
      "cs-pie-dataLabelDistance-val": pi.dataLabelDistance + "px",
      "cs-pie-slicedOffset-val": pi.slicedOffset + "px",
      "cs-pie-borderWidth-val": pi.borderWidth + "px",
      "cs-funnel-neckWidthPercent-val": fn.neckWidthPercent + "%",
      "cs-funnel-neckHeightPercent-val": fn.neckHeightPercent + "%",
    };
    Object.entries(vals).forEach(([id, txt]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    });

    // Update area sync controls visibility
    const syncControls = document.getElementById("gradientSyncControls");
    if (syncControls) {
      syncControls.style.display = ar.gradientEnabled ? "" : "none";
    }

    // Update shared bottom color swatch
    const sharedSwatch = document.getElementById("cs-area-sharedBottomColor-swatch");
    if (sharedSwatch) {
      if (ar.sharedBottomColor) {
        sharedSwatch.style.background = ar.sharedBottomColor;
        sharedSwatch.classList.remove("transparent");
      } else {
        sharedSwatch.style.background = "";
        sharedSwatch.classList.add("transparent");
      }
    }
    const sharedInput = document.getElementById("cs-area-sharedBottomColor");
    if (sharedInput && document.activeElement !== sharedInput) {
      sharedInput.value = ar.sharedBottomColor ? ar.sharedBottomColor.slice(1) : "";
    }
    const sharedOpacity = document.getElementById("cs-area-sharedBottomOpacity");
    if (sharedOpacity) sharedOpacity.value = String(ar.sharedBottomOpacity);
    const sharedOpacityNum = document.getElementById("cs-area-sharedBottomOpacityNum");
    if (sharedOpacityNum && document.activeElement !== sharedOpacityNum) {
      sharedOpacityNum.value = Math.round(ar.sharedBottomOpacity * 100);
    }
    const gradientToggle = document.getElementById("cs-area-gradientEnabled");
    if (gradientToggle) gradientToggle.checked = ar.gradientEnabled;
  }

  // Gradient controls rendering
  function renderGradientControls() {
    const slot = getSelectedSlot();
    if (!slot) return;
    const grad = slot.areaGradient || {};
    const baseColor = getSlotBaseColor(slot);
    const ar = state.chartSettings.area;

    // Disable per-slot gradient section when global gradient is disabled
    const gradientSection = document.getElementById("gradientSection");
    if (gradientSection) {
      const isGlobalEnabled = ar.gradientEnabled;
      gradientSection.classList.toggle("disabled", !isGlobalEnabled);
      // Update the summary text to indicate status
      const summary = gradientSection.querySelector("summary");
      if (summary) {
        summary.textContent = isGlobalEnabled ? "Area Gradient" : "Area Gradient (enable in Chart Settings)";
      }
    }

    const enabledEl = document.getElementById("grad-enabled");
    if (enabledEl) enabledEl.checked = !!grad.enabled;

    const angleEl = document.getElementById("grad-angle");
    if (angleEl) angleEl.value = String(grad.angle ?? 90);
    const gradAngleNum = document.getElementById("grad-angleNum");
    if (gradAngleNum && document.activeElement !== gradAngleNum) {
      gradAngleNum.value = grad.angle ?? 90;
    }

    // Top color
    const topSwatch = document.getElementById("grad-topColor-swatch");
    if (topSwatch) {
      const c = grad.topColor || baseColor;
      topSwatch.style.background = c;
      topSwatch.classList.remove("transparent");
    }
    const topInput = document.getElementById("grad-topColor");
    if (topInput && document.activeElement !== topInput) {
      topInput.value = grad.topColor ? grad.topColor.slice(1) : "";
      topInput.placeholder = baseColor.slice(1);
    }
    const topOpacityEl = document.getElementById("grad-topOpacity");
    if (topOpacityEl) topOpacityEl.value = String(grad.topOpacity ?? 1);
    const topOpacityNum = document.getElementById("grad-topOpacityNum");
    if (topOpacityNum && document.activeElement !== topOpacityNum) {
      topOpacityNum.value = Math.round((grad.topOpacity ?? 1) * 100);
    }

    // Bottom color
    const bottomSwatch = document.getElementById("grad-bottomColor-swatch");
    if (bottomSwatch) {
      if (grad.bottomColor) {
        bottomSwatch.style.background = grad.bottomColor;
        bottomSwatch.classList.remove("transparent");
      } else {
        bottomSwatch.style.background = "";
        bottomSwatch.classList.add("transparent");
      }
    }
    const bottomInput = document.getElementById("grad-bottomColor");
    if (bottomInput && document.activeElement !== bottomInput) {
      bottomInput.value = grad.bottomColor ? grad.bottomColor.slice(1) : "";
      bottomInput.placeholder = baseColor.slice(1);
    }
    const bottomOpacityEl = document.getElementById("grad-bottomOpacity");
    if (bottomOpacityEl) bottomOpacityEl.value = String(grad.bottomOpacity ?? 0.1);
    const bottomOpacityNum = document.getElementById("grad-bottomOpacityNum");
    if (bottomOpacityNum && document.activeElement !== bottomOpacityNum) {
      bottomOpacityNum.value = Math.round((grad.bottomOpacity ?? 0.1) * 100);
    }
  }

  // Color picker popover
  let colorPickerTarget = null;
  let colorPickerCallback = null;

  function showColorPicker(targetEl, currentColor, callback) {
    const popover = document.getElementById("colorPickerPopover");
    const swatchesContainer = document.getElementById("colorPickerSwatches");
    if (!popover || !swatchesContainer) return;

    colorPickerTarget = targetEl;
    colorPickerCallback = callback;

    // Build swatches from palette
    swatchesContainer.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const slot = getActiveSlot(i);
      const color = getSlotBaseColor(slot);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-picker-swatch";
      btn.style.background = color;
      if (currentColor && currentColor.toLowerCase() === color.toLowerCase()) {
        btn.classList.add("selected");
      }
      btn.addEventListener("click", () => {
        hideColorPicker();
        if (colorPickerCallback) colorPickerCallback(color);
      });
      swatchesContainer.appendChild(btn);
    }

    // Position popover near target
    const rect = targetEl.getBoundingClientRect();
    popover.style.left = rect.left + "px";
    popover.style.top = (rect.bottom + 4) + "px";
    popover.hidden = false;

    // Setup action buttons
    const transparentBtn = document.getElementById("colorPickerTransparent");
    const slotColorBtn = document.getElementById("colorPickerSlotColor");

    transparentBtn.onclick = () => {
      hideColorPicker();
      if (colorPickerCallback) colorPickerCallback(null);
    };
    slotColorBtn.onclick = () => {
      hideColorPicker();
      if (colorPickerCallback) colorPickerCallback(null);
    };

    // Close on click outside
    setTimeout(() => {
      document.addEventListener("click", handleColorPickerOutsideClick);
    }, 0);
  }

  function hideColorPicker() {
    const popover = document.getElementById("colorPickerPopover");
    if (popover) popover.hidden = true;
    document.removeEventListener("click", handleColorPickerOutsideClick);
    colorPickerTarget = null;
    colorPickerCallback = null;
  }

  function handleColorPickerOutsideClick(e) {
    const popover = document.getElementById("colorPickerPopover");
    if (popover && !popover.contains(e.target) && e.target !== colorPickerTarget) {
      hideColorPicker();
    }
  }

  function wireGradientControls() {
    const getEditSlot = (s) => {
      const i = s.ui.selectedSlot;
      return s.ui.activeVersions[i] === "b" ? s.paletteB[i] : s.palette[i];
    };

    // Enabled toggle
    const enabledEl = document.getElementById("grad-enabled");
    if (enabledEl) {
      enabledEl.addEventListener("change", () => {
        setState((s) => {
          const slot = getEditSlot(s);
          if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
          slot.areaGradient.enabled = enabledEl.checked;
        });
      });
    }

    // Angle slider + number input
    const angleEl = document.getElementById("grad-angle");
    const gradAngleNum = document.getElementById("grad-angleNum");
    const handleGradAngleChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
        slot.areaGradient.angle = clamp(val, 0, 360);
      });
    };
    if (angleEl) {
      angleEl.addEventListener("input", () => {
        if (gradAngleNum) gradAngleNum.value = angleEl.value;
        handleGradAngleChange(Number(angleEl.value));
      });
    }
    if (gradAngleNum) {
      gradAngleNum.addEventListener("input", () => {
        const val = clamp(Number(gradAngleNum.value) || 0, 0, 360);
        if (angleEl) angleEl.value = val;
        handleGradAngleChange(val);
      });
      gradAngleNum.addEventListener("blur", () => {
        const val = clamp(Number(gradAngleNum.value) || 0, 0, 360);
        gradAngleNum.value = val;
        if (angleEl) angleEl.value = val;
      });
      gradAngleNum.addEventListener("keydown", handleNumInputKeydown);
    }

    // Top color swatch
    const topSwatch = document.getElementById("grad-topColor-swatch");
    if (topSwatch) {
      topSwatch.addEventListener("click", (e) => {
        e.preventDefault();
        const slot = getSelectedSlot();
        const current = slot?.areaGradient?.topColor;
        showColorPicker(topSwatch, current, (color) => {
          setState((s) => {
            const slot = getEditSlot(s);
            if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
            slot.areaGradient.topColor = color;
          });
        });
      });
    }

    // Top color input
    const topInput = document.getElementById("grad-topColor");
    if (topInput) {
      topInput.addEventListener("input", () => {
        const val = topInput.value.trim();
        const color = val ? normalizeHexColor("#" + val, null) : null;
        setState((s) => {
          const slot = getEditSlot(s);
          if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
          slot.areaGradient.topColor = color;
        });
      });
    }

    // Top opacity + number input
    const topOpacityEl = document.getElementById("grad-topOpacity");
    const topOpacityNum = document.getElementById("grad-topOpacityNum");
    const handleTopOpacityChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
        slot.areaGradient.topOpacity = clamp(val, 0, 1);
      });
    };
    if (topOpacityEl) {
      topOpacityEl.addEventListener("input", () => {
        if (topOpacityNum) topOpacityNum.value = Math.round(Number(topOpacityEl.value) * 100);
        handleTopOpacityChange(Number(topOpacityEl.value));
      });
    }
    if (topOpacityNum) {
      topOpacityNum.addEventListener("input", () => {
        const pct = clamp(Number(topOpacityNum.value) || 0, 0, 100);
        const val = pct / 100;
        if (topOpacityEl) topOpacityEl.value = val;
        handleTopOpacityChange(val);
      });
      topOpacityNum.addEventListener("blur", () => {
        const pct = clamp(Number(topOpacityNum.value) || 0, 0, 100);
        topOpacityNum.value = pct;
        if (topOpacityEl) topOpacityEl.value = pct / 100;
      });
      topOpacityNum.addEventListener("keydown", handleNumInputKeydown);
    }

    // Bottom color swatch
    const bottomSwatch = document.getElementById("grad-bottomColor-swatch");
    if (bottomSwatch) {
      bottomSwatch.addEventListener("click", (e) => {
        e.preventDefault();
        const slot = getSelectedSlot();
        const current = slot?.areaGradient?.bottomColor;
        showColorPicker(bottomSwatch, current, (color) => {
          setState((s) => {
            const slot = getEditSlot(s);
            if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
            slot.areaGradient.bottomColor = color;
          });
        });
      });
    }

    // Bottom color input
    const bottomInput = document.getElementById("grad-bottomColor");
    if (bottomInput) {
      bottomInput.addEventListener("input", () => {
        const val = bottomInput.value.trim();
        const color = val ? normalizeHexColor("#" + val, null) : null;
        setState((s) => {
          const slot = getEditSlot(s);
          if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
          slot.areaGradient.bottomColor = color;
        });
      });
    }

    // Bottom opacity + number input
    const bottomOpacityEl = document.getElementById("grad-bottomOpacity");
    const bottomOpacityNum = document.getElementById("grad-bottomOpacityNum");
    const handleBottomOpacityChange = (val) => {
      setState((s) => {
        const slot = getEditSlot(s);
        if (!slot.areaGradient) slot.areaGradient = normalizeAreaGradient(null);
        slot.areaGradient.bottomOpacity = clamp(val, 0, 1);
      });
    };
    if (bottomOpacityEl) {
      bottomOpacityEl.addEventListener("input", () => {
        if (bottomOpacityNum) bottomOpacityNum.value = Math.round(Number(bottomOpacityEl.value) * 100);
        handleBottomOpacityChange(Number(bottomOpacityEl.value));
      });
    }
    if (bottomOpacityNum) {
      bottomOpacityNum.addEventListener("input", () => {
        const pct = clamp(Number(bottomOpacityNum.value) || 0, 0, 100);
        const val = pct / 100;
        if (bottomOpacityEl) bottomOpacityEl.value = val;
        handleBottomOpacityChange(val);
      });
      bottomOpacityNum.addEventListener("blur", () => {
        const pct = clamp(Number(bottomOpacityNum.value) || 0, 0, 100);
        bottomOpacityNum.value = pct;
        if (bottomOpacityEl) bottomOpacityEl.value = pct / 100;
      });
      bottomOpacityNum.addEventListener("keydown", handleNumInputKeydown);
    }

    // Area gradient enabled toggle
    const gradientToggle = document.getElementById("cs-area-gradientEnabled");
    if (gradientToggle) {
      gradientToggle.addEventListener("change", () => {
        setState((s) => {
          s.chartSettings.area.gradientEnabled = gradientToggle.checked;
        });
        applyChartSettings();
        updateCharts();
      });
    }

    // Shared bottom color swatch
    const sharedSwatch = document.getElementById("cs-area-sharedBottomColor-swatch");
    if (sharedSwatch) {
      sharedSwatch.addEventListener("click", (e) => {
        e.preventDefault();
        const current = state.chartSettings.area.sharedBottomColor;
        showColorPicker(sharedSwatch, current, (color) => {
          setState((s) => {
            s.chartSettings.area.sharedBottomColor = color;
          });
          applyChartSettings();
          updateCharts();
        });
      });
    }

    // Shared bottom color input
    const sharedInput = document.getElementById("cs-area-sharedBottomColor");
    if (sharedInput) {
      sharedInput.addEventListener("input", () => {
        const val = sharedInput.value.trim();
        const color = val ? normalizeHexColor("#" + val, null) : null;
        setState((s) => {
          s.chartSettings.area.sharedBottomColor = color;
        });
        applyChartSettings();
        updateCharts();
      });
    }

    // Shared bottom opacity + number input
    const sharedOpacity = document.getElementById("cs-area-sharedBottomOpacity");
    const sharedOpacityNum = document.getElementById("cs-area-sharedBottomOpacityNum");
    const handleSharedOpacityChange = (val) => {
      setState((s) => {
        s.chartSettings.area.sharedBottomOpacity = clamp(val, 0, 1);
      });
      applyChartSettings();
      updateCharts();
    };
    if (sharedOpacity) {
      sharedOpacity.addEventListener("input", () => {
        if (sharedOpacityNum) sharedOpacityNum.value = Math.round(Number(sharedOpacity.value) * 100);
        handleSharedOpacityChange(Number(sharedOpacity.value));
      });
    }
    if (sharedOpacityNum) {
      sharedOpacityNum.addEventListener("input", () => {
        const pct = clamp(Number(sharedOpacityNum.value) || 0, 0, 100);
        const val = pct / 100;
        if (sharedOpacity) sharedOpacity.value = val;
        handleSharedOpacityChange(val);
      });
      sharedOpacityNum.addEventListener("blur", () => {
        const pct = clamp(Number(sharedOpacityNum.value) || 0, 0, 100);
        sharedOpacityNum.value = pct;
        if (sharedOpacity) sharedOpacity.value = pct / 100;
      });
      sharedOpacityNum.addEventListener("keydown", handleNumInputKeydown);
    }
  }

  async function writeClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  const loadedScripts = new Set();
  function loadScriptOnce(src) {
    if (loadedScripts.has(src)) return Promise.resolve();
    loadedScripts.add(src);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  let mapChart = null;

  function renderMapChart() {
    if (!window.Highcharts || !window.Highcharts.mapChart) return;
    const colors = buildPaletteColors();

    const mapData = window.Highcharts.maps && window.Highcharts.maps["custom/world"];
    if (!mapData || !Array.isArray(mapData.features)) {
      $mapStatus.textContent = "Map data unavailable.";
      return;
    }

    const features = mapData.features.slice(0, 64);
    const data = features.map((f, idx) => {
      const bucket = idx % 8;
      return { "hc-key": f.properties["hc-key"], value: bucket, color: colors[bucket] };
    });

    if (mapChart) {
      try {
        mapChart.destroy();
      } catch {
        // ignore
      }
      mapChart = null;
    }

    mapChart = Highcharts.mapChart("chart-map", {
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      mapNavigation: { enabled: true, enableButtons: true },
      chart: { backgroundColor: "transparent", style: { fontFamily: "inherit" } },
      accessibility: { enabled: true },
      series: [
        {
          name: "Bucket",
          mapData,
          data,
          joinBy: "hc-key",
          borderColor: "rgba(0,0,0,0.12)",
          states: { hover: { brightness: 0.1 } },
          dataLabels: { enabled: false },
          nullColor: "rgba(200,200,200,0.15)",
        },
      ],
    });
  }

  function syncToggleInputs() {
    $toggleTheme.checked = !!state.ui.darkTheme;
    $toggleGrayscale.checked = !!state.ui.grayscale;
    $toggleLowContrast.checked = !!state.ui.lowContrast;
  }

  function main() {
    syncToggleInputs();
    setBodyModesFromState();
    wireUI();
    initCharts();
    renderAll();

    if (!supportsPatternFill()) {
      console.warn("Highcharts pattern-fill module not detected; pattern slots will render as solid backgrounds.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
