import { useState, useEffect, useCallback } from "react";
import { FormItemProps } from "../../FormItem";
import { measureButtonGroupWidth } from "../_utils";

/**
 * Hook that controls expand/collapse adaptively based on width
 * @param containerRef Container ref
 * @param buttonGroupRef Button group ref
 * @param itemClassName className of the search items
 * @param itemCount Total number of search items
 * @param columnNum Column count
 * @param autoAdaptWidth Whether adaptive width is enabled
 * @param defaultExpanded Whether expanded by default
 * @param onExpandChange Callback when expand state changes
 * @param searchItems Search item config array (optional)
 * @param showAllSearchItems Whether to show all search items
 * @returns Expand state and control methods
 */
export function useSearchExpand(
  containerRef: React.RefObject<HTMLDivElement>,
  buttonGroupRef: React.RefObject<HTMLDivElement>,
  itemClassName: string,
  itemCount: number,
  columnNum: number,
  autoAdaptWidth: boolean,
  defaultExpanded: boolean,
  onExpandChange?: (expand: boolean) => void,
  searchItems?: FormItemProps[],
  showAllSearchItems?: boolean,
  columnOffsetWidth: number = 0
) {
  const [expand, setExpand] = useState<boolean>(defaultExpanded);
  const [visibleItemCount, setVisibleItemCount] = useState<number>(columnNum);

  useEffect(() => {
    if (!autoAdaptWidth || !containerRef.current || !!showAllSearchItems) {
      return;
    }

    const container = containerRef.current;

    const calculateVisibleItems = () => {
      if (!containerRef.current || !buttonGroupRef.current) return;

      const containerWidth = container.offsetWidth;
      // Subtract padding
      const availableWidth = containerWidth - 30; // 15px padding on each side

      // Get the actual width of the button group (sum of all child element widths)
      const buttonGroupWidth =
        measureButtonGroupWidth(buttonGroupRef.current) ?? 0;

      // Get all search item elements
      const items = container.querySelectorAll(`${itemClassName}`);

      // Compute how many search items fit in the first row
      let count = 0;
      let usedWidth = 0;
      const gap = 10; // Gap between items

      // Compute the default width of a single item (container width divided by column count)
      const defaultItemWidth =
        (availableWidth - (columnNum - 1) * gap) / columnNum -
        columnOffsetWidth;

      // Iterate over all search items (including unrendered ones)
      for (let i = 0; i < itemCount; i++) {
        let itemWidth = 0;

        // If this item exists in the DOM, use its actual width
        if (i < items.length) {
          const item = items[i] as HTMLElement;
          itemWidth = item.offsetWidth;
        } else if (searchItems && searchItems[i]?.width !== undefined) {
          // If not in the DOM but a width is configured, use the configured width
          const configWidth = searchItems[i].width;
          if (typeof configWidth === "number") {
            itemWidth = configWidth;
          } else if (typeof configWidth === "string") {
            // Handle percentage or pixel values
            if (configWidth.endsWith("%")) {
              const percent = parseFloat(configWidth) / 100;
              itemWidth = availableWidth * percent;
            } else {
              itemWidth = parseFloat(configWidth);
            }
          }
        } else {
          // If not in the DOM and no width is configured, use the default computed width
          itemWidth = defaultItemWidth;
        }

        // Compute the total width after adding the current item (including gap)
        const nextWidth = usedWidth + itemWidth + (i > 0 ? gap : 0);

        // Check whether the button group still fits (must reserve the gap and the button group width)
        if (nextWidth + gap + buttonGroupWidth <= availableWidth) {
          count++;
          usedWidth = nextWidth;
        } else {
          break;
        }
      }

      // Show at least 1 search item
      count = Math.max(1, count);
      setVisibleItemCount(count);

      // If all items can be displayed, expanding is not needed
      if (count >= itemCount) {
        setExpand(false);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to defer to the next frame, ensuring the DOM has updated
      requestAnimationFrame(() => {
        calculateVisibleItems();
      });
    });

    // MutationObserver watches for DOM changes
    const mutationObserver = new MutationObserver(() => {
      // Use requestAnimationFrame to defer to the next frame
      requestAnimationFrame(() => {
        calculateVisibleItems();
      });
    });

    resizeObserver.observe(container);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // Listen for window resize
    const handleWindowResize = () => {
      requestAnimationFrame(() => {
        calculateVisibleItems();
      });
    };
    window.addEventListener("resize", handleWindowResize);

    // Initial calculation (deferred to ensure the DOM has rendered)
    requestAnimationFrame(() => {
      calculateVisibleItems();
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [
    containerRef,
    buttonGroupRef,
    itemClassName,
    itemCount,
    columnNum,
    autoAdaptWidth,
    searchItems,
    showAllSearchItems,
    columnOffsetWidth,
  ]);

  const toggleExpand = useCallback(() => {
    const newExpand = !expand;
    setExpand(newExpand);
    onExpandChange?.(newExpand);
  }, [expand, onExpandChange]);

  const handleSetExpand = useCallback(
    (newExpand: boolean) => {
      setExpand(newExpand);
      onExpandChange?.(newExpand);
    },
    [onExpandChange]
  );

  return {
    expand,
    setExpand: handleSetExpand,
    toggleExpand,
    visibleItemCount: autoAdaptWidth ? visibleItemCount : columnNum,
  };
}
