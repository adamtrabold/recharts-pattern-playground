import React from 'react';
import { ChartPatternDefs } from './charts/ChartWrapper';
import ColumnChart from './charts/ColumnChart';
import BarChartHorizontal from './charts/BarChartHorizontal';
import StackedBarChart from './charts/StackedBarChart';
import LineChartComponent from './charts/LineChartComponent';
import AreaChartComponent from './charts/AreaChartComponent';
import StackedAreaChart from './charts/StackedAreaChart';
import PieChartComponent from './charts/PieChartComponent';
import DonutChart from './charts/DonutChart';
import FunnelChartComponent from './charts/FunnelChartComponent';
import { usePalette } from '../context/PaletteContext';

export function ChartGrid() {
  const { state } = usePalette();
  const animationKey = state.ui.animationKey ?? 0;
  
  return (
    <section className="charts-panel">
      {/* Hidden SVG with pattern definitions - referenced by all charts */}
      <ChartPatternDefs />
      
      <div id="chart-grid-capture" className="chart-grid">
        <div className="chart-card">
          <h3 className="chart-card-title">Column</h3>
          <div className="chart">
            <ColumnChart key={`column-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Bar</h3>
          <div className="chart">
            <BarChartHorizontal key={`bar-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Stacked Bar</h3>
          <div className="chart">
            <StackedBarChart key={`stacked-bar-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Line</h3>
          <div className="chart">
            <LineChartComponent key={`line-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Area</h3>
          <div className="chart">
            <AreaChartComponent key={`area-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Stacked Area</h3>
          <div className="chart">
            <StackedAreaChart key={`stacked-area-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Pie</h3>
          <div className="chart">
            <PieChartComponent key={`pie-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Donut</h3>
          <div className="chart">
            <DonutChart key={`donut-${animationKey}`} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Funnel</h3>
          <div className="chart">
            <FunnelChartComponent key={`funnel-${animationKey}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChartGrid;
