import { useMemo } from "react";
import { OperateProps } from "../index";

/**
 * Determine whether the operate buttons overflow the visible range
 * @param menu - Array of menu items
 * @param maxVisible - Maximum number of visible items
 * @param enableEllipsis - Whether ellipsis is enabled
 * @returns Whether it overflows
 */
const useOperateEllipsis = (
  menu: OperateProps[],
  maxVisible?: number,
  enableEllipsis: boolean = true
): boolean => {
  return useMemo(() => {
    if (!enableEllipsis || maxVisible === undefined) {
      return false;
    }
    return menu.length > maxVisible;
  }, [menu.length, maxVisible, enableEllipsis]);
};

export default useOperateEllipsis;

