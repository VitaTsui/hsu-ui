import { useEffect, useRef } from "react";

/**
 * Hook that clears the title attribute of tree nodes
 * After data changes, sets the title of all span.ant-tree-node-content-wrapper elements to empty
 * @param treeData Tree data
 * @param cls Unique class name of the tree component (used for precise targeting)
 */
export const useClearNodeTitle = <T extends unknown[]>(
  treeData: T,
  cls?: string
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use requestAnimationFrame to ensure the DOM has been updated
    const timer = requestAnimationFrame(() => {
      // Look up by class name, or fall back to the ref
      const container = cls
        ? document.querySelector(`.${cls}`)
        : containerRef.current;

      if (!container) return;

      setTimeout(() => {
        // Get all ant-tree-node-content-wrapper elements
        const nodes = container.querySelectorAll(
          "span.ant-tree-node-content-wrapper"
        );

        // Clear the title attribute of each element
        nodes?.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.title = "";
          }
        });
      }, 100);
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [treeData, cls]);

  return containerRef;
};
