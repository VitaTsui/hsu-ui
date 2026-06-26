/* 将 src 下所有 @/ 别名导入改写为包内相对路径 */
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "../src");

// 别名 -> src 内目标路径（相对 src）
function mapAlias(spec) {
  if (spec === "@/services/Axios") return "request";
  if (spec === "@/services/ResType") return "request";
  if (spec.startsWith("@/services/")) return "request";
  if (spec === "@/utils") return "utils";
  if (spec.startsWith("@/utils/")) return "utils/" + spec.slice("@/utils/".length);
  if (spec.startsWith("@/hooks/")) return "hooks/" + spec.slice("@/hooks/".length);
  if (spec === "@/hooks") return "hooks";
  if (spec.startsWith("@/components/"))
    return "components/" + spec.slice("@/components/".length);
  if (spec === "@/components") return "components";
  return null; // 未知别名，保留并告警
}

function toRel(fromFile, targetRelToSrc) {
  const targetAbs = path.join(SRC, targetRelToSrc);
  let rel = path.relative(path.dirname(fromFile), targetAbs);
  rel = rel.split(path.sep).join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  }
  return files;
}

const IMPORT_RE = /(from\s+|import\s*\(\s*|require\(\s*)(["'])(@\/[^"']+)\2/g;
let changed = 0;
const unknown = new Set();

for (const file of walk(SRC)) {
  const orig = fs.readFileSync(file, "utf8");
  const next = orig.replace(IMPORT_RE, (m, kw, q, spec) => {
    const mapped = mapAlias(spec);
    if (!mapped) {
      unknown.add(spec);
      return m;
    }
    const rel = toRel(file, mapped);
    return `${kw}${q}${rel}${q}`;
  });
  if (next !== orig) {
    fs.writeFileSync(file, next);
    changed++;
  }
}

console.log(`rewrote ${changed} files`);
if (unknown.size) console.log("UNKNOWN aliases left:", [...unknown]);
