import React, { useMemo } from "react";

import { PermissionsContent } from "../hooks/usePermissions";
import { configureRequest, RequestImpl } from "../request";

export interface ConfigProviderProps {
  /** Current user's permission code list; when provided, usePermissions / hasPermi validate against it. If omitted, everything is allowed by default */
  permissions?: string[] | null;
  /** Inject the HTTP request implementation, used by smart components such as ImportForm */
  request?: Partial<RequestImpl>;
  children?: React.ReactNode;
}

/**
 * Hsu UI global configuration: injects permissions and the request implementation.
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
  // Inject synchronously during render so child components get the request implementation on their very first interaction
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
