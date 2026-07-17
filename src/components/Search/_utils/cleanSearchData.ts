/**
 * Cleans search data by removing undefined values
 * @param data Raw search data
 * @returns Cleaned search data
 */
export function cleanSearchData<T = Record<string, unknown>>(
  data: Record<string, unknown>
): Partial<T> | undefined {
  const cleaned: Record<string, unknown> = {};
  let hasValue = false;

  for (const key in data) {
    if (data[key] !== undefined) {
      cleaned[key] = data[key];
      hasValue = true;
    }
  }

  return hasValue ? (cleaned as Partial<T>) : undefined;
}

