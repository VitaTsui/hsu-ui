import { isStringValue } from "./typeGuards";
import { hasSelectedChildren } from "./hasSelectedChildren";

/**
 * Updates the real return value
 */
export function updateRealValue(
  value: Record<string, unknown>,
  optionName: string,
  newValues: Record<string, unknown>
): void {
  // Parameter validation
  if (!value || !isStringValue(optionName) || !newValues) {
    return;
  }

  // Merge the current values and new values to get the latest state
  const mergedValues = { ...value, ...newValues };

  // Check whether child item data exists
  let hasAnyChildrenSelected = false;
  let childrenValue: unknown = null;

  // Iterate over all possible child item names
  Object.keys(mergedValues)?.forEach((key) => {
    if (key.endsWith("Children")) {
      // Find the corresponding parent item name
      const parentName = key.replace("Children", "");

      // Only handle the child items of the current option
      if (parentName === optionName) {
        try {
          // Check whether the child items have a selected value
          const currentChildrenValue = mergedValues[key];
          const hasSelected = hasSelectedChildren(
            mergedValues,
            key,
            Array.isArray(currentChildrenValue)
          );

          if (hasSelected) {
            hasAnyChildrenSelected = true;
            childrenValue = currentChildrenValue;
          }
        } catch {
          void 0;
        }
      }
    }
  });

  // Set the real return value
  const realValueKey = `${optionName}Real`;
  if (hasAnyChildrenSelected) {
    // If any child item is selected, use the child value
    newValues[realValueKey] = childrenValue;
  } else {
    // If no child item is selected, use the parent value
    const parentValue = newValues[optionName] ?? value[optionName];
    newValues[realValueKey] = parentValue;
  }
}
