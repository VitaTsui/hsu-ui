---
nav: 组件
group:
  title: 通用
  order: 1
title: Button 按钮
---

# Button 按钮

在 antd `Button` 之上增加 `hasPermi`（权限码）、`hidden`、`iconPosition` 等能力。无权限或 `hidden` 时不渲染。

## 引入

```ts
import { Button } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { Button } from "@hsu-react/ui";

export default () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button type="primary">主要按钮</Button>
    <Button>默认按钮</Button>
    <Button type="dashed">虚线按钮</Button>
    <Button danger>危险按钮</Button>
    <Button type="primary" disabled>
      禁用
    </Button>
  </div>
);
```

## API

在 [antd ButtonProps](https://ant.design/components/button-cn) 基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasPermi | 权限码；当前用户不具备时按钮不渲染（配合 `ConfigProvider.permissions`） | `string[]` | - |
| hidden | 是否隐藏（不渲染） | `boolean` | `false` |
| iconPosition | 图标位置 | `'start' \| 'end'` | `'start'` |

> 另提供 `Button.Chakra`，用于需要 Chakra UI 按钮样式的场景。
