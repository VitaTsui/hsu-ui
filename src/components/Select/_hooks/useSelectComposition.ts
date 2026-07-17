import { useEffect, useState } from "react";

interface UseSelectCompositionProps {
  onSearch?: (value: string) => void;
}

/**
 * Manage IME composition state
 */
export function useSelectComposition({
  onSearch,
}: UseSelectCompositionProps) {
  const [isComposing, setComposing] = useState<boolean>(false);

  useEffect(() => {
    const compositionend = () => {
      setComposing(false);
    };
    const compositionstart = () => {
      setComposing(true);
    };

    if (onSearch) {
      window.addEventListener("compositionstart", compositionstart);
      window.addEventListener("compositionend", compositionend);
    }

    return () => {
      window.removeEventListener("compositionstart", compositionstart);
      window.removeEventListener("compositionend", compositionend);
    };
  }, [onSearch]);

  return { isComposing };
}

