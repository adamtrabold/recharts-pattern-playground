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
function renderRadialStroke(props, strokeColor, strokeWidth) {
  const { cx, cy, innerRadius, outerRadius, startAngle } = props;
  const halfStroke = strokeWidth / 2;
  
  // Convert angle to radians (Recharts uses degrees, counter-clockwise from 3 o'clock)
  const angleRad = (-startAngle * Math.PI) / 180;
  
  const innerX = cx + innerRadius * Math.cos(angleRad);
  const innerY = cy + innerRadius * Math.sin(angleRad);
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

// Custom label renderer for data labels
function renderDataLabel(props) {
  const { cx, cy, midAngle, innerRadius, outerRadius, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight="bold"
    >
      {name}
    </text>
  );
}

export function DonutChart() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, donut } = state.chartSettings;

  const data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  const outerRadius = 70;
  // thickness controls the ring width, so innerRadius = outerRadius - thickness
  const thickness = donut?.thickness ?? 30;
  const innerRadius = Math.max(0, outerRadius - thickness);

  // Use global gap settings if enabled and applied to donut
  const useGap = gap?.enabled && gap?.applyTo?.donut;
  const useAngle = gap?.useAngle ?? true;
  const paddingAngle = useGap && useAngle ? (gap?.angle ?? 2) : 0;
  const useRadialStroke = useGap && !useAngle;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  const startAngleOffset = donut?.startAngle ?? 0;

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
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90 - startAngleOffset}
          endAngle={450 - startAngleOffset}
          paddingAngle={paddingAngle}
          isAnimationActive={global.animation}
          label={useRadialStroke 
            ? (props) => renderRadialStroke(props, strokeColor, strokeThickness) 
            : (global.dataLabels ? renderDataLabel : false)}
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

export default DonutChart;
