/**
 * Hsu UI 设计 token 的 TS 常量（供 antd themeConfig 等 JS 侧消费）。
 * CSS 变量版见 ./tokens.scss，两份需同步修改。
 */

export interface HsuThemeTokens {
  /** 页面画布 */
  canvas: string;
  /** 卡片/面板底 */
  surface: string;
  /** 表头/次级底 */
  subtle: string;
  /** 描边 */
  border: string;
  /** 更轻描边 */
  borderWeak: string;
  /** 顶栏底 */
  headerBg: string;
  text: string;
  text2: string;
  text3: string;
  rowHover: string;
}

export const lightTokens: HsuThemeTokens = {
  canvas: "#f6f7f9",
  surface: "#ffffff",
  subtle: "#fafbfc",
  border: "#e6e8eb",
  borderWeak: "#eceef1",
  headerBg: "#ffffff",
  text: "rgba(0, 0, 0, 0.88)",
  text2: "rgba(0, 0, 0, 0.45)",
  text3: "rgba(0, 0, 0, 0.35)",
  rowHover: "#f6f7f9",
};

export const darkTokens: HsuThemeTokens = {
  canvas: "#131314",
  surface: "#1c1c1e",
  subtle: "#232325",
  border: "rgba(255, 255, 255, 0.12)",
  borderWeak: "rgba(255, 255, 255, 0.08)",
  headerBg: "#1c1c1e",
  text: "rgba(255, 255, 255, 0.85)",
  text2: "rgba(255, 255, 255, 0.45)",
  text3: "rgba(255, 255, 255, 0.35)",
  rowHover: "rgba(255, 255, 255, 0.04)",
};

/** 默认主色（CSS 变量 --primary-color 的初始值，消费项目可运行时覆盖） */
export const defaultPrimaryColor = "#1677ff";
