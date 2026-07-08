import React, { useCallback, useState } from "react";
import classNames from "classnames";
import styles from "../index.module.scss";
import SearchBase from "../_components/SearchBase";
import { CollapseToggle } from "./_components/CollapseToggle";
import { ChakraButtonProps } from "../../Button";
import { SearchPropsWithFilter } from "../_types";

export interface SearchCollapsibleProps extends SearchPropsWithFilter {
  onCollapseToggle?: (collapse: boolean) => void;
  beforeButtonGroup?: ChakraButtonProps[];
  affterButtonGroup?: ChakraButtonProps[];
}

/**
 * 可折叠模式的 Search 组件
 * - 可以完全折叠/展开整个搜索区域
 * - 通过 defaultExpanded 控制初始展开状态
 * - 适合需要隐藏搜索栏以获得更多展示空间的场景
 */
const SearchCollapsible: React.FC<SearchCollapsibleProps> = (props) => {
  const {
    className,
    defaultExpanded = false,
    onCollapseToggle,
    setFilter,
    ...rest
  } = props;

  // collapse 的语义是反的，所以需要取反 defaultExpanded
  const [collapse, setCollapse] = useState(!defaultExpanded);

  // 处理折叠切换
  const handleCollapseToggle = useCallback(() => {
    setCollapse((prev) => {
      const newCollapse = !prev;
      onCollapseToggle?.(newCollapse);
      return newCollapse;
    });
  }, [onCollapseToggle]);

  return (
    <SearchBase
      {...rest}
      defaultExpanded={defaultExpanded}
      showFilter={!!setFilter}
      className={classNames(className, styles.collapseExpand, {
        [styles.collapse]: collapse,
      })}
      afterForm={
        <CollapseToggle collapse={collapse} onToggle={handleCollapseToggle} />
      }
    />
  );
};

export default SearchCollapsible;
