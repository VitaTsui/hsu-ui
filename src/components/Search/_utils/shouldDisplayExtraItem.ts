/**
 * 判断收起状态下是否应多显示一个搜索项
 *
 * 规则：按钮组宽度大于列宽（按钮组独占更宽空间，首行有富余）；
 * 或按钮组宽度小于列宽且可见项刚好比列数多 1（此时收起只会藏起 1 项，不如直接放下）。
 * @param buttonGroupWidth 按钮组宽度
 * @param columnWidth 列宽
 * @param columnNum 搜索项列数（不含按钮组）
 * @param visibleCount 可见搜索项总数
 */
export function shouldDisplayExtraItem(
  buttonGroupWidth: number | undefined,
  columnWidth: number | undefined,
  columnNum: number,
  visibleCount: number
): boolean {
  return (
    buttonGroupWidth !== undefined &&
    columnWidth !== undefined &&
    (buttonGroupWidth > columnWidth ||
      (buttonGroupWidth < columnWidth && columnNum + 1 === visibleCount))
  );
}
