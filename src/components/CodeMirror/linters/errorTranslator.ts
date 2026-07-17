/**
 * Translate English error messages into Chinese
 */
export function translateError(message: string): string {
  if (!message) return message;

  let translated = message;

  // Handle complete JSON error patterns first (highest priority)
  const jsonPatterns: Array<[RegExp, string]> = [
    [
      /Unexpected token (.+) in JSON at position (\d+)/gi,
      "JSON 中位置 $2 处意外的标记: $1",
    ],
    [/Unexpected end of JSON input/gi, "JSON 输入意外结束"],
    [
      /Expected property name or '}' in JSON at position (\d+)/gi,
      "JSON 中位置 $1 处期望属性名或 '}'",
    ],
    [
      /Expected double-quoted property name in JSON at position (\d+)/gi,
      "JSON 中位置 $1 处期望双引号属性名",
    ],
    [
      /Expected ':' after property name in JSON at position (\d+)/gi,
      "JSON 中位置 $1 处属性名后期望 ':'",
    ],
    [
      /Expected ',' or '}' after property value in JSON at position (\d+)/gi,
      "JSON 中位置 $1 处属性值后期望 ',' 或 '}'",
    ],
    [
      /Expected ',' or ']' after array element in JSON at position (\d+)/gi,
      "JSON 中位置 $1 处数组元素后期望 ',' 或 ']'",
    ],
    [
      /Unexpected non-whitespace character after JSON at position (\d+)/gi,
      "JSON 中位置 $1 处意外的非空白字符",
    ],
    [/Unexpected end of JSON input/gi, "JSON 输入意外结束"],
  ];

  // Apply the complete JSON patterns
  jsonPatterns?.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  // Handle position info (if not already handled by the patterns above)
  if (translated.includes("at position")) {
    const positionMatch = translated.match(/at position (\d+)/);
    if (positionMatch) {
      translated = translated.replace(
        /at position \d+/,
        `位置 ${positionMatch[1]}`
      );
    }
  }

  // Handle common word translations (sorted by length from long to short, matching longer phrases first)
  const wordTranslations: Array<[string, string]> = [
    ["but found", "但找到"],
    ["in JSON", "在 JSON 中"],
    ["at position", "位置"],
    ["after property", "属性后"],
    ["after array", "数组后"],
    ["property name", "属性名"],
    ["property value", "属性值"],
    ["array element", "数组元素"],
    ["non-whitespace character", "非空白字符"],
    ["double-quoted", "双引号"],
    ["Unexpected", "意外的"],
    ["Expected", "期望"],
    ["Invalid", "无效的"],
    ["Missing", "缺少"],
    ["Unknown", "未知的"],
    ["SyntaxError", "语法错误"],
    ["token", "标记"],
    ["column", "列"],
    ["table", "表"],
    ["keyword", "关键字"],
    ["operator", "操作符"],
    ["function", "函数"],
    ["syntax", "语法"],
    ["parse", "解析"],
    ["error", "错误"],
    ["end", "结束"],
    ["input", "输入"],
    ["character", "字符"],
    ["found", "找到"],
    ["but", "但是"],
  ];

  // Apply word translations (in order, longer phrases first)
  wordTranslations?.forEach(([en, zh]) => {
    // For phrases, replace directly
    if (en.includes(" ")) {
      const regex = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      translated = translated.replace(regex, zh);
    } else {
      // For single words, use word boundaries
      const regex = new RegExp(
        `\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi"
      );
      translated = translated.replace(regex, zh);
    }
  });

  // Handle common SQL error patterns
  const sqlPatterns: Array<[RegExp, string]> = [
    [/SyntaxError: (.+)/gi, "语法错误: $1"],
    [/Expected (.+) but found (.+)/gi, "期望 $1 但找到 $2"],
    [/Invalid (.+)/gi, "无效的 $1"],
    [/Missing (.+)/gi, "缺少 $1"],
    [/Unknown (.+)/gi, "未知的 $1"],
  ];

  sqlPatterns?.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  // Clean up extra whitespace and punctuation
  translated = translated
    .replace(/\s+/g, " ") // Merge multiple spaces into one
    .replace(/\s*,\s*/g, "，") // Replace English commas with Chinese commas
    .replace(/\s*:\s*/g, "：") // Replace English colons with Chinese colons
    .replace(/\s*\.\s*/g, "。") // Replace English periods with Chinese periods
    .trim();

  // Final check: if obvious English words remain, try translating common words
  // Note: these words may already have been handled by earlier translations; this is a fallback
  const commonEnglishWords: Array<[string, string]> = [
    ["or", "或"],
    ["and", "和"],
    ["of", "的"],
    ["with", "使用"],
    ["without", "没有"],
    ["for", "为"],
    ["from", "从"],
    ["by", "通过"],
    ["the", "该"],
    ["a", "一个"],
    ["an", "一个"],
    ["is", "是"],
    ["are", "是"],
    ["was", "是"],
    ["were", "是"],
    ["has", "有"],
    ["have", "有"],
    ["in", "在"],
    ["at", "在"],
    ["to", "到"],
  ];

  // Replace directly without checking first (avoids regex state issues)
  commonEnglishWords?.forEach(([en, zh]) => {
    // Use word boundaries to ensure only complete words are replaced
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, zh);
  });

  // Final cleanup: remove extra spaces
  translated = translated.replace(/\s+/g, " ").trim();

  return translated;
}
