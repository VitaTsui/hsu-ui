# @hsu-react/ui

一套基于 **React + Ant Design** 的中后台业务组件库，把「列表 + 搜索 + 表单弹窗 + CRUD」这类重复劳动沉淀为页面级组件，并内置 Markdown / CodeMirror / Spreadsheet / Chart / Editor 等内容组件。

📖 **文档与在线示例：https://vitatsui.github.io/hsu-ui**

## 安装

```bash
yarn add @hsu-react/ui
# peerDependencies
yarn add react react-dom antd @ant-design/icons mobx mobx-react-lite
```

## 使用

```tsx
import { ConfigProvider, Button } from "@hsu-react/ui";
import { get, post, del, put } from "@/services/Axios";

export default function App() {
  return (
    <ConfigProvider permissions={userPermissions} request={{ get, post, del, put }}>
      <Button type="primary">Hello Hsu UI</Button>
    </ConfigProvider>
  );
}
```

- `ConfigProvider.permissions` — 当前用户权限码，驱动所有 `hasPermi` 的显隐校验。
- `ConfigProvider.request` — 注入 HTTP 请求实现（库本身不绑定 HTTP 客户端）。

可选引入全局 antd 观感覆盖：

```ts
import "@hsu-react/ui/es/styles/antd-overload.less";
```

## 开发

```bash
yarn          # 安装依赖
yarn dev      # 启动 dumi 文档站
yarn build    # father 构建 es/ + lib/ + 类型
yarn docs:build  # 构建文档站静态产物
```

## 组件一览

通用 `Button` `Icon` `Copy` `Operate` ·
布局 `Panel` `FlexFill` `TabBar` ·
数据录入 `Input` `Select` `Checkbox` `Switch` `Slider` `DatePicker` `Form` `FormItem` `Upload` `CodeMirror` `Editor` `SecondConf` `Search` ·
数据展示 `Table` `Tags` `Descriptions` `Tree` `TextEllipsis` `FileCol` `FilePreview` `Chart` `Markdown` `Spreadsheet` `ChainGraph` ·
反馈 `Modal` · AI `Chat`

详见文档站。
