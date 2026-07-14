import * as echarts from "echarts";

import { ChartOptionType, Series } from "..";

const colors: string[] = ["rgba(29, 230, 235,1)", "rgba(7, 235, 251,1)"];

// buildPath 内 ctx 的可链式调用类型（等价于 zrender 的 PathProxy）
type PathCtx = {
  moveTo(x: number, y: number): PathCtx;
  lineTo(x: number, y: number): PathCtx;
  closePath(): PathCtx;
};

// 绘制正面
const CubeFront = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath(ctx, shape) {
    const { xAxisPoint, xAxisTranslation = 0, barWidth = 20 } = shape;

    // 右上点
    const c0 = [shape.x + 0 + xAxisTranslation, shape.y];
    // 左上点
    const c1 = [shape.x - barWidth + xAxisTranslation, shape.y];
    // 左下点
    const c2 = [xAxisPoint[0] - barWidth + xAxisTranslation, xAxisPoint[1]];
    // 右下点
    const c3 = [xAxisPoint[0] + 0 + xAxisTranslation, xAxisPoint[1]];

    (ctx as unknown as PathCtx)
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath();
  },
});
// 绘制右侧面
const CubeRight = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath(ctx, shape) {
    const { xAxisPoint, xAxisTranslation = 0, barWidth = 20 } = shape;
    // 根据 barWidth 计算深度偏移，保持原有比例
    const depthOffset = (barWidth * 8) / 20;

    // 左上点
    const c1 = [shape.x + 0 + xAxisTranslation, shape.y];
    // 左下点
    const c2 = [xAxisPoint[0] + 0 + xAxisTranslation, xAxisPoint[1]];
    // 右下点
    const c3 = [
      xAxisPoint[0] + depthOffset + xAxisTranslation,
      xAxisPoint[1] - 5,
    ];
    // 右上点
    const c4 = [shape.x + depthOffset + xAxisTranslation, shape.y - 5];

    (ctx as unknown as PathCtx)
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// 绘制顶面
const CubeTop = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath(ctx, shape) {
    const { xAxisTranslation = 0, barWidth = 20 } = shape;
    // 根据 barWidth 计算偏移量，保持原有比例
    const rightOffset = (barWidth * 8) / 20; // 右侧偏移
    const leftOffset = (barWidth * 12) / 20; // 左侧偏移

    // 右上点
    const c1 = [shape.x + 0 + xAxisTranslation, shape.y];
    // 右上点
    const c2 = [shape.x + rightOffset + xAxisTranslation, shape.y - 5];
    // 左上点
    const c3 = [shape.x - leftOffset + xAxisTranslation, shape.y - 5];
    // 左下点
    const c4 = [shape.x - barWidth + xAxisTranslation, shape.y];

    (ctx as unknown as PathCtx)
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// 注册三个面图形
echarts.graphic.registerShape("CubeFront", CubeFront);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);

export interface Bar3DSeriesOptions {
  /** 同组 3D 柱系列总数（图例隐藏的不计入），用于整组相对类目刻度居中，默认 1 */
  seriesCount?: number;
  /** 当前系列在同组内的序号（图例隐藏的不占位），默认取 params.seriesIndex */
  seriesOrder?: number;
  /** 堆叠模式：同一类目上各系列纵向叠放（共用同一根柱） */
  stack?: boolean;
  /** 堆叠基底：每个数据点下方已累计的值，由调用方按可见系列累加 */
  stackBase?: number[];
}

/**
 * 3D柱状图series生成
 * @param _colors 颜色
 * @param barGap 柱间距，必须大于等于柱宽
 * @param barWidth 柱宽
 * @param options 分组居中 / 堆叠配置
 * @returns
 */
const bar3DSeries = (
  _colors: echarts.Color,
  barGap: number = 25,
  barWidth: number = 20,
  options: Bar3DSeriesOptions = {},
): echarts.SeriesOption & ChartOptionType => {
  const { seriesCount = 1, seriesOrder, stack = false, stackBase } = options;
  // 单根柱的视觉足迹为 [x - barWidth, x + depthOffset]（depthOffset 为 3D 深度）
  const depthOffset = (barWidth * 8) / 20;
  // 整组（堆叠时只有一根柱）相对类目刻度的居中补偿
  const groupSpan = stack ? 0 : Math.max(0, seriesCount - 1) * barGap;
  const centerOffset = (barWidth - depthOffset - groupSpan) / 2;

  const series = {
    type: "custom",
    renderItem: (
      params: echarts.CustomSeriesRenderItemParams,
      api: echarts.CustomSeriesRenderItemAPI,
    ) => {
      const { seriesIndex = 0, dataIndex = 0 } = params;

      const cubeLeftStyle =
        _colors ??
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors[0],
          },
          {
            offset: 1,
            color: "rgba(7, 20, 52,0.7)",
          },
        ]);
      const cubeRightStyle =
        _colors ??
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(7, 20, 52,1)",
          },
          {
            offset: 1,
            color: colors[0],
          },
        ]);
      const cubeTopStyle =
        _colors ??
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(7, 20, 52,1)",
          },
          {
            offset: 1,
            color: colors[0],
          },
        ]);

      const [value0, value1] = [api.value!(0), api.value!(1)];

      if (value1 === 0) {
        return { type: "group", children: [] };
      }

      // 堆叠时从基底（下方各系列累计值）画到基底+自身值；非堆叠从 0 画起
      const stackBottom = stack ? (stackBase?.[dataIndex] ?? 0) : 0;
      const location = api.coord!([value0, stackBottom + value1]);
      const bottomPoint = api.coord!([value0, stackBottom]);

      const order = seriesOrder ?? seriesIndex;
      const xAxisTranslation = (stack ? 0 : order * barGap) + centerOffset;

      return {
        type: "group",
        children: [
          {
            type: "CubeFront",
            shape: {
              api,
              xValue: value0,
              yValue: value1,
              x: location[0],
              y: location[1],
              xAxisPoint: bottomPoint,
              xAxisTranslation,
              barWidth,
            },
            style: {
              fill: cubeLeftStyle,
            },
          },
          {
            type: "CubeRight",
            shape: {
              api,
              xValue: value0,
              yValue: value1,
              x: location[0],
              y: location[1],
              xAxisPoint: bottomPoint,
              xAxisTranslation,
              barWidth,
            },
            style: {
              fill: cubeRightStyle,
            },
          },
          {
            type: "CubeTop",
            shape: {
              api,
              xValue: value0,
              yValue: value1,
              x: location[0],
              y: location[1],
              xAxisPoint: bottomPoint,
              xAxisTranslation,
              barWidth,
            },
            style: {
              fill: cubeTopStyle,
            },
          },
        ],
      };
    },
  };

  return series as Series;
};

export default bar3DSeries;
