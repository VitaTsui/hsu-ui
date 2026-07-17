import React, { useMemo } from "react";
import classNames from "classnames";
import Input, { InputProps } from "../../../Input";
import Icon from "../../../Icon";
import Button, { ButtonProps } from "../../../Button";
import styles from "../../index.module.scss";

export interface TitleSearchBarProps {
  title?: React.ReactNode;
  search?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchProps?: InputProps;
  buttonGroup?: ButtonProps[];
  btnPosition?: "left" | "right";
  titleClassName?: string;
  className?: string;
}

const TitleSearchBar: React.FC<TitleSearchBarProps> = ({
  title,
  search,
  searchValue,
  onSearchChange,
  searchProps,
  buttonGroup,
  btnPosition = "right",
  titleClassName,
  className,
}) => {
  // Render the button group
  const renderButtonGroup = useMemo(() => {
    if (!buttonGroup?.length) {
      return null;
    }

    return (
      <div className={styles.buttonGroup}>
        {buttonGroup?.map((button, idx) => (
          <Button key={idx} {...button} />
        ))}
      </div>
    );
  }, [buttonGroup]);
  // Do not render if there is no content
  if (!search && !title && !buttonGroup?.length) {
    return null;
  }

  return (
    <div className={classNames(styles.title_search, className)}>
      {title && (
        <div className={classNames(styles.title, titleClassName)}>{title}</div>
      )}
      {btnPosition === "left" && renderButtonGroup}
      {search && (
        <Input
          prefix={<Icon icon="mdi:search" className={styles.searchIcon} />}
          placeholder="输入搜索"
          {...searchProps}
          value={searchValue}
          onChange={onSearchChange}
          className={classNames(styles.search, searchProps?.className)}
        />
      )}
      {btnPosition === "right" && renderButtonGroup}
    </div>
  );
};

export default TitleSearchBar;
