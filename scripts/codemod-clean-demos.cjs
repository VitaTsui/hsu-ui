/* 清理组件文档 Demo：移除 maxWidth 限制与「当前值：…」展示行 */
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

  // 1) 删除「当前值：…」展示行（含其上方可能的空行收尾在后面统一处理）
  s = s
    .split("\n")
    .filter((line) => !/当前值[：:]/.test(line))
    .join("\n");

  // 2) 移除 style 里只有 maxWidth 的属性：style={{ maxWidth: 320 }} -> 整个属性删掉
  s = s.replace(/\s*style=\{\{\s*maxWidth:\s*\d+\s*\}\}/g, "");

  // 3) 移除多属性对象里的 maxWidth（带前导逗号）
  s = s.replace(/,\s*maxWidth:\s*\d+/g, "");
  // 4) 移除作为首属性的 maxWidth（带后随逗号）
  s = s.replace(/maxWidth:\s*\d+\s*,\s*/g, "");

  if (s !== orig) {
    fs.writeFileSync(file, s);
    changed++;
  }
}
console.log(`cleaned ${changed} doc files (removed maxWidth & 当前值 lines)`);
