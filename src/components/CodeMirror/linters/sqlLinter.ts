import { EditorView } from "@codemirror/view";
import { Diagnostic } from "@codemirror/lint";
import { translateError } from "./errorTranslator";

// Global SQL parser instance
let sqlParser: { astify: (sql: string) => unknown } | null = null;

// MongoDB parser function type
type MongoParser = (query: string) => unknown;

let mongoParser: MongoParser | null = null;

// Preload the SQL parser
const loadSqlParser = async () => {
  if (!sqlParser) {
    try {
      const { Parser } = await import("node-sql-parser");
      sqlParser = new Parser();
    } catch {
      void 0;
    }
  }
  return sqlParser;
};

// Preload the MongoDB parser
const loadMongoParser = async () => {
  if (!mongoParser) {
    try {
      const mongoQueryParser = await import("mongodb-query-parser");
      mongoParser = mongoQueryParser.default;
    } catch {
      void 0;
    }
  }
  return mongoParser;
};

// Detect whether the text is a MongoDB use statement
function isMongoUseStatement(text: string): boolean {
  const trimmed = text.trim();
  // MongoDB use statement format: use database_name
  // The database name may contain letters, digits, underscores, hyphens, etc.
  const usePattern = /^use\s+[a-zA-Z0-9_-]+(\s*;?\s*)$/i;
  return usePattern.test(trimmed);
}

// Validate a MongoDB use statement
function validateMongoUseStatement(text: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = text.trim();

  if (!trimmed) {
    return { valid: false, error: "use 语句不能为空" };
  }

  // Check the format: use database_name
  const usePattern = /^use\s+([a-zA-Z0-9_-]+)(\s*;?\s*)$/i;
  const match = trimmed.match(usePattern);

  if (!match) {
    return { valid: false, error: "use 语句格式错误，应为：use database_name" };
  }

  const dbName = match[1];
  if (!dbName) {
    return { valid: false, error: "数据库名称不能为空" };
  }

  // The database name cannot start with a digit
  if (/^\d/.test(dbName)) {
    return { valid: false, error: "数据库名称不能以数字开头" };
  }

  return { valid: true };
}

// Detect the query type: SQL or MongoDB
function detectQueryType(text: string): "sql" | "mongodb" {
  const trimmed = text.trim();

  // First check whether it might be a MongoDB query (MongoDB shell command format)
  const isMongo =
    trimmed.startsWith("db.") ||
    trimmed.includes(".find(") ||
    trimmed.includes(".aggregate(") ||
    trimmed.includes(".insert(") ||
    trimmed.includes(".update(") ||
    trimmed.includes(".delete(") ||
    trimmed.includes(".remove(") ||
    trimmed.startsWith("use ");

  if (isMongo) {
    return "mongodb";
  }

  // Fall back to SQL by default
  return "sql";
}

// SQL and MongoDB syntax linter (auto-detected)
export function sqlLinter(translate: boolean = false) {
  return (view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    const text = view.state.doc.toString();

    if (!text.trim()) {
      return diagnostics;
    }

    // Split the text by lines
    const lines = text.split("\n");
    let currentOffset = 0;
    const nonUseLines: Array<{ line: string; start: number; end: number }> = [];

    // First pass: check use lines individually, collect non-use lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineStart = currentOffset;
      const lineEnd = currentOffset + line.length;
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        currentOffset = lineEnd + 1; // +1 for the newline character
        continue;
      }

      // Check use lines individually
      if (isMongoUseStatement(trimmedLine)) {
        const validation = validateMongoUseStatement(trimmedLine);
        if (!validation.valid) {
          diagnostics.push({
            from: lineStart,
            to: lineEnd,
            severity: "error",
            message: translate
              ? translateError(validation.error || "use 语句格式错误")
              : validation.error || "use 语句格式错误",
          });
        }
      } else {
        // Collect non-use lines
        nonUseLines.push({
          line: line,
          start: lineStart,
          end: lineEnd,
        });
      }

      currentOffset = lineEnd + 1; // +1 for the newline character
    }

    // Second pass: validate all non-use lines together
    if (nonUseLines.length > 0) {
      // Merge all non-use lines
      const nonUseText = nonUseLines?.map((item) => item.line).join("\n");
      const nonUseStart = nonUseLines[0].start;
      const nonUseEnd = nonUseLines[nonUseLines.length - 1].end;

      // Determine the query type
      const queryType = detectQueryType(nonUseText);

      if (queryType === "mongodb") {
        // Validate MongoDB statements with mongoParser
        if (mongoParser) {
          try {
            mongoParser(nonUseText);
          } catch (e: unknown) {
            const errorMessage = (e as Error).message;
            diagnostics.push({
              from: nonUseStart,
              to: nonUseEnd,
              severity: "error",
              message: translate ? translateError(errorMessage) : errorMessage,
            });
          }
        } else {
          // If the parser is not loaded yet, try to load it
          loadMongoParser().then((parser) => {
            if (parser) {
              try {
                parser(nonUseText);
              } catch {
                void 0;
              }
            }
          });
        }
      } else {
        // Validate SQL statements with the SQL parser
        if (sqlParser) {
          try {
            sqlParser.astify(nonUseText);
          } catch (e: unknown) {
            const errorMessage = (e as Error).message;
            diagnostics.push({
              from: nonUseStart,
              to: nonUseEnd,
              severity: "error",
              message: translate ? translateError(errorMessage) : errorMessage,
            });
          }
        } else {
          // If the parser is not loaded yet, try to load it
          loadSqlParser().then((parser) => {
            if (parser) {
              try {
                parser.astify(nonUseText);
              } catch {
                void 0;
              }
            }
          });
        }
      }
    }

    return diagnostics;
  };
}

// Export the preload functions for external use
export { loadSqlParser, loadMongoParser };
