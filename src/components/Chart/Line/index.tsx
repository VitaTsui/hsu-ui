import * as echarts from "echarts";

import {
  ChartCommonProps,
  ChartOptionType,
  ChartsOption,
  SeriesDataType,
} from "..";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import styles from "../index.module.scss";
import { autoScrollLegend } from "../_utils/autoScrollLegend";
import { autoScrollByItem } from "../_utils/autoSmooth";
import {
  buildCartesianSeriesOptions,
  ChartScrollConfig,
  createDefaultCategoryXAxis,
  createDefaultValueYAxis,
  DataZoomIndexWindow,
  getSliderShow,
  percentWindowToIndexWindow,
  resolveScrollConfig,
} from "../_utils/cartesian";

export interface ChartLineProps extends ChartCommonProps {
  chartTitle?: string;
  xAxisData?: Array<string>;
  seriesData?: SeriesDataType;
  legendData?: string[];
  scrollConfig?: ChartScrollConfig;
  yAxisNameOffsets?: number[];
  onClick?: (event: echarts.ECElementEvent) => void;
  /** 图例点选变化回调，参数为当前各系列选中状态（配合 legend.selected 可实现坐标轴重算） */
  onLegendSelectChanged?: (selected: Record<string, boolean>) => void;
  /** dataZoom 可见窗口变化回调（滑块/滚轮/自动滚动/初始同步均触发），参数为当前可见的 x 轴索引区间（配合 useDataZoomWindow 可按展示部分重算坐标轴） */
  onDataZoomWindowChanged?: (window: DataZoomIndexWindow) => void;
  /** 是否启用图例自动滚动，默认 false */
  enableLegendAutoScroll?: boolean;
  /** 图例每页可见数量，默认 8 */
  legendVisibleCount?: number;
  /** 图例滚动间隔时间(ms)，默认 1500 */
  legendScrollInterval?: number;
}

