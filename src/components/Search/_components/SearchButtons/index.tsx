import React from "react";
import Button from "../../../Button";
import Icon from "../../../Icon";

interface SearchButtonsProps {
  onSearch: () => void;
  onReset: () => void;
  searchDisabled?: boolean;
  /** Search button text */
  searchText?: React.ReactNode;
  /** Reset button text */
  resetText?: React.ReactNode;
}

export const SearchButtons: React.FC<SearchButtonsProps> = ({
  onSearch,
  onReset,
  searchDisabled = false,
  searchText = "查询",
  resetText = "重置",
}) => {
  return (
    <>
      <Button
        type="primary"
        onClick={onSearch}
        icon={<Icon icon="tabler:search" />}
        disabled={searchDisabled}
      >
        {searchText}
      </Button>
      <Button
        onClick={onReset}
        icon={<Icon icon="basil:refresh-solid" />}
        disabled={searchDisabled}
      >
        {resetText}
      </Button>
    </>
  );
};
