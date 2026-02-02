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
  Brush,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';
import { calcYAxisWidth } from '../../utils/helpers';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const VALUES = [8, 6, 7, 4, 9, 5, 3, 7, 6, 8, 5, 4];

// Generate data dynamically based on slot count
function generateChartData(slotCount) {
  return CATEGORIES.slice(0, slotCount).map((name, i) => ({
    name,
    value: VALUES[i % VALUES.length],
    slotIndex: i,
  }));
}

const getRefLineDashArray = (style) => {
  switch (style) {
    case 'dashed': return '5 5';
    case 'dotted': return '2 2';
    default: return undefined;
  }
};

export function ColumnChart() {
  const { state, getActiveSlot } = usePalette();
  const { global, columnBar, axis, legend, referenceLine, brush, animation, grid, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';
  
  // Generate chart data based on current slot count
  const slotCount = state.palette.length;
  const chartData = React.useMemo(() => generateChartData(slotCount), [slotCount]);
  const maxValue = Math.max(...chartData.map(d => d.value));

  const hoverEnabled = columnBar.hoverEnabled ?? true;
  const hoverColor = columnBar.hoverColor ?? '#000000';
  const hoverOpacity = columnBar.hoverOpacity ?? 0.1;

  // Native activeBar prop for bar hover styling
  const activeBarConfig = hoverEnabled ? { 
    fill: hoverColor, 
    fillOpacity: hoverOpacity + 0.3,
    stroke: hoverColor,
    strokeWidth: 1,
  } : false;

  const barGap = columnBar.barGap ?? 4;

  // Axis configuration
  const yDomain = (axis?.yDomainAuto ?? true) 
    ? [0, 'auto'] 
    : [axis?.yDomainMin ?? 0, axis?.yDomainMax ?? 10];
  const yTickCount = (axis?.yTickCount ?? 0) > 0 ? axis.yTickCount : undefined;
  const yScale = axis?.yScale ?? 'linear';

  // Legend configuration
  const legendPosition = legend?.position ?? 'bottom';
  const legendAlign = legend?.align ?? 'center';
  const legendLayout = legend?.layout ?? 'horizontal';
  const legendIconType = legend?.iconType ?? 'square';

  // Brush configuration
  const brushEnabled = brush?.enabled ?? false;
  const brushHeight = brush?.height ?? 30;
  const brushStroke = brush?.stroke ?? '#8884d8';

  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  // Adjust chart height when brush is enabled
  const chartHeight = brushEnabled ? 200 + brushHeight + 10 : 200;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barGap={`${barGap}%`}>
        {global.gridLines && (
          <CartesianGrid 
            horizontal={grid?.horizontal ?? true}
            vertical={grid?.vertical ?? true}
            stroke={grid?.stroke ?? '#ccc'}
            strokeDasharray={grid?.strokeDasharray ?? '3 3'}
            strokeOpacity={grid?.strokeOpacity ?? 1}
          />
        )}
        <XAxis dataKey="name" hide={!global.axisLabels} />
        <YAxis 
          width={global.axisLabels ? calcYAxisWidth(maxValue) : 0}
          domain={yDomain} 
          tickCount={yTickCount}
          scale={yScale}
          allowDataOverflow={!(axis?.yDomainAuto ?? true)}
          hide={!global.axisLabels}
        />
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
            y={referenceLine?.yValue ?? 5}
            stroke={referenceLine?.color ?? '#ff0000'}
            strokeWidth={referenceLine?.strokeWidth ?? 1}
            strokeDasharray={getRefLineDashArray(referenceLine?.dashStyle)}
            label={referenceLine?.label || undefined}
          />
        )}
        <Bar 
          dataKey="value" 
          radius={[columnBar.borderRadius, columnBar.borderRadius, 0, 0]}
          isAnimationActive={global.animation}
          animationDuration={animDuration}
          animationEasing={animEasing}
          animationBegin={animDelay}
          activeBar={activeBarConfig}
        >
          {chartData.map((entry, index) => {
            const slot = getActiveSlot(entry.slotIndex);
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={getSlotFill(slot, entry.slotIndex)}
              />
            );
          })}
          {global.dataLabels && (
            <LabelList dataKey="value" position="top" fill={labelColor} fontSize={11} />
          )}
        </Bar>
        {brushEnabled && (
          <Brush 
            dataKey="name" 
            height={brushHeight} 
            stroke={brushStroke}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ColumnChart;