const ChartLine: React.FC<ChartLineProps> = (props) => {
  const {
    className,
    style,
    chartTitle,
    xAxisData,
    seriesData,
    legendData,
    grid,
    tooltip,
    xAxis,
    yAxis,
    series,
    title,
    legend,
    scrollConfig,
    dataZoom,
    insideDataZoom,
    sliderDataZoom,
    onClick,
    onLegendSelectChanged,
    onDataZoomWindowChanged,
    enableLegendAutoScroll = false,
    legendVisibleCount = 8,
    legendScrollInterval = 1500,
    ...coreOption
  } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const prevXAxisKeyRef = useRef<string | null>(null);
  const legendScrollRef = useRef<ReturnType<typeof autoScrollLegend> | null>(
    null,
  );
  const normalizedScroll = useMemo(
    () => resolveScrollConfig(scrollConfig),
    [scrollConfig],
  );

  // 使用 useMemo 缓存 chart 配置
  const chartOption = useMemo(() => {
    const def_xAxis = createDefaultCategoryXAxis(xAxisData);
    const def_yAxis = createDefaultValueYAxis("line");

    // 处理 xAxis 配置
    const processedXAxis = Array.isArray(xAxis)
      ? xAxis?.map((item) => ({
          ...def_xAxis,
          data: item?.type === "value" ? undefined : xAxisData,
          ...item,
        }))
      : {
          ...def_xAxis,
          data: xAxis?.type === "value" ? undefined : xAxisData,
          ...xAxis,
        };

    // 处理 yAxis 配置
    const processedYAxis = Array.isArray(yAxis)
      ? yAxis?.map((item) => ({
          ...def_yAxis,
          data: item?.type === "category" ? xAxisData : undefined,
          ...item,
        }))
      : {
          ...def_yAxis,
          data: yAxis?.type === "category" ? xAxisData : undefined,
          ...yAxis,
        };

    // 计算 grid 配置
    let gridTop: string | undefined = "5%";

    if ((yAxis as ChartOptionType)?.name) {
      gridTop = "15%";
    }

    const gridConfig: echarts.GridComponentOption = {
      top: gridTop,
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true,
      ...grid,
    };

    if (chartTitle) {
      delete gridConfig.top;
    }

    // 处理 dataZoom 配置
    const totalLen = xAxisData?.length ?? 1;
    const {
      zoomEnabled,
      autoScroll,
      windowSize,
      startIndex: resolvedStartIndex,
      sliderVisible: sliderVisibleInConfig,
    } = normalizedScroll;
    const windowSizePercent = Number(
      ((windowSize / totalLen) * 100).toFixed(0),
    );
    const zoomStartIndex = resolvedStartIndex;
    const clampedStart = Math.max(
      0,
      Math.min(zoomStartIndex, Math.max(0, totalLen - 1)),
    );
    const zoomStartPercent = totalLen > 0 ? (clampedStart / totalLen) * 100 : 0;
    const zoomEndPercent = Math.min(zoomStartPercent + windowSizePercent, 100);
    const sliderFromDataZoom = Array.isArray(dataZoom)
      ? dataZoom.find((item) => item.type === "slider")
      : dataZoom || {};
    const insideFromDataZoom = Array.isArray(dataZoom)
      ? dataZoom.find((item) => item.type === "inside")
      : dataZoom || {};
    const requestedSliderVisible =
      sliderVisibleInConfig ??
      getSliderShow(sliderDataZoom) ??
      getSliderShow(sliderFromDataZoom) ??
      false;
    const finalSliderVisible = autoScroll ? false : requestedSliderVisible;
    const enableCustomWheelScroll =
      normalizedScroll.wheelModeWhenSliderHidden === "scroll" &&
      (autoScroll || !finalSliderVisible);
    const processedDataZoom = zoomEnabled
      ? [
          {
            type: "inside",
            ...(insideFromDataZoom || {}),
            ...(insideDataZoom || {}),
            start: zoomStartPercent,
            end: zoomEndPercent,
            ...(autoScroll ? { zoomLock: true } : {}),
            ...(enableCustomWheelScroll
              ? { zoomOnMouseWheel: false, moveOnMouseWheel: false }
              : {}),
          },
          {
            type: "slider",
            ...(sliderFromDataZoom || {}),
            ...(sliderDataZoom || {}),
            start: zoomStartPercent,
            end: zoomEndPercent,
            show: finalSliderVisible,
          },
        ]
      : undefined;

    const option: ChartsOption = {
      title: {
        text: chartTitle,
        textStyle: {
          fontSize: 18,
          color: "#333",
        },
        ...title,
      },
      grid: gridConfig,
      legend: (() => {
        const baseLegend: echarts.LegendComponentOption = {
          data: legendData,
          top: "5%",
          icon: "circle",
          textStyle: {
            color: "#373D48",
          },
          itemWidth: 8,
          itemHeight: 8,
          ...legend,
        };
        if (enableLegendAutoScroll) {
          return {
            ...baseLegend,
            type: "scroll",
            pageIconSize: 0,
            pageIconColor: "transparent",
            pageIconInactiveColor: "transparent",
            pageTextStyle: {
              color: "transparent",
            },
          };
        }
        return baseLegend;
      })(),
      tooltip: {
        trigger: "axis",
        ...tooltip,
      },
      xAxis: processedXAxis,
      yAxis: processedYAxis,
      dataZoom: processedDataZoom,
      series: buildCartesianSeriesOptions("line", seriesData, series),
      ...coreOption,
    } as ChartsOption;

    return option;
  }, [
    xAxisData,
    xAxis,
    yAxis,
    grid,
    chartTitle,
    dataZoom,
    normalizedScroll,
    insideDataZoom,
    sliderDataZoom,
    title,
    legendData,
    legend,
    tooltip,
    seriesData,
    series,
    enableLegendAutoScroll,
    coreOption,
  ]);

  // 处理图表 resize 的回调
  const handleResize = useCallback(() => {
    chartInstanceRef.current?.resize();
  }, []);

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化或获取已存在的实例
    let chart = chartInstanceRef.current;
    if (!chart) {
      chart = echarts.init(chartRef.current);
      chartInstanceRef.current = chart;
    }

    // 设置配置：notMerge 会把 dataZoom 窗口重置回初始位置，
    // x 轴数据未变化时（如坐标轴重算/图例点选触发的重渲染）先记录当前窗口，设置后恢复
    const xAxisKey = xAxisData?.join("\u0001") ?? "";
    const prevZoomRanges =
      prevXAxisKeyRef.current === xAxisKey
        ? ((chart.getOption() as ChartsOption | undefined)?.dataZoom as
            | Array<{ start?: number; end?: number }>
            | undefined)
        : undefined;
    prevXAxisKeyRef.current = xAxisKey;
    chart.setOption(chartOption as ChartOptionType, true);
    const nextZooms = (chartOption as ChartsOption).dataZoom;
    if (
      prevZoomRanges?.length &&
      Array.isArray(nextZooms) &&
      nextZooms.length === prevZoomRanges.length
    ) {
      chart.setOption({
        dataZoom: prevZoomRanges.map((z) => ({ start: z.start, end: z.end })),
      });
    }

    // 向调用方同步当前可见窗口（初始渲染与恢复后），用于按展示部分重算坐标轴
    if (onDataZoomWindowChanged) {
      const zooms = (chart.getOption() as ChartsOption | undefined)
        ?.dataZoom as Array<{ start?: number; end?: number }> | undefined;
      const zoom = zooms?.[0];
      const totalLen = xAxisData?.length ?? 0;
      if (typeof zoom?.start === "number" && typeof zoom?.end === "number") {
        onDataZoomWindowChanged(
          percentWindowToIndexWindow(zoom.start, zoom.end, totalLen),
        );
      } else {
        // 无 dataZoom（如数据量不足未启用滚动）时窗口即全量，同步一次避免残留旧窗口
        onDataZoomWindowChanged({
          startIndex: 0,
          endIndex: Math.max(0, totalLen - 1),
        });
      }
    }

    // 添加 resize 监听
    window.addEventListener("resize", handleResize);

    // 添加 ResizeObserver
    if (chartRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartRef.current);
    }

    // 添加点击事件
    if (onClick) {
      chartInstanceRef.current?.on("click", onClick);
    }

    // 图例点选事件
    const handleLegendSelectChanged = (params: unknown) => {
      onLegendSelectChanged?.(
        (params as { selected: Record<string, boolean> }).selected,
      );
    };
    if (onLegendSelectChanged) {
      chartInstanceRef.current?.on(
        "legendselectchanged",
        handleLegendSelectChanged,
      );
    }

    // dataZoom 原生交互（slider 拖动 / inside 缩放）→ 同步可见窗口
    const handleDataZoom = (params: unknown) => {
      const raw = params as {
        start?: number;
        end?: number;
        startValue?: number;
        endValue?: number;
        batch?: Array<{
          start?: number;
          end?: number;
          startValue?: number;
          endValue?: number;
        }>;
      };
      const info = raw?.batch?.[0] ?? raw;
      if (
        typeof info?.startValue === "number" &&
        typeof info?.endValue === "number"
      ) {
        onDataZoomWindowChanged?.({
          startIndex: Math.max(0, Math.round(info.startValue)),
          endIndex: Math.max(0, Math.round(info.endValue)),
        });
      } else if (
        typeof info?.start === "number" &&
        typeof info?.end === "number"
      ) {
        onDataZoomWindowChanged?.(
          percentWindowToIndexWindow(
            info.start,
            info.end,
            xAxisData?.length ?? 0,
          ),
        );
      }
    };
    if (onDataZoomWindowChanged) {
      chartInstanceRef.current?.on("datazoom", handleDataZoom);
    }

    // 图例自动滚动（与 Pie/Bar 一致）
    const opt = chartOption as ChartsOption;
    const legendDataLen = Array.isArray(opt.legend)
      ? opt.legend[0]?.data?.length
      : (opt.legend as echarts.LegendComponentOption)?.data?.length;
    const seriesLen = Array.isArray(opt.series)
      ? opt.series.length
      : opt.series
        ? 1
        : 0;
    const legendTotal = legendDataLen ?? seriesLen ?? 0;
    if (enableLegendAutoScroll && chartInstanceRef.current && legendTotal > 0) {
      if (legendScrollRef.current) {
        legendScrollRef.current.dispose();
      }
      legendScrollRef.current = autoScrollLegend({
        chart: chartInstanceRef.current,
        total: legendTotal,
        visibleCount: legendVisibleCount,
        interval: legendScrollInterval,
        autoStart: true,
      });
    }

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);

      if (onClick) {
        chartInstanceRef.current?.off("click", onClick);
      }

      if (onLegendSelectChanged) {
        chartInstanceRef.current?.off(
          "legendselectchanged",
          handleLegendSelectChanged,
        );
      }

      if (onDataZoomWindowChanged) {
        chartInstanceRef.current?.off("datazoom", handleDataZoom);
      }

      if (legendScrollRef.current) {
        legendScrollRef.current.dispose();
        legendScrollRef.current = null;
      }
    };
  }, [
    chartOption,
    handleResize,
    onClick,
    onLegendSelectChanged,
    onDataZoomWindowChanged,
    xAxisData,
    enableLegendAutoScroll,
    legendVisibleCount,
    legendScrollInterval,
  ]);

  // 处理自动播放
  useEffect(() => {
    if (
      !normalizedScroll.zoomEnabled ||
      !chartInstanceRef.current ||
      !xAxisData?.length
    )
      return;

    const sliderVisible =
      normalizedScroll.sliderVisible ??
      getSliderShow(sliderDataZoom) ??
      (Array.isArray(dataZoom)
        ? getSliderShow(dataZoom.find((item) => item.type === "slider"))
        : getSliderShow(dataZoom)) ??
      false;
    const enableWheelScroll =
      normalizedScroll.wheelModeWhenSliderHidden === "scroll" &&
      (normalizedScroll.autoScroll || !sliderVisible);
    const { dispose } = autoScrollByItem({
      chart: chartInstanceRef.current,
      xAxisData,
      windowSize: normalizedScroll.windowSize,
      interval: normalizedScroll.interval,
      startIndex: normalizedScroll.startIndex,
      autoPlay: normalizedScroll.autoScroll,
      enableWheelScroll,
      onWindowChange: onDataZoomWindowChanged
        ? (startPercent, endPercent) =>
            onDataZoomWindowChanged(
              percentWindowToIndexWindow(
                startPercent,
                endPercent,
                xAxisData.length,
              ),
            )
        : undefined,
    });

    return dispose;
  }, [
    dataZoom,
    normalizedScroll,
    sliderDataZoom,
    xAxisData,
    onDataZoomWindowChanged,
  ]);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 清理 ResizeObserver
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      // 销毁图表实例
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

export default ChartLine;
