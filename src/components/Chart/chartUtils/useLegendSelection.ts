import { useCallback, useState } from "react";

export interface LegendSelectionResult {
  /** Pass to the chart's legend.selected to keep hidden state from being lost after re-render (setOption notMerge) */
  legendSelected: Record<string, boolean>;
  /** Pass to the chart's onLegendSelectChanged */
  onLegendSelectChanged: (selected: Record<string, boolean>) => void;
  /** Checks whether a series is currently visible (series never toggled are visible by default) */
  isSeriesVisible: (name?: string | null) => boolean;
}

/**
 * Legend selection state management: works with Chart.Bar / Chart.Line's onLegendSelectChanged
 * so the caller can recalculate the Y-axis min/max/interval (calculateAxisConfig) based on the "currently visible series",
 * making the axis automatically recalculate after an item is hidden via the legend.
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
