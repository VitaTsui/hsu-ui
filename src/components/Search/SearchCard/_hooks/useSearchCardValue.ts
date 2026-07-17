import { useEffect, useState, useMemo, useCallback } from "react";
import { Equal } from "hsu-utils";
import { SearchCardOption } from "../_components/OptionRow";
import { getRealValues } from "../_utils";

interface UseSearchCardValueProps {
  defaultValue?: Record<string, unknown>;
  searchField: string;
  options: SearchCardOption[];
  onChange?: (data: Record<string, unknown>) => void;
}

/**
 * Manages the value state of SearchCard
 */
export function useSearchCardValue({
  defaultValue,
  searchField,
  options,
  onChange,
}: UseSearchCardValueProps) {
  const [value, setValue] = useState<Record<string, unknown>>({});
  const [lastValue, setLastValue] = useState<Record<string, unknown>>({});
  const [internalValue, setInternalValue] = useState<string>("");

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      setLastValue(defaultValue);
      setInternalValue((defaultValue[searchField] as string) || "");
    }
  }, [defaultValue, searchField]);

  // Handle internal value updates, keeping all values in internal state
  const handleValueChange = useCallback((newValue: Record<string, unknown>) => {
    setValue({ ...newValue });
  }, []);

  // Get the real values
  const getRealValuesData = useCallback(() => {
    return getRealValues(value, options, searchField);
  }, [value, options, searchField]);

  // Handle value changes
  useMemo(() => {
    if (onChange && !Equal.ObjEqual(value, lastValue)) {
      setLastValue(value);

      // Extract all Real values
      const realValues = getRealValuesData();

      onChange(realValues);
    }
  }, [getRealValuesData, lastValue, onChange, value]);

  return {
    value,
    setValue: handleValueChange,
    internalValue,
    setInternalValue,
    getRealValues: getRealValuesData,
  };
}
