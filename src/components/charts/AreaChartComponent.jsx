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
  Customized,
  LabelList,
  ReferenceLine,
  Symbols,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill, getSlotColor } from '../../utils/patternGenerator';
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

const getRefLineDashArray = (style) => {
  switch (style) {
    case 'dashed': return '5 5';
    case 'dotted': return '2 2';
    default: return undefined;
  }
};

// Cursor overlay component - renders on top of chart content
const CursorOverlay = ({ xAxisMap, offset, activeCoordinate, stroke, strokeWidth, strokeDasharray, show }) => {
  if (!show || !activeCoordinate) return null;
  const { x } = activeCoordinate;
  const top = offset?.top ?? 0;
  const height = offset?.height ?? 0;
  return (
    <line
      x1={x}
      y1={top}
      x2={x}
      y2={top + height}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      style={{ pointerEvents: 'none' }}
    />
  );
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

export function AreaChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, area, axis, legend, referenceLine } = state.chartSettings;

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

  // Generate data with 8 series - each slot has unique values
  const data = CATEGORIES.map((name, catIndex) => {
    const entry = { name };
    for (let i = 0; i < 8; i++) {
      // Use different offsets for each slot to ensure distinct areas
      entry[`slot${i}`] = 2 + i + ((catIndex + i) % 3);
    }
    return entry;
  });

  // Use global gap settings if enabled and applied to area
  const useGap = gap?.enabled && gap?.applyTo?.area;
  const gapThickness = useGap ? gap.thickness : 0;
  const gapColor = gap?.color ?? '#ffffff';

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

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        {/* Gradient definitions */}
        <defs>
          {gradientEnabled && [0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
            const slot = getActiveSlot(slotIndex);
            const color = getSlotColor(slot);
            return (
              <linearGradient 
                key={`gradient-${slotIndex}`}
                id={`area-gradient-${slotIndex}`}
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
        {global.gridLines && <CartesianGrid strokeDasharray="3 3" />}
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
        {(global.tooltip || showCursor) && (
          <Tooltip 
            cursor={false}
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
          const fillValue = getFillForSlot(slot, slotIndex);
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
              key={slotIndex}
              type={area.curveType}
              dataKey={`slot${slotIndex}`}
              fill={fillValue}
              fillOpacity={gradientEnabled ? 1 : area.fillOpacity}
              stroke={useGap ? gapColor : strokeColor}
              strokeWidth={useGap ? gapThickness : area.lineWidth}
              dot={dotProps}
              activeDot={activeDotProps}
              connectNulls={area.connectNulls ?? false}
              name={slot.label}
              isAnimationActive={global.animation}
            >
              {global.dataLabels && (
                <LabelList dataKey={`slot${slotIndex}`} position="top" fill="#333" fontSize={9} />
              )}
            </Area>
          );
        })}
        {/* Cursor overlay rendered on top */}
        <Customized
          component={(props) => (
            <CursorOverlay
              {...props}
              stroke={cursorStroke}
              strokeWidth={cursorStrokeWidth}
              strokeDasharray={cursorDashArray}
              show={showCursor}
            />
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaChartComponent;
