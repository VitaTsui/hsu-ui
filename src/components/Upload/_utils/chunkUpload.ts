import axios, { Canceler } from "axios";
import { RcFile } from "antd/es/upload";
import { getUUID } from "../../../utils";
import { deepCopy } from "hsu-utils";
import { toMB, validateFile, createFormData, isSuccessResponse } from ".";
import { UploadingList } from "..";

interface ChunkUploadOptions {
  file: RcFile;
  chunkAction: string;
  mergeChunkAction: string;
  chunkNum: number;
  data?: Partial<Record<string, string>>;
  headers?: Record<string, string>;
  accept?: string;
  size?: number;
  en?: boolean;
  uploadingList: UploadingList;
  setUploadingList: (list: UploadingList) => void;
  onProgress?: (progress: { percent: number }) => void;
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error) => void;
  onUploadSuccess?: () => void;
}

/**
 * Chunked upload
 */
export async function chunkUpload({
  file,
  chunkAction,
  mergeChunkAction,
  chunkNum,
  data,
  headers,
  accept,
  size,
  en,
  uploadingList,
  setUploadingList,
  onProgress,
  onSuccess,
  onError,
  onUploadSuccess,
}: ChunkUploadOptions) {
  // Validate the file
  const validation = validateFile({ file, accept, size, en });
  if (!validation.valid) {
    onError?.(validation.error!);
    return;
  }

  const name = file.name;
  const uploadId = getUUID();
  const sliceSize = toMB(5); // Chunk size, 5MB per chunk
  const totalSlices = Math.ceil(file.size / sliceSize); // Get the number of chunks

  let chunk = 0;
  let postPromises: Promise<{ data?: { code?: number; msg?: string } }>[] = [];
  let success = 0;
  const CancelToken = axios.CancelToken;

  while (chunk < totalSlices) {
    const start = chunk * sliceSize;
    const end = Math.min(start + sliceSize, file.size);
    const slice = file.slice(start, end);

    const formData = createFormData(data);
    formData.append("file", slice);
    formData.append("chunkNum", `${chunk}`);
    formData.append("fileName", name);
    formData.append("uploadId", uploadId);

    const postPromise = axios.post(chunkAction, formData, {
      headers,
      onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
        if (progressEvent.loaded === progressEvent.total) {
          success += 0.5;
          const overallProgress = Math.round((success / totalSlices) * 100);
          onProgress?.({ percent: overallProgress });
        }
      },
      cancelToken: new CancelToken(function executor(c: Canceler) {
        uploadingList[file.uid]
          ? uploadingList[file.uid].push(c)
          : (uploadingList[file.uid] = [c]);
        setUploadingList(deepCopy(uploadingList));
      }),
    });

    postPromise.then((res: { data: any }) => {
      if (isSuccessResponse(res.data)) {
        success += 0.5;
        const overallProgress = Math.round((success / totalSlices) * 100);
        onProgress?.({ percent: overallProgress });
      }
    });

    postPromises.push(postPromise);

    if ((chunk + 1) % chunkNum === 0) {
      try {
        const arrList = await Promise.all(postPromises);
        const errorList = arrList.filter(
          (v) => !v.data || !isSuccessResponse(v.data)
        );

        postPromises = [];
        delete uploadingList[file.uid];
        setUploadingList(deepCopy(uploadingList));

        if (errorList.length) {
          onError?.(
            new Error(
              errorList.slice(-1)?.[0]?.data?.msg ||
                (en ? "Upload failed" : "上传失败")
            )
          );
          return;
        }
      } catch (e) {
        if ((e as { code: string }).code === "ERR_CANCELED") {
          onSuccess?.({ code: "ERR_CANCELED" });
        } else {
          onError?.(new Error(en ? "Upload failed" : "上传失败"));
        }

        postPromises = [];
        delete uploadingList[file.uid];
        setUploadingList(deepCopy(uploadingList));
        return;
      }
    }

    chunk++;
  }

  try {
    const arrList = await Promise.all(postPromises);
    const errorList = arrList.filter(
      (v) => !v.data || !isSuccessResponse(v.data)
    );

    if (!errorList.length) {
      const formData = createFormData(data);
      formData.append("chunkCount", `${totalSlices}`);
      formData.append("fileName", name);
      formData.append("uploadId", uploadId);

      const res = await axios.post(mergeChunkAction, formData);

      if (isSuccessResponse(res.data)) {
        onSuccess?.(res.data);
        onUploadSuccess?.();
      } else {
        onError?.(
          new Error(res.data.msg || (en ? "Upload failed" : "上传失败"))
        );
      }
    } else {
      onError?.(
        new Error(
          errorList.slice(-1)?.[0]?.data?.msg ||
            (en ? "Upload failed" : "上传失败")
        )
      );
    }
  } catch (e) {
    if ((e as { code: string }).code === "ERR_CANCELED") {
      onSuccess?.({ code: "ERR_CANCELED" });
    } else {
      onError?.(new Error(en ? "Upload failed" : "上传失败"));
    }
  }

  postPromises = [];
  delete uploadingList[file.uid];
  setUploadingList(deepCopy(uploadingList));
}
