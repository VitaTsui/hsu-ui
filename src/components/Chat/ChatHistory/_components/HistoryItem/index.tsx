import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Dropdown } from "antd";
import Icon from "../../../../Icon";
import Input from "../../../../Input";
import SecondConf from "../../../../SecondConf";
import styles from "./index.module.scss";
import { ChatHistoryData } from "../..";
import { formatChatName } from "../../_utils";
import TextEllipsis from "../../../../TextEllipsis";

interface HistoryItemProps {
  item: ChatHistoryData;
  isActive: boolean;
  updateTitle?: (chatId: string, title: string) => void;
  deleteHistory?: (item?: ChatHistoryData) => void;
  onClick?: (item: ChatHistoryData) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  isActive,
  updateTitle,
  deleteHistory,
  onClick,
}) => {
  // Rename-related state
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [currentTitle, setCurrentTitle] = useState(formatChatName(item.name));
  // Tracks whether a rename has just completed, to avoid being immediately overwritten by external updates
  const justRenamedRef = useRef(false);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState(false);

  // Initialize the rename title
  useEffect(() => {
    if (isRenaming) {
      setRenameTitle(currentTitle);
    }
  }, [isRenaming, currentTitle]);

  // Sync changes of item.name to currentTitle (only when not renaming)
  useEffect(() => {
    if (!isRenaming && !justRenamedRef.current) {
      const formattedName = formatChatName(item.name);
      setCurrentTitle(formattedName);
    }
    // Reset the rename flag
    if (justRenamedRef.current) {
      justRenamedRef.current = false;
    }
  }, [item.name, item.conversationId, isRenaming]);

  const handleRename = () => {
    setIsRenaming(true);
  };

  const handleRenameConfirm = () => {
    const newTitle = renameTitle.trim();
    if (newTitle && updateTitle) {
      updateTitle(item.conversationId, newTitle);
      // Update the displayed title first to immediately show the user-entered name
      setCurrentTitle(newTitle);
      // Mark that a rename has just completed, to avoid being immediately overwritten by external updates
      justRenamedRef.current = true;
    }
    setIsRenaming(false);
    setRenameTitle("");
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setRenameTitle("");
    setCurrentTitle(formatChatName(item.name));
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteModal(false);
    deleteHistory?.(item);
  };

  const dropdownItems = [
    {
      key: "rename",
      label: (
        <span className={styles.dropdownItem}>
          <Icon icon="ri:pencil-line" />
          重命名
        </span>
      ),
      onClick: handleRename,
    },
    {
      key: "delete",
      label: (
        <span className={classNames(styles.dropdownItem, styles.delete)}>
          <Icon icon="ri:delete-bin-line" />
          删除
        </span>
      ),
      onClick: handleDelete,
    },
  ];

  if (isRenaming) {
    return (
      <Input
        className={styles.renameInput}
        onClick={(e) => e.stopPropagation()}
        value={renameTitle}
        onChange={(value) => setRenameTitle(value)}
        onBlur={handleRenameCancel}
        onPressEnter={handleRenameConfirm}
        autoFocus={true}
      />
    );
  }

  return (
    <>
      <div
        className={classNames(styles.historyItem, {
          [styles.active]: isActive,
        })}
        onClick={() => onClick?.(item)}
      >
        <TextEllipsis>{currentTitle}</TextEllipsis>

        <Dropdown
          menu={{
            items: dropdownItems,
            onClick: ({ domEvent }) => {
              domEvent.stopPropagation();
            },
          }}
          placement="bottomRight"
        >
          <div
            className={styles.operation}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon icon="ri:more-fill" />
          </div>
        </Dropdown>
      </div>
      <SecondConf
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        contentTitle="删除"
        contentText="删除后，该会话将无法恢复，请确认是否继续？"
        okButtonProps={{
          danger: true,
        }}
        onOk={handleDeleteConfirm}
        width={"40%"}
      />
    </>
  );
};

export default HistoryItem;
