import { useEffect, useState } from "react";
import { calculateVisibleCount } from "../_utils/calculateVisibleCount";

export interface UseVisibleTagsOptions {
  tags: string[];
  gap?: number;
  ellipsisTagWidth?: number;
  ellipsis?: boolean;
}

/**
 * Hook that computes the number of visible tags
 * @param containerRef Container ref
 * @param measureRef Measure container ref
 * @param options Config options
 * @returns Number of visible tags
 */
export function useVisibleTags(
  containerRef: React.RefObject<HTMLDivElement>,
  measureRef: React.RefObject<HTMLDivElement>,
  options: UseVisibleTagsOptions,
): number {
  const { tags, gap = 8, ellipsisTagWidth = 60, ellipsis = true } = options;
  const [visibleCount, setVisibleCount] = useState<number>(tags.length);

  // Reset visibleCount when tags change
  useEffect(() => {
    setVisibleCount(tags.length);
  }, [tags.length]);

  // If ellipsis is disabled, just return the total tag count
  useEffect(() => {
    if (!ellipsis) {
      setVisibleCount(tags.length);
    }
  }, [ellipsis, tags.length]);

  // Compute the number of visible tags
  useEffect(() => {
    // If ellipsis is disabled, skip the calculation
    if (!ellipsis) {
      return;
    }

    if (!containerRef.current || !measureRef.current || tags.length === 0) {
      setVisibleCount(tags.length);
      return;
    }

    const calculate = () => {
      const container = containerRef.current;
      const measureContainer = measureRef.current;
      if (!container || !measureContainer) return;

      const containerWidth = container.offsetWidth;
      if (containerWidth === 0) {
        // Container width is 0, possibly hidden; skip the calculation
        return;
      }

      // Get the actual widths of all tag elements
      const tagElements = measureContainer.children;
      const tagWidths: number[] = [];
      for (let i = 0; i < tagElements.length; i++) {
        const element = tagElements[i] as HTMLElement;
        tagWidths.push(element.offsetWidth);
      }

      const count = calculateVisibleCount(
        containerWidth,
        tagWidths,
        gap,
        ellipsisTagWidth,
      );
      setVisibleCount(count);
    };

    // Use requestAnimationFrame to ensure the DOM has been updated
    const timer = requestAnimationFrame(() => {
      calculate();
    });

    // Observe container size changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calculate();
      });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(timer);
      resizeObserver.disconnect();
    };
  }, [tags, gap, ellipsisTagWidth, ellipsis, containerRef, measureRef]);

  return visibleCount;
}
