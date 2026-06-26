---
nav: 组件
group:
  title: 数据录入
  order: 3
title: DatePicker 日期选择
---

# DatePicker 日期选择

在 antd `DatePicker` 基础上扩展，支持通过下拉切换日期 / 周 / 月 / 季度 / 年等粒度，`onChange` 直接返回格式化后的字符串。

## 引入

```ts
import { DatePicker } from "@hsu-react/ui";
```

## 日期选择

```tsx
import React, { useState } from "react";
import { DatePicker } from "@hsu-react/ui";

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <DatePicker value={value} onChange={(date) => setValue(date)} />
      <DatePicker showPicker onChange={(date, picker) => console.log(date, picker)} />
    </div>
  );
};
```

## 日期范围选择

区间选择，`value` / `defaultValue` 为 `string[]`，`onChange` 返回格式化后的 `string[]`，同样支持 `picker` / `showPicker` 等粒度切换。

```tsx
import React, { useState } from "react";
import { DatePicker } from "@hsu-react/ui";

export default () => {
  const [value, setValue] = useState<string[]>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <DatePicker.RangePicker value={value} onChange={(dates) => setValue(dates)} />
      <DatePicker.RangePicker showPicker onChange={(dates, picker) => console.log(dates, picker)} />
    </div>
  );
};
```

## 步进日期选择

按 `step` 步进的日期选择，支持 `picker: 'day' | 'month' | 'year'`，以及 `minDate` / `maxDate` 边界限制。

```tsx
import React, { useState } from "react";
import { DatePicker } from "@hsu-react/ui";

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <DatePicker.StepPicker picker="day" step={1} onChange={(date) => setValue(date)} />
      <DatePicker.StepPicker picker="month" onChange={(date) => setValue(date)} />
    </div>
  );
};
```

## API

在 [antd DatePickerProps](https://ant.design/components/date-picker-cn) 基础上扩展（重写了 `picker`、`onChange`）：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| picker | 日期选择粒度 | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year' \| 'time'` | `'date'` |
| showPicker | 是否在前方显示粒度切换下拉框 | `boolean` | `false` |
| pickerHide | 在粒度下拉框中隐藏的选项 | `Picker[]` | `[]` |
| pickerSelectProps | 透传给粒度下拉框的 `Select` 属性 | `SelectProps` | - |
| pickerOptions | 自定义粒度下拉框的选项 | `SelectOption[]` | - |
| dataPickerCls | 内部日期选择器的自定义类名 | `string` | - |
| onChange | 值变化回调，返回格式化字符串与当前粒度 | `(date?: string, picker?: Picker) => void` | - |

> 另提供 `DatePicker.RangePicker`（区间选择，`onChange` 返回 `string[]`，同样支持 `picker` / `showPicker` 等）与 `DatePicker.StepPicker`（按 `step` 步进的日期选择，支持 `picker: 'day' \| 'month' \| 'year'`、`minDate` / `maxDate`）。
