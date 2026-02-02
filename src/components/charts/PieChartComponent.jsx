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

const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const VALUES = [8, 6, 7, 4, 9, 5, 3, 7, 6, 8, 5, 4];

// Generate data dynamically based on slot count
function generateChartData(slotCount) {
  return CATEGORIES.slice(0, slotCount).map((name, i) => ({
    name,
    value: VALUES[i % VALUES.length],
    slotIndex: i,
  }));
}

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

// Custom label renderer for data labels
function renderDataLabel(props, labelColor) {
  const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={labelColor}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight="bold"
    >
      {name}
    </text>
  );
}

export function PieChartComponent() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, pie, legend, animation, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';
  
  // Generate chart data based on current slot count
  const slotCount = state.palette.length;
  const chartData = React.useMemo(() => generateChartData(slotCount), [slotCount]);
  
  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  // Use global gap settings if enabled and applied to pie
  const useGap = gap?.enabled && gap?.applyTo?.pie;
  const useAngle = gap?.useAngle ?? true;
  const paddingAngle = useGap && useAngle ? (gap?.angle ?? 2) : 0;
  const useRadialStroke = useGap && !useAngle;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  const outerRadius = 70;
  const innerRadius = 0; // Pie has no inner radius
  const cornerRadius = pie?.cornerRadius ?? 0;

  // Legend configuration
  const legendPosition = legend?.position ?? 'bottom';
  const legendAlign = legend?.align ?? 'center';
  const legendLayout = legend?.layout ?? 'horizontal';
  const legendIconType = legend?.iconType ?? 'square';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {global.tooltip && (
          <Tooltip 
            trigger={tooltip?.trigger ?? 'hover'}
            separator={tooltip?.separator ?? ' : '}
            offset={tooltip?.offset ?? 10}
            animationDuration={tooltip?.animationDuration ?? 200}
            animationEasing={tooltip?.animationEasing ?? 'ease'}
            contentStyle={{
              backgroundColor: tooltip?.backgroundColor ?? '#ffffff',
              borderColor: tooltip?.borderColor ?? '#cccccc',
              borderRadius: tooltip?.borderRadius ?? 4,
              borderWidth: tooltip?.borderWidth ?? 1,
              borderStyle: 'solid',
            }}
            labelStyle={{
              color: tooltip?.labelColor ?? '#333333',
              fontWeight: tooltip?.labelFontWeight ?? 'bold',
            }}
            itemStyle={{
              color: tooltip?.itemColor ?? '#666666',
            }}
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
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          cornerRadius={cornerRadius}
          startAngle={90 - pie.startAngle}
          endAngle={450 - pie.startAngle}
          paddingAngle={paddingAngle}
          isAnimationActive={global.animation}
          animationDuration={animDuration}
          animationEasing={animEasing}
          animationBegin={animDelay}
          label={useRadialStroke 
            ? (props) => renderRadialStroke(props, strokeColor, strokeThickness, innerRadius) 
            : (global.dataLabels ? (props) => renderDataLabel(props, labelColor) : false)}
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
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
