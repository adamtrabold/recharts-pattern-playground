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

export function ChartGrid() {
  return (
    <section className="charts-panel">
      {/* Hidden SVG with pattern definitions - referenced by all charts */}
      <ChartPatternDefs />
      
      <div id="chart-grid-capture" className="chart-grid">
        <div className="chart-card">
          <h3 className="chart-card-title">Column</h3>
          <div className="chart">
            <ColumnChart />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Bar</h3>
          <div className="chart">
            <BarChartHorizontal />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Stacked Bar</h3>
          <div className="chart">
            <StackedBarChart />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Line</h3>
          <div className="chart">
            <LineChartComponent />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Area</h3>
          <div className="chart">
            <AreaChartComponent />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Stacked Area</h3>
          <div className="chart">
            <StackedAreaChart />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Pie</h3>
          <div className="chart">
            <PieChartComponent />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Donut</h3>
          <div className="chart">
            <DonutChart />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Funnel</h3>
          <div className="chart">
            <FunnelChartComponent />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChartGrid;
