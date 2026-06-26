---
nav: 组件
group:
  title: 数据录入
  order: 3
title: FormItem 表单项
---

# FormItem 表单项

通过 `type` 字段驱动的统一表单项组件，根据类型渲染对应的输入 / 选择 / 上传等控件，需配合 antd `Form` 使用。

## 引入

```ts
import { FormItem } from "@hsu-react/ui";
```

## 基础用法

`FormItem` 是配置驱动的，通过 `type` 指定控件类型，业务参数统一放在 `componentProps` 中，需置于 antd `Form` 之内：

```tsx | pure
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <FormItem type="INPUT" name="name" label="姓名" required />
      <FormItem
        type="SELECT"
        name="role"
        label="角色"
        componentProps={{
          options: [
            { label: "管理员", value: "admin" },
            { label: "访客", value: "guest" },
          ],
        }}
      />
      <FormItem type="DATEPICKER" name="date" label="日期" />
      <FormItem type="SWITCH" name="enabled" label="是否启用" />
    </Form>
  );
};
```

## API

`FormItemProps` 是按 `type` 区分的联合类型：`{ type } & BaseFormItem & 对应控件 Props`。除 `type`、`visible` 外，其余通用属性继承自 `ItemContainerProps`（扩展自 antd `FormItemProps`），各控件的专有参数通过 `componentProps` 传入。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 表单项类型，决定渲染的控件 | `FormItemType` | - |
| visible | 是否渲染该项，为 `false` 时不渲染 | `boolean` | `true` |
| name | 字段名（antd Form 字段） | `NamePath` | - |
| label | 标签内容 | `ReactNode` | - |
| componentProps | 透传给底层控件的属性（如 `options`、`placeholder` 等） | 对应控件 Props | - |
| labelWidth | 标签宽度 | `string \| number` | - |
| layout | 标签与控件的排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| requiredMsg | 必填校验提示文案 | `string` | - |
| tips | 标签旁的提示气泡（antd `TooltipProps` + 图标配置） | `TipsProps & TooltipProps` | - |
| hasPermi | 权限码；无权限时不渲染 | `string[]` | - |
| disabled | 是否禁用 | `boolean` | - |
| en | 是否使用英文占位文案 | `boolean` | - |
| hideLabel | 是否隐藏标签 | `boolean` | `false` |

`type` 可选值（`FormItemType`）：

- 输入类：`AUTO`、`INPUT`、`TEXTAREA`、`PASSWORD`、`PASSWORDSTRENGTH`、`INPUTNUMBER`、`RANGEINPUT`、`SLIDER`、`EDITOR`、`CODEMIRROR`、`TEXT`
- 选择类：`SELECT`、`TREESELECT`、`AUTOCOMPLETESELECT`、`SEGMENTED`、`SWITCH`、`RADIO`、`CHECKBOX`、`CHECKBOXGROUP`、`DATEPICKER`、`RANGEPICKER`、`STEPPICKER`、`TREE`、`ICONSELECT`
- 上传类：`FILE`、`IMAGEFILE`

> 同时导出 `FormItemContainer`（即 `ItemContainer`）及类型 `FormItemType`、`FormItemProps`、`PlaceholderDict` / `PlaceholderDictEn` 占位文案字典。
