import { useCallback, useState } from "react";

export interface LegendSelectionResult {
  /** 传给图表 legend.selected，保证重渲染(setOption notMerge)后隐藏状态不丢 */
  legendSelected: Record<string, boolean>;
  /** 传给图表 onLegendSelectChanged */
  onLegendSelectChanged: (selected: Record<string, boolean>) => void;
  /** 判断某系列当前是否可见（未点过的系列默认可见） */
  isSeriesVisible: (name?: string | null) => boolean;
}

/**
 * 图例选中状态管理：配合 Chart.Bar / Chart.Line 的 onLegendSelectChanged，
 * 在调用方按"当前可见系列"重算 Y 轴 min/max/interval（calculateAxisConfig），
 * 实现图例隐藏某一项后坐标轴自动重算。
 */
export function useLegendSelection(): LegendSelectionResult {
  const [legendSelected, setLegendSelected] = useState<Record<string, boolean>>(
    {},
  );

  const onLegendSelectChanged = useCallback(
    (selected: Record<string, boolean>) => {
      setLegendSelected({ ...selected });
    },
    [],
  );

  const isSeriesVisible = useCallback(
    (name?: string | null) => name == null || legendSelected[name] !== false,
    [legendSelected],
  );

  return { legendSelected, onLegendSelectChanged, isSeriesVisible };
}
