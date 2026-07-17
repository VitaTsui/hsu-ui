import { RefObject, useEffect, useState } from "react";

/**
 * Dynamically adjust the column count based on container width
 * @param containerRef Container whose width should be observed
 * @param columnNum Base column count
 * @param enabled Whether adaptive mode is enabled
 * @param minColumnNum Minimum column count
 * @param maxColumnNum Maximum column count
 * @param baseWidth Reference width (adjustable per design spec)
 */
export const useAdaptiveColumnNum = (
  containerRef: RefObject<HTMLElement> | HTMLElement | null,
  columnNum: number,
  enabled: boolean = true,
  minColumnNum: number = 1,
  maxColumnNum?: number,
  baseWidth: number = 1200,
  active: boolean = true
) => {
  const [adaptiveColumnNum, setAdaptiveColumnNum] = useState<number>(columnNum);

  useEffect(() => {
    if (!enabled || !active) {
      setAdaptiveColumnNum(columnNum);
      return;
    }

    const container =
      containerRef && "current" in containerRef
        ? containerRef.current
        : (containerRef as HTMLElement | null);

    if (!container) {
      return;
    }

    const calculateColumnNum = () => {
      if (!container) return;

      const containerWidth = container.parentElement!.offsetWidth;

      // Scale proportionally to the current container width, using baseWidth as the baseline
      let next = Math.round((columnNum * containerWidth) / baseWidth);

      if (next < minColumnNum) next = minColumnNum;
      if (maxColumnNum !== undefined && next > maxColumnNum) {
        next = maxColumnNum;
      }

      setAdaptiveColumnNum(next);
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculateColumnNum);
    });

    resizeObserver.observe(container);
    window.addEventListener("resize", calculateColumnNum);

    requestAnimationFrame(calculateColumnNum);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateColumnNum);
    };
  }, [
    containerRef,
    columnNum,
    enabled,
    minColumnNum,
    maxColumnNum,
    baseWidth,
    active,
  ]);

  return enabled ? adaptiveColumnNum : columnNum;
};
