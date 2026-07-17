import { useEffect, useState } from "react";
import { SelectOption } from "..";

interface UseSelectInputOptionsProps {
  searchValue: string;
  isComposing: boolean;
  onChange?: (value: unknown) => void;
  onSearch?: (value: string) => void;
  optionsLength: number;
}

/**
 * Manage input options (when there are no matching options)
 */
export function useSelectInputOptions({
  searchValue,
  isComposing,
  onChange,
  onSearch,
  optionsLength,
}: UseSelectInputOptionsProps) {
  const [inputOptions, setInputOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!isComposing) {
      onSearch?.(searchValue);
    }
  }, [
    inputOptions,
    isComposing,
    onChange,
    onSearch,
    optionsLength,
    searchValue,
  ]);

  return { inputOptions, setInputOptions };
}
