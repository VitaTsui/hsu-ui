import React from "react";
import SearchCard, { SearchCardProps } from "./SearchCard";
import SearchAdvanced from "./SearchAdvanced";
import SearchCollapsible from "./SearchCollapsible";
import SearchWithFilter from "./SearchWithFilter";
import SearchWithMore from "./SearchWithMore";
import SearchBase from "./_components/SearchBase";
import { BaseSearchProps } from "./_types";
import { ChakraButtonProps } from "../Button";

export interface SearchProps extends BaseSearchProps {
  beforeButtonGroup?: ChakraButtonProps[];
  affterButtonGroup?: ChakraButtonProps[];
}

interface SearchFC extends React.FC<SearchProps> {
  Card: React.FC<SearchCardProps>;
  Advanced: typeof SearchAdvanced;
  Collapsible: typeof SearchCollapsible;
  WithFilter: typeof SearchWithFilter;
  WithMore: typeof SearchWithMore;
}

// 导出所有可用的 Search 模式键名
export type SearchModeKeys =
  | "Default"
  | keyof Omit<SearchFC, keyof React.FC<SearchProps>>;

// 导出 Search 模式映射类型
export type SearchModePropsMap = {
  Default: SearchProps;
  Card: React.ComponentProps<SearchFC["Card"]>;
  Advanced: React.ComponentProps<SearchFC["Advanced"]>;
  Collapsible: React.ComponentProps<SearchFC["Collapsible"]>;
  WithFilter: React.ComponentProps<SearchFC["WithFilter"]>;
  WithMore: React.ComponentProps<SearchFC["WithMore"]>;
};

/**
 * 基础 Search 组件
 * - 标准的搜索表单布局，自适应列数与展开/收起
 */
const Search: SearchFC = (props) => {
  return <SearchBase {...props} />;
};

Search.Card = SearchCard;
Search.Advanced = SearchAdvanced;
Search.Collapsible = SearchCollapsible;
Search.WithFilter = SearchWithFilter;
Search.WithMore = SearchWithMore;

export default Search;
