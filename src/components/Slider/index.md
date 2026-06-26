---
nav: 组件
group:
  title: 数据录入
  order: 3
title: Slider 滑动输入
---

# Slider 滑动输入

基于 antd 单值 `Slider` 封装的滑动输入条，内部维护受控值、默认关闭 Tooltip，并支持通过 `topValue` 从外部强制更新当前值。

## 引入

```ts
import { Slider } from "@hsu-react/ui";
```

## 滑动输入

```tsx
import React from "react";
import { Slider } from "@hsu-react/ui";

export default () => {
  const [value, setValue] = React.useState(30);

  return (
    <div style={{ width: 240 }}>
      <Slider value={value} onChange={setValue} />
    </div>
  );
};
```

## API

在 [antd SliderSingleProps](https://ant.design/components/slider-cn) 基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| topValue | 外部强制同步的当前值，优先级高于 `value` | `number` | - |
| value | 当前值 | `number` | `0` |
| onChange | 值变化回调 | `(value: number) => void` | - |
