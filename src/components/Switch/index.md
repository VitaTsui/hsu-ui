---
nav: 组件
group:
  title: 数据录入
  order: 3
title: Switch 开关
---

# Switch 开关

基于 antd `Switch` 封装的开关，可通过 `options` 配合 `trueValue`/`falseValue` 自动生成开启与关闭状态的文案。

## 引入

```ts
import { Switch } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { Switch } from "@hsu-react/ui";

const options = [
  { label: "启用", value: 1 },
  { label: "停用", value: 0 },
];

export default () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Switch defaultChecked />
    <Switch options={options} trueValue={1} falseValue={0} defaultChecked />
    <Switch disabled />
  </div>
);
```

## API

在 [antd SwitchProps](https://ant.design/components/switch-cn) 基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项数据，用于匹配选中/未选中文案 | `SelectOption[]` | - |
| trueValue | 开启状态对应的 value，从 `options` 中取其 `label` 作为 `checkedChildren` | `number \| string` | - |
| falseValue | 关闭状态对应的 value，从 `options` 中取其 `label` 作为 `unCheckedChildren` | `number \| string` | - |

> 若直接传入 `checkedChildren` / `unCheckedChildren`，则优先使用传入值。
