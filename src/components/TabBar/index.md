---
nav: 组件
group:
  title: 布局
  order: 2
title: TabBar 标签栏
---

# TabBar 标签栏

轻量级标签切换栏，支持受控/非受控、`default` 与 `outline` 两种样式，并可结合路由实现页签跳转。

## 引入

```ts
import { TabBar } from "@hsu-react/ui";
```

## 默认样式

通过 `tabGroup` 配置页签，`onTabChange` 监听切换。

```tsx
import React, { useState } from "react";
import { TabBar } from "@hsu-react/ui";

export default () => {
  const [tab, setTab] = useState<string | number>("1");

  const tabGroup = [
    { title: "全部", key: "1" },
    { title: "进行中", key: "2" },
    { title: "已完成", key: "3" },
  ];

  return <TabBar tabGroup={tabGroup} tab={tab} onTabChange={setTab} />;
};
```

## 描边样式

`variant="outline"` 渲染为描边胶囊样式。

```tsx
import React, { useState } from "react";
import { TabBar } from "@hsu-react/ui";

export default () => {
  const [tab, setTab] = useState<string | number>("1");

  const tabGroup = [
    { title: "全部", key: "1" },
    { title: "进行中", key: "2" },
    { title: "已完成", key: "3" },
  ];

  return (
    <TabBar
      variant="outline"
      tabGroup={tabGroup}
      tab={tab}
      onTabChange={setTab}
    />
  );
};
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tabGroup | 页签数据 | `TabGroup[]` | - |
| tab | 受控选中项的 key | `string \| number` | - |
| defaultTab | 默认选中项的 key（非受控） | `string \| number` | - |
| onTabChange | 切换页签时触发 | `(key: string \| number) => void` | - |
| variant | 样式风格 | `'default' \| 'outline'` | `'default'` |
| router | 是否在切换时按 key 进行路由跳转 | `boolean` | - |
| className | 自定义类名 | `string` | - |

`TabGroup` 结构：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 页签标题 | `string` | - |
| key | 页签唯一标识 | `string \| number` | - |
| onClick | 点击该页签时的回调 | `() => void` | - |
