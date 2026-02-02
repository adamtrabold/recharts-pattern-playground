import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill, getSlotColor } from '../../utils/patternGenerator';
import { calcYAxisWidth } from '../../utils/helpers';

const getRefLineDashArray = (style) => {
  switch (style) {
    case 'dashed': return '5 5';
    case 'dotted': return '2 2';
    default: return undefined;
  }
};

// Helper to convert angle to gradient coordinates
function angleToCoords(angle) {
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - 50 * Math.sin(rad);
  const y1 = 50 - 50 * Math.cos(rad);
  const x2 = 50 + 50 * Math.sin(rad);
  const y2 = 50 + 50 * Math.cos(rad);
  return { x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` };
}

const CATEGORIES = ['Q1', 'Q2', 'Q3', 'Q4'];

// Generate data dynamically based on slot count
function generateChartData(slotCount) {
  const baseValues = [4, 3, 5, 6, 2, 4, 3, 5, 4, 3, 5, 6];
  const offsets = [1, 2, 0, 1, 2, 0, 1, 2];
  return CATEGORIES.map((name, catIndex) => {
    const entry = { name };
    for (let i = 0; i < slotCount; i++) {
      entry[`slot${i}`] = baseValues[i % baseValues.length] + offsets[(catIndex + i) % offsets.length];
    }
    return entry;
  });
}

export function StackedAreaChart() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, area, stacked, axis, legend, referenceLine, animation, grid, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';
  
  // Generate chart data based on current slot count
  const slotCount = state.palette.length;
  const chartData = React.useMemo(() => generateChartData(slotCount), [slotCount]);

  // Determine if markers are enabled (override or global)
  const markersEnabled = area.markerOverride !== null && area.markerOverride !== undefined
    ? area.markerOverride
    : global.markersEnabled;
  
  // Determine what to show based on markerType
  const showCursor = markersEnabled && (area.markerType === 'cursor' || area.markerType === 'both');
  const showMarkers = markersEnabled && (area.markerType === 'marker' || area.markerType === 'both');

  // Cursor styling
  const getCursorDashArray = () => {
    switch (area.cursorStyle) {
      case 'dashed': return '5 5';
      case 'dotted': return '2 2';
      default: return undefined;
    }
  };
  const cursorStroke = area.cursorColor || '#666666';
  const cursorStrokeWidth = area.cursorWidth || 1;
  const cursorDashArray = getCursorDashArray();

  // Use global gap settings if enabled and applied to stacked area
  const useGap = gap?.enabled && gap?.applyTo?.stackedArea;
  const gapThickness = useGap ? gap.thickness : 0;
  const gapColor = gap?.color ?? '#ffffff';

  // Gradient settings
  const gradientEnabled = area.gradientEnabled ?? false;
  const sharedAngle = area.sharedAngle ?? 90;
  const topOpacity = area.sharedTopOpacity ?? 1;
  const bottomOpacity = area.sharedBottomOpacity ?? 0.1;
  const gradientCoords = angleToCoords(sharedAngle);

  // Helper to get fill value (with gradient support)
  const getFillForSlot = (slot, slotIndex) => {
    if (gradientEnabled) {
      return `url(#stacked-area-gradient-${slotIndex})`;
    }
    return getSlotFill(slot, slotIndex);
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

  // Stack offset configuration
  const stackOffset = stacked?.stackOffset ?? 'none';

  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart 
        data={chartData} 
        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        stackOffset={stackOffset}
      >
        {/* Gradient definitions */}
        <defs>
          {gradientEnabled && state.palette.map((_, slotIndex) => {
            const slot = getActiveSlot(slotIndex);
            const color = getSlotColor(slot);
            return (
              <linearGradient 
                key={`gradient-${slotIndex}`}
                id={`stacked-area-gradient-${slotIndex}`}
                x1={gradientCoords.x1}
                y1={gradientCoords.y1}
                x2={gradientCoords.x2}
                y2={gradientCoords.y2}
              >
                <stop offset="0%" stopColor={color} stopOpacity={topOpacity} />
                <stop offset="100%" stopColor={color} stopOpacity={bottomOpacity} />
              </linearGradient>
            );
          })}
        </defs>
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
          width={global.axisLabels ? calcYAxisWidth(50) : 0}
          domain={yDomain} 
          tickCount={yTickCount}
          scale={yScale}
          allowDataOverflow={!(axis?.yDomainAuto ?? true)}
          hide={!global.axisLabels}
        />
        {(global.tooltip || showCursor) && (
          <Tooltip 
            trigger={tooltip?.trigger ?? 'hover'}
            separator={tooltip?.separator ?? ' : '}
            offset={tooltip?.offset ?? 10}
            cursor={showCursor ? {
              stroke: cursorStroke,
              strokeWidth: cursorStrokeWidth,
              strokeDasharray: cursorDashArray,
            } : (tooltip?.cursor ?? true)}
            animationDuration={tooltip?.animationDuration ?? 200}
            animationEasing={tooltip?.animationEasing ?? 'ease'}
            contentStyle={global.tooltip ? {
              backgroundColor: tooltip?.backgroundColor ?? '#ffffff',
              borderColor: tooltip?.borderColor ?? '#cccccc',
              borderRadius: tooltip?.borderRadius ?? 4,
              borderWidth: tooltip?.borderWidth ?? 1,
              borderStyle: 'solid',
            } : undefined}
            labelStyle={global.tooltip ? {
              color: tooltip?.labelColor ?? '#333333',
              fontWeight: tooltip?.labelFontWeight ?? 'bold',
            } : undefined}
            itemStyle={global.tooltip ? {
              color: tooltip?.itemColor ?? '#666666',
            } : undefined}
            content={global.tooltip ? undefined : () => null}
            wrapperStyle={!global.tooltip ? { display: 'none' } : undefined}
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
        {state.palette.map((_, slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const fillValue = getFillForSlot(slot, slotIndex);
          const strokeColor = getSlotColor(slot);
          // For stacked areas, only show dots on hover (activeDot) since static dots get covered by layers above
          const activeDotProps = showMarkers 
            ? { r: area.markerRadius + 1, fill: strokeColor, stroke: '#fff', strokeWidth: 2 }
            : false;
          const isLastSlot = slotIndex === state.palette.length - 1;
          
          return (
            <Area
              key={slotIndex}
              type={area.curveType}
              dataKey={`slot${slotIndex}`}
              stackId="stack"
              fill={fillValue}
              fillOpacity={gradientEnabled ? 1 : area.fillOpacity}
              stroke={useGap ? gapColor : strokeColor}
              strokeWidth={useGap ? gapThickness : area.lineWidth}
              dot={false}
              activeDot={activeDotProps}
              connectNulls={area.connectNulls ?? false}
              name={slot.label}
              isAnimationActive={global.animation}
              animationDuration={animDuration}
              animationEasing={animEasing}
              animationBegin={animDelay}
            >
              {global.dataLabels && isLastSlot && (
                <LabelList dataKey={`slot${slotIndex}`} position="top" fill={labelColor} fontSize={9} />
              )}
            </Area>
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default StackedAreaChart;
