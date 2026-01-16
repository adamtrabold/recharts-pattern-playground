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
  LabelList,
  ReferenceLine,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

const getRefLineDashArray = (style) => {
  switch (style) {
    case 'dashed': return '5 5';
    case 'dotted': return '2 2';
    default: return undefined;
  }
};

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
  const { global, columnBar, gap, stacked, axis, legend, referenceLine } = state.chartSettings;

  // Gap settings for stacked bar
  const useGap = gap?.enabled && gap?.applyTo?.stackedBar;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  // Hover settings
  const hoverEnabled = columnBar.hoverEnabled ?? true;
  const hoverColor = columnBar.hoverColor ?? '#000000';
  const hoverOpacity = columnBar.hoverOpacity ?? 0.1;

  const cursorConfig = hoverEnabled ? { fill: hoverColor, fillOpacity: hoverOpacity } : false;

  // Axis configuration (for horizontal stacked bar, X is the value axis)
  const xDomain = (axis?.yDomainAuto ?? true) 
    ? [0, 'auto'] 
    : [axis?.yDomainMin ?? 0, axis?.yDomainMax ?? 10];
  const xTickCount = (axis?.yTickCount ?? 0) > 0 ? axis.yTickCount : undefined;
  const xScale = axis?.yScale ?? 'linear';

  // Legend configuration
  const legendPosition = legend?.position ?? 'bottom';
  const legendAlign = legend?.align ?? 'center';
  const legendLayout = legend?.layout ?? 'horizontal';
  const legendIconType = legend?.iconType ?? 'square';

  // Stack offset configuration
  const stackOffset = stacked?.stackOffset ?? 'none';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={STATIC_DATA} 
        layout="vertical"
        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        stackOffset={stackOffset}
      >
        {global.gridLines && <CartesianGrid strokeDasharray="3 3" />}
        {global.axisLabels && <YAxis dataKey="name" type="category" width={28} />}
        {global.axisLabels && (
          <XAxis 
            type="number"
            domain={xDomain}
            tickCount={xTickCount}
            scale={xScale}
            allowDataOverflow={!(axis?.yDomainAuto ?? true)}
          />
        )}
        <Tooltip 
          cursor={cursorConfig} 
          content={global.tooltip ? undefined : () => null}
        />
        {global.legend && (
          <Legend 
            verticalAlign={legendPosition === 'left' || legendPosition === 'right' ? legendAlign : legendPosition}
            align={legendPosition === 'left' || legendPosition === 'right' ? legendPosition : legendAlign}
            layout={legendLayout}
            iconType={legendIconType}
          />
        )}
        {(referenceLine?.enabled ?? false) && (
          <ReferenceLine 
            x={referenceLine?.yValue ?? 5}
            stroke={referenceLine?.color ?? '#ff0000'}
            strokeWidth={referenceLine?.strokeWidth ?? 1}
            strokeDasharray={getRefLineDashArray(referenceLine?.dashStyle)}
            label={referenceLine?.label || undefined}
          />
        )}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const fill = getSlotFill(slot, slotIndex);
          const isLast = slotIndex === 7;
          
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
              >
                {global.dataLabels && isLast && (
                  <LabelList dataKey={`slot${slotIndex}`} position="right" fill="#333" fontSize={11} />
                )}
              </Bar>
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
            >
              {global.dataLabels && isLast && (
                <LabelList dataKey={`slot${slotIndex}`} position="right" fill="#333" fontSize={11} />
              )}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StackedBarChart;
