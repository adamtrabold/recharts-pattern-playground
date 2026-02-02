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
  Symbols,
  Brush,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill, getSlotColor } from '../../utils/patternGenerator';
import { calcYAxisWidth } from '../../utils/helpers';
import { CHART_DEFAULTS } from '../../utils/chartDefaults';

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
  // For a linear gradient, we need start and end points
  // Angle 0 = left to right, 90 = top to bottom, etc.
  const x1 = 50 - 50 * Math.sin(rad);
  const y1 = 50 - 50 * Math.cos(rad);
  const x2 = 50 + 50 * Math.sin(rad);
  const y2 = 50 + 50 * Math.cos(rad);
  return { x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` };
}

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Static data - generated once, never changes
const STATIC_DATA = CATEGORIES.map((name, catIndex) => ({
  name,
  value: 2 + ((catIndex * 3 + 1) % 5) + catIndex,
}));

export function AreaChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, area, axis, legend, referenceLine, brush, animation, grid, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? CHART_DEFAULTS.labelColor;
  const legendTextColor = legend?.textColor ?? CHART_DEFAULTS.legendTextColor;

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
  const cursorStroke = area.cursorColor || CHART_DEFAULTS.cursorColor;
  const cursorStrokeWidth = area.cursorWidth || 1;
  const cursorDashArray = getCursorDashArray();

  // Use global gap settings if enabled and applied to area
  const useGap = gap?.enabled && gap?.applyTo?.area;
  const gapThickness = useGap ? gap.thickness : 0;
  const gapColor = gap?.color ?? CHART_DEFAULTS.gapColor;

  // Gradient settings
  const gradientEnabled = area.gradientEnabled ?? false;
  const gradientMode = area.gradientMode ?? 'shared';
  const sharedAngle = area.sharedAngle ?? 90;
  const topOpacity = area.sharedTopOpacity ?? 1;
  const bottomOpacity = area.sharedBottomOpacity ?? 0.1;
  const gradientCoords = angleToCoords(sharedAngle);

  // Helper to get fill value (with gradient support)
  const getFillForSlot = (slot, slotIndex) => {
    if (gradientEnabled) {
      return `url(#area-gradient-${slotIndex})`;
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

  // Brush configuration
  const brushEnabled = brush?.enabled ?? false;
  const brushHeight = brush?.height ?? 30;
  const brushStroke = brush?.stroke ?? CHART_DEFAULTS.brushStroke;

  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  // Adjust chart height when brush is enabled
  const chartHeight = brushEnabled ? 200 + brushHeight + 10 : 200;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <AreaChart data={STATIC_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        {/* Gradient definition for slot 0 */}
        <defs>
          {gradientEnabled && (() => {
            const slot = getActiveSlot(0);
            const color = getSlotColor(slot);
            return (
              <linearGradient 
                id="area-gradient-0"
                x1={gradientCoords.x1}
                y1={gradientCoords.y1}
                x2={gradientCoords.x2}
                y2={gradientCoords.y2}
              >
                <stop offset="0%" stopColor={color} stopOpacity={topOpacity} />
                <stop offset="100%" stopColor={color} stopOpacity={bottomOpacity} />
              </linearGradient>
            );
          })()}
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
          width={global.axisLabels ? calcYAxisWidth(10) : 0}
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
              backgroundColor: tooltip?.backgroundColor ?? CHART_DEFAULTS.backgroundColor,
              borderColor: tooltip?.borderColor ?? CHART_DEFAULTS.borderColor,
              borderRadius: tooltip?.borderRadius ?? 4,
              borderWidth: tooltip?.borderWidth ?? 1,
              borderStyle: 'solid',
            } : undefined}
            labelStyle={global.tooltip ? {
              color: tooltip?.labelColor ?? CHART_DEFAULTS.tooltipLabelColor,
              fontWeight: tooltip?.labelFontWeight ?? 'bold',
            } : undefined}
            itemStyle={global.tooltip ? {
              color: tooltip?.itemColor ?? CHART_DEFAULTS.tooltipItemColor,
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
            stroke={referenceLine?.color ?? CHART_DEFAULTS.referenceLineColor}
            strokeWidth={referenceLine?.strokeWidth ?? 1}
            strokeDasharray={getRefLineDashArray(referenceLine?.dashStyle)}
            label={referenceLine?.label || undefined}
          />
        )}
        {(() => {
          const slot = getActiveSlot(0);
          const fillValue = getFillForSlot(slot, 0);
          const strokeColor = getSlotColor(slot);
          const dotShape = area.dotShape ?? 'circle';
          const dotProps = showMarkers 
            ? (props) => (
                <CustomDot
                  {...props}
                  fill={strokeColor}
                  stroke={strokeColor}
                  r={area.markerRadius}
                  shape={dotShape}
                />
              )
            : false;
          const activeDotProps = showMarkers
            ? { r: area.markerRadius + 1, fill: strokeColor, stroke: '#fff', strokeWidth: 2 }
            : false;
          
          return (
            <Area
              type={area.curveType}
              dataKey="value"
              fill={fillValue}
              fillOpacity={gradientEnabled ? 1 : area.fillOpacity}
              stroke={useGap ? gapColor : strokeColor}
              strokeWidth={useGap ? gapThickness : area.lineWidth}
              dot={dotProps}
              activeDot={activeDotProps}
              connectNulls={area.connectNulls ?? false}
              name={slot.label}
              isAnimationActive={global.animation}
              animationDuration={animDuration}
              animationEasing={animEasing}
              animationBegin={animDelay}
            >
              {global.dataLabels && (
                <LabelList dataKey="value" position="top" fill={labelColor} fontSize={9} />
              )}
            </Area>
          );
        })()}
        {brushEnabled && (
          <Brush 
            dataKey="name" 
            height={brushHeight} 
            stroke={brushStroke}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaChartComponent;
