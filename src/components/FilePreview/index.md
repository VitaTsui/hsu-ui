---
nav: 组件
group:
  title: 数据展示
  order: 4
title: FilePreview 文件预览
---

# FilePreview 文件预览

根据文件类型展示对应预览（视频、PDF、图片、文本、Markdown、Excel），通过 `open` 控制显隐。

## 引入

```ts
import { FilePreview } from "@hsu-react/ui";
```

## 基础用法

文本 / Markdown 类型通过 `text` 传入内容，无需远程地址即可预览；视频 / PDF / 图片 / Excel 类型则通过 `fileUrl` 传入文件地址。

```tsx
import React, { useState } from "react";
import { FilePreview } from "@hsu-react/ui";
import { Button } from "antd";

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        预览文本
      </Button>
      <FilePreview
        open={open}
        fileType="txt"
        fileName="说明.txt"
        text={"第一行：这是一段示例文本内容。\n第二行：点击右上角关闭按钮可退出预览。\n第三行：txt / md 类型通过 text 传入，无需网络请求。"}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否展示预览（为 `false` 时不渲染） | `boolean` | - |
| fileType | 文件类型，决定使用哪种预览器 | `'mp4' \| 'pdf' \| 'jpg' \| 'jpeg' \| 'png' \| 'gif' \| 'txt' \| 'md' \| 'xlsx' \| string` | - |
| fileUrl | 文件地址（视频/PDF/图片/Excel） | `string` | - |
| fileName | 文件名 | `string` | - |
| text | 文本内容（`txt` / `md` 类型使用） | `string` | - |
| pagination | PDF 是否显示分页 | `boolean` | - |
| className | 自定义类名 | `string` | - |
| onClose | 关闭回调 | `() => void` | - |

> 另导出类型 `FilePreviewType` 与常量 `FilePreviewTypeArr`（支持的文件类型数组）。
