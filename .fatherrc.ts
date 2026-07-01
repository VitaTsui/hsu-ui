import { defineConfig } from "father";

export default defineConfig({
  // 组件库采用 bundless 构建：逐文件转译，保留目录结构，支持按需引入。
  esm: {
    output: "es",
    // .scss 等非 JS 资源会被原样拷贝到产物目录（消费方自行用 sass-loader 处理）
    transformer: "babel",
  },
  cjs: {
    output: "lib",
    transformer: "babel",
  },
  // 仅编译 src，文档/演示不参与打包
  // scss / 图片等静态资源由 father 自动拷贝到产物目录
});
