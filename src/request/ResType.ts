/** 通用响应包装：与后端约定的 { code, data, msg } 结构 */
export interface ResType<T = unknown> {
  code: number;
  data: T;
  msg?: string;
}

/** 分页列表响应 */
export interface ListRes<T> {
  list: Array<T>;
  page: {
    pageNum: number;
    pageSize: number;
    total: number;
  };
}

/** 文件响应（二进制下载） */
export interface FileRes {
  filename: string;
  data: ArrayBuffer;
}
