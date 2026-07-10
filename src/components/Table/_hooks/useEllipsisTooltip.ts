import { useCallback } from "react";
import { ColumnsType, EllipsisTooltipConfig } from "..";
import { AnyObject } from "antd/es/_util/type";
import TextEllipsis from "../../TextEllipsis";
import React from "react";

/**
 * 为设置了 ellipsis 且没有自定义 render 的列自动添加溢出检测和 Tooltip
 */
const useEllipsisTooltip = <T extends AnyObject>(
  tooltipConfig?: EllipsisTooltipConfig,
) => {
  const enhanceColumns = useCallback(
    (columns?: ColumnsType<T>): ColumnsType<T> | undefined => {
      return columns?.map((column) => {
        // 递归处理子列
        if (column.children) {
          return {
            ...column,
            children: enhanceColumns(column.children),
          };
        }

        // 如果设置了 ellipsis 且没有自定义 render
        if (column.ellipsis && !column.render && column.dataIndex) {
          return {
            ...column,
            render: (text) => {
              // 获取实际的显示值
              const displayValue =
                typeof text === "string" || typeof text === "number"
                  ? text
                  : String(text ?? "");

              // 不传 width：由 TextEllipsis 实测单元格实际渲染宽度作为 Tooltip 宽度
              // （声明的列宽经 fixedWidth 比例分配后与实际宽度并不一致）
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
