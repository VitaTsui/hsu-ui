---
nav: 组件
group:
  title: 数据录入
  order: 3
title: CodeMirror 代码编辑
---

# CodeMirror 代码编辑

基于 `@uiw/react-codemirror` 封装的代码编辑器，支持 SQL / JSON 语言的按需加载、语法检查与错误提示。

## 引入

```ts
import { CodeMirror } from "@hsu-react/ui";
```

## 代码编辑

```tsx
import React from "react";
import { CodeMirror } from "@hsu-react/ui";

export default () => {
  const [value, setValue] = React.useState(
    '{\n  "name": "hsu-ui",\n  "version": "1.0.0",\n  "private": true\n}'
  );
  const [error, setError] = React.useState(null);

  return (
    <CodeMirror
      language="json"
      value={value}
      enableLint
      hasError={!!error}
      onChange={setValue}
      onLintError={setError}
    />
  );
};
```

## API

在 [ReactCodeMirrorProps](https://uiwjs.github.io/react-codemirror/)（去除 `extensions`、`onError`）基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| language | 语言类型，按需引入对应语言支持 | `'sql' \| 'json' \| 'plain'` | `'sql'` |
| enableLint | 是否启用语法检查 | `boolean` | `true` |
| onLintError | 错误信息回调，无错误时回调 `null` | `(error: string \| null) => void` | - |
| hasError | 是否显示错误边框 | `boolean` | `false` |
| translateError | 是否将错误信息翻译为中文 | `boolean` | `false` |
| allowJsonArrayRoot | JSON 校验是否允许根节点为数组 `[...]` | `boolean` | `false` |

> 其余如 `value`、`onChange`、`basicSetup`、`theme`、`minHeight` 等均继承自 `ReactCodeMirror`，默认主题为 `vscodeLight`。
