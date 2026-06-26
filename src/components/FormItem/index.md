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

`FormItem` 是配置驱动的，通过 `type` 指定控件类型，业务参数统一放在 `componentProps` 中，需置于 antd `Form` 之内。下面列出全部类型：

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form, Input, Divider } from "antd";

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

const treeData = [
  {
    title: "父节点",
    value: "0",
    key: "0",
    children: [
      { title: "子节点 1", value: "0-1", key: "0-1" },
      { title: "子节点 2", value: "0-2", key: "0-2" },
    ],
  },
];

export default () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" style={{ maxWidth: 560 }}>
      <Divider orientation="left">输入类</Divider>
      <FormItem type="INPUT" name="input" label="INPUT 输入框" required />
      <FormItem type="TEXTAREA" name="textarea" label="TEXTAREA 多行文本" />
      <FormItem type="PASSWORD" name="password" label="PASSWORD 密码" />
      <FormItem
        type="PASSWORDSTRENGTH"
        name="pwdStrength"
        label="PASSWORDSTRENGTH 密码强度"
      />
      <FormItem
        type="INPUTNUMBER"
        name="number"
        label="INPUTNUMBER 数字"
        componentProps={{ min: 0, max: 100 }}
      />
      <FormItem type="RANGEINPUT" name="rangeInput" label="RANGEINPUT 范围输入" />
      <FormItem type="SLIDER" name="slider" label="SLIDER 滑块" />
      <FormItem
        type="TEXT"
        name="text"
        label="TEXT 只读文本"
        componentProps={{ value: "只读文本内容" }}
      />
      <FormItem
        type="AUTO"
        name="auto"
        label="AUTO 自定义控件"
        element={<Input placeholder="任意自定义控件" />}
      />

      <Divider orientation="left">选择类</Divider>
      <FormItem
        type="SELECT"
        name="select"
        label="SELECT 选择器"
        componentProps={{ options }}
      />
      <FormItem
        type="AUTOCOMPLETESELECT"
        name="autoComplete"
        label="AUTOCOMPLETESELECT 自动完成"
        componentProps={{ options }}
      />
      <FormItem
        type="TREESELECT"
        name="treeSelect"
        label="TREESELECT 树选择"
        componentProps={{ treeData }}
      />
      <FormItem type="ICONSELECT" name="iconSelect" label="ICONSELECT 图标选择" />
      <FormItem
        type="SEGMENTED"
        name="segmented"
        label="SEGMENTED 分段控制"
        componentProps={{ options }}
      />
      <FormItem
        type="RADIO"
        name="radio"
        label="RADIO 单选"
        componentProps={{ options }}
      />
      <FormItem type="CHECKBOX" name="checkbox" label="CHECKBOX 单个多选框" />
      <FormItem
        type="CHECKBOXGROUP"
        name="checkboxGroup"
        label="CHECKBOXGROUP 多选组"
        componentProps={{ options }}
      />
      <FormItem type="SWITCH" name="switch" label="SWITCH 开关" />
      <FormItem type="DATEPICKER" name="date" label="DATEPICKER 日期" />
      <FormItem type="RANGEPICKER" name="rangePicker" label="RANGEPICKER 日期范围" />
      <FormItem type="STEPPICKER" name="stepPicker" label="STEPPICKER 步进日期" />
      <FormItem
        type="TREE"
        name="tree"
        label="TREE 树形控件"
        componentProps={{ treeData }}
      />

      <Divider orientation="left">富文本 / 代码</Divider>
      <FormItem type="EDITOR" name="editor" label="EDITOR 富文本" />
      <FormItem
        type="CODEMIRROR"
        name="codemirror"
        label="CODEMIRROR 代码"
        componentProps={{ language: "json" }}
      />

      <Divider orientation="left">上传类</Divider>
      <FormItem
        type="FILE"
        name="file"
        label="FILE 文件上传"
        componentProps={{ action: "/api/upload" }}
      />
      <FormItem
        type="IMAGEFILE"
        name="image"
        label="IMAGEFILE 图片上传"
        componentProps={{ action: "/api/upload" }}
      />
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
