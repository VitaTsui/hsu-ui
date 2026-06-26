import React, { useMemo } from "react";

import { PermissionsContent } from "../hooks/usePermissions";
import { configureRequest, RequestImpl } from "../request";

export interface ConfigProviderProps {
  /** 当前用户权限码列表；传入后 usePermissions / hasPermi 据此校验。不传则默认全部放行 */
  permissions?: string[] | null;
  /** 注入 HTTP 请求实现，供 ImportForm 等智能组件使用 */
  request?: Partial<RequestImpl>;
  children?: React.ReactNode;
}

/**
 * Hsu UI 全局配置：注入权限与请求实现。
 *
 * @example
 * <ConfigProvider permissions={perms} request={{ get, post, del, put }}>
 *   <App />
 * </ConfigProvider>
 */
const ConfigProvider: React.FC<ConfigProviderProps> = ({
  permissions = null,
  request,
  children,
}) => {
  // 在渲染期同步注入，确保子组件首次交互即可拿到 request 实现
  useMemo(() => {
    if (request) configureRequest(request);
  }, [request]);

  const permissionsValue = useMemo(() => ({ permissions }), [permissions]);

  return (
    <PermissionsContent.Provider value={permissionsValue}>
      {children}
    </PermissionsContent.Provider>
  );
};

export default ConfigProvider;
