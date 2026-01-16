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
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

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

const CATEGORIES = ['Q1', 'Q2', 'Q3', 'Q4'];

// Static data - generated once, never changes
const STATIC_DATA = CATEGORIES.map((name, catIndex) => {
  const entry = { name };
  // Deterministic values based on index
  const baseValues = [4, 3, 5, 6, 2, 4, 3, 5];
  const offsets = [1, 2, 0, 1, 2, 0, 1, 2];
  for (let i = 0; i < 8; i++) {
    entry[`slot${i}`] = baseValues[i] + offsets[(catIndex + i) % offsets.length];
  }
  return entry;
});

export function StackedAreaChart() {
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

  // Use global gap settings if enabled and applied to stacked area
  const useGap = gap?.enabled && gap?.applyTo?.stackedArea;
  const gapThickness = useGap ? gap.thickness : 0;
  const gapColor = gap?.color ?? '#ffffff';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={STATIC_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          const fillValue = getSlotFill(slot, slotIndex);
          const strokeColor = slot.type === 'solid' ? slot.color : slot.backgroundColor;
          // For stacked areas, only show dots on hover (activeDot) since static dots get covered by layers above
          const activeDotProps = showMarkers 
            ? { r: area.markerRadius + 1, fill: strokeColor, stroke: '#fff', strokeWidth: 2 }
            : false;
          
          return (
            <Area
              key={slotIndex}
              type={area.curveType}
              dataKey={`slot${slotIndex}`}
              stackId="stack"
              fill={fillValue}
              fillOpacity={area.fillOpacity}
              stroke={useGap ? gapColor : strokeColor}
              strokeWidth={useGap ? gapThickness : area.lineWidth}
              dot={false}
              activeDot={activeDotProps}
              name={slot.label}
              isAnimationActive={global.animation}
            />
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

export default StackedAreaChart;
