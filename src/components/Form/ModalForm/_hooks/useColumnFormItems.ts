import { useCallback } from "react";
import { FormItemProps } from "../../../FormItem";

/**
 * Compute the form items within a column layout
 * @param columnNum Column count
 * @returns Function that computes the form items of a column
 */
export const useColumnFormItems = (columnNum: number) => {
  /**
   * Get the indices of all full-width form items (width === "100%") before the given index
   * @param formItems All form items
   * @param endIndex End index (inclusive)
   * @returns Array of indices of full-width form items
   */
  const getFullWidthIndices = useCallback(
    (formItems: FormItemProps[], endIndex: number): number[] => {
      const fullWidthIndices: number[] = [];
      for (let i = 0; i <= endIndex; i++) {
        if (formItems[i]?.width === "100%") {
          fullWidthIndices.push(i);
        }
      }
      return fullWidthIndices;
    },
    []
  );

  /**
   * Calculate the actual column position index of a form item within the column layout
   * Accounts for full-width items (width === "100%") occupying an entire row, which affects the column positions of subsequent items
   * @param formItems All form items
   * @param itemIndex Original index of the form item
   * @returns Actual column position index
   */
  const calculateActualColumnIndex = useCallback(
    (formItems: FormItemProps[], itemIndex: number): number => {
      const fullWidthIndices = getFullWidthIndices(formItems, itemIndex);

      // Calculate the column offset caused by full-width items
      // Accumulate the offset using reduce
      const offset = fullWidthIndices.reduce(
        (acc, curr, idx) =>
          acc +
          (columnNum - ((curr + acc + idx * (columnNum - 1)) % columnNum)),
        0
      );

      // Number of supplementary items after full-width items
      const supplementItemsCount = fullWidthIndices.filter(
        (idx) => idx !== itemIndex
      ).length;
      const additionalOffset = supplementItemsCount * (columnNum - 1);

      // Return the actual column index
      return (itemIndex + offset + additionalOffset) % columnNum;
    },
    [columnNum, getFullWidthIndices]
  );

  const columnFormItems = useCallback(
    (formItems: FormItemProps[], idx: number) => {
      // Calculate the actual column index for the target index
      const targetColumnIndex = calculateActualColumnIndex(formItems, idx);

      // Filter out all form items in the same column as the target item
      const sameColumnItems = formItems.filter((_, itemIndex) => {
        const itemColumnIndex = calculateActualColumnIndex(
          formItems,
          itemIndex
        );
        return itemColumnIndex === targetColumnIndex;
      });

      return sameColumnItems;
    },
    [calculateActualColumnIndex]
  );

  return columnFormItems;
};
