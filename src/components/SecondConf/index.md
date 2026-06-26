---
nav: 组件
group:
  title: 数据录入
  order: 3
title: SecondConf 二次确认
---

# SecondConf 二次确认

基于 `Modal` 封装的二次确认弹窗，内置问号图标，自动拼接「确认{contentTitle}吗？」标题与说明文案。

## 引入

```ts
import { SecondConf } from "@hsu-react/ui";
```

## 二次确认

```tsx
import React, { useState } from "react";
import { SecondConf } from "@hsu-react/ui";
import { Button } from "antd";

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button danger onClick={() => setOpen(true)}>
        删除
      </Button>
      <SecondConf
        open={open}
        contentTitle="删除该条数据"
        contentText="删除后将无法恢复，请谨慎操作。"
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

## API

在 `Modal`（即 antd `ModalProps`）基础上扩展（`title` 已被内部接管）：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| contentTitle | 标题中「确认 … 吗？」的中间内容 | `ReactNode` | - |
| contentText | 标题下方的补充说明文案 | `ReactNode` | - |

> 其余属性（`open`、`onOk`、`onCancel`、`width`、`confirmLoading` 等）与 `Modal` 一致；组件内部默认 `width={800}`、`centered`、`maskClosable={false}`、`mask={false}`。
