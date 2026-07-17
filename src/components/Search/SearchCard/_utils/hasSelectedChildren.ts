import { isArrayValue, isValidValue } from "./typeGuards";

/**
 * Checks whether any child item is selected
 */
export function hasSelectedChildren(
  value: Record<string, unknown>,
  childrenName: string,
  isMultiple: boolean
): boolean {
  const childrenValue = value[childrenName];

  if (isMultiple) {
    // Multi-select mode: check that it is an array with length greater than 0
    return isArrayValue(childrenValue) && childrenValue.length > 0;
  } else {
    // Single-select mode: check that the value exists and is not an empty string
    return isValidValue(childrenValue) && childrenValue !== "";
  }
}

