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
  const v = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^[0-9a-fA-F]{6}$/.test(v)) return '#' + v;
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
