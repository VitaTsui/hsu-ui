---
nav: 组件
group:
  title: 数据录入
  order: 3
title: Editor 富文本
---

# Editor 富文本

基于 wangEditor 封装的富文本编辑器，受控输出 HTML 字符串，并提供 `Editor.Content` 用于只读展示富文本内容。

## 引入

```ts
import { Editor } from "@hsu-react/ui";
```

## 富文本

```tsx
import React from "react";
import { Editor } from "@hsu-react/ui";

export default () => {
  const [html, setHtml] = React.useState(
    "<p>这是一段<strong>富文本</strong>内容，可以编辑。</p>"
  );

  return (
    <>
      <Editor value={html} onChange={setHtml} height={240} />
      {/* 只读展示 */}
      <Editor.Content value={html} />
    </>
  );
};
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 编辑器内容（HTML 字符串） | `string` | - |
| onChange | 内容变化回调 | `(html: string) => void` | - |
| placeholder | 占位提示文字 | `string` | `'请输入内容...'` |
| height | 编辑区高度（px） | `number` | `500` |
| disabled | 是否禁用（只读，隐藏工具栏） | `boolean` | `false` |

### Editor.Content

只读展示组件，仅用于渲染富文本内容。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 待展示的 HTML 字符串 | `string` | `''` |
