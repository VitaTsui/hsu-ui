import { EditorView } from "@codemirror/view";
import { Diagnostic } from "@codemirror/lint";
import { translateError } from "./errorTranslator";

// Global JSON parser instance
let jsonParser: { parse: (text: string) => unknown } | null = null;

// Preload the JSON parser
const loadJsonParser = async () => {
  if (!jsonParser) {
    try {
      const { parse } = await import("comment-json");
      jsonParser = { parse };
    } catch {
      void 0;
    }
  }
  return jsonParser;
};

export interface JsonLinterOptions {
  /** Whether to translate error messages into Chinese */
  translate?: boolean;
  /**
   * Whether to allow the root node to be a JSON array `[...]` (only affects top-level character validation; default false, only `{...}` is allowed)
   */
  allowArrayRoot?: boolean;
}

function resolveJsonLinterOptions(
  options: JsonLinterOptions | boolean = false,
): { translate: boolean; allowArrayRoot: boolean } {
  if (typeof options === "boolean") {
    return { translate: options, allowArrayRoot: false };
  }
  return {
    translate: options.translate ?? false,
    allowArrayRoot: options.allowArrayRoot ?? false,
  };
}

// JSON syntax linter (a `boolean` can be passed to only enable translate, for backward compatibility)
export function jsonLinter(options: JsonLinterOptions | boolean = false) {
  const { translate, allowArrayRoot } = resolveJsonLinterOptions(options);

  return (view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    const text = view.state.doc.toString();

    if (!text.trim()) {
      return diagnostics;
    }

    // By default the text must start with `{`; when allowArrayRoot is enabled, `[` is also allowed
    const trimmedStart = text.trimStart();
    const rootOk =
      trimmedStart.startsWith("{") ||
      (allowArrayRoot && trimmedStart.startsWith("["));

    if (!rootOk) {
      const firstNonSpaceIndex = text.search(/\S/);
      const from = firstNonSpaceIndex === -1 ? 0 : firstNonSpaceIndex;
      const to = Math.min(from + 1, text.length);

      diagnostics.push({
        from,
        to,
        severity: "error",
        message: "请输入 JSON 格式",
      });

      return diagnostics;
    }

    if (jsonParser) {
      try {
        jsonParser.parse(text);
      } catch (e: unknown) {
        const error = e as Error;
        const message = error.message;

        // Try to extract position info from the error message
        let from = 0;
        let to = text.length;

        // Parse position info, e.g. "Unexpected token } in JSON at position 10"
        const positionMatch = message.match(/at position (\d+)/);
        if (positionMatch) {
          const position = parseInt(positionMatch[1], 10);
          from = Math.max(0, position - 1);
          to = Math.min(text.length, position + 1);
        }

        // Decide whether to translate the error message based on the translate parameter
        const finalMessage = translate ? translateError(message) : message;

        diagnostics.push({
          from,
          to,
          severity: "error",
          message: finalMessage,
        });
      }
    } else {
      // If the parser is not loaded yet, try to load it
      loadJsonParser().then((parser) => {
        if (parser) {
          try {
            parser.parse(text);
          } catch {
            void 0;
          }
        }
      });
    }

    return diagnostics;
  };
}

// Export the preload function for external use
export { loadJsonParser };
