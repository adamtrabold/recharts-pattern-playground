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
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill, getSlotColor } from '../../utils/patternGenerator';

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
  const { global, gap, area } = state.chartSettings;

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

  // Generate data with 8 series
  const data = CATEGORIES.map((name, catIndex) => {
    const entry = { name };
    for (let i = 0; i < 8; i++) {
      entry[`slot${i}`] = Math.floor(2 + (i % 4) + (catIndex % 3));
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

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
        {global.axisLabels && <YAxis />}
        {(global.tooltip || showCursor) && (
          <Tooltip 
            cursor={false}
            content={global.tooltip ? undefined : () => null}
            wrapperStyle={!global.tooltip ? { display: 'none' } : undefined}
          />
        )}
        {global.legend && <Legend />}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const fillValue = getFillForSlot(slot, slotIndex);
          const strokeColor = getSlotColor(slot);
          const dotProps = showMarkers 
            ? { r: area.markerRadius, fill: strokeColor, stroke: strokeColor, strokeWidth: 0, clipDot: true }
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
