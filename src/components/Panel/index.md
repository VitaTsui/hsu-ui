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

`Panel.List` 通过 `searchProps`、`tableProps` 等组合出标准增删改查列表页，通常配合接口数据使用。

```tsx | pure
import React from "react";
import { Panel } from "@hsu-react/ui";

export default () => (
  <Panel.List
    searchProps={{
      formData: [{ type: "Input", name: "name", label: "名称" }],
      onSearch: (values) => console.log(values),
    }}
    tableProps={{
      title: "用户列表",
      buttonGroup: [{ title: "新增", type: "primary" }],
      columns: [
        { title: "名称", dataIndex: "name" },
        { title: "状态", dataIndex: "status" },
      ],
      dataSource: [{ name: "张三", status: "启用" }],
    }}
  />
);
```

### Panel.Iframe 内嵌页

```tsx | pure
import React from "react";
import { Panel } from "@hsu-react/ui";

export default () => (
  <Panel.Iframe src="https://example.com" fullBtn />
);
```

### Panel.Default 内容页

```tsx | pure
import React from "react";
import { Panel } from "@hsu-react/ui";

export default () => (
  <Panel.Default>
    <div>页面内容区域</div>
  </Panel.Default>
);
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
