import { Tag } from "antd";
import React, { useRef } from "react";
import classNames from "classnames";
import { useVisibleTags } from "./_hooks";
import { getTagColor } from "./_utils";
import EllipsisTag from "./_components/EllipsisTag";
import MeasureContainer from "./_components/MeasureContainer";
import styles from "./index.module.scss";

export interface TagsProps {
  className?: string;
  colors?: string[];
  tags: string[];
  ellipsis?: boolean;
  align?: "left" | "center" | "right";
  gap?: number;
}

const Tags: React.FC<TagsProps> = (props) => {
  const {
    className,
    colors,
    tags = [],
    ellipsis = true,
    align = "left",
    gap = 8,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Use the hook to compute the number of visible tags
  const visibleCount = useVisibleTags(containerRef, measureRef, {
    tags,
    ellipsis,
    gap,
  });

  // Get the visible tags and the omitted tags
  const visibleTags = tags.slice(0, visibleCount);
  const ellipsisTags = tags.slice(visibleCount);

  return (
    <>
      {/* Hidden container used to measure tag widths (only rendered when ellipsis is enabled) */}
      {ellipsis && (
        <MeasureContainer ref={measureRef} tags={tags} colors={colors} />
      )}
      {/* The actually displayed container */}
      <div
        ref={ellipsis ? containerRef : undefined}
        className={classNames(styles.tagsContainer, className, {
          [styles.wrap]: !ellipsis,
          [styles.alignLeft]: align === "left",
          [styles.alignCenter]: align === "center",
          [styles.alignRight]: align === "right",
        })}
        style={{ "--gap": gap } as React.CSSProperties}
      >
        {visibleTags?.map((tag, index) => (
          <Tag
            key={`${tag}-${index}`}
            color={getTagColor(index, colors)}
            className={styles.tag}
          >
            {tag}
          </Tag>
        ))}
        {ellipsis && (
          <EllipsisTag
            ellipsisTags={ellipsisTags}
            startIndex={visibleCount}
            colors={colors}
          />
        )}
      </div>
    </>
  );
};

export default Tags;
