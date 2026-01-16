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
  Cell,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const VALUES = [8, 6, 7, 4, 9, 5, 3, 7];

export function BarChartHorizontal() {
  const { state, getActiveSlot } = usePalette();
  const { global, columnBar } = state.chartSettings;

  const data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
      >
        {global.gridLines && <CartesianGrid strokeDasharray="3 3" />}
        {global.axisLabels && <YAxis dataKey="name" type="category" />}
        {global.axisLabels && <XAxis type="number" />}
        {global.tooltip && <Tooltip />}
        {global.legend && <Legend />}
        <Bar 
          dataKey="value" 
          radius={[0, columnBar.borderRadius, columnBar.borderRadius, 0]}
          isAnimationActive={global.animation}
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
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartHorizontal;
