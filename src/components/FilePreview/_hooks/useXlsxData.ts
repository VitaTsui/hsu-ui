import { useEffect, useState } from "react";
import { read, WorkBook } from "xlsx";

interface UseXlsxDataProps {
  fileType?: string;
  fileUrl?: string;
}

/**
 * Load and parse an xlsx file
 */
export function useXlsxData({ fileType, fileUrl }: UseXlsxDataProps) {
  const [xlsxData, setXlsxData] = useState<WorkBook | undefined>(undefined);

  useEffect(() => {
    if (fileType === "xlsx" && fileUrl) {
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const workbook = read(buffer);
          setXlsxData(workbook);
        });
    }
  }, [fileType, fileUrl]);

  return xlsxData;
}
