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

/** Context exposed to variant extension rendering (e.g. the advanced filters drawer) */
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
  /** Advanced filters mode: search items hide their label, and the expand button shows as "advanced filters" */
  advancedFilters?: boolean;
  /** Whether to render FilterDropdown (the filter settings dropdown) */
  showFilter?: boolean;
  /** Extra content after the form area but inside the container (e.g. the collapse toggle); rendered only when permitted */
  afterForm?: ReactNode;
  /** Extra content outside the container (e.g. the advanced filters drawer); rendered only when permitted */
  renderOutside?: (ctx: SearchBaseContext) => ReactNode;
}

/**
 * Base implementation shared by all Search variants:
 * form rendering, column layout, expand/collapse, button group, permission control.
 * Variants are only responsible for their own differences (filter, collapse toggle, advanced filters drawer, etc.).
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

  // Precompute grouping by column (used to align label widths within the same column), avoiding repeated per-item filtering inside map
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
