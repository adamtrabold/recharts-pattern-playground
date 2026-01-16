# Skills for Claude-in-Cursor (Recharts Pattern Playground)

This document describes the **capabilities/behaviors** the agent should apply while building and iterating on this playground in Cursor.

## Product skills (what the agent must be good at)

- **SVG Pattern Generation for Recharts**
  - Generate dynamic SVG `<pattern>` elements that tile correctly
  - Support multiple pattern families (lines, crosshatch, dots) with tunable spacing/width/angle/opacity
  - Handle pattern transforms (rotation) and special cases (staggered dots)
  - Reference patterns in Recharts via `fill="url(#pattern-id)"`

- **React + Recharts Integration**
  - Use React Context for centralized state management
  - Efficient re-renders when palette changes (Recharts handles this well)
  - Inject pattern definitions into a shared SVG that all charts reference
  - Map slot data to Recharts Cell/series props correctly

- **Live, reactive updates**
  - Centralize palette state in React Context and update all charts on control changes
  - Debounced persistence to localStorage
  - Immediate visual feedback on slider/input changes

- **Accessible UI design**
  - Semantic form controls with proper labels
  - Keyboard operability for slot selection (arrow keys, Home/End)
  - Strong visible focus states
  - Avoid "color-only" communication: include slot names and pattern descriptors

- **Comparison tooling**
  - Swatch gallery with pattern previews (CSS gradient approximation)
  - Multi-chart context preview (9 chart types)
  - Light/dark background toggle and grayscale/low-contrast filters

- **Persistence + sharing**
  - Debounced autosave to `localStorage`
  - URL-shareable state encoding/decoding (base64 in hash)
  - Clear/reset actions; versioned storage key and `schemaVersion`

- **Build tooling with Vite**
  - Fast HMR development experience
  - Production builds output to `dist/`
  - Relative paths (`base: './'`) for GitHub Pages compatibility

## Cursor workflow skills (how the agent should operate here)

- **Codebase navigation**
  - Use search to locate components, context, and utility functions
  - Understand the React component hierarchy

- **Incremental implementation**
  - Test changes in one chart before applying to all
  - Verify pattern rendering in browser dev tools SVG inspector

- **Run + verify quickly**
  - `npm run dev` for hot-reloading development
  - Manual smoke checks:
    - Slot selection works via keyboard
    - Changing a slider updates all charts
    - Export/import round-trips correctly
    - Persistence restores state after reload
    - Patterns render correctly (check SVG in devtools)

- **Safety/robustness**
  - Clamp all numeric inputs to valid ranges
  - Validate hex color inputs
  - Handle edge cases (empty patterns, zero spacing)

## Optional "nice-to-have" skills (if time permits)

- **Preset library**: Named saved palettes stored in `localStorage`
- **Contrast heuristics**: Warn when label text becomes unreadable on a swatch/background
- **Additional pattern types**: Chevrons, waves, zigzags, custom SVG paths
- **Gradient overlays**: Combine patterns with gradients for area charts

## Technology stack

- **React 18** - Component framework
- **Recharts** - React charting library (wraps D3)
- **Vite** - Build tool and dev server
- **No additional state libraries** - React Context + useReducer is sufficient
- **No CSS frameworks** - Plain CSS with custom properties (CSS variables)
