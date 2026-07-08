import { useCallback, useMemo, useEffect, useState } from "react";
import { ColumnsType, ColumnType, ColumnsGroupType, TableProps } from "..";
import { AnyObject } from "antd/es/_util/type";
import { TableRowSelection } from "antd/es/table/interface";
import { ColumnsType as AntColumnsType } from "antd/lib/table";
import { cloneDeep } from "lodash";
import { Tooltip } from "antd";
import Icon from "../../Icon";
import styles from "../index.module.scss";
import { SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import { TablePaginationConfig } from "antd/es/table/interface";
import { FilterValue } from "antd/es/table/interface";
import { get_string_size } from "hsu-utils";
import classNames from "classnames";
import {
  getDepartmentRowSpan,
  HELP_TOOLTIP_CONFIG,
} from "../_utils/tableUtils";
import usePermissions from "../../../hooks/usePermissions";
import { PaginationProps } from "../_components/Pagination";

// measureAlign 列：与表体、autoWidth 标题测量一致，统一按 14px 测量
const MEASURE_ALIGN_FONT_SIZE = 14;
// Canvas measureText 仅返回 advance width，较 DOM 实际渲染偏窄约 1px，补 2px 缓冲避免最宽行被挤压
const MEASURE_ALIGN_BUFFER_PX = 2;
// 单元格左右内边距合计的默认值（默认 --td-padding: 4px 8px），用于把列宽抬到能放下定宽内容块
const MEASURE_ALIGN_CELL_PADDING_PX = 16;

/**
 * 解析 tdPadding（CSS padding 简写）的左右内边距合计；
 * 未传或解析不出时回退默认值（与默认 --td-padding: 4px 8px 一致）。
 */
const getCellHorizontalPadding = (tdPadding?: string): number => {
  if (!tdPadding) return MEASURE_ALIGN_CELL_PADDING_PX;

  const parts = tdPadding
    .trim()
    .split(/\s+/)
    .map((v) => parseFloat(v));
  if (!parts.length || parts.some((v) => Number.isNaN(v))) {
    return MEASURE_ALIGN_CELL_PADDING_PX;
  }

  // CSS 简写：1 值=四边；2/3 值=第 2 个为左右；4 值=右+左
  if (parts.length === 1) return parts[0] * 2;
  if (parts.length === 4) return parts[1] + parts[3];
  return parts[1] * 2;
};

// 计算 measureAlign 列的定宽（取本列所有行展示文本的最大像素宽）
const getMeasureAlignWidth = <T extends AnyObject>(
  column: ColumnType<T>,
  dataSource?: readonly T[]
): number => {
  if (!dataSource?.length) return 0;
  const { measureText, dataIndex } = column;
  const max = dataSource.reduce((acc, record) => {
    const text = measureText
      ? measureText(record)
      : String((dataIndex ? record[dataIndex] : "") ?? "");
    return Math.max(
      acc,
      get_string_size(text, { size: MEASURE_ALIGN_FONT_SIZE }).width
    );
  }, 0);
  return max > 0 ? Math.ceil(max) + MEASURE_ALIGN_BUFFER_PX : 0;
};

interface UseTableColumnsParams<T extends AnyObject> {
  columns?: ColumnsType<T>;
  scroll?: boolean | { y: boolean };
  autoWidth?: boolean;
  dataSource?: TableProps<T>["dataSource"];
  enhanceColumns: (columns?: ColumnsType<T>) => ColumnsType<T> | undefined;
  serialNumberColumn?: boolean;
  pagination?: false | PaginationProps;
  _pageNum: number;
  _pageSize: number;
  order?: { k: string; t: "asc" | "desc" };
  mergeRowDataSource?: readonly T[] | undefined;
  onChange?: TableProps<T>["onChange"];
  onOrderChange?: (order?: { k: string; t: "asc" | "desc" }) => void;
  sorter?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
  cls?: string;
  bordered?: boolean;
  rowSelection?: TableRowSelection<T>;
  expandable?: TableProps<T>["expandable"];
  tdPadding?: string;
}

const useTableColumns = <T extends AnyObject>(
  params: UseTableColumnsParams<T>
): {
  _columns: ColumnsType<T>;
  renderedColumns: ColumnsType<T> | undefined;
  handleTableChange: TableProps<T>["onChange"];
} => {
  const {
    columns = [],
    scroll,
    autoWidth,
    dataSource,
    enhanceColumns,
    serialNumberColumn = false,
    pagination,
    _pageNum,
    _pageSize,
    order,
    mergeRowDataSource,
    onChange,
    onOrderChange,
    sorter,
    ref,
    cls,
    bordered,
    rowSelection,
    expandable,
    tdPadding,
  } = params;
  const { checkPermission } = usePermissions();
  const [tableWidth, setTableWidth] = useState<number | null>(null);

  // 监听表格宽度变化
  useEffect(() => {
    if (ref?.current && cls) {
      const tableElement = document.querySelector(
        `.${cls} .ant-table`
      ) as HTMLElement;
      if (tableElement) {
        const updateWidth = () => {
          const width = tableElement.offsetWidth;
          if (width > 0) {
            setTableWidth(width);
          }
        };
        updateWidth();
        const resizeObserver = new ResizeObserver(updateWidth);
        resizeObserver.observe(tableElement);
        return () => resizeObserver.disconnect();
      }
    }
  }, [ref, cls]);

  // 处理列的基础设置（权限、宽度、排序等）
  const _columns = useMemo(() => {
    const cloned = cloneDeep(columns);

    const newColumns = cloned
      ?.map((item, idx) => {
        return {
          ...item,
          width: !item.width ? "100%" : item.width,
          key: item.key ?? item.dataIndex ?? `col_${idx}`,
          hidden: !checkPermission(item.hasPermi) || item.hidden,
          ellipsis: typeof item.ellipsis === "boolean" ? item.ellipsis : true,
        };
      })
      ?.sort((a, b) => (a?.sort ?? 0) - (b?.sort ?? 0))
      ?.map((item) => {
        if (
          autoWidth &&
          item.width === "100%" &&
          scroll &&
          (typeof item.title === "string" || typeof item.title === "number")
        ) {
          let { width: titleWidth } = get_string_size(item.title?.toString(), {
            size: 14,
          });
          if (item.help) {
            titleWidth += 22;
          }

          const dataIndexWidth = item.dataIndex
            ? dataSource?.reduce((acc, cur) => {
                return Math.max(
                  acc,
                  get_string_size(cur[item.dataIndex!]?.toString(), {
                    size: 14,
                  }).width
                );
              }, 0) ?? 0
            : 0;
          item.width = Math.max(titleWidth, dataIndexWidth) + 32;
        }

        // measureAlign 列：列宽须容得下最宽行的定宽内容块 + 单元格左右内边距，
        // 否则出现超长值（如 +3357.52%）时内容会被列宽截断；声明的 width 只作下限。
        if (item.measureAlign && typeof item.width === "number") {
          const measured = getMeasureAlignWidth(
            item as ColumnType<T>,
            dataSource
          );
          if (measured > 0) {
            item.width = Math.max(
              item.width,
              measured + getCellHorizontalPadding(tdPadding)
            );
          }
        }

        return item;
      })
      ?.map((item) => {
        return {
          ...item,
          width: item.hidden ? 0.01 : item.width,
          className: classNames(item.className, {
            [styles.hidden]: item.hidden,
          }),
          hidden: undefined,
        };
      });

    return newColumns;
  }, [autoWidth, columns, dataSource, checkPermission, scroll, tdPadding]);

  // 渲染列标题
  const renderColumnTitle = useCallback(
    (column: ColumnType<T> | ColumnsGroupType<T>) => {
      const titleContent = column?.titleSort
        ? column.titleSort
        : column.renderTitle
        ? column.renderTitle(column.title || "")
        : column.title;

      if (!column.help) {
        return titleContent;
      }

      return (
        <>
          {titleContent}
          <Tooltip title={column.help} {...HELP_TOOLTIP_CONFIG}>
            <Icon
              icon="material-symbols:help"
              className={styles.help}
              fontSize={16}
              color="#999999"
            />
          </Tooltip>
        </>
      );
    },
    []
  );

  const renderColumns = useCallback(
    (columns?: ColumnsType<T>): AntColumnsType<T> | undefined => {
      // 先增强列配置，为 ellipsis 列添加自动 Tooltip
      let enhancedColumns = enhanceColumns(columns);

      if (serialNumberColumn && !_columns.find((v) => !!v.children)) {
        enhancedColumns?.unshift({
          title: "序号",
          dataIndex: "serialNumber",
          width: 60,
          align: "center",
          render: (_, __, index) => {
            return pagination
              ? (_pageNum - 1) * _pageSize + (index + 1)
              : index + 1;
          },
          fixedWidth: true,
        });
      }

      // 处理 fixedWidth 列的宽度分配（在 enhancedColumns 基础上）
      if (enhancedColumns && tableWidth && tableWidth > 0) {
        // 检查是否有 fixedWidth 为 true 的列
        const hasFixedWidth = enhancedColumns.some(
          (col) => col.fixedWidth === true
        );

        if (hasFixedWidth) {
          // 过滤出可见列（排除 hidden 列，即宽度为 0.01 的列）
          const visibleColumns = enhancedColumns.filter(
            (col) => typeof col.width === "number" && col.width > 0.01
          );

          // 检查所有可见列是否都有宽度（非"100%"）
          const allHaveWidth = visibleColumns.every(
            (col) =>
              col.width && col.width !== "100%" && typeof col.width === "number"
          );

          if (allHaveWidth && visibleColumns.length > 0) {
            // 计算所有可见列的宽度总和
            const totalWidth = visibleColumns.reduce((sum, col) => {
              const width = typeof col.width === "number" ? col.width : 0;
              return sum + width;
            }, 0);

            // 如果总和小于表格宽度，按比例分配给非 fixedWidth 的可见列
            // 当 bordered 为 true 时，tableWidth 需要减去 2（边框宽度）
            // 当有 rowSelection 时，tableWidth 需要减去 48（选择列宽度）
            let adjustedTableWidth = bordered ? tableWidth - 2 : tableWidth;
            if (rowSelection) {
              adjustedTableWidth -= 48;
            }
            if (expandable) {
              adjustedTableWidth -= 48;
            }
            if (totalWidth < adjustedTableWidth) {
              const extraWidth = adjustedTableWidth - totalWidth;
              const nonFixedWidthColumns = visibleColumns.filter(
                (col) => col.fixedWidth !== true
              );
              const nonFixedWidthTotal = nonFixedWidthColumns.reduce(
                (sum, col) => {
                  const width = typeof col.width === "number" ? col.width : 0;
                  return sum + width;
                },
                0
              );

              if (nonFixedWidthTotal > 0) {
                // 按比例分配多余宽度
                enhancedColumns = enhancedColumns?.map((col) => {
                  // hidden 列（宽度为 0.01）或 fixedWidth 列保持原宽度
                  const currentWidth =
                    typeof col.width === "number" ? col.width : 0;
                  if (col.fixedWidth === true || currentWidth <= 0.01) {
                    return col;
                  }
                  const ratio = currentWidth / nonFixedWidthTotal;
                  const additionalWidth = extraWidth * ratio;
                  return {
                    ...col,
                    width: +(currentWidth + additionalWidth).toFixed(2),
                  };
                });
              }
            }
          }
        }
      }

      return enhancedColumns?.map((column) => {
        const orderKey = column.orderKey || column.dataIndex;
        const isOrderColumn = orderKey && orderKey !== "serialNumber";

        // measureAlign 列：把展示内容包进定宽右对齐块（块随列 align 居中），各行右边缘对齐。
        // 不适用于 render 返回 { children, rowSpan } 这类 RenderedCell 的合并单元格场景。
        let render = column.render;
        if (column.measureAlign) {
          const cellWidth = getMeasureAlignWidth(
            column as ColumnType<T>,
            dataSource
          );
          if (cellWidth > 0) {
            const innerRender = column.render;
            render = (value: unknown, record: T, index: number) => (
              <span
                style={{
                  display: "inline-block",
                  width: cellWidth,
                  textAlign: "right",
                }}
              >
                {
                  (innerRender
                    ? innerRender(value, record, index)
                    : value) as React.ReactNode
                }
              </span>
            );
          }
        }

        return {
          showSorterTooltip: false,
          sorter:
            typeof sorter === "boolean" ? sorter : isOrderColumn ? true : false,
          ...column,
          orderKey,
          title: renderColumnTitle(column),
          render,
          children: column?.children
            ? renderColumns(column.children)
            : undefined,
          onCell: (record, index) => {
            const cell = column?.onCell?.(record, index);
            let rowSpan = 1;

            if (column.mergeRow) {
              rowSpan = getDepartmentRowSpan(
                record as unknown as Record<string, unknown>,
                index as number,
                mergeRowDataSource as unknown as Record<string, unknown>[],
                column.dataIndex as string
              );
            }

            return {
              rowSpan,
              ...cell,
            };
          },
          sortOrder:
            order?.k === orderKey
              ? order?.t === "desc"
                ? "descend"
                : "ascend"
              : undefined,
        };
      });
    },
    [
      enhanceColumns,
      serialNumberColumn,
      _columns,
      tableWidth,
      pagination,
      _pageNum,
      _pageSize,
      bordered,
      rowSelection,
      expandable,
      sorter,
      renderColumnTitle,
      order,
      mergeRowDataSource,
      dataSource,
    ]
  );

  // 缓存渲染后的列配置
  const renderedColumns = useMemo(
    () => renderColumns(cloneDeep(_columns)),
    [renderColumns, _columns]
  );

  // 处理排序变化
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
      extra: TableCurrentDataSource<T>
    ) => {
      onChange?.(pagination, filters, sorter, extra);
      const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;
      const { column, order: _order } = sorterResult;
      const columnOrderKey = (column as ColumnType<T>)?.orderKey;
      const k = columnOrderKey ?? order?.k;

      if (!k || !_order) {
        onOrderChange?.(undefined);
      } else {
        const t = _order === "ascend" ? "asc" : "desc";

        onOrderChange?.({ k, t });
      }
    },
    [onChange, onOrderChange, order]
  );

  return {
    _columns: _columns as ColumnsType<T>,
    renderedColumns: renderedColumns as ColumnsType<T> | undefined,
    handleTableChange,
  };
};

export default useTableColumns;
