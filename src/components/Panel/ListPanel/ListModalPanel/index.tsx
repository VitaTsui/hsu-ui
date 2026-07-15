import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Search, {
  SearchModeKeys,
  SearchModePropsMap,
} from "../../../Search";
import Table, { ColumnsType, TableProps } from "../../../Table";

import { ChakraButtonProps as BasicButtonProps } from "../../../Button";
import { TabBarProps } from "../../../TabBar";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { cloneDeep } from "lodash";
import styles from "./index.module.scss";
import usePermissions from "../../../../hooks/usePermissions";
import Modal, { ModalProps } from "../../../Modal";
import ToolBar from "../_components/ToolBar";
import ColumnMgt from "../_components/ColumnMgt";

interface ButtonProps extends Omit<BasicButtonProps, "children" | "title"> {
  title?: ReactNode;
  children?: ReactNode;
}

interface TableTools {
  onTableRefresh?: () => void;
  columnMgt?: IColumnMgt;
}

export interface ListModalPanelTabelProps extends Omit<TableProps, "title"> {
  /** 透传给内部 Table 的 key，用于在异构列集切换时强制重挂载表格 */
  key?: React.Key;
  title?: string;
  buttonGroup?: ButtonProps[];
  tabBarProps?: TabBarProps;
  tableTools?: TableTools;
  tableContainerClassName?: string;
  tips?: ReactNode;
  otherTool?: ReactNode;
}

interface ColumnMgtDataSource {
  hidden: boolean;
  title: string;
  dataIndex: string;
  sort: number;
  width?: number;
  ellipsis?: boolean;
}

export interface IColumnMgt {
  columnCount?: {
    max?: number;
    min?: number;
  };
  fixedDisplay?: string[];
  fixedPosition?: string[];
  onSelectionChange?: (
    selectedDataIndexes: string[],
    dataSource: Array<ColumnMgtDataSource>,
  ) => void;
}

export interface ListModalPanelProps<
  T extends SearchModeKeys = "Default",
> extends ModalProps {
  modalClassName?: string;
  className?: string;
  searchProps?: SearchModePropsMap[T];
  /** Search 组件模式：default-基础 | Advanced-高级筛选 | Collapsible-可折叠 | WithFilter-带筛选器 | WithMore-带更多项 | Card-卡片式 */
  searchMode?: T;
  tableProps?: ListModalPanelTabelProps;
  hasPermi?: string[];
  extraContent?: ReactNode;
}

const ListModalPanel: React.FC<ListModalPanelProps<SearchModeKeys>> = (
  props,
) => {
  const {
    modalClassName,
    className,
    searchProps,
    searchMode = "Default",
    tableProps = {},
    hasPermi,
    extraContent,
    ...modalConfig
  } = props;
  const {
    title,
    buttonGroup,
    className: tableClassName,
    columns,
    tabBarProps,
    tableTools = {},
    tableContainerClassName,
    tips,
    otherTool,
    // 异构列集切换时用于强制重挂载表格的 key；显式提取，避免随 ...tableConfig
    // 展开进 JSX 触发 React "key prop being spread" 警告
    key: tableInstanceKey,
    ...tableConfig
  } = tableProps;
  const { columnMgt } = tableTools;
  const { permitted } = usePermissions(hasPermi);
  const [_columns, setColumns] = useState<ColumnsType | undefined>(columns);
  const [showColumnMgt, setShowColumnMgt] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (modalConfig.open) {
      setIsFullscreen(false);
    }
  }, [modalConfig.open]);

  useEffect(() => {
    if (columnMgt && columns?.length) {
      const _columns = columns?.map((col) => {
        return {
          ...col,
          sort: !col?.dataIndex
            ? typeof col.sort === "number"
              ? col.sort
              : 999
            : 0,
        };
      });

      setColumns(_columns);
    } else {
      setColumns(columns);
    }
  }, [columnMgt, columns]);

  // 根据 searchMode 渲染对应的 Search 组件
  const SearchComponent = useMemo(() => {
    const searchClassName = classNames(searchProps?.className, styles.search);

    switch (searchMode) {
      case "Advanced":
        return (
          <Search.Advanced
            baseWidth={1400}
            {...(searchProps as SearchModePropsMap["Advanced"])}
            className={searchClassName}
          />
        );
      case "Collapsible":
        return (
          <Search.Collapsible
            baseWidth={1400}
            {...(searchProps as SearchModePropsMap["Collapsible"])}
            className={searchClassName}
          />
        );
      case "WithFilter":
        return (
          <Search.WithFilter
            baseWidth={1400}
            {...(searchProps as SearchModePropsMap["WithFilter"])}
            className={searchClassName}
          />
        );
      case "WithMore":
        return (
          <Search.WithMore
            baseWidth={1400}
            {...(searchProps as SearchModePropsMap["WithMore"])}
            className={searchClassName}
          />
        );
      case "Card":
        return (
          <Search.Card
            {...(searchProps as SearchModePropsMap["Card"])}
            className={searchClassName}
          />
        );
      default:
        return (
          <Search
            baseWidth={1400}
            {...(searchProps as SearchModePropsMap["Default"])}
            className={searchClassName}
          />
        );
    }
  }, [searchMode, searchProps]);

  if (!permitted) {
    return null;
  }

  return (
    <>
      <Modal
        {...modalConfig}
        width={isFullscreen ? "100vw" : (modalConfig.width ?? 1400)}
        {...(isFullscreen ? { full: true } : {})}
        className={classNames(styles.modal, modalClassName, {
          [styles.fullscreen]: isFullscreen,
        })}
        titleButtonGroup={[
          {
            type: "text",
            icon: isFullscreen ? (
              <FullscreenExitOutlined />
            ) : (
              <FullscreenOutlined />
            ),
            title: isFullscreen ? "退出全屏" : "全屏",
            onClick: () => setIsFullscreen((v) => !v),
          },
          ...(modalConfig.titleButtonGroup ?? []),
        ]}
      >
        <div className={classNames(styles.ListModalPanel, className)}>
          {extraContent}
          {SearchComponent}
          <div
            className={classNames(
              styles.tableContainer,
              tableContainerClassName,
            )}
          >
            <ToolBar
              columns={columns}
              title={title}
              tabBarProps={tabBarProps}
              buttonGroup={buttonGroup}
              tableTools={tableTools}
              setShowColumnMgt={setShowColumnMgt}
              tips={tips}
              otherTool={otherTool}
            />
            <Table
              key={tableInstanceKey}
              className={`${styles.table} ${tableClassName ?? ""}`}
              {...{
                scroll: true,
                serialNumberColumn: true,
                bordered: true,
                fillPanel: true,
                ...tableConfig,
                columns: _columns,
              }}
            />
          </div>
        </div>
      </Modal>
      <ColumnMgt
        open={showColumnMgt}
        onClose={() => setShowColumnMgt(false)}
        onOk={(columns) => setColumns(cloneDeep(columns))}
        columns={_columns}
        defaultColumns={columns}
        onSelectionChange={columnMgt?.onSelectionChange}
        {...columnMgt}
      />
    </>
  );
};

export default ListModalPanel;
