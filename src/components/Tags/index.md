---
nav: 组件
group:
  title: 数据展示
  order: 4
title: Tags 标签
---

# Tags 标签

基于 antd `Tag` 的标签组，支持自动配色、对齐方式，并可在容器宽度不足时自动省略并收纳超出的标签。

## 引入

```ts
import { Tags } from "@hsu-react/ui";
```

## 标签

```tsx
import React from "react";
import { Tags } from "@hsu-react/ui";

export default () => (
  <Tags tags={["前端", "React", "TypeScript", "Ant Design", "dumi"]} />
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tags | 标签内容列表 | `string[]` | `[]` |
| colors | 自定义标签配色（按索引循环取用） | `string[]` | - |
| ellipsis | 容器宽度不足时是否自动省略并收纳多余标签 | `boolean` | `true` |
| align | 对齐方式 | `'left' \| 'center' \| 'right'` | `'left'` |
| gap | 标签之间的间距 | `number` | `8` |
| className | 自定义类名 | `string` | - |
