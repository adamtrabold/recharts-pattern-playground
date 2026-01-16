# Recharts Pattern Playground - Project Status

## Current Status

**Phase: Feature Enhancement** (Migration Complete)

The React + Recharts migration is complete. The project is now in a feature enhancement phase focused on fixing broken controls and adding missing Recharts functionality.

---

## Next Charter

See **Recharts Controls Audit** plan (`recharts_controls_audit_011d2c3d.plan.md`) for the full roadmap.

Location: `~/.cursor/plans/` (Cursor plans directory)

### Critical Priority (Broken Controls) - ALL FIXED ✅

These features have been fixed:

| Control | Issue | Status |
|---------|-------|--------|
| Area Gradients | UI exists, rendering never implemented | ✅ Fixed |
| Data Labels | Only works on Funnel, ignored by 8 other charts | ✅ Fixed |
| barGap | State exists, no UI control, never passed to components | ✅ Fixed |

### High Priority (New Features)

- Axis configuration (domain, tick count, scale)
- Legend positioning and styling
- Pie/Donut corner radius
- Reference lines for annotations

### Medium Priority (Polish)

- Dot shape options for Line/Area
- `connectNulls` for Line/Area charts
- Stack offset options for stacked charts

---

## Completed Work

### Phase 1: Migration (Complete)

1. **React + Vite scaffold** - `package.json`, `vite.config.js`, `index.html`
2. **Dependencies** - React 18, Recharts, Vite
3. **State management** - `src/context/PaletteContext.jsx` with full reducer
4. **Utilities** - `helpers.js`, `storage.js`, `patternGenerator.js`
5. **Pattern system** - `PatternDefs.jsx`, `ChartWrapper.jsx`
6. **UI Components** - App, Header, PaletteEditor, SlotList, PatternControls, ChartSettings, ChartGrid
7. **Chart Components** (9 total) - Column, Bar, StackedBar, Line, Area, StackedArea, Pie, Donut, Funnel
8. **Styles** - `src/styles.css`
9. **CI/CD** - GitHub Actions workflow for Pages deployment

### Bug Fixes Applied (Jan 2026)

1. Fixed stacked bar/area charts changing data on render
2. Added gradient controls for area charts (UI only - rendering not implemented)
3. Added gap controls for Pie, Donut, Funnel, Area, StackedArea
4. Fixed donut thickness calculation
5. Separated Pie and Donut settings sections

### Critical Controls Fixed (Jan 2026) ✅

1. **Area Gradients** - Implemented SVG `<linearGradient>` definitions in AreaChartComponent and StackedAreaChart. When gradientEnabled is true, creates per-slot gradients with configurable angle (sharedAngle), top opacity (sharedTopOpacity), and bottom opacity (sharedBottomOpacity). Added `getSlotColor()` utility to patternGenerator.js.

2. **Data Labels** - Added `LabelList` component to all chart types:
   - ColumnChart: Labels above bars
   - BarChartHorizontal: Labels to the right of bars
   - StackedBarChart: Labels on last segment
   - LineChartComponent: Labels above data points
   - AreaChartComponent: Labels above data points
   - StackedAreaChart: Labels on top layer only
   - PieChartComponent: Labels centered in segments
   - DonutChart: Labels centered in segments
   - FunnelChartComponent: Already working

3. **barGap** - Added UI control slider (0-20%) in Chart Settings > Column/Bar section. Passed `barGap` prop to ColumnChart and BarChartHorizontal components.

## How to Run

```bash
cd "/Users/adam.trabold/Cursor Projects/recharts-pattern-playground"
npm install   # if not done
npm run dev   # starts dev server at localhost:5173
```

## File Structure

```
/
├── index.html              # Vite entry (updated for React)
├── package.json            # React + Recharts deps
├── vite.config.js          # Vite config with relative paths
├── src/
│   ├── main.jsx            # React entry point
│   ├── styles.css          # All CSS
│   ├── components/
│   │   ├── App.jsx
│   │   ├── Header.jsx
│   │   ├── PaletteEditor.jsx
│   │   ├── SlotList.jsx
│   │   ├── PatternControls.jsx
│   │   ├── ChartSettings.jsx
│   │   ├── ChartGrid.jsx
│   │   ├── PatternDefs.jsx
│   │   └── charts/
│   │       ├── ChartWrapper.jsx
│   │       ├── ColumnChart.jsx
│   │       ├── BarChartHorizontal.jsx
│   │       ├── StackedBarChart.jsx
│   │       ├── LineChartComponent.jsx
│   │       ├── AreaChartComponent.jsx
│   │       ├── StackedAreaChart.jsx
│   │       ├── PieChartComponent.jsx
│   │       ├── DonutChart.jsx
│   │       └── FunnelChartComponent.jsx
│   ├── context/
│   │   └── PaletteContext.jsx
│   └── utils/
│       ├── helpers.js
│       ├── storage.js
│       └── patternGenerator.js
└── .github/workflows/
    └── deploy-pages.yml    # DONE - GitHub Pages deployment
```

## Key Pattern Implementation

Patterns work by:
1. `patternGenerator.js` creates SVG pattern definitions from slot data
2. `ChartWrapper.jsx` renders a hidden `<svg>` with `<defs>` containing all patterns
3. Charts reference patterns via `fill="url(#pattern-slot-0)"` etc.
4. Each slot can be solid (`color`) or pattern (`backgroundColor`, `inkColor`, `patternType`, etc.)
