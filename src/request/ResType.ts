/** Generic response wrapper: the { code, data, msg } structure agreed with the backend */
export interface ResType<T = unknown> {
  code: number;
  data: T;
  msg?: string;
}

/** Paginated list response */
export interface ListRes<T> {
  list: Array<T>;
  page: {
    pageNum: number;
    pageSize: number;
    total: number;
  };
}

/** File response (binary download) */
export interface FileRes {
  filename: string;
  data: ArrayBuffer;
}
