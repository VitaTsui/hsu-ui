import { useState, useCallback } from "react";

interface UseSearchCardCollapseProps {
  defaultCollapse?: boolean;
}

/**
 * Manages the collapse state of SearchCard
 */
export function useSearchCardCollapse({
  defaultCollapse = false,
}: UseSearchCardCollapseProps) {
  const [collapse, setCollapse] = useState(defaultCollapse);

  const handleCollapseToggle = useCallback(() => {
    setCollapse(!collapse);
  }, [collapse]);

  return {
    collapse,
    setCollapse,
    toggleCollapse: handleCollapseToggle,
  };
}

