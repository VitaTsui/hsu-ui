import React from "react";
import classNames from "classnames";
import styles from "../index.module.scss";
import SearchBase from "../_components/SearchBase";
import { AdvancedFiltersDrawer } from "./_components/AdvancedFiltersDrawer";
import { ChakraButtonProps } from "../../Button";
import { DrawerFormProps } from "../../Form/DrawerForm";
import { SearchPropsWithFilter } from "../_types";

export interface SearchAdvancedProps extends SearchPropsWithFilter {
  advancedFiltersProps?: DrawerFormProps;
  beforeButtonGroup?: ChakraButtonProps[];
  affterButtonGroup?: ChakraButtonProps[];
}

/**
 * 高级筛选模式的 Search 组件
 * - 不显示标签（label）
 * - 使用抽屉形式展示更多筛选项
 * - 更适合复杂的筛选场景
 */
const SearchAdvanced: React.FC<SearchAdvancedProps> = (props) => {
  const {
    className,
    advancedFiltersProps,
    setFilter,
    minLabelWidth,
    ...rest
  } = props;

  return (
    <SearchBase
      {...rest}
      minLabelWidth={minLabelWidth}
      advancedFilters
      showFilter={!!setFilter}
      className={classNames(className, styles.advancedFilters)}
      renderOutside={(ctx) =>
        ctx.setExpand && (
          <AdvancedFiltersDrawer
            expand={ctx.expand}
            setExpand={ctx.setExpand}
            searchItems={ctx.processedSearchItems}
            form={ctx.form}
            getLabelWidth={ctx.getLabelWidth}
            minLabelWidth={minLabelWidth}
            onSearchClick={ctx.onSearchClick}
            onResetClick={ctx.onResetClick}
            advancedFiltersProps={advancedFiltersProps}
          />
        )
      }
    />
  );
};

export default SearchAdvanced;
