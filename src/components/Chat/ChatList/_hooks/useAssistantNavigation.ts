import { useEffect, useState } from "react";

interface UseAssistantNavigationProps {
  itemLength: number;
}

/**
 * Manage navigation state in the Assistant component (switching between different answers)
 */
export function useAssistantNavigation({
  itemLength,
}: UseAssistantNavigationProps) {
  const [num, setNum] = useState(itemLength - 1);

  useEffect(() => {
    setNum(itemLength - 1);
  }, [itemLength]);

  const goPrev = () => {
    if (num > 0) {
      setNum(num - 1);
    }
  };

  const goNext = () => {
    if (num < itemLength - 1) {
      setNum(num + 1);
    }
  };

  return {
    currentIndex: num,
    setCurrentIndex: setNum,
    goPrev,
    goNext,
    isFirst: num === 0,
    isLast: num === itemLength - 1,
  };
}

