// Ambient declarations: supply missing module types for build-time type checking / declaration file generation.
// Types only; no runtime effect.

// CSS / Sass Modules
declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "*.scss" {
  const content: string;
  export default content;
}
declare module "*.css" {
  const content: string;
  export default content;
}

// Static assets
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
