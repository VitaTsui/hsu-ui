---
nav: 组件
group:
  title: 数据展示
  order: 4
title: ChainGraph 关系图
---

# ChainGraph 关系图

基于 `@antv/g6` 封装的树状关系图，支持节点展开/收起、搜索、缩略图、自适应布局与自定义节点渲染。

## 引入

```ts
import { ChainGraph } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { ChainGraph } from "@hsu-react/ui";

// TreeGraphData：每个节点含 id / label / 可选 children；level 用于标记根节点层级
const data = {
  id: "root",
  label: "根节点",
  level: 1,
  children: [
    { id: "a", label: "节点 A", level: 2 },
    {
      id: "b",
      label: "节点 B",
      level: 2,
      children: [{ id: "b-1", label: "节点 B-1", level: 3 }],
    },
  ],
};

export default () => (
  <div style={{ height: 320, width: "100%" }}>
    <ChainGraph
      data={data}
      showSearch
      showMiniMap
      miniMapSize={[120, 80]}
      showExpandBtn
      onClick={(node) => console.log(node)}
    />
  </div>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树状图数据（可携带 `origin` 原始数据） | `TreeGraphData` | - |
| octopus | 是否启用八爪鱼（双向）布局 | `boolean` | - |
| level | 默认展开层级 | `number` | `1` |
| rootLevel | 根节点层级 | `number` | `1` |
| onClick | 节点点击回调 | `(node?: TreeGraphData) => void` | - |
| styles | 节点样式配置 | `ChainGraphServicesStyles` | - |
| showPort | 是否显示连接端点 | `boolean` | `true` |
| showMiniMap | 是否显示缩略图 | `boolean` | `true` |
| miniMapSize | 缩略图尺寸 | `[number, number]` | `[200, 150]` |
| getImage | 获取图表快照（base64） | `(img: string) => void` | - |
| className | 内层容器类名 | `string` | - |
| wrapperClassName | 外层（Spin）容器类名 | `string` | - |
| showSearch | 是否显示搜索框 | `boolean` | `true` |
| showExpandBtn | 是否显示展开/收起按钮 | `boolean` | `true` |
| expandClassName | 展开按钮类名 | `string` | - |
| resize | 是否监听容器尺寸自适应 | `boolean` | `true` |
| offset | 容器宽高偏移 `[x, y]` | `[number, number]` | `[0, 0]` |
| fitLeft | 是否左对齐布局 | `boolean` | `false` |
| paddingLeft | 左侧内边距 | `number` | `20` |
| loading | 是否加载中 | `boolean` | `false` |
| hasHover | 是否启用 hover 效果 | `boolean` | `true` |
| hasSelected | 是否启用选中效果 | `boolean` | `true` |
| minZoom | 最小缩放比例 | `number` | - |
| labelRender | 自定义节点文本 | `(label: TreeGraphData) => string` | - |
| addShape | 自定义节点图形绘制 | `(group: IGroup, cfg: ModelConfig & { origin?: Record<string, unknown> }) => void` | - |
