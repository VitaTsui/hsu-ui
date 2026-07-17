import { useDebounceEffect, useMutationObserver } from "ahooks";
import { useRef, useState } from "react";
import { TableProps } from "..";

interface useScrollEndProps {
  cls?: string;
  ref?: React.RefObject<HTMLDivElement>;
  dataSource?: TableProps["dataSource"];
  onScrollEnd?: () => void;
  threshold?: number; // Distance-to-bottom threshold, default 50px
  autoScrolling?: boolean; // When autoScrolling is enabled, this hook is disabled
}

const useScrollEnd = (props: useScrollEndProps) => {
  const {
    cls,
    ref,
    dataSource,
    onScrollEnd,
    threshold = 50,
    autoScrolling,
  } = props;
  const [ready, setReady] = useState(false);
  const eventHandlersRef = useRef<{
    scroll?: () => void;
  }>({});

  useDebounceEffect(() => {
    let body: HTMLDivElement | null = null;

    // Cleanup function
    const cleanup = () => {
      // Remove event listeners
      if (body && eventHandlersRef.current.scroll) {
        body.removeEventListener("scroll", eventHandlersRef.current.scroll);
      }
      eventHandlersRef.current = {};
    };

    // Do not enable this hook when autoScrolling is on
    if (
      ref &&
      ref.current &&
      ready &&
      onScrollEnd &&
      dataSource?.length &&
      !autoScrolling
    ) {
      body = document.querySelector(
        `.${cls} .ant-table-body`
      ) as HTMLDivElement;

      if (body && body.scrollHeight > body.clientHeight) {
        // Clean up previous listeners
        cleanup();

        // Add scroll event listener
        const handleScroll = () => {
          if (!body) {
            return;
          }

          // Compute the distance to the bottom
          const scrollTop = body.scrollTop;
          const scrollHeight = body.scrollHeight;
          const clientHeight = body.clientHeight;
          const distanceToBottom = scrollHeight - scrollTop - clientHeight;

          // Trigger when scrolled close to the bottom
          if (distanceToBottom <= threshold) {
            onScrollEnd();
          }
        };

        body.addEventListener("scroll", handleScroll, { passive: true });

        eventHandlersRef.current = {
          scroll: handleScroll,
        };
      }
    }

    return cleanup;
  }, [ref, cls, ready, dataSource, onScrollEnd, threshold, autoScrolling]);

  useMutationObserver(
    () => {
      setReady(true);
    },
    ref,
    {
      childList: true,
      subtree: true,
    }
  );
};

export default useScrollEnd;
