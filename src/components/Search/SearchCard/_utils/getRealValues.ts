import { SearchCardOption } from "../_components/OptionRow";

/**
 * Gets the real values (extracts all Real values)
 */
export function getRealValues(
  value: Record<string, unknown>,
  options: SearchCardOption[],
  searchField: string
): Record<string, unknown> {
  const realValues: Record<string, unknown> = {};

  // Iterate over all options and get their Real values
  options?.forEach((option) => {
    const realKey = `${option.name}Real`;
    if (value[realKey] !== undefined) {
      // Store the "Real"-suffixed value under the original key without the suffix
      realValues[option.name] = value[realKey];
    } else {
      // If there is no Real value, use the original value
      realValues[option.name] = value[option.name];
    }
  });

  // Keep search-related fields
  if (value[searchField] !== undefined) {
    realValues[searchField] = value[searchField];
  }

  return realValues;
}
