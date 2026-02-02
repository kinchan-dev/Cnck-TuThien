export default function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: `${v}%` }} />
      </div>
      <div className="mt-2 text-right text-xs text-slate-500">{v}%</div>
    </div>
  );
}
