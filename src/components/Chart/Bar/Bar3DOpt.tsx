import * as echarts from "echarts";

import { ChartOptionType, Series } from "..";

const colors: string[] = ["rgba(29, 230, 235,1)", "rgba(7, 235, 251,1)"];

// Chainable type of ctx inside buildPath (equivalent to zrender's PathProxy)
type PathCtx = {
  moveTo(x: number, y: number): PathCtx;
  lineTo(x: number, y: number): PathCtx;
  closePath(): PathCtx;
};

// Draw the front face
const CubeFront = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath(ctx, shape) {
    const { xAxisPoint, xAxisTranslation = 0, barWidth = 20 } = shape;

    // Top-right point
    const c0 = [shape.x + 0 + xAxisTranslation, shape.y];
    // Top-left point
    const c1 = [shape.x - barWidth + xAxisTranslation, shape.y];
    // Bottom-left point
    const c2 = [xAxisPoint[0] - barWidth + xAxisTranslation, xAxisPoint[1]];
    // Bottom-right point
    const c3 = [xAxisPoint[0] + 0 + xAxisTranslation, xAxisPoint[1]];

    (ctx as unknown as PathCtx)
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath();
  },
});
// Draw the right face
const CubeRight = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath(ctx, shape) {
    const { xAxisPoint, xAxisTranslation = 0, barWidth = 20 } = shape;
    // Compute the depth offset from barWidth, keeping the original ratio
    const depthOffset = (barWidth * 8) / 20;

    // Top-left point
    const c1 = [shape.x + 0 + xAxisTranslation, shape.y];
    // Bottom-left point
    const c2 = [xAxisPoint[0] + 0 + xAxisTranslation, xAxisPoint[1]];
    // Bottom-right point
    const c3 = [
      xAxisPoint[0] + depthOffset + xAxisTranslation,
      xAxisPoint[1] - 5,
    ];
    // Top-right point
    const c4 = [shape.x + depthOffset + xAxisTranslation, shape.y - 5];

    (ctx as unknown as PathCtx)
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// Draw the top face
const CubeTop = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath(ctx, shape) {
    const { xAxisTranslation = 0, barWidth = 20 } = shape;
    // Compute offsets from barWidth, keeping the original ratio
    const rightOffset = (barWidth * 8) / 20; // Right offset
    const leftOffset = (barWidth * 12) / 20; // Left offset

    // Top-right point
    const c1 = [shape.x + 0 + xAxisTranslation, shape.y];
    // Top-right point
    const c2 = [shape.x + rightOffset + xAxisTranslation, shape.y - 5];
    // Top-left point
    const c3 = [shape.x - leftOffset + xAxisTranslation, shape.y - 5];
    // Bottom-left point
    const c4 = [shape.x - barWidth + xAxisTranslation, shape.y];

    (ctx as unknown as PathCtx)
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// Register the three face shapes
echarts.graphic.registerShape("CubeFront", CubeFront);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);

export interface Bar3DSeriesOptions {
  /** Total number of 3D bar series in the group (legend-hidden ones excluded), used to center the whole group relative to the category tick, default 1 */
  seriesCount?: number;
  /** Order of the current series within the group (legend-hidden ones take no slot), defaults to params.seriesIndex */
  seriesOrder?: number;
  /** Stack mode: series on the same category are stacked vertically (sharing a single bar) */
  stack?: boolean;
  /** Stack base: accumulated value below each data point, summed by the caller over visible series */
  stackBase?: number[];
}

/**
 * Generates the series for a 3D bar chart
 * @param _colors Colors
 * @param barGap Gap between bars, must be greater than or equal to the bar width
 * @param barWidth Bar width
 * @param options Group centering / stacking config
 * @returns
 */
const bar3DSeries = (
  _colors: echarts.Color,
  barGap: number = 25,
  barWidth: number = 20,
  options: Bar3DSeriesOptions = {},
): echarts.SeriesOption & ChartOptionType => {
  const { seriesCount = 1, seriesOrder, stack = false, stackBase } = options;
  // The visual footprint of a single bar is [x - barWidth, x + depthOffset] (depthOffset is the 3D depth)
  const depthOffset = (barWidth * 8) / 20;
  // Centering compensation of the whole group (a single bar when stacked) relative to the category tick
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

      // When stacked, draw from the base (accumulated value of the series below) to base + own value; otherwise draw from 0
      const stackBottom = stack ? (stackBase?.[dataIndex] ?? 0) : 0;
      const location = api.coord!([value0, stackBottom + Number(value1)]);
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
