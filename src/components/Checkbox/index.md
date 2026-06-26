---
nav: 组件
group:
  title: 数据录入
  order: 3
title: Checkbox 多选框
---

# Checkbox 多选框

基于 antd `Checkbox` 封装的多选框，额外提供 `outline` 描边样式，并附带支持全选、布局方向的 `Checkbox.Group`。

## 引入

```ts
import { Checkbox } from "@hsu-react/ui";
```

## 多选框

```tsx
import React from "react";
import { Checkbox } from "@hsu-react/ui";

const options = [
  { label: "苹果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "橙子", value: "orange" },
];

export default () => {
  const [value, setValue] = React.useState(["apple"]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <Checkbox outline>描边多选框</Checkbox>
      <Checkbox.Group options={options} value={value} onChange={setValue} />
    </div>
  );
};
```

## 多选框组

多选框组，支持 `hasAll`（全选）、`layout`（排列方向）与 `outline`（描边样式）。

```tsx
import React from "react";
import { Checkbox } from "@hsu-react/ui";

const options = [
  { label: "苹果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "橙子", value: "orange" },
];

export default () => {
  const [value, setValue] = React.useState(["apple"]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Checkbox.Group
        options={options}
        value={value}
        onChange={setValue}
        hasAll
        outline
        layout="vertical"
      />
    </div>
  );
};
```

## API

### Checkbox

在 [antd CheckboxProps](https://ant.design/components/checkbox-cn) 基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| outline | 是否使用描边样式 | `boolean` | - |

### Checkbox.Group

在 antd `Checkbox.Group` 基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| outline | 是否使用描边样式 | `boolean` | - |
| hasAll | 是否显示"全选"选项 | `boolean` | - |
| layout | 选项排列方向 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| allMaxHeight | 含全选时容器最大高度（px） | `number` | - |
