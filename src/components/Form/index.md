---
nav: 组件
group:
  title: 数据录入
  order: 3
title: Form 表单
---

# Form 表单

配置驱动的表单集合，通过 `formItems` 描述表单项，提供弹窗表单、抽屉表单、导入表单三种形态及 `useForm`。

## 引入

```ts
import { Form } from "@hsu-react/ui";
```

## 基础用法

`Form` 是一个命名空间对象，常用 `Form.Modal` 渲染弹窗表单，表单项通过 `formItems` 配置。点击下方按钮试试：

```tsx
import React, { useState } from "react";
import { Form } from "@hsu-react/ui";
import { Button, message } from "antd";

export default () => {
  const [open, setOpen] = useState(false);

  const formItems = [
    { type: "INPUT", name: "name", label: "姓名", required: true },
    {
      type: "SELECT",
      name: "role",
      label: "角色",
      componentProps: {
        options: [
          { label: "管理员", value: "admin" },
          { label: "访客", value: "guest" },
        ],
      },
    },
    {
      type: "INPUTNUMBER",
      name: "age",
      label: "年龄",
      componentProps: { min: 0, max: 120 },
    },
    { type: "SWITCH", name: "enabled", label: "启用" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        新增用户
      </Button>
      <Form.Modal
        open={open}
        title="新增用户"
        formItems={formItems}
        onOk={(data) => {
          message.success("提交数据：" + JSON.stringify(data));
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

## API

`Form` 是一个对象，包含以下成员：

| 成员 | 说明 | 类型 |
| --- | --- | --- |
| Form.Modal | 弹窗表单 | `React.FC<ModalFormProps>` |
| Form.Drawer | 抽屉表单 | `React.FC<DrawerFormProps>` |
| Form.Import | 导入表单（上传文件） | `React.FC<ImportFormProps>` |
| Form.useForm | antd `Form.useForm`，创建表单实例 | `typeof AntdForm.useForm` |

### Form.Modal（ModalFormProps）

在 `Modal`（antd `ModalProps`，`onCancel` / `onOk` 已重写）基础上扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formItems | 表单项配置；传对象时按分组渲染 | `FormItemProps[] \| Record<string, FormItemProps[]>` | `[]` |
| extraFormItems | 额外的自定义表单项节点 | `ExtraFormItem[]` | - |
| externalForm | 外部传入的表单实例 | `FormInstance` | - |
| value | 表单回填值 | `Record<string, unknown>` | - |
| onOk | 校验通过后的提交回调 | `(data, form: FormInstance) => void` | - |
| onCancel | 取消回调 | `() => void` | - |
| hasPermi | 权限码 | `string[]` | - |
| layout / formItemLayout | 表单 / 表单项布局方向 | `'horizontal' \| 'vertical'` | - |
| columnNum | 表单列数 | `number` | - |
| disabled | 是否禁用整个表单 | `boolean` | - |
| onValuesChange | 表单值变化回调 | `(value, values) => void` | - |

### Form.Drawer（DrawerFormProps）

在 antd `DrawerProps`（`onClose` 已重写）基础上扩展：`formItems`、`extraFormItems`、`externalForm`、`value`、`hasPermi`、`buttonGroup`（底部按钮组 `ButtonProps[]`）、`onClose`、`reset`。

### Form.Import（ImportFormProps）

在 `Modal`（`onCancel` / `onOk` 已重写）基础上扩展：`open`、`title`、`onCancel`、`uploadAction`（上传地址）、`template`（模板下载地址）、`templateName`、`hasPermi`、`formClassName`、`formItemClassName`、`uploadProps`。
