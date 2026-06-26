---
nav: 组件
group:
  title: 数据展示
  order: 4
title: Spreadsheet 电子表格
---

# Spreadsheet 电子表格

基于 `x-data-spreadsheet` 封装的电子表格组件，接收 `xlsx` 的 `WorkBook` 数据并自动转换为表格内容渲染。

## 引入

```ts
import { Spreadsheet } from "@hsu-react/ui";
```

## 基础用法

```tsx
import React from "react";
import { Spreadsheet } from "@hsu-react/ui";
import { utils } from "xlsx";

// 用 xlsx 工具构建一个 WorkBook（实际项目中通常由 read() 读取文件得到）
const aoa = [
  ["姓名", "部门", "工资"],
  ["张三", "研发部", 12000],
  ["李四", "市场部", 9500],
  ["王五", "财务部", 8800],
];
const ws = utils.aoa_to_sheet(aoa);
const workbook = utils.book_new();
utils.book_append_sheet(workbook, ws, "员工表");

export default () => (
  <div style={{ height: 320, width: "100%" }}>
    <Spreadsheet data={workbook} xOptions={{ showBottomTool: true }} />
  </div>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表格数据，xlsx 的 `WorkBook` 对象 | `WorkBook` | - |
| xOptions | x-data-spreadsheet 配置项（在其 `Options` 基础上扩展，已忽略 `view`） | `XOptions` | `{}` |
| className | 容器类名 | `string` | - |

### XOptions

继承 x-data-spreadsheet 的 `Options`（`view` 由组件内部接管），并扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| showBottomTool | 是否显示底部工具栏（sheet 切换栏） | `boolean` | `true` |
