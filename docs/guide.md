---
title: 快速上手
group:
  title: 指南
  order: 1
order: 1
---

# 快速上手

Hsu UI 是一套基于 React + Ant Design 的中后台业务组件库，把「列表 + 搜索 + 表单弹窗 + CRUD」这类重复劳动沉淀为页面级组件。

## 安装

```bash
yarn add @hsu-react/ui
```

同时确保宿主项目已安装 peerDependencies：

```bash
yarn add react react-dom antd @ant-design/icons mobx mobx-react-lite
```

## 注入请求与权限

库内的「智能组件」（如 `ImportForm` 的下载模板）不绑定具体 HTTP 客户端，需要通过 `ConfigProvider` 注入：

```tsx | pure
import { ConfigProvider } from "@hsu-react/ui";
import { get, post, del, put } from "@/services/Axios";

<ConfigProvider
  permissions={userPermissions}      // 当前用户权限码，驱动 hasPermi 校验
  request={{ get, post, del, put }}   // 注入请求实现
>
  <App />
</ConfigProvider>;
```

- `permissions`：传入后，所有带 `hasPermi` 的按钮/表单/操作会据此显隐；不传默认全部放行。
- `request`：注入后，依赖请求的组件即可工作；也可在入口直接调用 `configureRequest({ get, post, del, put })`。

## 引入全局样式（可选）

库附带了对 antd 的全局观感覆盖，按需在入口引入（产物为 scss，宿主项目需安装 `sass` 并具备 scss 编译能力）：

```ts
import "@hsu-react/ui/es/styles/antd-overload.scss";
import "@hsu-react/ui/es/styles/utils.scss";
```

## 按需引入

组件库为 bundless 产物（`es/` 为 ESM、`lib/` 为 CJS），支持按目录按需引入：

```ts
import { Button, Panel, FormItem } from "@hsu-react/ui";
```
