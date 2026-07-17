import React, { useEffect, useMemo, useState } from "react";

import { generateRandomStr } from "hsu-utils";
import styles from "./blocks.module.scss";

// mermaid is large; lazy-load it and initialize globally only once
let mermaidPromise: Promise<typeof import("mermaid")["default"]> | null = null;
const loadMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "neutral",
      });
      return m.default;
    });
  }
  return mermaidPromise;
};

export interface MermaidBlockProps {
  code: string;
}

/**
 * Mermaid diagram rendering block (modeled after the flowchart rendering in Claude/Kimi etc.):
 * shows SVG on successful render; silently falls back to code display when the syntax is incomplete (e.g. during streaming).
 */
const MermaidBlock: React.FC<MermaidBlockProps> = ({ code }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const id = useMemo(() => `mmd-${generateRandomStr(8)}`, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      loadMermaid()
        .then((mermaid) => mermaid.render(id, code))
        .then(({ svg: rendered }) => {
          if (!cancelled) setSvg(rendered);
        })
        .catch(() => {
          // Incomplete code during streaming is normal; fall back to code display
          if (!cancelled) setSvg(null);
          // A failed mermaid.render leaves an error placeholder node in the DOM; clean it up
          document.getElementById(`d${id}`)?.remove();
        });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, id]);

  if (!svg) {
    return (
      <pre className={styles.mermaidFallback}>
        <code>{code}</code>
      </pre>
    );
  }
  return (
    <div
      className={styles.mermaid}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
