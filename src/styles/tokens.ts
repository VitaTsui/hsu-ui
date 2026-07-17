/**
 * TS constants for the Hsu UI design tokens (for JS-side consumers such as antd themeConfig).
 * The CSS-variable version lives in ./tokens.scss; the two must be kept in sync.
 */

export interface HsuThemeTokens {
  /** Page canvas */
  canvas: string;
  /** Card/panel background */
  surface: string;
  /** Table header/secondary background */
  subtle: string;
  /** Border */
  border: string;
  /** Lighter border */
  borderWeak: string;
  /** Header bar background */
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

/** Default primary color (initial value of the CSS variable --primary-color; consuming projects may override at runtime) */
export const defaultPrimaryColor = "#1677ff";
