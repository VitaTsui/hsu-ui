---
nav: 组件
group:
  title: 通用
  order: 1
title: Operate 操作
---

# Operate 操作

表格操作列组件，支持单个操作按钮或一组操作按钮，内置二次确认、权限过滤，并在数量超出时自动收纳到「更多」下拉中。

## 引入

```ts
import { Operate } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { Operate } from "@hsu-react/ui";
import { message } from "antd";

export default () => (
  <Operate
    title="更多"
    menu={[
      { title: "查看", onClick: () => message.info("查看") },
      { title: "编辑", onClick: () => message.info("编辑") },
      {
        title: "删除",
        delete: true,
        onConfirm: () => message.success("已删除"),
      },
    ]}
  />
);
```

## API

在 antd `ButtonProps`（已排除 `children`、`title`、`onClick`、`hasPermi`）基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 按钮文本 | `ReactNode` | - |
| menu | 操作项列表（递归同 `OperateProps`），存在时渲染为按钮组 | `OperateProps[]` | `[]` |
| onClick | 点击回调 | `() => void` | - |
| onConfirm | 二次确认回调，存在时点击弹出 Popconfirm | `() => void` | - |
| icon | 自定义图标，`false` 时不显示 | `ReactNode \| false` | - |
| delete | 是否为删除操作（红色样式，默认删除图标） | `boolean` | - |
| popconfirm | Popconfirm 配置 | `Omit<PopconfirmProps, 'title'> & { title?: ReactNode }` | - |
| hidden | 是否隐藏（不渲染） | `boolean` | - |
| hasPermi | 权限码；无权限时不渲染 | `string[]` | - |
| maxVisible | 收纳前最多展示的操作数量 | `number` | `3` |
| enableEllipsis | 操作超出时是否启用「更多」收纳 | `boolean` | `true` |
| moreIcon | 「更多」按钮自定义图标，`false` 时不显示 | `ReactNode \| false` | - |
