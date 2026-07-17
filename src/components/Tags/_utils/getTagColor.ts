/**
 * Gets the tag color by index
 * @param index Tag index
 * @param colors Color array
 * @returns Color value or undefined
 */
export function getTagColor(
  index: number,
  colors?: string[]
): string | undefined {
  if (colors && colors.length > 0) {
    return colors[index % colors.length];
  }
  return undefined;
}
