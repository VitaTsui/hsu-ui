import { Key } from "react";
import { TreeData, CheckedKeys } from "..";
import { getAllChildrenKeys } from ".";

/**
 * Normalize checkedKeys: check parent nodes; if their children are not all checked, mark the parent as half-checked
 * @param checkedKeys The checkedKeys to normalize
 * @param treeData Tree data
 * @returns Normalized checkedKeys
 */
export const normalizeCheckedKeys = (
  checkedKeys: CheckedKeys | undefined,
  treeData: TreeData[]
): CheckedKeys | undefined => {
  if (!checkedKeys || !treeData.length) {
    return checkedKeys;
  }

  // If in array format, convert to object format
  const checkedSet = new Set<Key>();
  const halfCheckedSet = new Set<Key>();

  if (Array.isArray(checkedKeys)) {
    checkedKeys?.forEach((key) => checkedSet.add(key));
  } else {
    checkedKeys.checked?.forEach((key) => checkedSet.add(key));
    (checkedKeys.halfChecked || [])?.forEach((key) => halfCheckedSet.add(key));
  }

  // Recursively traverse all nodes and check parent node states
  // Process from the deepest level up so that parent states are based on correct child states
  const processNode = (node: TreeData): void => {
    // Recursively process child nodes first (starting from the deepest level)
    if (node.children?.length) {
      for (const child of node.children) {
        processNode(child);
      }
    }

    // Then process the current node (the parent)
    // If the node is in checked and has children
    if (checkedSet.has(node.key) && node.children?.length) {
      // Get the keys of all descendant nodes
      const allChildrenKeys = getAllChildrenKeys(node.children);

      // Check whether all descendant nodes are checked
      if (allChildrenKeys.length > 0) {
        const allChildrenChecked = allChildrenKeys.every((childKey) =>
          checkedSet.has(childKey)
        );

        if (!allChildrenChecked) {
          // If the children are not all checked, remove the parent from checked and add it to halfChecked
          checkedSet.delete(node.key);
          halfCheckedSet.add(node.key);
        } else {
          // If all children are checked, make sure the parent is not in halfChecked
          halfCheckedSet.delete(node.key);
        }
      }
    }
  };

  // Traverse all root nodes
  for (const node of treeData) {
    processNode(node);
  }

  // Return the normalized checkedKeys
  return {
    checked: Array.from(checkedSet),
    halfChecked: Array.from(halfCheckedSet),
  };
};
