/**
 * Format the chat name (take the part before the ellipsis)
 */
export const formatChatName = (name: string): string => {
  return name.split("…")[0];
};

