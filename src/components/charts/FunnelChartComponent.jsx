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
import { CHART_DEFAULTS } from '../../utils/chartDefaults';
import { getSlotFill } from '../../utils/patternGenerator';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const VALUES = [100, 80, 60, 50, 40, 30, 20, 10, 8, 6, 4, 2];

// Generate data dynamically based on slot count
function generateChartData(slotCount, reversed) {
  const data = CATEGORIES.slice(0, slotCount).map((name, i) => ({
    name,
    value: VALUES[i % VALUES.length],
    slotIndex: i,
  }));
  return reversed ? [...data].reverse() : data;
}

// Custom label renderer that draws horizontal lines between segments
function renderHorizontalDivider(props, strokeColor, strokeWidth, totalSegments) {
  const { x, y, width, index } = props;
  
  // Only draw line between segments (not at top of first or bottom of last)
  if (index === 0) return null;
  
  const halfStroke = strokeWidth / 2;
  
  return (
    <line
      x1={x}
      y1={y + halfStroke}
      x2={x + width}
      y2={y + halfStroke}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
    />
  );
}

export function FunnelChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, funnel, animation, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? CHART_DEFAULTS.labelColor;
  
  // Generate chart data based on current slot count
  const slotCount = state.palette.length;
  const reversed = funnel.reversed;
  const chartData = React.useMemo(() => generateChartData(slotCount, reversed), [slotCount, reversed]);
  
  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  // Use global gap settings if enabled and applied to funnel
  const useGap = gap?.enabled && gap?.applyTo?.funnel;
  const gapThickness = useGap ? (gap?.thickness ?? 2) : 0;
  const gapColor = gap?.color ?? CHART_DEFAULTS.gapColor;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <FunnelChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {global.tooltip && (
          <Tooltip 
            trigger={tooltip?.trigger ?? 'hover'}
            separator={tooltip?.separator ?? ' : '}
            offset={tooltip?.offset ?? 10}
            animationDuration={tooltip?.animationDuration ?? 200}
            animationEasing={tooltip?.animationEasing ?? 'ease'}
            contentStyle={{
              backgroundColor: tooltip?.backgroundColor ?? CHART_DEFAULTS.backgroundColor,
              borderColor: tooltip?.borderColor ?? CHART_DEFAULTS.borderColor,
              borderRadius: tooltip?.borderRadius ?? 4,
              borderWidth: tooltip?.borderWidth ?? 1,
              borderStyle: 'solid',
            }}
            labelStyle={{
              color: tooltip?.labelColor ?? CHART_DEFAULTS.tooltipLabelColor,
              fontWeight: tooltip?.labelFontWeight ?? 'bold',
            }}
            itemStyle={{
              color: tooltip?.itemColor ?? CHART_DEFAULTS.tooltipItemColor,
            }}
          />
        )}
        <Funnel
          data={chartData}
          dataKey="value"
          isAnimationActive={global.animation}
          animationDuration={animDuration}
          animationEasing={animEasing}
          animationBegin={animDelay}
          labelLine={false}
        >
          {chartData.map((entry, index) => {
            const slot = getActiveSlot(entry.slotIndex);
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={getSlotFill(slot, entry.slotIndex)}
              />
            );
          })}
          {global.dataLabels && (
            <LabelList position="right" dataKey="name" fill={labelColor} stroke="none" />
          )}
          {useGap && (
            <LabelList 
              content={(props) => renderHorizontalDivider(props, gapColor, gapThickness, chartData.length)}
            />
          )}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}

export default FunnelChartComponent;
