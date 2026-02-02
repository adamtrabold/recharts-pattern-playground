/**
 * Design System Color Tokens
 * Extracted from Figma: 🦄 Unicorn Design System
 * 
 * Colors marked with ⭐ are the "main" colors for each family,
 * recommended for primary use in interfaces (buttons, sliders, etc.)
 */

export const DESIGN_SYSTEM_COLORS = [
  // Gray
  { name: 'gray25', hex: '#FAFBFC' },
  { name: 'gray50', hex: '#F8F9FA' },
  { name: 'gray100', hex: '#F5F6F7' },
  { name: 'gray200', hex: '#F4F5F6' },
  { name: 'gray300', hex: '#EEF0F1' },
  { name: 'gray400', hex: '#E2E6E8' },
  { name: 'gray500', hex: '#CED5D8' },
  { name: 'gray600', hex: '#B6C0C5' },
  { name: 'gray700', hex: '#9EACB2' },
  { name: 'gray800', hex: '#73858C' },
  { name: 'gray900', hex: '#5B6C74', main: true }, // ⭐ Tertiary/Medium Gray
  { name: 'gray1000', hex: '#435056' },
  { name: 'gray1050', hex: '#394247' },
  { name: 'gray1100', hex: '#2E3538' }, // Tertiary/Dark Gray
  { name: 'gray1150', hex: '#272D30' },
  { name: 'gray1200', hex: '#1F2426' }, // fg-primary, text-primary
  
  // Teal
  { name: 'teal100', hex: '#E7FAFB' },
  { name: 'teal200', hex: '#D7F6F8' },
  { name: 'teal300', hex: '#AFEDF1' },
  { name: 'teal400', hex: '#87E5EA' },
  { name: 'teal500', hex: '#5EDCE2' },
  { name: 'teal600', hex: '#36D3DB' },
  { name: 'teal700', hex: '#0ECAD4', main: true }, // ⭐ Primary/Teal
  { name: 'teal800', hex: '#0CA8B1' },
  { name: 'teal900', hex: '#09878D' },
  { name: 'teal1000', hex: '#07656A' },
  { name: 'teal1100', hex: '#054347' },
  
  // Mint (Data colors)
  { name: 'mint500', hex: '#189990', main: true }, // ⭐ Data - 500
  
  // Blue - CORRECTED from Figma
  { name: 'blue100', hex: '#E6F0FB' },
  { name: 'blue200', hex: '#D5E6F8' },
  { name: 'blue300', hex: '#AACEF1' },
  { name: 'blue400', hex: '#80B5EB' },
  { name: 'blue500', hex: '#559CE4' },
  { name: 'blue600', hex: '#2A84DD' },
  { name: 'blue700', hex: '#006BD6', main: true }, // ⭐ Primary/Blue - for buttons, sliders, focus, links
  { name: 'blue800', hex: '#0059B2' },
  { name: 'blue900', hex: '#00478F' },
  { name: 'blue1000', hex: '#00366B' },
  { name: 'blue1100', hex: '#002447' }, // Primary/Navy
  
  // Yellow
  { name: 'yellow100', hex: '#FFF9ED' },
  { name: 'yellow200', hex: '#FFF5E2' },
  { name: 'yellow300', hex: '#FFEBC4' },
  { name: 'yellow400', hex: '#FFE1A7' },
  { name: 'yellow500', hex: '#FFD789' },
  { name: 'yellow600', hex: '#FFCD6B' },
  { name: 'yellow700', hex: '#FFC34E', main: true }, // ⭐ Secondary/Yellow
  { name: 'yellow800', hex: '#D5A341' },
  { name: 'yellow900', hex: '#AA8234' },
  { name: 'yellow1000', hex: '#806227' },
  { name: 'yellow1100', hex: '#55411A' },
  
  // Purple
  { name: 'purple100', hex: '#F2ECFC' },
  { name: 'purple200', hex: '#E9E0FB' },
  { name: 'purple300', hex: '#D3C1F6' },
  { name: 'purple400', hex: '#BDA2F2' },
  { name: 'purple500', hex: '#A683EE' },
  { name: 'purple600', hex: '#9064E9' },
  { name: 'purple700', hex: '#7A45E5', main: true }, // ⭐ Secondary/Purple
  { name: 'purple800', hex: '#663ABF' },
  { name: 'purple900', hex: '#512E99' },
  { name: 'purple1000', hex: '#3D2373' },
  { name: 'purple1100', hex: '#29174C' },
  
  // Green
  { name: 'green100', hex: '#E7F8EF' },
  { name: 'green200', hex: '#D3F3E2' },
  { name: 'green300', hex: '#AFE9CA' },
  { name: 'green400', hex: '#81DEAC' },
  { name: 'green500', hex: '#55D494' },
  { name: 'green600', hex: '#2BCA80' },
  { name: 'green700', hex: '#04BA6E' },
  { name: 'green800', hex: '#039B5C', main: true }, // ⭐ Secondary/Green
  { name: 'green900', hex: '#037C49' },
  { name: 'green1000', hex: '#025D37' },
  { name: 'green1100', hex: '#013E25' },
  { name: 'green1200', hex: '#011F12' },
  
  // Orange
  { name: 'orange100', hex: '#FFEFE8' },
  { name: 'orange200', hex: '#FFE5D9' },
  { name: 'orange300', hex: '#FFCAB2' },
  { name: 'orange400', hex: '#FFB08C' },
  { name: 'orange500', hex: '#FF9666' },
  { name: 'orange600', hex: '#FF7B3F' },
  { name: 'orange700', hex: '#FF6119', main: true }, // ⭐ Secondary/Orange
  { name: 'orange800', hex: '#D55115' },
  { name: 'orange900', hex: '#AA4111' },
  { name: 'orange1000', hex: '#80310D' },
  { name: 'orange1100', hex: '#552008' },
  
  // Red
  { name: 'red100', hex: '#FCE7EC' },
  { name: 'red200', hex: '#F9D8E0' },
  { name: 'red300', hex: '#F4B0C0' },
  { name: 'red400', hex: '#EE89A1' },
  { name: 'red500', hex: '#E86182' },
  { name: 'red600', hex: '#E33962' },
  { name: 'red700', hex: '#DD1243', main: true }, // ⭐ Tertiary/Red
  { name: 'red800', hex: '#B80F38' },
  { name: 'red900', hex: '#930C2D' },
  { name: 'red1000', hex: '#6F0922' },
  { name: 'red1100', hex: '#4A0616' },
  
  // White
  { name: 'white', hex: '#FFFFFF', main: true }, // Primary/White
];

