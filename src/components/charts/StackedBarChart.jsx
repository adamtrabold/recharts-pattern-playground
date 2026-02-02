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

// Generate data dynamically based on slot count
function generateChartData(slotCount) {
  const baseValues = [3, 5, 4, 6, 2, 7, 3, 5, 4, 6, 2, 7];
  const offsets = [1, 0, 2, 1, 0, 1, 2, 0];
  return CATEGORIES.map((name, catIndex) => {
    const entry = { name };
    for (let i = 0; i < slotCount; i++) {
      entry[`slot${i}`] = baseValues[i % baseValues.length] + offsets[(catIndex + i) % offsets.length];
    }
    return entry;
  });
}

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
  const { global, columnBar, gap, stacked, axis, legend, referenceLine, animation, grid, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';
  
  // Generate chart data based on current slot count
  const slotCount = state.palette.length;
  const chartData = React.useMemo(() => generateChartData(slotCount), [slotCount]);

  // Gap settings for stacked bar
  const useGap = gap?.enabled && gap?.applyTo?.stackedBar;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  // Hover settings
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

  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        stackOffset={stackOffset}
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
        <YAxis dataKey="name" type="category" width={global.axisLabels ? 28 : 0} hide={!global.axisLabels} />
        <XAxis 
          type="number"
          domain={xDomain}
          tickCount={xTickCount}
          scale={xScale}
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
            x={referenceLine?.yValue ?? 5}
            stroke={referenceLine?.color ?? '#ff0000'}
            strokeWidth={referenceLine?.strokeWidth ?? 1}
            strokeDasharray={getRefLineDashArray(referenceLine?.dashStyle)}
            label={referenceLine?.label || undefined}
          />
        )}
        {state.palette.map((_, slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const fill = getSlotFill(slot, slotIndex);
          const isLast = slotIndex === state.palette.length - 1;
          
          if (useGap) {
            return (
              <Bar
                key={slotIndex}
                dataKey={`slot${slotIndex}`}
                stackId="stack"
                fill={fill}
                name={slot.label}
                isAnimationActive={global.animation}
                animationDuration={animDuration}
                animationEasing={animEasing}
                animationBegin={animDelay}
                activeBar={activeBarConfig}
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
                  <LabelList dataKey={`slot${slotIndex}`} position="right" fill={labelColor} fontSize={11} />
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
              animationDuration={animDuration}
              animationEasing={animEasing}
              animationBegin={animDelay}
              activeBar={activeBarConfig}
            >
              {global.dataLabels && isLast && (
                <LabelList dataKey={`slot${slotIndex}`} position="right" fill={labelColor} fontSize={11} />
              )}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StackedBarChart;
