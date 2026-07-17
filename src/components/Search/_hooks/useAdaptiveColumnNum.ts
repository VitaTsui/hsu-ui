import { useEffect, useState, RefObject } from "react";

/**
 * Hook that dynamically adjusts the column count based on container width
 * @param containerRef Container ref
 * @param totalColumnNum Base total column count (including the button group)
 * @param enabled Whether adaptive mode is enabled (default true)
 * @param minColumnNum Minimum column count (default 1)
 * @param maxColumnNum Maximum column count (unlimited by default)
 * @param breakpoints Breakpoint config, format: { width: columnNum }, e.g. { 1200: 5, 800: 3 }
 * @param baseWidth Base width used to compute the width ratio (default 1200px)
 * @returns Adjusted total column count
 */
export function useAdaptiveColumnNum(
  containerRef: RefObject<HTMLDivElement>,
  totalColumnNum: number,
  enabled: boolean = true,
  minColumnNum: number = 1,
  maxColumnNum?: number,
  breakpoints?: Record<number, number>,
  baseWidth: number = 1200
) {
  const [adaptiveColumnNum, setAdaptiveColumnNum] =
    useState<number>(totalColumnNum);

  useEffect(() => {
    if (!enabled) {
      setAdaptiveColumnNum(totalColumnNum);
      return;
    }

    const calculateColumnNum = () => {
      if (!containerRef.current || !containerRef.current.offsetWidth) return;

      const containerWidth = containerRef.current.offsetWidth;

      let calculatedColumnNum = totalColumnNum;

      // If breakpoint config is provided, use breakpoints first
      if (breakpoints) {
        const sortedBreakpoints = Object.keys(breakpoints)
          ?.map(Number)
          .sort((a, b) => b - a); // Sort descending

        for (const breakpoint of sortedBreakpoints) {
          if (containerWidth >= breakpoint) {
            calculatedColumnNum = breakpoints[breakpoint];
            break;
          }
        }
      } else {
        // Default strategy: compute automatically from container width
        // Based on the base column count, adjusted by the container width ratio
        const widthRatio = containerWidth / baseWidth;
        calculatedColumnNum = Math.round(totalColumnNum * widthRatio);
      }

      // Apply min and max limits
      if (calculatedColumnNum < minColumnNum) {
        calculatedColumnNum = minColumnNum;
      }
      if (maxColumnNum !== undefined && calculatedColumnNum > maxColumnNum) {
        calculatedColumnNum = maxColumnNum;
      }

      setAdaptiveColumnNum(calculatedColumnNum);
    };

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to defer to the next frame, ensuring the DOM has updated
      requestAnimationFrame(() => {
        calculateColumnNum();
      });
    });

    // Defer observation to ensure the ref has been assigned
    const observeContainer = () => {
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      } else {
        // If the ref is not assigned yet, retry later
        requestAnimationFrame(observeContainer);
      }
    };
    observeContainer();

    // Listen for window resize
    const handleWindowResize = () => {
      requestAnimationFrame(() => {
        calculateColumnNum();
      });
    };
    window.addEventListener("resize", handleWindowResize);

    // Initial calculation (deferred to ensure the DOM has rendered)
    requestAnimationFrame(() => {
      calculateColumnNum();
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [
    containerRef,
    totalColumnNum,
    enabled,
    minColumnNum,
    maxColumnNum,
    breakpoints,
    baseWidth,
  ]);

  return enabled ? adaptiveColumnNum : totalColumnNum;
}
