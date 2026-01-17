import { clamp, normalizeHexColor } from './helpers';

/**
 * Generate a unique pattern ID for a slot
 */
export function getPatternId(slotIndex, suffix = '') {
  return `pattern-slot-${slotIndex}${suffix ? '-' + suffix : ''}`;
}

/**
 * Get the fill value for a slot (either solid color or pattern URL)
 */
export function getSlotFill(slot, slotIndex) {
  if (!slot || slot.type === 'solid') {
    return slot?.color || '#999999';
  }
  return `url(#${getPatternId(slotIndex)})`;
}

/**
 * Get the primary color for a slot (solid color or pattern background)
 * Useful for gradients, strokes, and other color-based styling
 */
export function getSlotColor(slot) {
  if (!slot) return '#999999';
  if (slot.type === 'solid') {
    return slot.color || '#999999';
  }
  return slot.backgroundColor || '#999999';
}

/**
 * Generate SVG pattern definition for a slot
 * Returns null for solid colors (no pattern needed)
 */
export function generatePatternDef(slot, slotIndex) {
  if (!slot || slot.type !== 'pattern') {
    return null;
  }

  const spacing = clamp(Number(slot.spacing) || 14, 4, 40);
  const strokeWidth = clamp(Number(slot.strokeWidth) || 3, 1, 12);
  const opacity = clamp(Number(slot.opacity) || 0.8, 0.05, 1);
  const angle = clamp(Number(slot.angle) || 0, 0, 180);

  let bg = normalizeHexColor(slot.backgroundColor, '#ffffff');
  let ink = normalizeHexColor(slot.inkColor, '#000000');
  
  if (slot.invert) {
    const tmp = bg;
    bg = ink;
    ink = tmp;
  }

  const patternId = getPatternId(slotIndex);
  
  return {
    id: patternId,
    width: spacing,
    height: spacing,
    patternType: slot.patternType,
    backgroundColor: bg,
    inkColor: ink,
    strokeWidth,
    opacity,
    angle,
    roundCaps: !!slot.roundCaps,
    dotShape: slot.dotShape || 'circle',
    dotOffsetX: clamp(Number(slot.dotOffsetX) || 0, 0, 100),
    dotOffsetY: clamp(Number(slot.dotOffsetY) || 0, 0, 100),
    dotStaggered: !!slot.dotStaggered,
  };
}

/**
 * Render pattern content based on pattern type
 */
export function renderPatternContent(patternDef) {
  const { 
    patternType, 
    width, 
    height, 
    inkColor, 
    strokeWidth, 
    opacity, 
    roundCaps,
    dotShape,
    dotOffsetX,
    dotOffsetY,
    dotStaggered,
  } = patternDef;

  const s = width;
  const cx = s / 2;
  const cy = s / 2;
  const linecap = roundCaps ? 'round' : 'butt';

  switch (patternType) {
    case 'crosshatch': {
      const ext = s * 2;
      return {
        type: 'path',
        d: `M 0 0 L ${s} ${s} M ${-ext} 0 L ${s} ${s + ext} M 0 ${-ext} L ${s + ext} ${s} M 0 ${s} L ${s} 0 M ${-ext} ${s} L ${s} ${-ext} M 0 ${s + ext} L ${s + ext} 0`,
        stroke: inkColor,
        strokeWidth,
        strokeOpacity: opacity,
        strokeLinecap: linecap,
        fill: 'none',
      };
    }
    
    case 'dots': {
      const dotRadius = clamp(strokeWidth, 1, 10);
      const offsetX = (dotOffsetX / 100) * s;
      const offsetY = (dotOffsetY / 100) * s;
      
      if (dotStaggered) {
        // Staggered pattern - return multiple shapes for honeycomb effect
        return {
          type: 'staggered-dots',
          shapes: generateStaggeredDots(s, dotRadius, dotShape, inkColor, opacity, offsetX, offsetY),
          width: s * 2,
          height: s * 2,
        };
      }
      
      // Regular grid pattern
      const dx = cx + offsetX;
      const dy = cy + offsetY;
      
      return {
        type: 'dot',
        shape: dotShape,
        cx: dx,
        cy: dy,
        r: dotRadius,
        fill: inkColor,
        fillOpacity: opacity,
      };
    }
    
    case 'lines':
    default: {
      const ext = s * 2;
      return {
        type: 'path',
        d: `M ${cx} ${-ext} L ${cx} ${s + ext}`,
        stroke: inkColor,
        strokeWidth,
        strokeOpacity: opacity,
        strokeLinecap: linecap,
        fill: 'none',
      };
    }
  }
}

