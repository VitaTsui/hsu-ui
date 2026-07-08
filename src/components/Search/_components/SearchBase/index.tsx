import React, { CSSProperties, ReactNode, useMemo } from "react";
import { Form as AntdForm, FormInstance } from "antd";
import classNames from "classnames";
import FormItem, { FormItemProps } from "../../../FormItem";
import type useLabelWidth from "../../../../hooks/useLabelWidth";
import styles from "../../index.module.scss";
import { useSearchCommon } from "../../_hooks";
import { ButtonGroup } from "../ButtonGroup";
import { SearchButtons } from "../SearchButtons";
import { ExpandButton } from "../ExpandButton";
import { FilterDropdown } from "../FilterDropdown";
import { SearchPropsWithFilter } from "../../_types";

/** 暴露给变体扩展渲染（如高级筛选抽屉）的上下文 */
export interface SearchBaseContext {
  form: FormInstance;
  expand: boolean;
  setExpand?: (expand: boolean) => void;
  processedSearchItems: FormItemProps[];
  getLabelWidth: ReturnType<typeof useLabelWidth>[1];
  onSearchClick: () => void;
  onResetClick: () => void;
}

export interface SearchBaseProps extends SearchPropsWithFilter {
  /** 高级筛选模式：搜索项不显示 label，展开按钮显示为"高级筛选" */
  advancedFilters?: boolean;
  /** 是否渲染 FilterDropdown（筛选器设置下拉） */
  showFilter?: boolean;
  /** 表单区域之后、容器之内的附加内容（如折叠开关），仅在有权限时渲染 */
  afterForm?: ReactNode;
  /** 容器之外的附加内容（如高级筛选抽屉），仅在有权限时渲染 */
  renderOutside?: (ctx: SearchBaseContext) => ReactNode;
}

/**
 * Search 各变体共享的基础实现：
 * 表单渲染、列布局、展开/收起、按钮组、权限控制。
 * 变体只负责自身差异（筛选器、折叠开关、高级筛选抽屉等）。
 */
const SearchBase: React.FC<SearchBaseProps> = (props) => {
  const {
    searchItems = [],
    moreSearchItems = [],
    className,
    onSearch,
    onReset,
    externalForm,
    hasPermi,
    columnNum = 4,
    beforeButtonGroup,
    affterButtonGroup,
    searchData,
    minLabelWidth,
    defaultExpanded = false,
    onExpandChange,
    autoAdaptWidth = true,
    baseWidth,
    onValuesChange,
    searchDisabled = false,
    showAllSearchItems = false,
    searchText,
    resetText,
    onFilterChange,
    columnOffsetWidth = 0,
    advancedFilters = false,
    showFilter = false,
    afterForm,
    renderOutside,
  } = props;

  const [form] = AntdForm.useForm(externalForm);

  const {
    containerRef,
    buttonGroupRef,
    cls,
    getLabelWidth,
    processedSearchItems,
    setSearchItems,
    currentSearchItems,
    totalColumnNum,
    expand,
    setExpand,
    toggleExpand,
    showExpandButton,
    onSearchClick,
    onResetClick,
    shouldRender,
    permitted,
  } = useSearchCommon({
    form,
    searchItems,
    moreSearchItems,
    searchData,
    hasPermi,
    beforeButtonGroup,
    affterButtonGroup,
    columnNum,
    autoAdaptWidth,
    defaultExpanded,
    onExpandChange,
    showAllSearchItems,
    minLabelWidth,
    baseWidth,
    onSearch,
    onReset,
    columnOffsetWidth,
  });

  // 按列分组预计算（用于对齐同列 label 宽度），避免在 map 中逐项重复 filter
  const columnGroups = useMemo(() => {
    const groups: FormItemProps[][] = Array.from(
      { length: totalColumnNum },
      () => []
    );
    currentSearchItems.forEach((item, idx) => {
      groups[idx % totalColumnNum].push(item);
    });
    return groups;
  }, [currentSearchItems, totalColumnNum]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <div
        ref={containerRef}
        className={classNames(styles.Search, className)}
        style={
          {
            "--column-number": totalColumnNum,
            "--column-offset-width": `${columnOffsetWidth}px`,
          } as CSSProperties
        }
      >
        <div
          className={classNames(styles.searchOption, styles[expand.toString()])}
        >
          <AntdForm
            form={form}
            className={classNames(styles.option, cls)}
            onValuesChange={onValuesChange}
          >
            {permitted &&
              currentSearchItems.map((item, idx) => (
                <FormItem
                  {...item}
                  key={item.name}
                  className={classNames(styles.item, item.className, {
                    [styles.unFill]: item.width !== undefined,
                  })}
                  label={advancedFilters ? undefined : item.label}
                  labelWidth={
                    advancedFilters || item.width !== undefined
                      ? undefined
                      : getLabelWidth(
                          columnGroups[idx % totalColumnNum],
                          undefined,
                          minLabelWidth
                        )
                  }
                />
              ))}
            {(beforeButtonGroup?.length ||
              affterButtonGroup?.length ||
              permitted) && (
              <ButtonGroup
                beforeButtonGroup={beforeButtonGroup}
                affterButtonGroup={affterButtonGroup}
                expandButton={
                  <ExpandButton
                    expand={expand}
                    toggleExpand={toggleExpand}
                    advancedFilters={advancedFilters}
                    showExpandButton={showExpandButton}
                    showAllSearchItems={
                      showAllSearchItems || !!moreSearchItems?.length
                    }
                  />
                }
                permitted={permitted}
                ref={buttonGroupRef}
              >
                {currentSearchItems.length > 0 && (
                  <SearchButtons
                    onSearch={onSearchClick}
                    onReset={onResetClick}
                    searchDisabled={searchDisabled}
                    searchText={searchText}
                    resetText={resetText}
                  />
                )}
                {showFilter && (
                  <FilterDropdown
                    searchItems={processedSearchItems}
                    originalSearchItems={searchItems}
                    setSearchItems={setSearchItems}
                    onFilterChange={onFilterChange}
                  />
                )}
              </ButtonGroup>
            )}
          </AntdForm>
        </div>
        {permitted && afterForm}
      </div>
      {permitted &&
        renderOutside?.({
          form,
          expand,
          setExpand,
          processedSearchItems,
          getLabelWidth,
          onSearchClick,
          onResetClick,
        })}
    </>
  );
};

export default SearchBase;