// Group colors by family for organized display
export const COLOR_FAMILIES = {
  gray: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('gray')),
  teal: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('teal')),
  mint: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('mint')),
  blue: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('blue')),
  yellow: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('yellow')),
  purple: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('purple')),
  green: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('green')),
  orange: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('orange')),
  red: DESIGN_SYSTEM_COLORS.filter(c => c.name.startsWith('red')),
  white: DESIGN_SYSTEM_COLORS.filter(c => c.name === 'white'),
};

/**
 * Find the design system color name for a given hex value
 * @param {string} hex - The hex color value (with or without #)
 * @returns {string|null} - The design system name or null if not found
 */
export function findColorName(hex) {
  if (!hex) return null;
  const normalizedHex = hex.toUpperCase().replace('#', '');
  const color = DESIGN_SYSTEM_COLORS.find(
    c => c.hex.toUpperCase().replace('#', '') === normalizedHex
  );
  return color ? color.name : null;
}

/**
 * Find the hex value for a design system color name
 * @param {string} name - The design system color name
 * @returns {string|null} - The hex value or null if not found
 */
export function findColorHex(name) {
  if (!name) return null;
  const color = DESIGN_SYSTEM_COLORS.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );
  return color ? color.hex : null;
}

/**
 * Get all main colors (marked with dots in the palette)
 * These are recommended for primary use in interfaces
 * @returns {Array} - Array of main color objects
 */
export function getMainColors() {
  return DESIGN_SYSTEM_COLORS.filter(c => c.main);
}

/**
 * Main color constants for easy access
 * These are the PRIMARY colors from the design system for UI use
 */
export const MAIN_COLORS = {
  // Primary colors
  blue: '#006BD6',      // blue700 - PRIMARY for buttons, sliders, focus, links
  teal: '#0ECAD4',      // teal700 - Primary/Teal
  white: '#FFFFFF',     // Primary/White
  navy: '#002447',      // blue1100 - Primary/Navy
  
  // Secondary colors
  yellow: '#FFC34E',    // yellow700 - Secondary/Yellow
  purple: '#7A45E5',    // purple700 - Secondary/Purple
  green: '#039B5C',     // green800 - Secondary/Green
  orange: '#FF6119',    // orange700 - Secondary/Orange
  
  // Tertiary colors
  red: '#DD1243',       // red700 - Tertiary/Red
  darkGray: '#2E3538',  // gray1100 - Tertiary/Dark Gray
  mediumGray: '#5B6C74', // gray900 - Tertiary/Medium Gray
  
  // Foreground/Text
  fgPrimary: '#1F2426', // gray1200 - fg-primary, text-primary
  textSecondary: '#2E3538', // gray1100 - text-secondary
  textAction: '#006BD6', // blue700 - text-action
  
  // Background
  bgPrimary: '#FFFFFF', // white - bg-primary
  
  // Data visualization
  data: '#189990',      // mint500 - Data color
};

/**
 * Semantic Color Tokens
 * Use these for consistent theming and design system compliance
 */
export const SEMANTIC = {
  // Text
  text: {
    primary: '#1F2426',    // Main body text
    secondary: '#2E3538',  // Supporting text
    tertiary: '#5B6C74',   // Muted/subtle text
    action: '#006BD6',     // Links, clickable text
    white: '#FFFFFF',      // Text on dark backgrounds
  },
  
  // Foreground (icons, decorative elements)
  foreground: {
    primary: '#1F2426',
    action: '#006BD6',
    disabled: '#85888E',
    white: '#FFFFFF',
  },
  
  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F6F7',
  },
  
  // Border
  border: {
    primary: '#E2E6E8',    // gray400 - main borders
    secondary: '#EEF0F1',  // gray300 - subtle borders
  },
  
  // Action states (buttons, interactive elements)
  action: {
    primary: '#006BD6',    // blue700
    hover: '#0059B2',      // blue800
    active: '#00478F',     // blue900
  },
  
  // Status
  status: {
    success: '#039B5C',    // green800
    warning: '#DC6803',
    danger: '#DD1243',     // red700
  },
  
  // Data visualization
  data: {
    primary: '#189990',    // mint500/data-500
    secondary: '#0D827A',  // mint600/data-600
  },
};
