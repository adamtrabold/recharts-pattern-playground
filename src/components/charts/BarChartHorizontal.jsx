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
  Cell,
  LabelList,
  ReferenceLine,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const VALUES = [8, 6, 7, 4, 9, 5, 3, 7];

const getRefLineDashArray = (style) => {
  switch (style) {
    case 'dashed': return '5 5';
    case 'dotted': return '2 2';
    default: return undefined;
  }
};

export function BarChartHorizontal() {
  const { state, getActiveSlot } = usePalette();
  const { global, columnBar, axis, legend, referenceLine } = state.chartSettings;

  const hoverEnabled = columnBar.hoverEnabled ?? true;
  const hoverColor = columnBar.hoverColor ?? '#000000';
  const hoverOpacity = columnBar.hoverOpacity ?? 0.1;

  const data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  const cursorConfig = hoverEnabled ? { fill: hoverColor, fillOpacity: hoverOpacity } : false;

  const barGap = columnBar.barGap ?? 4;

  // Axis configuration (for horizontal bar, X is the value axis)
  const xDomain = (axis?.yDomainAuto ?? true) 
    ? ['auto', 'auto'] 
    : [axis?.yDomainMin ?? 0, axis?.yDomainMax ?? 10];
  const xTickCount = (axis?.yTickCount ?? 0) > 0 ? axis.yTickCount : undefined;
  const xScale = axis?.yScale ?? 'linear';

  // Legend configuration
  const legendPosition = legend?.position ?? 'bottom';
  const legendAlign = legend?.align ?? 'center';
  const legendLayout = legend?.layout ?? 'horizontal';
  const legendIconType = legend?.iconType ?? 'square';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
        barGap={`${barGap}%`}
      >
        {global.gridLines && <CartesianGrid strokeDasharray="3 3" />}
        {global.axisLabels && <YAxis dataKey="name" type="category" />}
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
        <Bar 
          dataKey="value" 
          radius={[0, columnBar.borderRadius, columnBar.borderRadius, 0]}
          isAnimationActive={global.animation}
        >
          {data.map((entry, index) => {
            const slot = getActiveSlot(entry.slotIndex);
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={getSlotFill(slot, entry.slotIndex)}
              />
            );
          })}
          {global.dataLabels && (
            <LabelList dataKey="value" position="right" fill="#333" fontSize={11} />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartHorizontal;
