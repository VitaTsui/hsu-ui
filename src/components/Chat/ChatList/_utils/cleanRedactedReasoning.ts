/**
 * Clean up redacted_reasoning tags
 * @param text The text to clean
 * @returns The cleaned text
 */
export function cleanRedactedReasoning(text: string): string {
  if (!text) return "";
  return text
    .replace("<think>", "")
    .replace("</think>", "")
    .trim();
}

