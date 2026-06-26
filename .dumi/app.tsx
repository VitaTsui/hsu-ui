import React from "react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import { configureRequest } from "../src/request";

// 文档站运行时（umi rootContainer）：与真实项目入口一致，全局提供 Chakra + emotion cache，
// 使依赖 Button.Chakra 的组件（Search / Panel.List 等）在所有 Demo 中开箱即用，
// 无需每个 Demo 单独包 ChakraProvider。
const cache = createCache({ key: "css", prepend: true });
const system = createSystem(defaultConfig, {
  disableLayers: true,
  preflight: false,
});

// 给依赖 request 的智能组件（如 ImportForm 下载模板）注入 Demo 用的假请求，避免未注入报错。
configureRequest({
  get: async () => ({
    code: 0,
    data: { filename: "demo", data: new ArrayBuffer(0) },
  }),
  post: async () => ({ code: 0, data: undefined }),
  del: async () => ({ code: 0, data: undefined }),
  put: async () => ({ code: 0, data: undefined }),
});

export function rootContainer(container: React.ReactNode) {
  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={system}>{container}</ChakraProvider>
    </CacheProvider>
  );
}
