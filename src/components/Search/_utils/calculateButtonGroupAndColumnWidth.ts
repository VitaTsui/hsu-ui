import { RefObject } from "react";
import { measureButtonGroupWidth } from "./measureButtonGroupWidth";

/**
 * Computes the button group width and column width
 * @param containerRef Container ref
 * @param buttonGroupRef Button group ref
 * @param adaptiveColumnNum Adaptive column count
 * @param columnOffsetWidth Column offset width (default 0)
 * @returns Button group width and column width
 */
export function calculateButtonGroupAndColumnWidth(
  containerRef: RefObject<HTMLDivElement>,
  buttonGroupRef: RefObject<HTMLDivElement>,
  adaptiveColumnNum: number,
  columnOffsetWidth: number = 0
): {
  buttonGroupWidth: number | undefined;
  columnWidth: number | undefined;
} {
  let buttonGroupWidth: number | undefined;
  let columnWidth: number | undefined;

  if (containerRef.current && buttonGroupRef.current) {
    const containerWidth = containerRef.current.offsetWidth;
    const availableWidth = containerWidth - 30; // Subtract padding
    const gap = 10; // Gap between items

    // Compute the button group width
    buttonGroupWidth = measureButtonGroupWidth(buttonGroupRef.current);

    // Compute the column width (default width of a single search item)
    if (adaptiveColumnNum > 0) {
      columnWidth =
        availableWidth -
        (((availableWidth - adaptiveColumnNum * gap) / (adaptiveColumnNum + 1) -
          columnOffsetWidth) *
          adaptiveColumnNum +
          adaptiveColumnNum * gap);
    }

    if (
      buttonGroupWidth !== undefined &&
      columnWidth !== undefined &&
      buttonGroupWidth > columnWidth
    ) {
      containerRef.current.style.setProperty(
        "--column-compensate-width",
        `${columnOffsetWidth}px`
      );
    } else {
      containerRef.current.style.setProperty(
        "--column-compensate-width",
        `${0}px`
      );
    }
  }

  return { buttonGroupWidth, columnWidth };
}
