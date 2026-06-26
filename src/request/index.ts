import type { ResType } from "./ResType";

export * from "./ResType";

/** 请求配置（与常见 axios 封装兼容的子集） */
export interface RequestConfig<P = object> {
  params?: P;
  responseType?: string;
  headers?: Record<string, unknown>;
  /** 为 true 时该请求 401 不触发全局跳登录 */
  skipAuthRedirect?: boolean;
  [key: string]: unknown;
}

/**
 * 组件库内部「智能组件」依赖的请求实现接口。
 * 由使用方通过 ConfigProvider 的 `request` 或 `configureRequest()` 注入，
 * 组件库自身不绑定任何具体 HTTP 客户端。
 */
// 注意：config/data 用宽松类型，以兼容各类 axios 封装的方法签名差异
export interface RequestImpl {
  get<T = unknown>(url: string, config?: any): Promise<ResType<T>>;
  post<T = unknown>(url: string, data?: any, config?: any): Promise<ResType<T>>;
  del<T = unknown>(url: string, config?: any): Promise<ResType<T>>;
  put<T = unknown>(url: string, data?: any): Promise<ResType<T>>;
}

const notConfigured = (): never => {
  throw new Error(
    "[@hsu-react/ui] 尚未注入 request。请用 <ConfigProvider request={...}> 包裹应用，" +
      "或在入口调用 configureRequest({ get, post, del, put })。",
  );
};

let impl: RequestImpl = {
  get: notConfigured,
  post: notConfigured,
  del: notConfigured,
  put: notConfigured,
};

/** 注入真实的请求实现（可只注入用到的方法） */
export const configureRequest = (request: Partial<RequestImpl>): void => {
  impl = { ...impl, ...request } as RequestImpl;
};

export const get: RequestImpl["get"] = (url, config) => impl.get(url, config);
export const post: RequestImpl["post"] = (url, data, config) =>
  impl.post(url, data, config);
export const del: RequestImpl["del"] = (url, config) => impl.del(url, config);
export const put: RequestImpl["put"] = (url, data) => impl.put(url, data);
