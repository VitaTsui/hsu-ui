import { useCallback, useMemo, useEffect, useState, Key, useRef } from "react";
import { TreeData } from "..";
import { filterTreeData } from "../_utils";

/**
 * Hook for handling tree search
 */
export const useTreeSearch = (
  treeData: TreeData[],
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[] | undefined>>
) => {
  const [searchKey, setSearchKey] = useState<string>("");
  const prevSearchKeyRef = useRef<string>("");

  // Process tree data (search filtering)
  // filterTreeData already handles data copying internally, no extra cloneDeep needed
  const filteredTreeData = useMemo(() => {
    if (!searchKey.trim()) {
      return treeData;
    }
    return filterTreeData(searchKey, treeData);
  }, [searchKey, treeData]);

  // Handle expand logic while searching
  useEffect(() => {
    const trimmedSearchKey = searchKey.trim();
    const prevTrimmedKey = prevSearchKeyRef.current.trim();

    // Skip processing if the search keyword has not changed
    if (trimmedSearchKey === prevTrimmedKey) {
      return;
    }

    prevSearchKeyRef.current = searchKey;

    // When the search is cleared, reset the expanded state
    if (!trimmedSearchKey) {
      setExpandedKeys([]);
      return;
    }

    // When there is a search keyword, expand all matching nodes
    if (!filteredTreeData.length) {
      return;
    }

    const keysToExpandSet = new Set<Key>();
    const collectExpandKeys = (nodes: TreeData[]): void => {
      for (const node of nodes) {
        if (node.children?.length) {
          keysToExpandSet.add(node.key);
          collectExpandKeys(node.children);
        }
      }
    };

    collectExpandKeys(filteredTreeData);

    if (keysToExpandSet.size > 0) {
      setExpandedKeys((prev) => {
        const prevSet = new Set(prev ?? []);
        keysToExpandSet?.forEach((key) => prevSet.add(key));
        return Array.from(prevSet);
      });
    }
  }, [searchKey, filteredTreeData, setExpandedKeys]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchKey(value);
  }, []);

  return {
    searchKey,
    handleSearchChange,
    filteredTreeData,
  };
};
