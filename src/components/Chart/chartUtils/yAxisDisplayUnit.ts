/**
 * Dashboard (large-screen) Y-axis: when converting to "万 (10^4) / 亿 (10^8)" or MB/GB/TB units,
 * the converted tick step must be >= 1, avoiding tick labels smaller than 1 such as "0.2万" or "0.5GB".
 */

export const MB_PER_GB = 1024;
export const MB_PER_TB = 1024 * 1024;

export function trimAxisNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2).replace(/\.?0+$/, "");
  return s === "" || s === "-" ? "0" : s;
}

/** Chinese magnitude: scale by "万" (10^4) / "亿" (10^8) only when both the max value and the tick interval reach that magnitude */
export function chineseMagnitudeDivisor(
  max: number,
  interval: number,
): 1 | 10_000 | 100_000_000 {
  const m = Number.isFinite(max) ? max : 0;
  const iv = Number.isFinite(interval) ? interval : 0;
  if (m >= 1e8 && iv >= 1e8) return 100_000_000;
  if (m >= 1e4 && iv >= 1e4) return 10_000;
  return 1;
}

export function formatChineseMagnitudeTick(
  value: number,
  max: number,
  interval: number,
): string {
  const v = Number(value);
  if (v === 0) return "0";
  const div = chineseMagnitudeDivisor(max, interval);
  if (div === 1) return trimAxisNumber(v);
  return trimAxisNumber(v / div);
}

/** MB tiering: promote to GB/TB only when both the max value and the tick interval are >= 1 in that unit */
export function mbDisplayTier(
  maxMb: number,
  intervalMb: number,
): "MB" | "GB" | "TB" {
  const m = Number.isFinite(maxMb) ? maxMb : 0;
  const iv = Number.isFinite(intervalMb) ? intervalMb : 0;
  if (m >= MB_PER_TB && iv >= MB_PER_TB) return "TB";
  if (m >= MB_PER_GB && iv >= MB_PER_GB) return "GB";
  return "MB";
}

export function formatMbAxisTick(
  value: number,
  maxMb: number,
  intervalMb: number,
): string {
  const v = Number(value);
  if (v === 0) return "0";
  const tier = mbDisplayTier(maxMb, intervalMb);
  if (tier === "TB") return trimAxisNumber(v / MB_PER_TB);
  if (tier === "GB") return trimAxisNumber(v / MB_PER_GB);
  return trimAxisNumber(v);
}
