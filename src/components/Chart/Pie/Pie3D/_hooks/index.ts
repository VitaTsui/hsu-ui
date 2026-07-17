import { useCallback } from "react";
import * as echarts from "echarts";
import { ChartsOption, ChartOptionType } from "../../..";
import { getParametricEquation } from "../_utils/parametricEquation";
import type { SeriesItem } from "..";

// Get the number of pie sectors (excluding the label series)
const getPieSeriesCount = (series: SeriesItem[]): number => {
  return series.filter((s) => s.type === "surface").length;
};

const getMaxPieValue = (series: SeriesItem[]): number => {
  const values = series
    .filter((s) => s.pieData && s.pieData.value !== undefined)
    .map((s) => s.pieData.value);
  if (!values.length) return 1;

  return Math.max(1, ...values);
};

// Highlight a label
const highlightLabel = (
  option: ChartsOption & { series: SeriesItem[] },
  pieIndex: number
) => {
  const pieSeriesCount = getPieSeriesCount(option.series);
  const lineIndex = pieSeriesCount + pieIndex;
  const scatterIndex = pieSeriesCount * 2 + pieIndex;

  // Highlight the leader line
  if (lineIndex < option.series.length) {
    const lineSeries = option.series[
      lineIndex
    ] as unknown as echarts.SeriesOption & {
      lineStyle?: { color?: string; width?: number };
      _originalWidth?: number;
    };
    if (lineSeries && lineSeries.lineStyle) {
      // Save the original width (if not saved yet)
      if (lineSeries._originalWidth === undefined) {
        lineSeries._originalWidth = lineSeries.lineStyle.width || 1;
      }
      // Highlight: only increase the width, keep the color
      lineSeries.lineStyle.width = (lineSeries._originalWidth || 1) * 2;
    }
  }

  // Highlight the text
  if (scatterIndex < option.series.length) {
    const scatterSeries = option.series[
      scatterIndex
    ] as unknown as echarts.SeriesOption & {
      label?: {
        textStyle?: { color?: string; fontSize?: number };
      };
      _originalFontSize?: number;
    };
    if (scatterSeries && scatterSeries.label && scatterSeries.label.textStyle) {
      const textStyle = scatterSeries.label.textStyle;
      // Save the original font size (if not saved yet)
      if (scatterSeries._originalFontSize === undefined) {
        scatterSeries._originalFontSize = textStyle.fontSize || 14;
      }
      // Highlight: only increase the font size, keep the color
      textStyle.fontSize = (scatterSeries._originalFontSize || 14) * 1.2;
    }
  }
};

// Remove label highlight
const unhighlightLabel = (
  option: ChartsOption & { series: SeriesItem[] },
  pieIndex: number
) => {
  const pieSeriesCount = getPieSeriesCount(option.series);
  const lineIndex = pieSeriesCount + pieIndex;
  const scatterIndex = pieSeriesCount * 2 + pieIndex;

  // Restore the leader line style
  if (lineIndex < option.series.length) {
    const lineSeries = option.series[
      lineIndex
    ] as unknown as echarts.SeriesOption & {
      lineStyle?: { color?: string; width?: number };
      _originalWidth?: number;
    };
    if (
      lineSeries &&
      lineSeries.lineStyle &&
      lineSeries._originalWidth !== undefined
    ) {
      lineSeries.lineStyle.width = lineSeries._originalWidth;
    }
  }

  // Restore the text style
  if (scatterIndex < option.series.length) {
    const scatterSeries = option.series[
      scatterIndex
    ] as unknown as echarts.SeriesOption & {
      label?: {
        textStyle?: { color?: string; fontSize?: number };
      };
      _originalFontSize?: number;
    };
    if (
      scatterSeries &&
      scatterSeries.label &&
      scatterSeries.label.textStyle &&
      scatterSeries._originalFontSize !== undefined
    ) {
      scatterSeries.label.textStyle.fontSize = scatterSeries._originalFontSize;
    }
  }
};

