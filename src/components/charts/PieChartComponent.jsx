import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const VALUES = [8, 6, 7, 4, 9, 5, 3, 7];

// Custom label renderer that draws radial stroke at segment start
function renderRadialStroke(props, strokeColor, strokeWidth, pieInnerRadius) {
  const { cx, cy, outerRadius, startAngle } = props;
  const halfStroke = strokeWidth / 2;
  
  // Convert angle to radians (Recharts uses degrees, counter-clockwise from 3 o'clock)
  const angleRad = (-startAngle * Math.PI) / 180;
  
  const innerX = cx + pieInnerRadius * Math.cos(angleRad);
  const innerY = cy + pieInnerRadius * Math.sin(angleRad);
  const outerX = cx + outerRadius * Math.cos(angleRad);
  const outerY = cy + outerRadius * Math.sin(angleRad);
  
  return (
    <line
      x1={innerX}
      y1={innerY}
      x2={outerX}
      y2={outerY}
      stroke={strokeColor}
      strokeWidth={halfStroke}
      strokeLinecap="butt"
    />
  );
}

export function PieChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, pie } = state.chartSettings;

  const data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  // Use global gap settings if enabled and applied to pie
  const useGap = gap?.enabled && gap?.applyTo?.pie;
  const useAngle = gap?.useAngle ?? true;
  const paddingAngle = useGap && useAngle ? (gap?.angle ?? 2) : 0;
  const useRadialStroke = useGap && !useAngle;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  const outerRadius = 70;
  const innerRadius = 0; // Pie has no inner radius

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {global.tooltip && <Tooltip />}
        {global.legend && <Legend />}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          startAngle={90 - pie.startAngle}
          endAngle={450 - pie.startAngle}
          paddingAngle={paddingAngle}
          isAnimationActive={global.animation}
          label={useRadialStroke ? (props) => renderRadialStroke(props, strokeColor, strokeThickness, innerRadius) : false}
          labelLine={false}
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
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
