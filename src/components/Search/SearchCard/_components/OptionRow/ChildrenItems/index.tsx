import React, { useMemo, useCallback, memo } from "react";
import { array_is_includes, Equal } from "hsu-utils";
import classNames from "classnames";
import { ElementItem, SearchCardOption } from "..";
import { updateRealValue } from "../../../_utils";
import styles from "../../../index.module.scss";

interface ChildrenItemsProps {
  parentItem: ElementItem;
  option: SearchCardOption;
  value: Record<string, unknown>;
  setValue: (data: Record<string, unknown>) => void;
}

export const ChildrenItems: React.FC<ChildrenItemsProps> = memo((props) => {
  const { parentItem, option, value, setValue } = props;

  // Name of the child items; defaults to the parent item's name with a "Children" suffix
  const childrenName = useMemo(
    () => `${parentItem.name || option.name}Children`,
    [parentItem.name, option.name]
  );

  // Determine whether child items support multi-select
  const isChildrenMultiple = !!parentItem.childrenMultiple;

  // Optimization: cache the child item click handler
  const createChildClickHandler = useCallback(
    (childItem: ElementItem) => {
      return () => {
        if (isChildrenMultiple) {
          // Multi-select mode: multiple child items can be selected at once
          const currentValue = (value[childrenName] as unknown[]) || [];
          const newValues = array_is_includes(currentValue, [childItem.value])
            ? currentValue.filter((v) => !Equal.ValEqual(v, childItem.value))
            : [...currentValue, childItem.value];

          const newValue = {
            ...value,
            [childrenName]: newValues,
          };

          // Update the real return value
          updateRealValue(value, option.name, newValue);
          setValue(newValue);
        } else {
          // Single-select mode: only one child item can be selected at a time
          const newValue = {
            ...value,
            [childrenName]: Equal.ValEqual(childItem.value, value[childrenName])
              ? ""
              : childItem.value,
          };

          // Update the real return value
          updateRealValue(value, option.name, newValue);
          setValue(newValue);
        }
      };
    },
    [isChildrenMultiple, value, childrenName, option.name, setValue]
  );

  if (!parentItem.children || parentItem.children.length === 0) {
    return null;
  }

  return (
    <div className={styles.childrenItems}>
      {parentItem.children?.map((childItem) => {
        // Determine whether the child item is selected
        const isChildSelected = isChildrenMultiple
          ? array_is_includes((value[childrenName] as unknown[]) || [], [
              childItem.value,
            ])
          : value?.[childrenName] === childItem.value;

        return (
          <span
            key={String(childItem.value)}
            className={classNames({
              [styles.active]: isChildSelected,
            })}
            onClick={createChildClickHandler(childItem)}
          >
            {childItem.label}
          </span>
        );
      })}
    </div>
  );
});

ChildrenItems.displayName = "ChildrenItems";
