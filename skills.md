# Skills for Claude-in-Cursor (Highcharts Pattern Playground)

This document describes the **capabilities/behaviors** the agent should apply while building and iterating on this playground in Cursor.

## Product skills (what the agent must be good at)

- **Highcharts pattern fills**
  - Correctly use Highcharts `pattern-fill` module when available.
  - Model pattern parameters as a stable JSON schema and generate Highcharts-compatible color/pattern objects from it.
  - Provide multiple pattern families (lines, crosshatch, dots, etc.) with tunable spacing/width/angle/opacity.

- **Live, reactive updates (without frameworks)**
  - Centralize palette state in JS and update all charts in realtime on control changes.
  - Prefer efficient updates (e.g., updating series/points) over full teardown/recreate when feasible.

- **Accessible UI design**
  - Semantic form controls with proper labels/fieldset/legend.
  - Keyboard operability for slot selection and all controls.
  - Strong visible focus, large hit targets, readable text on light/dark backgrounds.
  - Avoid “color-only” communication: include slot names and pattern descriptors.

- **Comparison tooling**
  - Swatch gallery + multi-chart context preview.
  - Light/dark background toggle and grayscale toggle (CSS filter is fine).

- **Persistence + sharing**
  - Debounced autosave to `localStorage`.
  - URL-shareable state encoding/decoding (hash or query).
  - Clear/reset actions; versioned storage key and `schemaVersion`.

- **Static-site discipline**
  - No build tools required; runs via `index.html` open or static server.
  - Use **relative paths** and avoid environment-specific assumptions so it can deploy cleanly to GitHub Pages later.

## Cursor workflow skills (how the agent should operate here)

- **Codebase navigation**
  - Use search to locate and refactor state, chart creation, and pattern generation cleanly as the playground grows.

- **Incremental implementation**
  - Implement the smallest end-to-end slice first (palette → one chart → live updates), then expand to the full chart grid.

- **Run + verify quickly**
  - When testing, use a simple static server and manual smoke checks:
    - slot selection works via keyboard
    - changing a slider updates all charts
    - export/import round-trips
    - persistence restores state after reload

- **Safety/robustness**
  - Clamp inputs; avoid invalid pattern geometry; handle module load failures gracefully (especially map).

## Optional “nice-to-have” skills (if time permits)

- **Preset library**: named saved palettes stored in `localStorage`.
- **Contrast heuristics**: warn when label text becomes unreadable on a swatch/background.
- **Small-multiples grid**: generate “8+ tiles” previews for side-by-side comparisons.

## Non-goals (avoid)

- No React/Vue/Next.
- No heavy dependencies beyond Highcharts CDN modules.
- No complicated a11y “modes”; just build the page accessibly by default.

