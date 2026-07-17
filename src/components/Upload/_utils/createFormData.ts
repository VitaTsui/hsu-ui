/**
 * Create a FormData instance and append data
 */
export function createFormData(
  data?: Partial<Record<string, string>>
): FormData {
  const formData = new FormData();

  if (data) {
    Object.keys(data)?.forEach((key) => {
      const v = data[key];
      if (v) {
        formData.append(key, v);
      }
    });
  }

  return formData;
}
