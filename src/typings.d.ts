// 环境声明：为构建期类型检查 / 声明文件生成补充缺失的模块类型。
// 仅提供类型，不影响运行时行为。

// CSS / Less Modules
declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.less" {
  const content: string;
  export default content;
}
declare module "*.css" {
  const content: string;
  export default content;
}

// 静态资源
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
