import React from "react";
import ReactMarkdown, { Options as ReactMarkdownProps } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import classNames from "classnames";
import styles from "./index.module.scss";
import "highlight.js/styles/atom-one-dark.min.css";
import "katex/dist/katex.min.css";
import { generateRandomStr } from "hsu-utils";
import Copy, { CopyProps } from "../../Copy";
import MermaidBlock from "./MermaidBlock";
import ArtifactBlock from "./ArtifactBlock";

/** Code block languages that support Artifacts preview (modeled after Claude Artifacts) */
const ARTIFACT_LANGS = new Set(["html", "svg"]);

/**
 * Recover the plain-text source from code block children: rehype-highlight splits code into
 * nested <span> highlight elements; joining directly yields [object Object], so extract text recursively.
 */
const extractText = (node: React.ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
};

export interface MarkdownViewsProps extends ReactMarkdownProps {
  copyProps?: Omit<CopyProps, "id">;
}

const MarkdownViews: React.FC<MarkdownViewsProps> = (props) => {
  const { className, copyProps, components: extraComponents } = props;

  return (
    <ReactMarkdown
      {...props}
      rehypePlugins={[rehypeHighlight, rehypeKatex]}
      remarkPlugins={[remarkGfm, remarkMath]}
      className={classNames(styles.MarkdownViews, className, "markdown-body")}
      components={{
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          if (match?.length) {
            const lang = match[1].toLowerCase();
            const codeText = extractText(children);

            // Mermaid diagrams: render directly as SVG (fall back to code display when streaming output is incomplete)
            if (lang === "mermaid") {
              return <MermaidBlock code={codeText} />;
            }

            const id = generateRandomStr(10);
            const codeView = (
              <div className={classNames(styles.code)}>
                <div className={classNames(styles.nav)}>
                  <Copy id={id} md={false} {...copyProps} />
                </div>
                <div className={classNames(styles.content)}>
                  <code
                    id={id}
                    {...props}
                    className={classNames(styles.code_content, className)}
                  >
                    {children}
                  </code>
                </div>
              </div>
            );

            // HTML/SVG: Artifacts preview (sandbox iframe) + code tabs
            if (ARTIFACT_LANGS.has(lang)) {
              return (
                <ArtifactBlock code={codeText} lang={lang} codeView={codeView} />
              );
            }
            return codeView;
          }
          return <code {...props}>{children}</code>;
        },
        td: ({ children, ...props }) => {
          return (
            <td {...props}>
              {Array.isArray(children)
                ? children?.map((item) => {
                    if (item === "<br>") {
                      return <br />;
                    }

                    return item;
                  })
                : children}
            </td>
          );
        },
        ...(extraComponents || {}),
      }}
    />
  );
};

export default MarkdownViews;
