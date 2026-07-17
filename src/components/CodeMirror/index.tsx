import React, { useEffect, useRef } from "react";
import ReactCodeMirror, {
  EditorView,
  ReactCodeMirrorProps,
} from "@uiw/react-codemirror";
import { Extension } from "@codemirror/state";
import classNames from "classnames";
import styles from "./index.module.scss";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { linter, LintSource, Diagnostic } from "@codemirror/lint";
import { sqlLinter, loadSqlParser } from "./linters/sqlLinter";
import { jsonLinter, loadJsonParser } from "./linters/jsonLinter";

// Supported language types
export type CodeMirrorLanguageType = "sql" | "json" | "plain";

export interface CodeMirrorProps extends Omit<
  ReactCodeMirrorProps,
  "extensions" | "onError"
> {
  /** Language type, supports on-demand loading */
  language?: CodeMirrorLanguageType;
  /** Whether to enable syntax linting */
  enableLint?: boolean;
  /** Error message callback */
  onLintError?: (error: string | null) => void;
  /** Whether there is an error, used to show the error border */
  hasError?: boolean;
  /** Whether to translate error messages into Chinese, default false */
  translateError?: boolean;
  /**
   * Whether JSON validation allows the root node to be an array `[...]`, default false (only objects `{...}` are allowed)
   */
  allowJsonArrayRoot?: boolean;
}

// Load language support on demand
const getLanguageExtension = async (language: CodeMirrorLanguageType) => {
  switch (language) {
    case "sql": {
      const { sql } = await import("@codemirror/lang-sql");
      return sql();
    }
    case "json": {
      const { json } = await import("@codemirror/lang-json");
      return json();
    }
    case "plain":
    default:
      return null;
  }
};

const CodeMirror: React.FC<CodeMirrorProps> = (props) => {
  const {
    className,
    language = "sql",
    enableLint = true,
    basicSetup,
    onLintError,
    hasError = false,
    translateError = false,
    allowJsonArrayRoot = false,
    ...restProps
  } = props;
  const [extensions, setExtensions] = React.useState<Extension[]>([]);
  const onLintErrorRef = useRef(onLintError);
  onLintErrorRef.current = onLintError;

  useEffect(() => {
    const loadExtensions = async () => {
      const languageExt = await getLanguageExtension(language);
      const newExtensions: Extension[] = [EditorView.lineWrapping];

      if (languageExt) {
        newExtensions.push(languageExt);
      }

      if (enableLint) {
        let lintSource: LintSource | null = null;

        if (language === "sql") {
          // Preload the SQL parser
          await loadSqlParser();
          lintSource = sqlLinter(translateError);
          newExtensions.push(linter(lintSource));
        } else if (language === "json") {
          // Preload the JSON parser
          await loadJsonParser();
          lintSource = jsonLinter({
            translate: translateError,
            allowArrayRoot: allowJsonArrayRoot,
          });
          newExtensions.push(linter(lintSource));
        }

        // Add an error listener extension
        if (lintSource) {
          newExtensions.push(
            EditorView.updateListener.of((update) => {
              if (update.docChanged || update.viewportChanged) {
                // Delay execution to wait for the linter to finish
                setTimeout(async () => {
                  try {
                    const diagnosticsResult = lintSource?.(update.view);
                    // Handle the case where the result may be a Promise
                    const diagnostics: readonly Diagnostic[] =
                      diagnosticsResult instanceof Promise
                        ? await diagnosticsResult
                        : diagnosticsResult || [];

                    const errors = diagnostics.filter(
                      (d: Diagnostic) => d.severity === "error",
                    );
                    if (errors && errors.length > 0) {
                      onLintErrorRef.current?.(errors[0].message);
                    } else {
                      onLintErrorRef.current?.(null);
                    }
                  } catch (e) {
                    // Ignore errors
                    onLintErrorRef.current?.(null);
                  }
                }, 150);
              }
            }),
          );
        }
      } else {
        // If lint is disabled, clear the error
        onLintErrorRef.current?.(null);
      }

      setExtensions(newExtensions);
    };

    loadExtensions();
  }, [language, enableLint, translateError, allowJsonArrayRoot]);

  return (
    <ReactCodeMirror
      minHeight="100px"
      theme={vscodeLight}
      {...restProps}
      basicSetup={
        typeof basicSetup === "boolean"
          ? basicSetup
          : {
              lineNumbers: true,
              highlightActiveLineGutter: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              ...(basicSetup ?? {}),
            }
      }
      extensions={extensions}
      className={classNames(styles.CodeMirror, className, {
        [styles.hasError]: hasError,
      })}
    />
  );
};

export default CodeMirror;
