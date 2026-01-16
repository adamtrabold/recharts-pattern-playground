import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

const CATEGORIES = ['Q1', 'Q2', 'Q3', 'Q4'];

// Static data - generated once, never changes
const STATIC_DATA = CATEGORIES.map((name, catIndex) => {
  const entry = { name };
  // Deterministic values based on index
  const baseValues = [3, 5, 4, 6, 2, 7, 3, 5];
  const offsets = [1, 0, 2, 1, 0, 1, 2, 0];
  for (let i = 0; i < 8; i++) {
    entry[`slot${i}`] = baseValues[i] + offsets[(catIndex + i) % offsets.length];
  }
  return entry;
});

// Custom shape that draws a stroke only on the left edge (between stacked segments)
function StackedBarShape(props) {
  const { x, y, width, height, fill, strokeColor, strokeWidth, isFirst } = props;

  return (
    <g>
      {/* The bar fill */}
      <Rectangle x={x} y={y} width={width} height={height} fill={fill} />
      {/* Left edge stroke (only for non-first segments) */}
      {!isFirst && (
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={y + height}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />
      )}
    </g>
  );
}

export function StackedBarChart() {
  const { state, getActiveSlot } = usePalette();
  const { global, columnBar, gap } = state.chartSettings;

  // Gap settings for stacked bar
  const useGap = gap?.enabled && gap?.applyTo?.stackedBar;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  // Hover settings
  const hoverEnabled = columnBar.hoverEnabled ?? true;
  const hoverColor = columnBar.hoverColor ?? '#000000';
  const hoverOpacity = columnBar.hoverOpacity ?? 0.1;

  const cursorConfig = hoverEnabled ? { fill: hoverColor, fillOpacity: hoverOpacity } : false;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={STATIC_DATA} 
        layout="vertical"
        margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
      >
        {global.gridLines && <CartesianGrid strokeDasharray="3 3" />}
        {global.axisLabels && <YAxis dataKey="name" type="category" />}
        {global.axisLabels && <XAxis type="number" />}
        <Tooltip 
          cursor={cursorConfig} 
          content={global.tooltip ? undefined : () => null}
        />
        {global.legend && <Legend />}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const fill = getSlotFill(slot, slotIndex);
          
          if (useGap) {
            return (
              <Bar
                key={slotIndex}
                dataKey={`slot${slotIndex}`}
                stackId="stack"
                fill={fill}
                name={slot.label}
                isAnimationActive={global.animation}
                shape={(props) => (
                  <StackedBarShape
                    {...props}
                    fill={fill}
                    strokeColor={strokeColor}
                    strokeWidth={strokeThickness}
                    isFirst={slotIndex === 0}
                  />
                )}
              />
            );
          }
          
          return (
            <Bar
              key={slotIndex}
              dataKey={`slot${slotIndex}`}
              stackId="stack"
              fill={fill}
              name={slot.label}
              isAnimationActive={global.animation}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StackedBarChart;
