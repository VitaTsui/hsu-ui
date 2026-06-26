---
nav: 组件
group:
  title: 布局
  order: 2
title: FlexFill 自适应填充
---

# FlexFill 自适应填充

在 `flex` + `justify-content: space-between` 的多行弹性布局中，用于占位补齐最后一行，避免末行元素被两端对齐拉散。组件渲染 10 个高度近似为 0 的占位块。

## 引入

```ts
import { FlexFill } from "@hsu-react/ui";
```

## 自适应填充

将 `FlexFill` 放在弹性容器的子元素末尾，即可让最后一行的卡片按正常间距左对齐排列。

```tsx
import React from "react";
import { FlexFill } from "@hsu-react/ui";

export default () => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "12px 0",
    }}
  >
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        style={{
          width: 120,
          height: 60,
          lineHeight: "60px",
          textAlign: "center",
          background: "#f0f2f5",
          borderRadius: 8,
        }}
      >
        卡片 {item}
      </div>
    ))}
    <FlexFill width="120px" />
  </div>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 单个占位块的宽度，通常与列表项宽度保持一致 | `string` | `'100%'` |
| className | 占位块的自定义类名 | `string` | - |
| style | 占位块的自定义样式（支持 CSS 变量） | `CSSProperties` | - |
