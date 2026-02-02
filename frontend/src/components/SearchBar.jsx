export default function SearchBar({ q, setQ, category, setCategory }) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm chiến dịch theo tên/mô tả..."
        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-xl border border-slate-200 px-4 py-3 bg-white"
      >
        <option value="">Tất cả loại</option>
        <option value="education">Education</option>
        <option value="disaster">Disaster</option>
        <option value="medical">Medical</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}
