/* 移除 Demo 里逐个的 ChakraProvider 包裹（已由 .dumi/app.tsx 全局提供） */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../src/components");

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name === "index.md") files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const orig = fs.readFileSync(file, "utf8");
  let s = orig;
  // 移除 chakra import
  s = s.replace(
    /import \{ ChakraProvider, createSystem, defaultConfig \} from "@chakra-ui\/react";\n/g,
    "",
  );
  // 移除 const system = createSystem(defaultConfig, { ... });（含前后空行）
  s = s.replace(
    /\n?const system = createSystem\(defaultConfig, \{[^}]*\}\);\n/g,
    "",
  );
  // ChakraProvider 包裹替换为 Fragment（兼容单/多子节点）
  s = s.replace(/<ChakraProvider value=\{system\}>/g, "<>");
  s = s.replace(/<\/ChakraProvider>/g, "</>");
  if (s !== orig) {
    fs.writeFileSync(file, s);
    changed++;
  }
}
console.log(`unwrapped ChakraProvider in ${changed} files`);
