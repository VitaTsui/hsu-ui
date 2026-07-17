import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import Markdown from "../../../../../Markdown";
import { AnswerMessage } from "../../..";
import { cleanRedactedReasoning } from "../../../_utils";
import { Bubble, Think } from "@ant-design/x";
import Copy from "./_components/Copy";
import QuoteList from "./_components/QuoteList";
import LikeDislike from "./_components/LikeDislike";

interface AssistantItemProps {
  item: AnswerMessage;
  assistanting?: boolean;
  onAgain?: () => void;
  hideTool?: boolean;
  onLikeChange?: (
    messageId: string,
    like: boolean | null,
    content: string
  ) => void;
  isLast?: boolean;
  className?: string;
  noAnswerTip?: string;
}

const AssistantItem: React.FC<AssistantItemProps> = (props) => {
  const { item, assistanting, hideTool, onLikeChange, className, noAnswerTip } =
    props;
  const cleanedThink = item?.think ? cleanRedactedReasoning(item.think) : "";
  const cleanedAnswer = item?.answer ? cleanRedactedReasoning(item.answer) : "";
  const [expanded, setExpanded] = useState(false);
  const prevThinkingRef = useRef(false);

  // Determine whether thinking is in progress
  const isThinking = !item?.think?.endsWith("</think>") && !!assistanting;

  // Determine whether there is thinking content (excluding empty tags and the tags themselves)
  const hasThink = cleanedThink && cleanedThink.trim().length > 0;

  // Auto-expand when thinking starts; auto-collapse when thinking ends
  useEffect(() => {
    if (isThinking && !prevThinkingRef.current) {
      // Transition from not thinking to thinking: expand
      setExpanded(true);
    } else if (!isThinking && prevThinkingRef.current) {
      // Transition from thinking to not thinking: collapse
      setExpanded(false);
    }
    prevThinkingRef.current = isThinking;
  }, [isThinking]);

  return (
    <>
      <div className={classNames(styles.AssistantItem, className)}>
        {!!cleanedThink && (
          <Think
            title={isThinking ? "思考中..." : "已深度思考"}
            loading={!item?.think?.endsWith("</think>")}
            classNames={{
              content: styles.thinkContent,
            }}
            expanded={expanded}
            onExpand={(v) => setExpanded(v)}
          >
            <Markdown.Views className={styles.thinkContentMarkdown}>
              {cleanedThink}
            </Markdown.Views>
          </Think>
        )}
        {!item.error && (
          <Bubble
            loading={!cleanedThink && !cleanedAnswer && assistanting}
            classNames={{
              root: styles.answerBubble,
              content: styles.answerContent,
            }}
            content={cleanedAnswer}
            streaming={!!cleanedAnswer && assistanting}
            contentRender={(content) => {
              return (
                <div id={`${item.messageId}-answer`}>
                  <Markdown.Views>{content}</Markdown.Views>
                </div>
              );
            }}
          />
        )}
        {item.error && <div className={styles.error}>{item.error}</div>}
        {/* Tip shown when no answer can be given */}
        {!hasThink &&
          !cleanedAnswer &&
          !assistanting &&
          !item.error &&
          !!noAnswerTip && (
            <div id={`${item.messageId}-answer`} className={styles.noAnswerTip}>
              <Markdown.Views>{noAnswerTip}</Markdown.Views>
            </div>
          )}
        <QuoteList retrieverResources={item?.retrieverResources} />
        {!assistanting && !hideTool && (
          <div className={styles.assistantTool}>
            {cleanedAnswer && (
              <>
                <Copy content={cleanedAnswer} />
                <LikeDislike
                  messageId={item.messageId}
                  initialLike={item.like}
                  onLikeChange={onLikeChange}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AssistantItem;
