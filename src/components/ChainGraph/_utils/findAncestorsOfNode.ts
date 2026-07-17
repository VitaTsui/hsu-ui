import { TreeGraphData } from "..";

/**
 * Find all ancestor nodes of a node in a tree structure
 * @param tree Tree data
 * @param targetNodeId Target node ID
 * @param childrenKey Key name for child nodes, defaults to "children"
 * @returns Array of ancestor node IDs
 */
export function findAncestorsOfNode(
  tree: TreeGraphData,
  targetNodeId: string,
  childrenKey: string = "children"
): string[] {
  let ancestors: string[] = [];

  function traverse(node: TreeGraphData) {
    if (node.id === targetNodeId) {
      // Target node found
      ancestors = [...ancestors, node.id]; // Add the target node to the ancestor list (optional, depending on whether the target node itself should be included)
      return true; // Stop traversal
    }

    // Recursively traverse child nodes
    if (node[childrenKey] && (node[childrenKey] as TreeGraphData[]).length) {
      (node[childrenKey] as TreeGraphData[])?.forEach(
        (child: TreeGraphData) => {
          if (traverse(child)) {
            ancestors.push(node.id); // If the target node was found among the children, add the current node to the ancestor list
            return true; // Stop traversal
          }
        }
      );
    }

    return false; // Target node not found
  }

  traverse(tree);

  return ancestors;
}
