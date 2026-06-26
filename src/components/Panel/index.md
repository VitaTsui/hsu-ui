---
nav: 组件
group:
  title: 布局
  order: 2
title: Panel 页面容器
---

# Panel 页面容器

页面级容器集合，封装了「左侧树 + 顶部搜索 + 表格」的列表页、内嵌 iframe 页以及通用内容页等常见布局形态。

## 引入

```ts
import { Panel } from "@hsu-react/ui";
```

## 子组件

| 组件 | 说明 |
| --- | --- |
| `Panel.List` | 列表页容器，集成 `Search`、`Table`、`TabBar`、`Tree`、列管理与工具栏 |
| `Panel.List.Modal` | 弹窗内的列表页容器，用于在 `Modal` 中复用列表布局 |
| `Panel.Iframe` | iframe 内容容器，带加载态与全屏按钮 |
| `Panel.Default` | 通用内容容器，可选左侧树与面包屑 |

## 基础用法

### Panel.List 列表页

`Panel.List` 通过 `searchProps`（搜索区）、`tableProps`（表格区）组合出标准增删改查列表页。下方为可交互示例：输入姓名搜索会实时过滤行，点击「新增」「编辑」有反馈。

> 注意：`Panel.List` / `Search` 内部用到 `Button.Chakra`，需要在外层包一层 `ChakraProvider`（真实项目通常在入口统一提供）。

```tsx
import React, { useState } from "react";
import { Panel, Button } from "@hsu-react/ui";
import { message } from "antd";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  disableLayers: true,
  preflight: false,
});

const ALL = [
  { id: 1, name: "张三", role: "管理员", status: "启用" },
  { id: 2, name: "李四", role: "成员", status: "启用" },
  { id: 3, name: "王五", role: "成员", status: "禁用" },
];

export default () => {
  const [data, setData] = useState(ALL);

  const columns = [
    { title: "姓名", dataIndex: "name" },
    { title: "角色", dataIndex: "role" },
    { title: "状态", dataIndex: "status" },
    {
      title: "操作",
      dataIndex: "op",
      render: (_, row) => (
        <Button type="link" onClick={() => message.info("编辑：" + row.name)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <ChakraProvider value={system}>
      <div style={{ height: 380 }}>
        <Panel.List
          searchProps={{
            searchItems: [{ type: "INPUT", name: "name", label: "姓名" }],
            onSearch: (v) =>
              setData(ALL.filter((x) => !v.name || x.name.includes(v.name))),
            onReset: () => setData(ALL),
            beforeButtonGroup: [
              {
                title: "新增",
                colorPalette: "blue",
                onClick: () => message.success("点击了新增"),
              },
            ],
          }}
          tableProps={{
            columns,
            dataSource: data,
            rowKey: "id",
            pagination: false,
          }}
        />
      </div>
    </ChakraProvider>
  );
};
```

### Panel.Default 内容页

```tsx
import React from "react";
import { Panel } from "@hsu-react/ui";

export default () => (
  <div style={{ height: 200 }}>
    <Panel.Default>
      <div style={{ padding: 16 }}>这里是通用内容区域</div>
    </Panel.Default>
  </div>
);
```

### Panel.Iframe 内嵌页

`Panel.Iframe` 用于内嵌外部页面，带加载态与全屏按钮（外部站点受 X-Frame-Options 限制，此处仅示意用法）：

```tsx | pure
import React from "react";
import { Panel } from "@hsu-react/ui";

export default () => <Panel.Iframe src="https://example.com" fullBtn />;
```

## API

### Panel.List（ListPanelProps）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| searchMode | Search 组件模式：`Default` / `Advanced` / `Collapsible` / `WithFilter` / `WithMore` / `Card` | `SearchModeKeys` | `'Default'` |
| searchProps | 搜索区配置（随 `searchMode` 变化） | `SearchModePropsMap[T]` | - |
| tableProps | 表格区配置，含 `title`、`buttonGroup`、`tabBarProps`、`tableTools` 等 | `ListPanelTabelProps` | - |
| treeProps | 左侧树配置 | `TreeProps` | - |
| headerTabBarProps | 顶部页签配置 | `TabBarProps` | - |
| headerTabBarChildren | 顶部页签区自定义内容 | `ReactNode` | - |
| hasPermi | 权限码，无权限时不渲染 | `string[]` | - |
| baseTreeBreadcrumb | 树面包屑的基础项 | `BreadcrumbProps['items']` | - |
| showTreeBreadcrumb | 是否展示树面包屑 | `boolean` | `true` |
| treeResize | 左侧树可拖拽调宽配置（`enabled`/`defaultWidth`/`minWidth`/`maxWidth`/`minContentWidth`） | `object` | - |
| className / wrapperClassName | 自定义类名 | `string` | - |

### Panel.Iframe（IframePanelProps）

继承原生 `<iframe>` 属性，并扩展：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fullBtn | 是否显示全屏按钮 | `boolean` | - |
| children | 自定义内容（传入后替代 iframe 渲染） | `ReactNode` | - |

### Panel.Default（DefaultPanelProps）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 内容区 | `ReactNode` | - |
| treeProps | 左侧树配置（传入即展示树） | `TreeProps` | - |
| baseTreeBreadcrumb | 树面包屑的基础项 | `BreadcrumbProps['items']` | - |
| showTreeBreadcrumb | 是否展示树面包屑 | `boolean` | `true` |
| className / contentClassName / wrapperClassName | 自定义类名 | `string` | - |
