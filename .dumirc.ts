import { defineConfig } from "dumi";

export default defineConfig({
  themeConfig: {
    name: "Hsu UI",
    logo: "/logo.svg",
    nav: [
      { title: "指南", link: "/guide" },
      { title: "组件", link: "/components/button" },
    ],
    footer: "Hsu UI · 基于 React + Ant Design 的中后台组件库",
    socialLinks: {
      github: "https://github.com/VitaTsui",
    },
  },
  // 组件演示里全局引入 antd 覆盖样式，保证与库内观感一致
  styles: [],
  // dumi 原生支持 less，无需额外 loader
  resolve: {
    docDirs: ["docs"],
    atomDirs: [{ type: "component", dir: "src/components" }],
  },
  // 仅作文档站，不输出库（库由 father 构建）
  mfsu: false,
});
