---
nav: 组件
group:
  title: 数据展示
  order: 4
title: Markdown 渲染
---

# Markdown 渲染

Markdown 渲染与编辑组件，`Markdown.Views` 用于渲染展示（支持 GFM、KaTeX 公式、代码高亮、Mermaid 图与 HTML/SVG Artifacts 预览），`Markdown.Editor` 提供所见即所得编辑器。

## 引入

```ts
import { Markdown } from "@hsu-react/ui";
```

## 基础用法

`Markdown.Views` 渲染（依赖 KaTeX / highlight.js / Mermaid 等样式，建议在应用环境内使用）：

```tsx | pure
import React from "react";
import { Markdown } from "@hsu-react/ui";

const content = `# 标题

- 列表项一
- 列表项二

\`\`\`ts
const a = 1;
\`\`\`

行内公式 $E = mc^2$
`;

export default () => <Markdown.Views>{content}</Markdown.Views>;
```

`Markdown.Editor` 编辑：

```tsx | pure
import React, { useState } from "react";
import { Markdown } from "@hsu-react/ui";

export default () => {
  const [value, setValue] = useState("# Hello");

  return (
    <Markdown.Editor
      value={value}
      onChange={setValue}
      view={{ menu: true, md: true, html: true }}
    />
  );
};
```

## API

### Markdown.Views

继承 [react-markdown Options](https://github.com/remarkjs/react-markdown)（markdown 文本通过 `children` 传入），新增属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 待渲染的 markdown 文本 | `string` | - |
| copyProps | 代码块复制按钮配置 | `Omit<CopyProps, 'id'>` | - |
| className | 自定义类名 | `string` | - |

### Markdown.Editor

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 编辑器内容 | `string` | `''` |
| onChange | 内容变化回调 | `(value: string) => void` | - |
| buttonGroup | 顶部自定义按钮组 | `ButtonProps[]` | - |
| className | 自定义类名 | `string` | - |
| disabled | 是否禁用 | `boolean` | - |
| readOnly | 是否只读 | `boolean` | - |
| view | 视图区域配置 | `{ menu?: boolean; md?: boolean; html?: boolean }` | `{ menu: true, md: true, html: true }` |
