---
nav: 组件
group:
  title: 数据展示
  order: 4
title: TextEllipsis 文本省略
---

# TextEllipsis 文本省略

文本溢出时自动省略，并通过 antd `Tooltip` 展示完整内容，支持省略号位置切换。

## 引入

```ts
import { TextEllipsis } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { TextEllipsis } from "@hsu-react/ui";

export default () => (
  <div style={{ width: 200 }}>
    <TextEllipsis>
      这是一段很长的文本，当容器宽度不足以完整展示时会自动省略，并在悬停时显示完整内容。
    </TextEllipsis>
  </div>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 要显示的文本内容 | `ReactNode` | - |
| width | 容器宽度，用于计算 Tooltip 宽度 | `number \| string` | - |
| tooltipConfig | Tooltip 配置（可附加 `defaultWidth`） | `Omit<TooltipProps, 'title' \| 'children'> & { defaultWidth?: number }` | - |
| disabled | 是否禁用 Tooltip（即使溢出也不显示） | `boolean` | `false` |
| ellipsisPosition | 省略号位置，`start` 省略前面，`end` 省略后面 | `'start' \| 'end'` | `'end'` |
| style | 文本自定义样式 | `React.CSSProperties` | - |
| className | 文本自定义类名 | `string` | - |
| containerStyle | 容器自定义样式 | `React.CSSProperties` | - |
