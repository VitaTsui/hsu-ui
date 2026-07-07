import { useCallback, useState } from "react";
import { DataZoomIndexWindow } from "../_utils/cartesian";

export interface DataZoomWindowOptions {
  /** 开关：是否按 dataZoom 当前可见窗口重算坐标轴，默认开启 */
  enabled?: boolean;
}

export interface DataZoomWindowResult {
  /** 当前可见窗口；开关关闭或尚未收到回调时为 null（表示全量） */
  zoomWindow: DataZoomIndexWindow | null;
  /** 传给 Chart.Bar / Chart.Line 的 onDataZoomWindowChanged；开关关闭时为 undefined（不绑定事件） */
  onDataZoomWindowChanged?: (window: DataZoomIndexWindow) => void;
  /** 按当前可见窗口裁剪系列数据，配合 calculateAxisConfig 只对展示部分重算坐标轴 */
  sliceByZoomWindow: <T>(values?: T[] | null) => T[];
}

/**
 * dataZoom 可见窗口管理：配合 Chart.Bar / Chart.Line 的 onDataZoomWindowChanged，
 * 在调用方按"当前可见窗口"裁剪数据后重算 Y 轴 min/max/interval（calculateAxisConfig），
 * 实现滑块拖动/滚轮/自动滚动时坐标轴跟随展示部分动态重算；可与 useLegendSelection 叠加。
 */
export function useDataZoomWindow(
  options?: DataZoomWindowOptions,
): DataZoomWindowResult {
  const enabled = options?.enabled ?? true;
  const [zoomWindow, setZoomWindow] = useState<DataZoomIndexWindow | null>(
    null,
  );

  const onDataZoomWindowChanged = useCallback((next: DataZoomIndexWindow) => {
    // 窗口未变化时保持原引用，避免重渲染 → 同步回调 → 再重渲染的循环
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
