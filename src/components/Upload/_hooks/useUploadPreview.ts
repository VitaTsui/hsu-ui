import { useState } from "react";
import { FilePreviewType } from "../../FilePreview";

/**
 * Manage the file preview state
 */
export function useUploadPreview() {
  const [file, setFile] = useState<{
    fileUrl?: string;
    fileType?: FilePreviewType;
    fileName?: string;
  }>({});

  return {
    file,
    setFile,
    open: !!file.fileUrl,
  };
}

