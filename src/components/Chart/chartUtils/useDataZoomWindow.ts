import { useCallback, useState } from "react";
import { DataZoomIndexWindow } from "../_utils/cartesian";

export interface DataZoomWindowOptions {
  /** Toggle: whether to recalculate the axis based on the current visible dataZoom window; enabled by default */
  enabled?: boolean;
}

export interface DataZoomWindowResult {
  /** Current visible window; null when disabled or before any callback has been received (meaning the full range) */
  zoomWindow: DataZoomIndexWindow | null;
  /** onDataZoomWindowChanged to pass to Chart.Bar / Chart.Line; undefined when disabled (event not bound) */
  onDataZoomWindowChanged?: (window: DataZoomIndexWindow) => void;
  /** Slices series data by the current visible window; used with calculateAxisConfig to recalculate the axis for the displayed portion only */
  sliceByZoomWindow: <T>(values?: T[] | null) => T[];
}

/**
 * dataZoom visible-window management: works with Chart.Bar / Chart.Line's onDataZoomWindowChanged
 * so the caller can slice data by the "current visible window" and recalculate the Y-axis min/max/interval (calculateAxisConfig),
 * making the axis dynamically follow the displayed portion during slider dragging / wheel scrolling / auto-scroll; can be combined with useLegendSelection.
 */
export function useDataZoomWindow(
  options?: DataZoomWindowOptions,
): DataZoomWindowResult {
  const enabled = options?.enabled ?? true;
  const [zoomWindow, setZoomWindow] = useState<DataZoomIndexWindow | null>(
    null,
  );

  const onDataZoomWindowChanged = useCallback((next: DataZoomIndexWindow) => {
    // Keep the original reference when the window is unchanged, avoiding a re-render → sync callback → re-render loop
    setZoomWindow((prev) =>
      prev &&
      prev.startIndex === next.startIndex &&
      prev.endIndex === next.endIndex
        ? prev
        : next,
    );
  }, []);

  const effectiveWindow = enabled ? zoomWindow : null;

  const sliceByZoomWindow = useCallback(
    <T>(values?: T[] | null): T[] => {
      if (!values) return [];
      if (!effectiveWindow) return values;
      return values.slice(
        effectiveWindow.startIndex,
        effectiveWindow.endIndex + 1,
      );
    },
    [effectiveWindow],
  );

  return {
    zoomWindow: effectiveWindow,
    onDataZoomWindowChanged: enabled ? onDataZoomWindowChanged : undefined,
    sliceByZoomWindow,
  };
}
