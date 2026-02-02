/**
 * Default colors for chart components using semantic color tokens
 * Values extracted from Figma: 🦄 Unicorn Design System - Color Variables
 */

export const CHART_DEFAULTS = {
  // Text colors (semantic)
  labelColor: '#1F2426',        // text-primary
  legendTextColor: '#1F2426',   // text-primary
  
  // Interactive states
  hoverColor: '#1F2426',        // fg-primary
  cursorColor: '#5B6C74',       // text-tertiary
  
  // Backgrounds and borders (semantic)
  backgroundColor: '#FFFFFF',   // bg-primary
  borderColor: '#E2E6E8',       // border-primary (gray400)
  gapColor: '#FFFFFF',          // bg-primary
  
  // Tooltip text colors (semantic)
  tooltipLabelColor: '#1F2426', // text-primary
  tooltipItemColor: '#2E3538',  // text-secondary
  
  // Reference elements
  referenceLineColor: '#DD1243', // red700 - danger/error
  brushStroke: '#006BD6',        // action-primary (blue700)
  
  // Action colors (semantic)
  actionColor: '#006BD6',       // fg-action-primary / text-action
  actionHover: '#0059B2',       // blue800 - hover state
  actionActive: '#00478F',      // blue900 - active state
  
  // Status colors
  successColor: '#039B5C',      // green800 - success
  warningColor: '#DC6803',      // warning
  dangerColor: '#DD1243',       // red700 - danger/error
  
  // Data visualization
  dataColor: '#189990',         // data-500 - primary data color
};

/**
 * Semantic color mapping for reference
 * Use these names when documenting or debugging
 */
export const SEMANTIC_NAMES = {
  '#1F2426': 'text-primary / fg-primary',
  '#2E3538': 'text-secondary',
  '#5B6C74': 'text-tertiary',
  '#006BD6': 'text-action / fg-action-primary / action-primary',
  '#FFFFFF': 'bg-primary',
  '#F5F6F7': 'bg-secondary',
  '#E2E6E8': 'border-primary',
  '#EEF0F1': 'border-secondary',
  '#0059B2': 'action-hover',
  '#00478F': 'action-active',
  '#DD1243': 'danger',
  '#039B5C': 'success',
  '#189990': 'data-primary',
};
