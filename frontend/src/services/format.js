export function formatVND(n) {
  const x = Number(n || 0);
  return x.toLocaleString("vi-VN") + " ₫";
}

export function pct(raised, target) {
  const r = Number(raised || 0);
  const t = Number(target || 0);
  if (t <= 0) return 0;
  return Math.min(100, Math.floor((r / t) * 100));
}
