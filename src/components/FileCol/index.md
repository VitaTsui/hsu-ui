---
nav: 组件
group:
  title: 数据展示
  order: 4
title: FileCol 文件列
---

# FileCol 文件列

展示文件列表，对支持预览的文件类型提供「查看」入口，常用于表格中的文件列。

## 引入

```ts
import { FileCol } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { FileCol } from "@hsu-react/ui";

export default () => (
  <FileCol
    item={[
      { uid: "1", name: "设计稿.png", url: "https://example.com/a.png" },
      { uid: "2", name: "需求文档.pdf", url: "https://example.com/b.pdf" },
    ]}
  />
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| item | 文件列表 | `UploadFile[]` | `[]` |
| hideNm | 是否隐藏文件名 | `boolean` | - |
