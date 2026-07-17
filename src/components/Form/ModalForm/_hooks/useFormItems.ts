import { useMemo } from "react";
import { FormItemProps } from "../../../FormItem";
import useLabelWidth from "../../../../hooks/useLabelWidth";
import { useColumnFormItems } from "./useColumnFormItems";

/**
 * Handle form item layout and label width calculation
 * @param formItems Form item configuration
 * @param layout Layout mode
 * @param columnNum Column count
 * @returns Processed form items
 */
export const useFormItems = (
  formItems: FormItemProps[] | Record<string, FormItemProps[]>,
  layout?: "horizontal" | "vertical",
  columnNum: number = 2
) => {
  const [labelWidth, getLabelWidth] = useLabelWidth(
    Array.isArray(formItems) ? formItems : Object.values(formItems ?? {}).flat()
  );
  const columnFormItems = useColumnFormItems(columnNum);

  const _formItems = useMemo(() => {
    const _formItems: Record<string, FormItemProps[]> = Object.assign(
      {},
      Array.isArray(formItems) ? { "": formItems } : formItems
    );
    Object.keys(_formItems)?.forEach((key) => {
      _formItems[key]?.forEach((item, idx) => {
        if (layout === "horizontal") {
          item.labelWidth = getLabelWidth(
            columnFormItems(_formItems[key], idx)
          );
        } else {
          item.labelWidth = labelWidth;
        }
      });
    });
    return _formItems;
  }, [formItems, layout, getLabelWidth, columnFormItems, labelWidth]);

  return _formItems;
};
