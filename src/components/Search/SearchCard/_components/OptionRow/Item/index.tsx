import React, { useState, useMemo, useCallback, memo } from "react";
import { array_is_includes, Equal } from "hsu-utils";
import classNames from "classnames";
import { Tooltip } from "antd";
import Icon from "../../../../../Icon";
import { ElementItem, SearchCardOption } from "..";
import { updateRealValue } from "../../../_utils";
import styles from "../../../index.module.scss";

interface ItemProps {
  item: ElementItem;
  idx: number;
  option: SearchCardOption;
  value: Record<string, unknown>;
  setValue: (data: Record<string, unknown>) => void;
}

export const Item: React.FC<ItemProps> = memo((props) => {
  const { item, idx, option, value, setValue } = props;
  const [lastElementValue, setLastElementValue] = useState<unknown>(undefined);

  // Optimization: cache the active state calculation
  const isActive = useMemo(() => {
    return option.multiple
      ? array_is_includes((value[option.name] as unknown[]) || [], [item.value])
      : value?.[option.name] === item.value;
  }, [option.multiple, option.name, value, item.value]);

  // Optimization: cache the click handler
  const handleClick = useCallback(() => {
    try {
      if (option.multiple) {
        const currentValue = (value[option.name] as unknown[]) || [];
        // Check whether it was previously selected
        const wasSelected = array_is_includes(currentValue, [item.value]);
        const newValues = wasSelected
          ? currentValue.filter((v) => !Equal.ValEqual(v, item.value))
          : [...currentValue, item.value];

        // Prepare the new value object
        const newValue: Record<string, unknown> = {
          ...value,
          [option.name]: newValues,
        };

        // If deselected and it has children, clear the children's selection
        const hasChildren = item.children && item.children.length > 0;
        if (wasSelected && hasChildren) {
          const childrenName = `${item.name || option.name}Children`;
          newValue[childrenName] = item.childrenMultiple ? [] : "";
        }

        // Update the real return value
        updateRealValue(value, option.name, newValue);

        setValue(newValue);
      } else {
        // Check whether it was previously selected
        const wasSelected = Equal.ValEqual(item.value, value[option.name]);

        // Prepare the new value object
        const newValue: Record<string, unknown> = {
          ...value,
          [option.name]: wasSelected ? "" : item.value,
        };

        // Clear the selection state of all child items
        if (!wasSelected) {
          // Clear all child item selection states
          option.items?.forEach((parentItem) => {
            if (parentItem.children && parentItem.children.length > 0) {
              const parentChildrenName = `${
                parentItem.name || option.name
              }Children`;
              newValue[parentChildrenName] = parentItem.childrenMultiple
                ? []
                : "";
            }
          });
        }

        // Update the real return value
        updateRealValue(value, option.name, newValue);

        setValue(newValue);
      }
    } catch {
      void 0;
    }
  }, [item, option, value, setValue]);

  if (item?.element) {
    const { label, name } = item;
    let { element } = item;

    element = {
      ...element,
      props: {
        ...element.props,
        value: option.multiple
          ? array_is_includes((value[name ?? option.name] as unknown[]) || [], [
              lastElementValue,
            ])
            ? lastElementValue
            : undefined
          : Equal.ValEqual(lastElementValue, value[name ?? option.name])
          ? value[name ?? option.name]
          : undefined,
        onChange: (e: React.ChangeEvent) => {
          if (option.multiple) {
            const currentValue = (
              (value[name ?? option.name] as unknown[]) || []
            ).filter((v) => !Equal.ValEqual(v, lastElementValue));

            const newValue = {
              ...value,
              [name ?? option.name]: e ? [...currentValue, e] : currentValue,
            };

            // Update the real return value
            updateRealValue(value, option.name, newValue);

            setValue(newValue);
            setLastElementValue(e);
          } else {
            const newValue = {
              ...value,
              [name ?? option.name]: e ?? "",
            };

            // Update the real return value
            updateRealValue(value, option.name, newValue);

            setValue(newValue);
            setLastElementValue(e);
          }
        },
      },
    };

    return (
      <div key={idx} className={classNames(styles.item, styles.elementItem)}>
        {!!label && <span className={styles.label}>{label}：</span>}
        {element}
        {item.help && (
          <Tooltip title={item.help}>
            <Icon
              icon="material-symbols:help-outline"
              className={styles.help}
            />
          </Tooltip>
        )}
      </div>
    );
  }

  if (!item?.element) {
    return (
      <span
        key={String(item.value)}
        className={classNames({
          [styles.active]: isActive,
        })}
        onClick={handleClick}
      >
        {item.label}
        {item.help && (
          <Tooltip title={item.help}>
            <Icon
              icon="material-symbols:help-outline"
              className={styles.help}
            />
          </Tooltip>
        )}
      </span>
    );
  }

  return null;
});

Item.displayName = "Item";
