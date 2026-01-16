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
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotColor } from '../../utils/patternGenerator';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function LineChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, line } = state.chartSettings;

  // Determine if markers are enabled (override or global)
  const markersEnabled = line.markerOverride !== null && line.markerOverride !== undefined
    ? line.markerOverride
    : global.markersEnabled;

  // Generate data with 8 series
  const data = CATEGORIES.map((name, catIndex) => {
    const entry = { name };
    for (let i = 0; i < 8; i++) {
      entry[`slot${i}`] = Math.floor(3 + (i % 4) + (catIndex % 3));
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

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        {global.gridLines && <CartesianGrid strokeDasharray="3 3" />}
        {global.axisLabels && <XAxis dataKey="name" />}
        {global.axisLabels && <YAxis />}
        {global.tooltip && <Tooltip />}
        {global.legend && <Legend />}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
          const slot = getActiveSlot(slotIndex);
          const strokeColor = getSlotColor(slot);
          const dotProps = markersEnabled 
            ? { r: line.markerRadius, fill: strokeColor, stroke: strokeColor, strokeWidth: 0 }
            : false;
          
          return (
            <Line
              key={slotIndex}
              type={line.curveType}
              dataKey={`slot${slotIndex}`}
              stroke={strokeColor}
              strokeWidth={line.lineWidth}
              strokeDasharray={getDashArray(line.dashStyle)}
              dot={dotProps}
              name={slot.label}
              isAnimationActive={global.animation}
            >
              {global.dataLabels && (
                <LabelList dataKey={`slot${slotIndex}`} position="top" fill="#333" fontSize={9} />
              )}
            </Line>
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
