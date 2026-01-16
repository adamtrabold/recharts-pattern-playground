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
  const { global, columnBar, axis, legend, referenceLine, animation, grid, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';

  const hoverEnabled = columnBar.hoverEnabled ?? true;
  const hoverColor = columnBar.hoverColor ?? '#000000';
  const hoverOpacity = columnBar.hoverOpacity ?? 0.1;

  const data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  // Native activeBar prop for bar hover styling
  const activeBarConfig = hoverEnabled ? { 
    fill: hoverColor, 
    fillOpacity: hoverOpacity + 0.3,
    stroke: hoverColor,
    strokeWidth: 1,
  } : false;

  const barGap = columnBar.barGap ?? 4;

  // Axis configuration (for horizontal bar, X is the value axis)
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

  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        barGap={`${barGap}%`}
      >
        {global.gridLines && (
          <CartesianGrid 
            horizontal={grid?.horizontal ?? true}
            vertical={grid?.vertical ?? true}
            stroke={grid?.stroke ?? '#ccc'}
            strokeDasharray={grid?.strokeDasharray ?? '3 3'}
            strokeOpacity={grid?.strokeOpacity ?? 1}
          />
        )}
        {global.axisLabels && <YAxis dataKey="name" type="category" interval={0} width={20} />}
        {global.axisLabels && (
          <XAxis 
            type="number"
            domain={xDomain}
            tickCount={xTickCount}
            scale={xScale}
            allowDataOverflow={!(axis?.yDomainAuto ?? true)}
          />
        )}
        {global.tooltip && (
          <Tooltip 
            trigger={tooltip?.trigger ?? 'hover'}
            separator={tooltip?.separator ?? ' : '}
            offset={tooltip?.offset ?? 10}
            cursor={tooltip?.cursor ?? true}
            animationDuration={tooltip?.animationDuration ?? 200}
            animationEasing={tooltip?.animationEasing ?? 'ease'}
            contentStyle={{
              backgroundColor: tooltip?.backgroundColor ?? '#ffffff',
              borderColor: tooltip?.borderColor ?? '#cccccc',
              borderRadius: tooltip?.borderRadius ?? 4,
              borderWidth: tooltip?.borderWidth ?? 1,
              borderStyle: 'solid',
            }}
            labelStyle={{
              color: tooltip?.labelColor ?? '#333333',
              fontWeight: tooltip?.labelFontWeight ?? 'bold',
            }}
            itemStyle={{
              color: tooltip?.itemColor ?? '#666666',
            }}
          />
        )}
        {global.legend && (
          <Legend 
            verticalAlign={legendPosition === 'left' || legendPosition === 'right' ? legendAlign : legendPosition}
            align={legendPosition === 'left' || legendPosition === 'right' ? legendPosition : legendAlign}
            layout={legendLayout}
            iconType={legendIconType}
            wrapperStyle={{ color: legendTextColor }}
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
          animationDuration={animDuration}
          animationEasing={animEasing}
          animationBegin={animDelay}
          activeBar={activeBarConfig}
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
            <LabelList dataKey="value" position="right" fill={labelColor} fontSize={11} />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartHorizontal;
