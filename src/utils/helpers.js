/**
 * Clamp a number between min and max
 */
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Deep copy an object
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Safely parse JSON
 */
export function safeParseJSON(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e };
  }
}

/**
 * Normalize a hex color string
 */
export function normalizeHexColor(input, fallback) {
  if (typeof input !== 'string') return fallback;
  const v = input.trim().toUpperCase();
  
  // 6-character hex with #
  if (/^#[0-9A-F]{6}$/.test(v)) return v;
  // 6-character hex without #
  if (/^[0-9A-F]{6}$/.test(v)) return '#' + v;
  // 3-character hex with # - expand to 6 characters
  if (/^#[0-9A-F]{3}$/.test(v)) {
    const r = v[1], g = v[2], b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  // 3-character hex without # - expand to 6 characters
  if (/^[0-9A-F]{3}$/.test(v)) {
    const r = v[0], g = v[1], b = v[2];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
}

/**
 * Convert hex to rgba
 */
export function hexToRgba(hex, alpha = 1) {
  const normalized = normalizeHexColor(hex, '#000000');
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Copy text to clipboard
 */
export async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
