import React from 'react';
import { usePalette } from '../../context/PaletteContext';
import { generatePatternDef, renderPatternContent } from '../../utils/patternGenerator';

/**
 * Wrapper that provides pattern definitions for Recharts charts.
 * Renders SVG defs that can be referenced by chart elements.
 */
export function ChartPatternDefs() {
  const { getActiveSlot } = usePalette();
  
  const patterns = [];
  for (let i = 0; i < 8; i++) {
    const slot = getActiveSlot(i);
    const patternDef = generatePatternDef(slot, i);
    if (patternDef) {
      patterns.push(patternDef);
    }
  }
  
  if (patterns.length === 0) return null;
  
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {patterns.map(patternDef => (
          <PatternElement key={patternDef.id} patternDef={patternDef} />
        ))}
      </defs>
    </svg>
  );
}

function PatternElement({ patternDef }) {
  const content = renderPatternContent(patternDef);
  
  // Handle staggered dots (uses larger tile)
  if (content.type === 'staggered-dots') {
    return (
      <pattern
        id={patternDef.id}
        width={content.width}
        height={content.height}
        patternUnits="userSpaceOnUse"
        patternTransform={patternDef.angle ? `rotate(${patternDef.angle})` : undefined}
      >
        <rect 
          width={content.width} 
          height={content.height} 
          fill={patternDef.backgroundColor} 
        />
        {content.shapes.map((shape, idx) => (
          <DotShape key={idx} {...shape} />
        ))}
      </pattern>
    );
  }
  
  return (
    <pattern
      id={patternDef.id}
      width={patternDef.width}
      height={patternDef.height}
      patternUnits="userSpaceOnUse"
      patternTransform={patternDef.angle ? `rotate(${patternDef.angle})` : undefined}
    >
      <rect 
        width={patternDef.width} 
        height={patternDef.height} 
        fill={patternDef.backgroundColor} 
      />
      {content.type === 'path' && (
        <path
          d={content.d}
          stroke={content.stroke}
          strokeWidth={content.strokeWidth}
          strokeOpacity={content.strokeOpacity}
          strokeLinecap={content.strokeLinecap}
          fill={content.fill}
        />
      )}
      {content.type === 'dot' && (
        <DotShape {...content} />
      )}
    </pattern>
  );
}

function DotShape({ shape, cx, cy, r, fill, fillOpacity }) {
  switch (shape) {
    case 'square':
      return (
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill={fill}
          fillOpacity={fillOpacity}
        />
      );
    
    case 'diamond':
      const dr = r * 1.2;
      return (
        <polygon
          points={`${cx},${cy - dr} ${cx + dr},${cy} ${cx},${cy + dr} ${cx - dr},${cy}`}
          fill={fill}
          fillOpacity={fillOpacity}
        />
      );
    
    case 'circle':
    default:
      return (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          fillOpacity={fillOpacity}
        />
      );
  }
}

export default ChartPatternDefs;
