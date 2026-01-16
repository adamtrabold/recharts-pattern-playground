import React from 'react';
import {
  FunnelChart,
  Funnel,
  Cell,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { usePalette } from '../../context/PaletteContext';
import { getSlotFill } from '../../utils/patternGenerator';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const VALUES = [100, 80, 60, 50, 40, 30, 20, 10];

export function FunnelChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, funnel } = state.chartSettings;

  let data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  // Reverse for pyramid mode
  if (funnel.reversed) {
    data = [...data].reverse();
  }

  // Use global gap settings if enabled and applied to funnel
  const useGap = gap?.enabled && gap?.applyTo?.funnel;
  const gapThickness = useGap ? gap.thickness : 0;
  const gapColor = gap?.color ?? '#ffffff';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <FunnelChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {global.tooltip && <Tooltip />}
        <Funnel
          data={data}
          dataKey="value"
          isAnimationActive={global.animation}
        >
          {data.map((entry, index) => {
            const slot = getActiveSlot(entry.slotIndex);
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={getSlotFill(slot, entry.slotIndex)}
                stroke={gapColor}
                strokeWidth={gapThickness}
              />
            );
          })}
          {global.dataLabels && (
            <LabelList position="right" dataKey="name" fill="#000" stroke="none" />
          )}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}

export default FunnelChartComponent;
