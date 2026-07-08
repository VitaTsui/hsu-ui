import React from "react";
import SearchBase from "../_components/SearchBase";
import { ChakraButtonProps } from "../../Button";
import { SearchPropsWithFilter } from "../_types";

export interface SearchWithFilterProps extends SearchPropsWithFilter {
  beforeButtonGroup?: ChakraButtonProps[];
  affterButtonGroup?: ChakraButtonProps[];
}

/**
 * 带筛选器设置的 Search 组件
 * - 提供下拉菜单，允许用户动态选择显示哪些搜索项
 * - 用户可以自定义显示的搜索字段
 * - 提供更灵活的搜索体验
 */
const SearchWithFilter: React.FC<SearchWithFilterProps> = (props) => {
  return <SearchBase {...props} showFilter />;
};

export default SearchWithFilter;
