import { useEffect, useRef, useState } from "react";
import { deepCopy, Equal } from "hsu-utils";
import { UploadingList } from "..";

interface UseUploadOperationsProps {
  onUploadingList?: (list: UploadingList) => void;
}

/**
 * Manage upload and download operations
 */
export function useUploadOperations({
  onUploadingList,
}: UseUploadOperationsProps) {
  const [uploadingList, setUploadingList] = useState<UploadingList>({});
  const [lastUploadList, setLastUploadList] = useState<UploadingList>({});
  const [downloading, setDownloading] = useState<
    Record<string, AbortController>
  >({});
  const operationsRef = useRef<{
    downloading: Record<string, AbortController>;
    uploadingList: UploadingList;
  }>({
    downloading: {},
    uploadingList: {},
  });

  // Sync to the ref on update
  useEffect(() => {
    operationsRef.current.downloading = downloading;
  }, [downloading]);

  useEffect(() => {
    operationsRef.current.uploadingList = uploadingList;
  }, [uploadingList]);

  useEffect(() => {
    if (!Equal.ObjEqual(uploadingList, lastUploadList)) {
      onUploadingList?.(deepCopy(uploadingList));
      setLastUploadList(deepCopy(uploadingList));
    }
  }, [uploadingList, lastUploadList, onUploadingList]);

  // Cleanup function
  useEffect(() => {
    return () => {
      const {
        downloading: currentDownloading,
        uploadingList: currentUploadingList,
      } = operationsRef.current;

      Object.values(currentDownloading)?.forEach((controller) => {
        controller?.abort();
      });

      Object.values(currentUploadingList)?.forEach((controllers) => {
        controllers?.forEach((c) => c?.());
      });

      operationsRef.current = {
        downloading: {},
        uploadingList: {},
      };
      setDownloading({});
      setUploadingList({});
      setLastUploadList({});
    };
  }, []);

  return {
    uploadingList,
    setUploadingList,
    downloading,
    setDownloading,
    operationsRef,
  };
}
