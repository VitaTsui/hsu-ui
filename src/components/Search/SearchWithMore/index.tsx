import React from "react";
import { FormItemProps } from "../../FormItem";
import SearchBase from "../_components/SearchBase";
import { ChakraButtonProps } from "../../Button";
import { SearchPropsWithFilter } from "../_types";

export interface SearchWithMoreProps
  extends Omit<SearchPropsWithFilter, "moreSearchItems"> {
  moreSearchItems: FormItemProps[];
  beforeButtonGroup?: ChakraButtonProps[];
  affterButtonGroup?: ChakraButtonProps[];
}

/**
 * 带更多搜索项的 Search 组件
 * - 将搜索项分为基础项和更多项两组
 * - 初始只显示基础搜索项，点击展开后显示更多项
 * - 适合有大量搜索字段的场景
 */
const SearchWithMore: React.FC<SearchWithMoreProps> = (props) => {
  const { setFilter, ...rest } = props;

  return (
    <SearchBase
      {...rest}
      // SearchWithMore 始终显示所有搜索项
      showAllSearchItems
      showFilter={!!setFilter}
    />
  );
};

export default SearchWithMore;
