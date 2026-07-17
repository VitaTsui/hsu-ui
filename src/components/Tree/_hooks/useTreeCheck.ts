import { useCallback } from "react";
import { TreeProps as AntdTreeProps } from "antd";
import { CheckedKeys } from "..";

/**
 * Hook for handling tree checking
 * Uses antd's default logic without any extra operations
 */
export const useTreeCheck = (
  setCheckedKeys: React.Dispatch<React.SetStateAction<CheckedKeys | undefined>>,
  onCheck?: AntdTreeProps["onCheck"],
  onChange?: (checked: CheckedKeys) => void
) => {
  // Handle check logic: directly use antd's default behavior
  const handleCheck = useCallback(
    (
      checked: CheckedKeys,
      info: Parameters<NonNullable<AntdTreeProps["onCheck"]>>[1]
    ) => {
      setCheckedKeys(checked);
      onCheck?.(checked, info);

      // Trigger the onChange callback
      if (onChange) {
        if (Array.isArray(checked)) {
          onChange({
            checked,
            halfChecked: info.halfCheckedKeys || [],
          });
        } else {
          onChange(checked);
        }
      }
    },
    [setCheckedKeys, onCheck, onChange]
  );

  return handleCheck;
};
