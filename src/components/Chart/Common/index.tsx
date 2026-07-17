import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "../index.module.scss";
import { ChartCommonProps, ChartOptionType, ChartsOption } from "..";
import * as echarts from "echarts";

const Common: React.FC<ChartCommonProps> = (props) => {
  const { className, style, onChart, ...coreOption } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Cache the chart configuration with useMemo
  const chartOption = useMemo(() => {
    const option: ChartsOption = {
      ...coreOption,
    };

    return option;
  }, [coreOption]);

  // Callback that handles chart resize
  const handleResize = useCallback(() => {
    chartInstanceRef.current?.resize();
  }, []);

  // Initialize the chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize or reuse an existing instance
    let chart = chartInstanceRef.current;
    if (!chart) {
      chart = echarts.init(chartRef.current);
      chartInstanceRef.current = chart;
    }

    // Apply the configuration
    chart.setOption(chartOption as ChartOptionType, true);

    // Chart-ready callback (can be used for legend auto-scroll, etc.)
    onChart?.(chart);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Add ResizeObserver
    if (chartRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartRef.current);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartOption, handleResize, onChart]);

  // Clean up resources on component unmount
  useEffect(() => {
    return () => {
      // Clean up ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      // Dispose the chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`${styles["chart-container"]} ${className ?? ""}`}
      style={style}
    >
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Common;
