import { Key } from "react";
import { TreeData } from "..";

/**
 * Get the keys of all descendant nodes of a node
 * @param children Array of child nodes
 * @returns Array of keys of all descendant nodes
 */
export const getAllChildrenKeys = (children: TreeData[]): Key[] => {
  const keys: Key[] = [];
  const traverse = (nodes: TreeData[]) => {
    for (const node of nodes) {
      keys.push(node.key);
      if (node.children?.length) {
        traverse(node.children);
      }
    }
  };
  traverse(children);
  return keys;
};

/**
 * Find the keys of all ancestor nodes of a node in the tree
 * @param targetKey Key of the target node
 * @param treeData Tree data
 * @param parentKeys Array of ancestor node keys (used for recursion)
 * @returns Array of keys of all ancestor nodes; returns an empty array if not found
 */
export const getAllParentKeys = (
  targetKey: Key,
  treeData: TreeData[],
  parentKeys: Key[] = []
): Key[] => {
  for (const node of treeData) {
    if (node.key === targetKey) {
      return parentKeys;
    }
    if (node.children?.length) {
      const newParentKeys = [...parentKeys, node.key];
      const found = getAllParentKeys(targetKey, node.children, newParentKeys);
      // If found (the returned array length is greater than 0 or equals newParentKeys), the target was found in the subtree
      if (found.length > 0) {
        return found;
      }
    }
  }
  return [];
};

/**
 * Find a node by key
 * @param targetKey Key of the target node
 * @param data Tree data
 * @returns The found node, or null
 */
export const findNodeByKey = (
  targetKey: Key,
  data: TreeData[]
): TreeData | null => {
  for (const node of data) {
    if (node.key === targetKey) {
      return node;
    }
    if (node.children) {
      const found = findNodeByKey(targetKey, node.children);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Filter tree data by search keyword
 * @param searchKey Search keyword
 * @param data Tree data
 * @returns Filtered tree data
 */
export const filterTreeData = (
  searchKey: string,
  data: TreeData[]
): TreeData[] => {
  if (!searchKey.trim()) return data;

  const result: TreeData[] = [];
  const lowerSearchKey = searchKey.toLowerCase();

  for (const item of data) {
    const matchesTitle = item.title.toLowerCase().includes(lowerSearchKey);
    const filteredChildren = item.children?.length
      ? filterTreeData(searchKey, item.children)
      : undefined;

    if (matchesTitle || filteredChildren?.length) {
      result.push({
        ...item,
        children: filteredChildren?.length ? filteredChildren : undefined,
      });
    }
  }

  return result;
};

/**
 * Compute the node keys that should be expanded based on the default expand level
 * @param treeData Tree data
 * @param level Expand level (starting from 1: 1 means the first level, 2 the second, and so on)
 * @returns Array of node keys that should be expanded
 */
export const getExpandedKeysByLevel = (
  treeData: TreeData[],
  level: number
): Key[] => {
  if (level < 1 || !treeData?.length) {
    return [];
  }

  const expandedKeys: Key[] = [];

  const traverse = (nodes: TreeData[], currentLevel: number) => {
    for (const node of nodes) {
      // Expand the node if the current level is less than or equal to the target level
      if (currentLevel <= level && node.children?.length) {
        expandedKeys.push(node.key);
        traverse(node.children, currentLevel + 1);
      }
    }
  };

  traverse(treeData, 1);

  return expandedKeys;
};

/**
 * Get the full path of a node (from the root node to the current node)
 * @param targetKey Key of the target node
 * @param treeData Tree data
 * @returns Array of nodes on the path, containing all node info from the root to the target node; returns null if not found
 */
export const getNodePath = (
  targetKey: Key,
  treeData: TreeData[]
): TreeData[] | null => {
  const findPath = (
    nodes: TreeData[],
    path: TreeData[] = []
  ): TreeData[] | null => {
    for (const node of nodes) {
      const currentPath = [...path, node];
      
      // Target node found
      if (node.key === targetKey) {
        return currentPath;
      }
      
      // Continue searching in child nodes
      if (node.children?.length) {
        const found = findPath(node.children, currentPath);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return findPath(treeData);
};
