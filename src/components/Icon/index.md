---
nav: 组件
group:
  title: 通用
  order: 1
title: Icon 图标
---

# Icon 图标

统一图标入口：传入 antd 图标名（如 `UserOutlined`）走 `@ant-design/icons`，传入 iconify 名（如 `ph:user-bold`）走 `@iconify/react`（需先 `addCollection` 注册图标集）。

## 引入

```ts
import { Icon } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { Icon } from "@hsu-react/ui";

export default () => (
  <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 22 }}>
    <Icon icon="UserOutlined" />
    <Icon icon="SettingOutlined" />
    <Icon icon="HomeOutlined" />
    <Icon icon="HeartFilled" style={{ color: "#eb2f96" }} />
  </div>
);
```

## API

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| icon | 图标名：antd 图标名 或 iconify 名 | `string` |
| iconProps | 透传给 iconify 的属性 | `object` |

继承原生 `span` 属性（`className` / `style` / `onClick` 等）。
