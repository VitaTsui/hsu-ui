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

## 子组件一览

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

> 以下示例均放在固定高度的容器中（echarts 需要有尺寸的容器才能渲染）。

## 折线图

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

## 柱状图

柱状图，与 `Chart.Line` 用法一致，传入 `xAxisData` 与 `seriesData`。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Bar
      legendData={["销量"]}
      xAxisData={["一月", "二月", "三月", "四月", "五月", "六月"]}
      seriesData={[120, 200, 150, 80, 70, 110]}
    />
  </div>
);
```

## 饼图

饼图，`seriesData` 为 `{ name, value }` 对象数组。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Pie
      chartTitle="访问来源"
      seriesData={[
        { name: "直接访问", value: 335 },
        { name: "搜索引擎", value: 234 },
        { name: "邮件营销", value: 154 },
        { name: "联盟广告", value: 135 },
      ]}
    />
  </div>
);
```

## 雷达图

雷达图，`indicators` 定义各维度（`{ name, max }`），`data` 为对应数值数组。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Radar
      name="能力评估"
      indicators={[
        { name: "研发", max: 100 },
        { name: "测试", max: 100 },
        { name: "运维", max: 100 },
        { name: "设计", max: 100 },
        { name: "产品", max: 100 },
      ]}
      data={[80, 70, 65, 90, 75]}
    />
  </div>
);
```

## 仪表盘

仪表盘，`seriesData` 为 `{ value, name }` 数组（默认量程 0~100）。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Gauge seriesData={[{ value: 72, name: "完成率" }]} />
  </div>
);
```

## 桑基图

桑基图，`seriesData` 为节点 `{ name }` 数组，`seriesLinks` 为连线 `{ source, target }` 数组。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Sankey
      seriesData={[
        { name: "访问" },
        { name: "注册" },
        { name: "下单" },
        { name: "复购" },
      ]}
      seriesLinks={[
        { source: "访问", target: "注册" },
        { source: "注册", target: "下单" },
        { source: "下单", target: "复购" },
      ]}
    />
  </div>
);
```

## 热力图

热力图，`data` 为 `[xIndex, yIndex, value]` 数组，配合 `xAxisData`、`yAxisData` 类目。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Heatmap
      xAxisData={["周一", "周二", "周三"]}
      yAxisData={["上午", "下午", "晚上"]}
      data={[
        [0, 0, 5],
        [0, 1, 7],
        [0, 2, 3],
        [1, 0, 8],
        [1, 1, 2],
        [1, 2, 6],
        [2, 0, 4],
        [2, 1, 9],
        [2, 2, 1],
      ]}
    />
  </div>
);
```

## 气泡图

气泡图，`data` 为 `{ name, value }` 数组，气泡大小随 `value` 自适应。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Bubble
      data={[
        { name: "前端", value: 120 },
        { name: "后端", value: 90 },
        { name: "测试", value: 60 },
        { name: "运维", value: 40 },
        { name: "设计", value: 30 },
      ]}
    />
  </div>
);
```

## 树图

树图，`seriesData` 为带 `children` 的层级节点数组（节点需含 `value` 字段）。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Tree
      seriesData={[
        {
          name: "根节点",
          value: 1,
          children: [
            {
              name: "分支 A",
              value: 1,
              children: [
                { name: "叶子 1", value: 1 },
                { name: "叶子 2", value: 1 },
              ],
            },
            { name: "分支 B", value: 1 },
          ],
        },
      ]}
    />
  </div>
);
```

## 极坐标图

极坐标进度环，`seriesData` 为单个 `{ name, value }` 对象（`angleAxis.max` 默认 100）。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Polar
      title1="75%"
      title2="完成度"
      title1Style={{ color: "#333" }}
      title2Style={{ color: "#999" }}
      color={["#1675FB", "#5AB5F6"]}
      seriesData={{ name: "完成度", value: 75 }}
    />
  </div>
);
```

## 通用图表

通用图表，直接透传 echarts 原生 `EChartsOption`，适合上述封装未覆盖的场景。

```tsx
import React from "react";
import { Chart } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 280 }}>
    <Chart.Common
      tooltip={{ trigger: "axis" }}
      xAxis={{ type: "category", data: ["A", "B", "C", "D", "E"] }}
      yAxis={{ type: "value" }}
      series={[{ type: "line", smooth: true, data: [10, 22, 18, 30, 25] }]}
    />
  </div>
);
```

## 组合图表

组合图表，通过 `chartGroup` 传入若干 `{ type, options }`，可按 `pageSize` 分页展示并在 `Line`/`Bar`/`Pie` 间组合。其内部依赖布局样式，建议在业务页面中使用：

```tsx | pure
import { Chart } from "@hsu-react/ui";

export default () => (
  <Chart.Group
    style={{ height: 320 }}
    pageSize={2}
    chartGroup={[
      {
        type: "Bar",
        options: {
          chartTitle: "销量",
          xAxisData: ["一月", "二月", "三月"],
          seriesData: [120, 200, 150],
        },
      },
      {
        type: "Pie",
        options: {
          chartTitle: "占比",
          seriesData: [
            { name: "直接访问", value: 335 },
            { name: "搜索引擎", value: 234 },
          ],
        },
      },
    ]}
  />
);
```

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
