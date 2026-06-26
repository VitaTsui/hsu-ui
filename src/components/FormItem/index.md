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

`FormItem` 通过 `type` 指定控件类型，业务参数统一放在 `componentProps` 中，需置于 antd `Form` 之内。下面按类型分别演示：

### 输入类

#### INPUT 输入框

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="INPUT" name="input" label="输入框" required />
  </Form>
);
```

#### TEXTAREA 多行文本

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="TEXTAREA" name="textarea" label="多行文本" />
  </Form>
);
```

#### PASSWORD 密码

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="PASSWORD" name="password" label="密码" />
  </Form>
);
```

#### PASSWORDSTRENGTH 密码强度

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="PASSWORDSTRENGTH" name="pwd" label="密码强度" />
  </Form>
);
```

#### INPUTNUMBER 数字

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem
      type="INPUTNUMBER"
      name="number"
      label="数字"
      componentProps={{ min: 0, max: 100 }}
    />
  </Form>
);
```

#### RANGEINPUT 范围输入

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="RANGEINPUT" name="range" label="范围输入" />
  </Form>
);
```

#### SLIDER 滑块

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="SLIDER" name="slider" label="滑块" />
  </Form>
);
```

#### TEXT 只读文本

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem
      type="TEXT"
      name="text"
      label="只读文本"
      componentProps={{ value: "只读文本内容" }}
    />
  </Form>
);
```

#### AUTO 自定义控件

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form, Input } from "antd";

export default () => (
  <Form>
    <FormItem
      type="AUTO"
      name="auto"
      label="自定义控件"
      element={<Input placeholder="任意自定义控件" />}
    />
  </Form>
);
```

### 选择类

#### SELECT 选择器

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

export default () => (
  <Form>
    <FormItem
      type="SELECT"
      name="select"
      label="选择器"
      componentProps={{ options }}
    />
  </Form>
);
```

#### AUTOCOMPLETESELECT 自动完成

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

export default () => (
  <Form>
    <FormItem
      type="AUTOCOMPLETESELECT"
      name="ac"
      label="自动完成"
      componentProps={{ options }}
    />
  </Form>
);
```

#### TREESELECT 树选择

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

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

export default () => (
  <Form>
    <FormItem
      type="TREESELECT"
      name="treeSelect"
      label="树选择"
      componentProps={{ treeData }}
    />
  </Form>
);
```

#### ICONSELECT 图标选择

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="ICONSELECT" name="icon" label="图标选择" />
  </Form>
);
```

#### SEGMENTED 分段控制

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

export default () => (
  <Form>
    <FormItem
      type="SEGMENTED"
      name="segmented"
      label="分段控制"
      componentProps={{ options }}
    />
  </Form>
);
```

#### RADIO 单选

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

export default () => (
  <Form>
    <FormItem
      type="RADIO"
      name="radio"
      label="单选"
      componentProps={{ options }}
    />
  </Form>
);
```

#### CHECKBOX 单个多选框

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="CHECKBOX" name="checkbox" label="多选框" />
  </Form>
);
```

#### CHECKBOXGROUP 多选组

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

const options = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
];

export default () => (
  <Form>
    <FormItem
      type="CHECKBOXGROUP"
      name="checkboxGroup"
      label="多选组"
      componentProps={{ options }}
    />
  </Form>
);
```

#### SWITCH 开关

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="SWITCH" name="switch" label="开关" />
  </Form>
);
```

#### DATEPICKER 日期

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="DATEPICKER" name="date" label="日期" />
  </Form>
);
```

#### RANGEPICKER 日期范围

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="RANGEPICKER" name="dateRange" label="日期范围" />
  </Form>
);
```

#### STEPPICKER 步进日期

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="STEPPICKER" name="step" label="步进日期" />
  </Form>
);
```

#### TREE 树形控件

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

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

export default () => (
  <Form>
    <FormItem
      type="TREE"
      name="tree"
      label="树形控件"
      componentProps={{ treeData }}
    />
  </Form>
);
```

### 富文本 / 代码

#### EDITOR 富文本

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem type="EDITOR" name="editor" label="富文本" />
  </Form>
);
```

#### CODEMIRROR 代码

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem
      type="CODEMIRROR"
      name="code"
      label="代码"
      componentProps={{ language: "json" }}
    />
  </Form>
);
```

### 上传类

#### FILE 文件上传

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem
      type="FILE"
      name="file"
      label="文件上传"
      componentProps={{ action: "/api/upload" }}
    />
  </Form>
);
```

#### IMAGEFILE 图片上传

```tsx
import React from "react";
import { FormItem } from "@hsu-react/ui";
import { Form } from "antd";

export default () => (
  <Form>
    <FormItem
      type="IMAGEFILE"
      name="image"
      label="图片上传"
      componentProps={{ action: "/api/upload" }}
    />
  </Form>
);
```

## API

`FormItemProps` 是按 `type` 区分的联合类型：`{ type } & BaseFormItem & 对应控件 Props`。除 `type`、`visible` 外，其余通用属性继承自 `ItemContainerProps`（扩展自 antd `FormItemProps`），各控件的专有参数通过 `componentProps` 传入。

| 属性           | 说明                                                   | 类型                         | 默认值         |
| -------------- | ------------------------------------------------------ | ---------------------------- | -------------- |
| type           | 表单项类型，决定渲染的控件                             | `FormItemType`               | -              |
| visible        | 是否渲染该项，为 `false` 时不渲染                      | `boolean`                    | `true`         |
| name           | 字段名（antd Form 字段）                               | `NamePath`                   | -              |
| label          | 标签内容                                               | `ReactNode`                  | -              |
| componentProps | 透传给底层控件的属性（如 `options`、`placeholder` 等） | 对应控件 Props               | -              |
| labelWidth     | 标签宽度                                               | `string \| number`           | -              |
| layout         | 标签与控件的排列方向                                   | `'horizontal' \| 'vertical'` | `'horizontal'` |
| requiredMsg    | 必填校验提示文案                                       | `string`                     | -              |
| tips           | 标签旁的提示气泡（antd `TooltipProps` + 图标配置）     | `TipsProps & TooltipProps`   | -              |
| hasPermi       | 权限码；无权限时不渲染                                 | `string[]`                   | -              |
| disabled       | 是否禁用                                               | `boolean`                    | -              |
| en             | 是否使用英文占位文案                                   | `boolean`                    | -              |
| hideLabel      | 是否隐藏标签                                           | `boolean`                    | `false`        |

`type` 可选值（`FormItemType`）：

- 输入类：`AUTO`、`INPUT`、`TEXTAREA`、`PASSWORD`、`PASSWORDSTRENGTH`、`INPUTNUMBER`、`RANGEINPUT`、`SLIDER`、`EDITOR`、`CODEMIRROR`、`TEXT`
- 选择类：`SELECT`、`TREESELECT`、`AUTOCOMPLETESELECT`、`SEGMENTED`、`SWITCH`、`RADIO`、`CHECKBOX`、`CHECKBOXGROUP`、`DATEPICKER`、`RANGEPICKER`、`STEPPICKER`、`TREE`、`ICONSELECT`
- 上传类：`FILE`、`IMAGEFILE`

> 同时导出 `FormItemContainer`（即 `ItemContainer`）及类型 `FormItemType`、`FormItemProps`、`PlaceholderDict` / `PlaceholderDictEn` 占位文案字典。
