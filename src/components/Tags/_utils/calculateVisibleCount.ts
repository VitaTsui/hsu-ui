/**
 * Calculates the number of visible tags
 * @param containerWidth Container width
 * @param tagWidths Array of all tag widths
 * @param gap Gap between tags
 * @param ellipsisTagWidth Estimated width of the ellipsis tag
 * @returns Number of visible tags
 */
export function calculateVisibleCount(
  containerWidth: number,
  tagWidths: number[],
  gap: number = 8,
  ellipsisTagWidth: number = 60
): number {
  if (containerWidth === 0 || tagWidths.length === 0) {
    return tagWidths.length;
  }

  let usedWidth = 0;
  let count = 0;

  // Iterate over all tags to compute how many can be displayed
  for (let i = 0; i < tagWidths.length; i++) {
    const tagWidth = tagWidths[i] || 0;
    // Compute the total width after adding the current tag
    const nextWidth = usedWidth + tagWidth + (i > 0 ? gap : 0);

    // Check whether the ellipsis tag needs to be displayed
    if (i < tagWidths.length - 1) {
      // Not the last tag; space must be reserved for the ellipsis tag
      if (nextWidth + gap + ellipsisTagWidth > containerWidth) {
        break;
      }
    } else {
      // The last tag; only the current width needs to be checked
      if (nextWidth > containerWidth) {
        break;
      }
    }

    count++;
    usedWidth = nextWidth;
  }

  // Show at least 0 (if not even one fits, show only the ellipsis tag)
  return Math.max(0, count);
}
