/**
 * Determines whether one extra search item should be displayed in collapsed state
 *
 * Rules: the button group is wider than a column (the button group takes up more space on its own, leaving spare room in the first row);
 * or the button group is narrower than a column and the visible items exceed the column count by exactly 1 (collapsing would only hide 1 item, so it's better to just fit it in).
 * @param buttonGroupWidth Button group width
 * @param columnWidth Column width
 * @param columnNum Search item column count (excluding the button group)
 * @param visibleCount Total number of visible search items
 */
export function shouldDisplayExtraItem(
  buttonGroupWidth: number | undefined,
  columnWidth: number | undefined,
  columnNum: number,
  visibleCount: number
): boolean {
  return (
    buttonGroupWidth !== undefined &&
    columnWidth !== undefined &&
    (buttonGroupWidth > columnWidth ||
      (buttonGroupWidth < columnWidth && columnNum + 1 === visibleCount))
  );
}
