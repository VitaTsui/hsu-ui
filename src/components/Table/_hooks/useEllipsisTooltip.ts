import { useCallback } from "react";
import { ColumnsType, EllipsisTooltipConfig } from "..";
import { AnyObject } from "antd/es/_util/type";
import TextEllipsis from "../../TextEllipsis";
import React from "react";

/**
 * Automatically adds overflow detection and a Tooltip for columns that set ellipsis and have no custom render
 */
const useEllipsisTooltip = <T extends AnyObject>(
  tooltipConfig?: EllipsisTooltipConfig,
) => {
  const enhanceColumns = useCallback(
    (columns?: ColumnsType<T>): ColumnsType<T> | undefined => {
      return columns?.map((column) => {
        // Recursively process child columns
        if (column.children) {
          return {
            ...column,
            children: enhanceColumns(column.children),
          };
        }

        // If ellipsis is set and there is no custom render
        if (column.ellipsis && !column.render && column.dataIndex) {
          return {
            ...column,
            render: (text) => {
              // Get the actual display value
              const displayValue =
                typeof text === "string" || typeof text === "number"
                  ? text
                  : String(text ?? "");

              // Do not pass width: let TextEllipsis measure the cell's actual rendered width as the Tooltip width
              // (the declared column width, after fixedWidth proportional allocation, does not match the actual width)
              return React.createElement(TextEllipsis, {
                tooltipConfig: tooltipConfig,
                children: displayValue,
                ellipsisPosition:
                  column.ellipsisPosition ?? tooltipConfig?.ellipsisPosition,
                key: text,
              });
            },
          };
        }

        return column;
      });
    },
    [tooltipConfig],
  );

  return { enhanceColumns };
};

export default useEllipsisTooltip;
