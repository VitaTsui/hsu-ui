/* 把组件 .module.less 里的三方类名选择器（ant-/cm-/chakra-/lang-/x-spreadsheet）
   包进 :global(...)，避免被 CSS Modules 哈希——等价于原项目 webpack 的 PASS_CLS 放行，
   且对任意构建（dumi / 各 app）都通用，无需额外 webpack 配置。 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../src/components");

// LK 前缀放行（与 PASS_CLS 一致）
const TP = /\.(?:ant-|cm-|chakra-|lang-|x-spreadsheet)[A-Za-z0-9_-]*/g;

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".module.less")) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const orig = fs.readFileSync(file, "utf8");
  // 逐行处理：仅改写“选择器行”（含 { 的行，或纯选择器续行），避免误伤属性值。
  const lines = orig.split("\n");
  let touched = false;
  const next = lines
    .map((line) => {
      // 跳过属性行（含 ":" 且不含 "{"，且不是以选择器开头）——但三方类只出现在选择器里，
      // 属性值不会出现 ".ant-" 形态（var(--ant-) 没有点前缀），故可安全全行替换。
      if (!TP.test(line)) return line;
      TP.lastIndex = 0;
      const replaced = line.replace(TP, (m) => `:global(${m})`);
      if (replaced !== line) touched = true;
      return replaced;
    })
    .join("\n");
  // 去掉可能的双重包裹（原本已有 :global(.ant-..) 的极少数情况）
  const cleaned = next.replace(
    /:global\(\s*:global\((\.[A-Za-z0-9_-]+)\)\s*\)/g,
    ":global($1)",
  );
  if (cleaned !== orig) {
    fs.writeFileSync(file, cleaned);
    changed++;
    if (touched) {
      /* noop */
    }
  }
}
console.log(`wrapped third-party selectors in :global() across ${changed} files`);
