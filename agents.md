# Highcharts Pattern Playground (Agent Instructions)

This repo will contain a **single-page, accessible playground** for experimenting with **color + pattern fills** in Highcharts visualizations.

Use the prompt below with your coding AI to generate the playground implementation when you’re ready.

## What we’re building

- Plain **HTML/CSS/vanilla JS** (no frameworks, no bundlers)
- Loads **Highcharts via CDN**
- Has an **8-slot palette**:
  - Slots **1–4** = your **base solid colors**
  - Slots **5–8** = **patterned fills** (pattern ink color + pattern parameters)
- Includes **live interactive controls** to build/tweak patterns in real time
- Shows **many options next to each other** (swatches + chart context)
- Lets you **apply Slot N** across **all chart previews** so you can evaluate in context
- Adds **persistence** so your work is there when you come back
- Later: deploy to **GitHub Pages** (share with others)

## Paste-ready AI build prompt

Copy/paste this whole prompt into your AI coding assistant:

```text
Build me a minimal, accessible, single-page “Highcharts Pattern Playground” using plain HTML/CSS/vanilla JS (no frameworks, no bundlers). It must run by just opening `index.html` (CDN scripts allowed).

Goal
- I have 4 base (solid) colors.
- I need to design at least 4 additional, highly-distinguishable pattern styles (using a pattern “ink” color I define) to create 8 total fill options.
- I want interactive controls to tweak pattern options on-the-fly and see changes applied in realtime.
- I want to compare many options next to each other (swatches + chart context).
- I want to “apply” a selected fill option to a specific color slot, and have that slot propagate across preview charts (all chart types on the page), so I can see the effect in context.

Hard requirements
1) Tech constraints
- Use only: `index.html`, `styles.css`, `app.js` (or a single `index.html` if you prefer, but keep it simple).
- Load Highcharts via CDN.
- Use Highcharts pattern support (prefer `modules/pattern-fill.js`). If that module isn’t available, fall back to custom SVG pattern defs via renderer, but try pattern-fill first.
- Include `modules/accessibility.js` (no “fancy settings”, but basic keyboard/ARIA support should just work).

2) UI: Palette + Pattern Builder
- Show an “8-slot palette” editor (Slot 1–8) with visible swatches and labels.
  - Slots 1–4 start as solid base colors (editable via color input).
  - Slots 5–8 start as patterned fills (editable via pattern builder controls).
- Clicking a slot selects it for editing. Changes update that slot immediately and update charts in realtime.
- Pattern builder controls (at minimum):
  - Mode: Solid vs Pattern
  - Background color (for solid: the color; for pattern: background fill)
  - Pattern ink color (foreground)
  - Pattern type selector: diagonal lines, crosshatch, dots, vertical lines, horizontal lines (at least 4 distinct usable patterns, more is fine)
  - Density/spacing slider
  - Stroke width slider
  - Opacity slider (pattern and/or background)
  - Angle/rotation slider (where applicable)
  - Optional but nice: “invert” toggle, “round linecaps” toggle
- Provide “Reset slot”, and “Duplicate slot to…” actions.

3) Comparison views
- Swatch gallery: display all 8 slots as large swatches with readable text labels.
- Add quick viewing toggles that help evaluate distinguishability:
  - Light/Dark page background toggle
  - “Grayscale preview” toggle (CSS filter is fine)
  - Optional: “low contrast simulation” (simple filter is fine)

4) Chart preview grid (context)
Create a grid of Highcharts previews on the same page that all share the same 8-slot palette mapping (slot index maps to point/series color):
- Column
- Bar
- Stacked bar
- Line
- Area
- Stacked area
- Pie
- Donut (pie with innerSize)
- Funnel
- Map (if feasible via CDN). If map is too heavy, include it behind a “Load map preview” button and handle failure gracefully.

Chart data rules
- Use a consistent dataset with 8 categories so all 8 fills appear at once.
- For stacked charts, ensure 8 distinct fills appear in the legend and in the stacks.
- For pie/donut, use 8 slices.
- For funnel, use 8 steps.
- For map, color at least 8 regions (or bucket regions into 8 values) so palette slots show up.

“Apply across chart types”
- Palette slots drive all charts. When I edit Slot N, every chart that uses Slot N updates live.

5) Export/Import + Sharing
- Add “Export palette” button that copies a JSON blob to clipboard (and/or downloads a file).
- Add “Import palette” file picker or textarea paste that loads JSON and updates everything.
- Bonus: encode palette state in URL hash so I can share a link.

6) Persistence (must-have)
- Automatically persist the full palette state (all 8 slots + UI toggles like light/dark + grayscale mode + selected chart type, etc.) to `localStorage` on every change (debounced, e.g., 150–300ms).
- On page load, if a saved state exists, restore it automatically.
- Include buttons:
  - “Reset to defaults” (clears localStorage + resets state)
  - “Clear saved state” (clears localStorage)
- Use a versioned key, e.g. `highchartsPatternPlayground:v1`, and store a `schemaVersion` in the JSON so future changes can migrate cleanly.
- Persistence priority order:
  1) If URL hash contains state, load that (so shared links win)
  2) Else load from localStorage
  3) Else load defaults

Accessibility / usability (important)
- The page itself must be accessible: semantic labels, fieldset/legend for control groups, good focus styles, keyboard operability for slot selection and sliders, no mouse-only interactions.
- Ensure text is readable on both light/dark backgrounds.
- Avoid tiny click targets; make swatches selectable via keyboard (e.g., roving tabindex listbox pattern is fine).
- Don’t rely on color alone in the UI: label slots clearly (Slot 1–8), and show a small “pattern icon” or short descriptor (e.g., “dots 12px @ 45°”).

CDN scripts to use (suggested)
- Highcharts core: https://code.highcharts.com/highcharts.js
- Pattern fill: https://code.highcharts.com/modules/pattern-fill.js
- Accessibility: https://code.highcharts.com/modules/accessibility.js
- Funnel: https://code.highcharts.com/modules/funnel.js
- Map (if implementing): https://code.highcharts.com/maps/highmaps.js plus mapdata like https://code.highcharts.com/mapdata/custom/world.js (or a smaller map)

Implementation notes (what I expect you to do)
- Centralize palette state in JS (an array of 8 slot objects).
- Each slot object should support either:
  - solid: `{ type: "solid", color: "#RRGGBB" }`
  - pattern: `{ type: "pattern", backgroundColor, inkColor, patternType, spacing, strokeWidth, opacity, angle, ... }`
- Convert each slot to a Highcharts “color” compatible value:
  - solid => string color
  - pattern => pattern-fill object (e.g., `{ pattern: { path, width, height, color, backgroundColor, opacity } }`)
- Re-render or update series/points efficiently on every edit (live updates should feel immediate).
- Add guardrails: clamp sliders, sane defaults, prevent unreadable label colors if possible.

Deliverables
- Provide the final code for `index.html`, `styles.css`, `app.js`.
- Include short run instructions (open the HTML file, or run a simple static server).
- Include a brief explanation of where to add more pattern types.

If you need to simplify map support, do it last and make the rest excellent.
```

## GitHub Pages (when you’re ready to share)

When the playground files exist, publish via GitHub Pages using **GitHub Actions** (deploy to Pages on each push to `main`).

Add this requirement to the AI prompt at that time:

```text
GitHub Pages deployment
- Add a workflow at `/.github/workflows/deploy-pages.yml` that deploys the static site (repo root) to GitHub Pages via GitHub Actions.
- The site must use only relative paths (so it works at `https://<user>.github.io/<repo>/`).
```

In GitHub repo settings: Settings → Pages → Source = **GitHub Actions**.