function generateStaggeredDots(spacing, radius, shape, color, opacity, offsetX, offsetY) {
  const s = spacing;
  const shapes = [];
  
  // Row 0 positions
  shapes.push({ x: s / 2 + offsetX, y: s / 2 + offsetY });
  shapes.push({ x: 3 * s / 2 + offsetX, y: s / 2 + offsetY });
  
  // Row 1 positions (offset by half)
  shapes.push({ x: s + offsetX, y: 3 * s / 2 + offsetY });
  shapes.push({ x: offsetX, y: 3 * s / 2 + offsetY });
  shapes.push({ x: 2 * s + offsetX, y: 3 * s / 2 + offsetY });
  
  return shapes.map(pos => ({
    shape,
    cx: pos.x,
    cy: pos.y,
    r: radius,
    fill: color,
    fillOpacity: opacity,
  }));
}

/**
 * Generate CSS background style object for a swatch preview
 * Returns an object with background and optionally backgroundSize
 */
export function swatchBackgroundCSS(slot) {
  if (!slot) return { background: '#999' };
  if (slot.type === 'solid') return { background: slot.color };

  const bg = slot.invert ? slot.inkColor : slot.backgroundColor;
  const ink = slot.invert ? slot.backgroundColor : slot.inkColor;
  const opacity = clamp(Number(slot.opacity) || 0.8, 0.05, 1);
  const spacing = clamp(Number(slot.spacing) || 14, 4, 40);
  const strokeWidth = clamp(Number(slot.strokeWidth) || 3, 1, 12);
  const angle = clamp(Number(slot.angle) || 0, 0, 180);

  switch (slot.patternType) {
    case 'crosshatch': {
      const gradient1 = `repeating-linear-gradient(
        ${45 + angle}deg,
        transparent,
        transparent ${(spacing - strokeWidth) / 2}px,
        ${ink} ${(spacing - strokeWidth) / 2}px,
        ${ink} ${(spacing + strokeWidth) / 2}px,
        transparent ${(spacing + strokeWidth) / 2}px,
        transparent ${spacing}px
      )`;
      const gradient2 = `repeating-linear-gradient(
        ${-45 + angle}deg,
        transparent,
        transparent ${(spacing - strokeWidth) / 2}px,
        ${ink} ${(spacing - strokeWidth) / 2}px,
        ${ink} ${(spacing + strokeWidth) / 2}px,
        transparent ${(spacing + strokeWidth) / 2}px,
        transparent ${spacing}px
      )`;
      return { background: `${gradient1}, ${gradient2}, ${bg}` };
    }
    
    case 'dots': {
      const dotRadius = clamp(strokeWidth, 1, 10);
      const staggered = !!slot.dotStaggered;
      
      if (staggered) {
        // Staggered dots - two offset radial gradients
        const size = spacing * 2;
        return {
          background: `
            radial-gradient(circle at ${spacing / 2}px ${spacing / 2}px, ${ink} ${dotRadius}px, transparent ${dotRadius}px),
            radial-gradient(circle at ${spacing * 1.5}px ${spacing * 1.5}px, ${ink} ${dotRadius}px, transparent ${dotRadius}px),
            ${bg}
          `,
          backgroundSize: `${size}px ${size}px`,
        };
      }
      
      // Regular grid dots
      return {
        background: `radial-gradient(circle at center, ${ink} ${dotRadius}px, transparent ${dotRadius}px), ${bg}`,
        backgroundSize: `${spacing}px ${spacing}px`,
      };
    }
    
    case 'lines':
    default: {
      return {
        background: `repeating-linear-gradient(
          ${angle}deg,
          transparent,
          transparent ${(spacing - strokeWidth) / 2}px,
          ${ink} ${(spacing - strokeWidth) / 2}px,
          ${ink} ${(spacing + strokeWidth) / 2}px,
          transparent ${(spacing + strokeWidth) / 2}px,
          transparent ${spacing}px
        ), ${bg}`,
      };
    }
  }
}

/**
 * Get a short description of a slot's pattern
 */
export function getSlotDescription(slot) {
  if (!slot) return '';
  if (slot.type === 'solid') return 'Solid';
  
  const type = slot.patternType || 'lines';
  const spacing = slot.spacing || 14;
  const angle = slot.angle || 0;
  
  return `${type} ${spacing}px @ ${angle}°`;
}
