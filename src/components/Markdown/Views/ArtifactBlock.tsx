import React, { useState } from "react";
import classNames from "classnames";

import styles from "./blocks.module.scss";

export interface ArtifactBlockProps {
  /** Raw source code (html/svg) */
  code: string;
  /** Language tag (html / svg) */
  lang: string;
  /** Code view (reuses the outer highlighted code block rendering) */
  codeView: React.ReactNode;
}

/**
 * HTML/SVG Artifacts preview block (modeled after Claude Artifacts): code / preview tabs;
 * the preview renders the model-generated page in a sandbox iframe (allow-scripts only, no same-origin access).
 */
const ArtifactBlock: React.FC<ArtifactBlockProps> = ({ code, lang, codeView }) => {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className={styles.artifact}>
      <div className={styles.artifactBar}>
        <span className={styles.artifactLang}>{lang.toUpperCase()} · Artifact</span>
        <div className={styles.artifactTabs}>
          <button
            type="button"
            className={classNames(styles.artifactTab, {
              [styles.artifactTabActive]: tab === "preview",
            })}
            onClick={() => setTab("preview")}
          >
            预览
          </button>
          <button
            type="button"
            className={classNames(styles.artifactTab, {
              [styles.artifactTabActive]: tab === "code",
            })}
            onClick={() => setTab("code")}
          >
            代码
          </button>
        </div>
      </div>
      {tab === "preview" ? (
        <iframe
          className={styles.artifactFrame}
          title="artifact-preview"
          sandbox="allow-scripts"
          srcDoc={code}
        />
      ) : (
        codeView
      )}
    </div>
  );
};

export default ArtifactBlock;
