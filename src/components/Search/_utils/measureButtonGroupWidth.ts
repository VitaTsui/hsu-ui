/**
 * Computes the actual width of the button group (sum of all child element widths + gaps between children)
 * @param buttonGroupEl Button group element
 * @returns Button group width; undefined when there are no children
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
  // Add the gaps between child elements
  const childGap = 5;
  totalWidth += (buttonChildren.length - 1) * childGap;

  return totalWidth;
}
