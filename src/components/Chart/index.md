---
nav: 组件
group:
  title: 数据展示
  order: 4
title: Chart 图表
---

# Chart 图表

基于 echarts 封装的图表集合，以 `Chart.Line`、`Chart.Bar`、`Chart.Pie` 等子组件形式提供常用图表，自动处理实例创建、容器自适应与销毁。

## 引入

```ts
import { Chart } from "@hsu-react/ui";
```

## 基础用法

以 `Chart.Line` 为例，传入 `xAxisData` 与 `seriesData` 即可渲染折线图：

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <Chart.Line
    style={{ height: 300 }}
    legendData={["销量"]}
    xAxisData={["周一", "周二", "周三", "周四", "周五", "周六", "周日"]}
    seriesData={[120, 200, 150, 80, 70, 110, 130]}
  />
);
```

## 子组件

`Chart` 提供以下子组件：

| 子组件 | 说明 |
| --- | --- |
| Chart.Line | 折线图 |
| Chart.Bar | 柱状图 |
| Chart.Pie | 饼图（另含 `Chart.Pie.Three` 3D 饼图） |
| Chart.Polar | 极坐标图 |
| Chart.Gauge | 仪表盘 |
| Chart.Sankey | 桑基图 |
| Chart.Tree | 树图 |
| Chart.Bubble | 气泡图 |
| Chart.Heatmap | 热力图 |
| Chart.Radar | 雷达图 |
| Chart.Group | 组合图表（可在 `Line`/`Bar`/`Pie` 间切换） |
| Chart.Common | 通用图表，直接透传 echarts 的 `EChartsOption` |

## API

### Chart.Line / Chart.Bar

在 echarts `EChartsOption` 基础上扩展（`Chart.Bar` 同此表）：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| xAxisData | X 轴类目数据 | `string[]` | - |
| seriesData | 系列数据，可为数字数组或带 `name`/`series` 的对象数组 | `SeriesDataType` | - |
| legendData | 图例数据 | `string[]` | - |
| chartTitle | 图表标题 | `string` | - |
| scrollConfig | 滚动/缩放配置 | `ChartScrollConfig` | - |
| insideDataZoom | 内置型数据缩放配置 | `DataZoomComponentOption` | - |
| sliderDataZoom | 滑动条型数据缩放配置 | `DataZoomComponentOption` | - |
| enableLegendAutoScroll | 是否启用图例自动滚动 | `boolean` | `false` |
| legendVisibleCount | 图例每页可见数量 | `number` | `8` |
| legendScrollInterval | 图例滚动间隔（ms） | `number` | `1500` |
| onClick | 图元点击回调 | `(event: ECElementEvent) => void` | - |
| className | 容器类名 | `string` | - |
| style | 容器样式 | `ChartCSSProperties` | - |

> `Chart.Line` 额外支持 `yAxisNameOffsets?: number[]`；其余 echarts 原生配置项（`grid`、`xAxis`、`yAxis`、`tooltip`、`series` 等）均可直接透传。

### Chart.Pie

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| seriesData | 系列数据 | `SeriesDataType` | - |
| chartTitle | 图表中心标题 | `string` | - |
| extendSeries | 追加的额外系列 | `Series[]` | `[]` |
| isSemiCircle | 是否为半圆 | `boolean` | `false` |
| position | 半圆贴边位置 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| spanAngle | 显示角度 | `number` | `180` |
| center | 中心位置 | `[string, string]` | - |
| radius | 半径配置 | `[string, string]` | - |
| enableLegendAutoScroll | 是否启用图例自动滚动 | `boolean` | `false` |
| onClick | 图元点击回调 | `(event: ECElementEvent) => void` | - |
| onChart | 图表实例就绪回调 | `(chart: EChartsType) => void` | - |
