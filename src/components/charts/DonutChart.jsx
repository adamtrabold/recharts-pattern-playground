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
function renderDataLabel(props, labelColor) {
  const { cx, cy, midAngle, innerRadius, outerRadius, name } = props;
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

export function DonutChart() {
  const { state, getActiveSlot } = usePalette();
  const { global, gap, donut, legend, animation, tooltip } = state.chartSettings;
  const labelColor = global.labelColor ?? '#333333';
  const legendTextColor = legend?.textColor ?? '#333333';
  
  // Animation configuration
  const animDuration = animation?.duration ?? 1500;
  const animEasing = animation?.easing ?? 'ease';
  const animDelay = animation?.delay ?? 0;

  const data = CATEGORIES.map((name, i) => ({
    name,
    value: VALUES[i],
    slotIndex: i,
  }));

  const outerRadius = 70;
  // thickness controls the ring width, so innerRadius = outerRadius - thickness
  const thickness = donut?.thickness ?? 30;
  const innerRadius = Math.max(0, outerRadius - thickness);
  const cornerRadius = donut?.cornerRadius ?? 0;

  // Use global gap settings if enabled and applied to donut
  const useGap = gap?.enabled && gap?.applyTo?.donut;
  const useAngle = gap?.useAngle ?? true;
  const paddingAngle = useGap && useAngle ? (gap?.angle ?? 2) : 0;
  const useRadialStroke = useGap && !useAngle;
  const strokeThickness = gap?.thickness ?? 2;
  const strokeColor = gap?.color ?? '#ffffff';

  const startAngleOffset = donut?.startAngle ?? 0;

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
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          cornerRadius={cornerRadius}
          startAngle={90 - startAngleOffset}
          endAngle={450 - startAngleOffset}
          paddingAngle={paddingAngle}
          isAnimationActive={global.animation}
          animationDuration={animDuration}
          animationEasing={animEasing}
          animationBegin={animDelay}
          label={useRadialStroke 
            ? (props) => renderRadialStroke(props, strokeColor, strokeThickness) 
            : (global.dataLabels ? (props) => renderDataLabel(props, labelColor) : false)}
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
