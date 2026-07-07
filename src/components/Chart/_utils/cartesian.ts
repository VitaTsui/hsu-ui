import * as echarts from "echarts";
import { ChartOptionType, SeriesData, SeriesDataType } from "..";

export interface ChartScrollConfig {
  enabled?: boolean;
  autoScroll?: boolean;
  windowSize?: number;
  interval?: number;
  startIndex?: number;
  sliderVisible?: boolean;
  wheelModeWhenSliderHidden?: "scroll" | "none";
}

export interface NormalizedScrollConfig {
  zoomEnabled: boolean;
  autoScroll: boolean;
  windowSize: number;
  interval: number;
  startIndex: number;
  sliderVisible?: boolean;
  wheelModeWhenSliderHidden: "scroll" | "none";
}

/** dataZoom 当前可见窗口对应的 x 轴索引区间（闭区间） */
export interface DataZoomIndexWindow {
  startIndex: number;
  endIndex: number;
}

/**
 * 把 dataZoom 的 start/end 百分比换算为 x 轴索引窗口。
 * 与本组件族写入 dataZoom 的百分比约定一致（index / total * 100），
 * 对 echarts 原生交互产生的百分比做外扩取整，边界最多多含一项，不影响坐标轴量级。
 */
export const percentWindowToIndexWindow = (
  startPercent: number,
  endPercent: number,
  total: number,
): DataZoomIndexWindow => {
  if (total <= 0) return { startIndex: 0, endIndex: 0 };
  const startIndex = Math.max(
    0,
    Math.min(total - 1, Math.floor((startPercent / 100) * total)),
  );
  const endIndex = Math.max(
    startIndex,
    Math.min(total - 1, Math.ceil((endPercent / 100) * total) - 1),
  );
  return { startIndex, endIndex };
};

export const createDefaultCategoryXAxis = (
  xAxisData?: Array<string>,
): ChartOptionType => ({
  type: "category",
  boundaryGap: true,
  data: xAxisData,
  axisLabel: {
    interval: 0,
    hideOverlap: true,
    textStyle: {
      fontSize: 14,
      color: "#373D48",
    },
  },
  axisTick: {
    show: false,
  },
});

export const createDefaultValueYAxis = (
  mode: "bar" | "line" = "bar",
): ChartOptionType => ({
  type: "value",
  axisLabel: {
    textStyle: {
      fontSize: 14,
      color: "#373D48",
    },
  },
  splitLine:
    mode === "line"
      ? {
          lineStyle: {
            color: "#C9CED6",
            type: "dashed",
          },
        }
      : {
          show: false,
        },
});

export const buildCartesianSeriesOptions = (
  mode: "bar" | "line",
  seriesData?: SeriesDataType,
  series?: echarts.SeriesOption | echarts.SeriesOption[],
): echarts.SeriesOption[] => {
  const seriesStyle: echarts.SeriesOption =
    mode === "bar"
      ? ({
          type: "bar",
          barWidth: 20,
        } as echarts.BarSeriesOption)
      : ({
          type: "line",
          symbol: "circle",
          symbolSize: 8,
        } as echarts.LineSeriesOption);

  if (
    !seriesData ||
    seriesData.length === 0 ||
    typeof seriesData[0] !== "object"
  ) {
    if (Array.isArray(series)) {
      return series.map(
        (item): echarts.SeriesOption =>
          ({
            data: seriesData,
            ...seriesStyle,
            ...item,
          } as echarts.SeriesOption),
      );
    }

    return [
      {
        data: seriesData,
        ...seriesStyle,
        ...(series || {}),
      },
    ] as echarts.SeriesOption[];
  }

  const typedSeriesData = seriesData as SeriesData[];
  if (Array.isArray(series)) {
    return series.flatMap((item) =>
      typedSeriesData.map(
        (serie): echarts.SeriesOption =>
          ({
            name: serie?.name,
            data: serie?.value,
            ...seriesStyle,
            ...item,
            ...serie?.series,
          } as echarts.SeriesOption),
      ),
    );
  }

  return typedSeriesData.map(
    (serie): echarts.SeriesOption =>
      ({
        name: serie?.name,
        data: serie?.value,
        ...seriesStyle,
        ...(series || {}),
        ...serie?.series,
      } as echarts.SeriesOption),
  );
};

export const getSliderShow = (
  zoom?: echarts.DataZoomComponentOption | Record<string, unknown>,
) => {
  if (!zoom || typeof zoom !== "object") return undefined;
  const maybeShow = (zoom as { show?: unknown }).show;
  return typeof maybeShow === "boolean" ? maybeShow : undefined;
};

export const resolveScrollConfig = (
  scrollConfig?: ChartScrollConfig,
): NormalizedScrollConfig => ({
  zoomEnabled: scrollConfig?.enabled ?? false,
  autoScroll: scrollConfig?.autoScroll ?? false,
  windowSize: scrollConfig?.windowSize ?? 10,
  interval: scrollConfig?.interval ?? 2000,
  startIndex: scrollConfig?.startIndex ?? 0,
  sliderVisible: scrollConfig?.sliderVisible,
  wheelModeWhenSliderHidden:
    scrollConfig?.wheelModeWhenSliderHidden ?? "scroll",
});
