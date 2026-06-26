---
nav: 组件
group:
  title: 通用
  order: 1
title: Copy 复制
---

# Copy 复制

一键复制指定 DOM 节点（通过 `id` 定位）的内容，支持转 Markdown。

## 引入

```ts
import { Copy } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { Copy } from "@hsu-react/ui";

export default () => (
  <div>
    <p id="copy-demo-text">这是一段可被复制的文本，点击右侧按钮试试。</p>
    <Copy id="copy-demo-text" md={false} text="复制文本" />
  </div>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 待复制内容所在元素的 DOM id | `string` | - |
| text | 按钮文案 | `string` | `复制` |
| md | 是否将内容转为 Markdown 再复制 | `boolean` | `true` |
| isMessage | 复制成功是否弹 message 提示 | `boolean` | `true` |
| hideIcon | 是否隐藏图标 | `boolean` | `false` |
| copyIcon / copyedIcon | 自定义复制前/后图标 | `ReactNode` | - |
