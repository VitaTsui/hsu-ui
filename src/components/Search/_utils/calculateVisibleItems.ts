import { FormItemProps } from "../../FormItem";
import { shouldDisplayExtraItem } from "./shouldDisplayExtraItem";

/**
 * Computes the search items that should currently be displayed
 * @param searchItems All search items
 * @param expand Whether expanded
 * @param columnNum Column count
 * @param visibleItemCount Visible item count (used with adaptive width)
 * @param autoAdaptWidth Whether adaptive width is enabled
 * @param buttonGroupWidth Button group width (optional)
 * @param columnWidth Column width (optional)
 * @returns The search items that should currently be displayed
 */
export function calculateVisibleItems(
  searchItems: FormItemProps[],
  expand: boolean,
  columnNum: number,
  visibleItemCount: number,
  autoAdaptWidth: boolean,
  buttonGroupWidth?: number,
  columnWidth?: number,
): FormItemProps[] {
  const visibleItems = searchItems.filter((item) => item.visible);
  const hasCustomWidth = searchItems.some((item) => item.width !== undefined);

  if (!expand) {
    // When there are custom widths, use adaptive calculation
    if (hasCustomWidth && autoAdaptWidth) {
      if (visibleItems.length > visibleItemCount) {
        return visibleItems.slice(0, visibleItemCount);
      }
    } else if (!hasCustomWidth) {
      // Without custom widths, use columnNum (actual search item count)
      // If the button group is wider than a column, display actual search item count + 1
      const displayCount = shouldDisplayExtraItem(
        buttonGroupWidth,
        columnWidth,
        columnNum,
        visibleItems.length,
      )
        ? columnNum + 1
        : columnNum;
      if (visibleItems.length >= displayCount) {
        return visibleItems.slice(0, displayCount);
      }
    }
  }
  return visibleItems;
}
