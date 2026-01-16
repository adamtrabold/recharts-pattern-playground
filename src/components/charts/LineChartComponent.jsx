import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  Symbols,
  Brush,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotColor } from '../../utils/patternGenerator';
import { calcYAxisWidth } from '../../utils/helpers';

// Custom dot component that renders different shapes
const CustomDot = ({ cx, cy, fill, stroke, r, shape }) => {
  if (!cx || !cy) return null;
  return (
    <Symbols
      cx={cx}
      cy={cy}
      type={shape}
      size={r * r * Math.PI}
      fill={fill}
      stroke={stroke}
      strokeWidth={0}
    />
  );
};

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const getRefLineDashArray = (style) => {
  switch (style) {
    case 'dashed': return '5 5';
    case 'dotted': return '2 2';
    default: return undefined;
  }
};

export function LineChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, line, axis, legend, referenceLine, brush, animation, grid, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';

  // Determine if markers are enabled (override or global)
  const markersEnabled = line.markerOverride !== null && line.markerOverride !== undefined
    ? line.markerOverride
    : global.markersEnabled;

  // Generate data with 8 series - each slot has unique values
  const data = CATEGORIES.map((name, catIndex) => {
    const entry = { name };
    for (let i = 0; i < 8; i++) {
      // Use different offsets for each slot to ensure distinct lines
      entry[`slot${i}`] = 2 + i + ((catIndex + i) % 3);
    }
    return entry;
  });

  const getDashArray = (style) => {
    switch (style) {
      case 'Dash': return '5 5';
      case 'Dot': return '2 2';
      case 'DashDot': return '5 2 2 2';
      case 'LongDash': return '10 5';
      case 'ShortDash': return '3 3';
      default: return undefined;
    }
  };

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
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        {global.gridLines && (
          <CartesianGrid 
            horizontal={grid?.horizontal ?? true}
            vertical={grid?.vertical ?? true}
            stroke={grid?.stroke ?? '#ccc'}
            strokeDasharray={grid?.strokeDasharray ?? '3 3'}
            strokeOpacity={grid?.strokeOpacity ?? 1}
          />
        )}
        {global.axisLabels && <XAxis dataKey="name" />}
        {global.axisLabels && (
          <YAxis 
            width={calcYAxisWidth(10)}
            domain={yDomain} 
            tickCount={yTickCount}
            scale={yScale}
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
            y={referenceLine?.yValue ?? 5}
            stroke={referenceLine?.color ?? '#ff0000'}
            strokeWidth={referenceLine?.strokeWidth ?? 1}
            strokeDasharray={getRefLineDashArray(referenceLine?.dashStyle)}
            label={referenceLine?.label || undefined}
          />
        )}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const strokeColor = getSlotColor(slot);
          const dotShape = line.dotShape ?? 'circle';
          const dotProps = markersEnabled 
            ? (props) => (
                <CustomDot
                  {...props}
                  fill={strokeColor}
                  stroke={strokeColor}
                  r={line.markerRadius}
                  shape={dotShape}
                />
              )
            : false;
          
          // Per-slot line style with global fallback
          const slotLineStyle = slot.lineStyle || {};
          const slotDashStyle = slotLineStyle.dashStyle ?? line.dashStyle;
          const slotLineWidth = slotLineStyle.lineWidth ?? line.lineWidth;
          const slotCurveType = slotLineStyle.curveType ?? line.curveType;
          
          return (
            <Line
              key={slotIndex}
              type={slotCurveType}
              dataKey={`slot${slotIndex}`}
              stroke={strokeColor}
              strokeWidth={slotLineWidth}
              strokeDasharray={getDashArray(slotDashStyle)}
              dot={dotProps}
              connectNulls={line.connectNulls ?? false}
              name={slot.label}
              isAnimationActive={global.animation}
              animationDuration={animDuration}
              animationEasing={animEasing}
              animationBegin={animDelay}
            >
              {global.dataLabels && (
                <LabelList dataKey={`slot${slotIndex}`} position="top" fill={labelColor} fontSize={9} />
              )}
            </Line>
          );
        })}
        {brushEnabled && (
          <Brush 
            dataKey="name" 
            height={brushHeight} 
            stroke={brushStroke}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