export const useMouseOverHandler = (
  optionRef: React.MutableRefObject<ChartsOption | null>,
  chartInstanceRef: React.MutableRefObject<echarts.ECharts | null>,
  hoveredIndexRef: React.MutableRefObject<number | "">,
  config: {
    hoverHeightIncrement: number;
    minHeight?: number;
    maxHeight?: number;
    yOffset?: number;
    autoRotate?: boolean;
  }
) => {
  const {
    hoverHeightIncrement,
    minHeight = 10,
    maxHeight = 35,
    yOffset = 0,
    autoRotate = false,
  } = config;
  const effectiveYOffset = autoRotate ? 0 : yOffset;

  return useCallback(
    (params: echarts.ECElementEvent) => {
      if (!optionRef.current || typeof params.seriesIndex !== "number") return;

      const option = optionRef.current as ChartsOption & {
        series: SeriesItem[];
      };
      const chart = chartInstanceRef.current;
      if (!chart) return;

      if (hoveredIndexRef.current === params.seriesIndex) {
        return;
      }

      if (
        hoveredIndexRef.current !== "" &&
        option.series[hoveredIndexRef.current]?.pieData
      ) {
        const idx = hoveredIndexRef.current as number;
        const isSelected = option.series[idx].pieStatus.selected;
        const startRatio = option.series[idx].pieData.startRatio!;
        const endRatio = option.series[idx].pieData.endRatio!;
        const k = option.series[idx].pieStatus.k;

        const maxValue = getMaxPieValue(option.series);
        const heightRatio = option.series[idx].pieData.value / maxValue;
        const h = minHeight + (maxHeight - minHeight) * heightRatio;

        option.series[idx].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          false,
          k,
          h,
          effectiveYOffset
        );
        option.series[idx].pieStatus.hovered = false;

        // Clear the previously highlighted label
        unhighlightLabel(option, idx);

        hoveredIndexRef.current = "";
      }

      if (
        params.seriesName !== "mouseoutSeries" &&
        option.series[params.seriesIndex]?.pieData
      ) {
        const seriesIndex = params.seriesIndex;
        const isSelected = option.series[seriesIndex].pieStatus.selected;
        const startRatio = option.series[seriesIndex].pieData.startRatio!;
        const endRatio = option.series[seriesIndex].pieData.endRatio!;
        const k = option.series[seriesIndex].pieStatus.k;

        const maxValue = getMaxPieValue(option.series);
        const heightRatio = option.series[seriesIndex].pieData.value / maxValue;
        const baseHeight = minHeight + (maxHeight - minHeight) * heightRatio;

        option.series[seriesIndex].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          true,
          k,
          baseHeight + hoverHeightIncrement,
          effectiveYOffset
        );
        option.series[seriesIndex].pieStatus.hovered = true;

        // Highlight the matching label
        highlightLabel(option, seriesIndex);

        hoveredIndexRef.current = seriesIndex;
      }

      chart.setOption({ series: option.series } as unknown as ChartOptionType, {
        notMerge: false,
        lazyUpdate: false,
      });
    },
    [
      chartInstanceRef,
      hoverHeightIncrement,
      hoveredIndexRef,
      optionRef,
      minHeight,
      maxHeight,
      effectiveYOffset,
    ]
  );
};

export const useGlobalOutHandler = (
  optionRef: React.MutableRefObject<ChartsOption | null>,
  chartInstanceRef: React.MutableRefObject<echarts.ECharts | null>,
  hoveredIndexRef: React.MutableRefObject<number | "">,
  config?: {
    minHeight?: number;
    maxHeight?: number;
    yOffset?: number;
    autoRotate?: boolean;
  }
) => {
  const {
    minHeight = 10,
    maxHeight = 35,
    yOffset = 0,
    autoRotate = false,
  } = config ?? {};
  const effectiveYOffset = autoRotate ? 0 : yOffset;

  return useCallback(() => {
    if (!optionRef.current) return;

    const option = optionRef.current as ChartsOption & { series: SeriesItem[] };
    const chart = chartInstanceRef.current;
    if (!chart) return;

    if (
      hoveredIndexRef.current !== "" &&
      option.series[hoveredIndexRef.current]?.pieData
    ) {
      const idx = hoveredIndexRef.current as number;
      const isSelected = option.series[idx].pieStatus.selected;
      const startRatio = option.series[idx].pieData.startRatio!;
      const endRatio = option.series[idx].pieData.endRatio!;
      const k = option.series[idx].pieStatus.k;

      const maxValue = getMaxPieValue(option.series);
      const heightRatio = option.series[idx].pieData.value / maxValue;
      const h = minHeight + (maxHeight - minHeight) * heightRatio;

      option.series[idx].parametricEquation = getParametricEquation(
        startRatio,
        endRatio,
        isSelected,
        false,
        k,
        h,
        effectiveYOffset
      );
      option.series[idx].pieStatus.hovered = false;

      // Remove label highlight
      unhighlightLabel(option, idx);

      hoveredIndexRef.current = "";
    }

    chart.setOption({ series: option.series } as unknown as ChartOptionType, {
      notMerge: false,
      lazyUpdate: false,
    });
  }, [
    chartInstanceRef,
    hoveredIndexRef,
    optionRef,
    minHeight,
    maxHeight,
    effectiveYOffset,
  ]);
};
