/**
 * 计算按钮组的实际宽度（所有子元素宽度总和 + 子元素间距）
 * @param buttonGroupEl 按钮组元素
 * @returns 按钮组宽度；无子元素时返回 undefined
 */
export function measureButtonGroupWidth(
  buttonGroupEl: HTMLElement | null
): number | undefined {
  if (!buttonGroupEl) return undefined;

  const buttonChildren = Array.from(buttonGroupEl.children);
  if (buttonChildren.length === 0) return undefined;

  let totalWidth = 0;
  buttonChildren.forEach((child) => {
    totalWidth += (child as HTMLElement).offsetWidth;
  });
  // 加上子元素之间的间距
  const childGap = 5;
  totalWidth += (buttonChildren.length - 1) * childGap;

  return totalWidth;
}
