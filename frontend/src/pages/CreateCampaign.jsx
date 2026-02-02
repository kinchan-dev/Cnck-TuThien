import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function CreateCampaign() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit() {
    try {
      setMsg("");
      if (!name.trim()) return setMsg("Tên chiến dịch bắt buộc");
      const t = Number(targetAmount);
      if (!Number.isFinite(t) || t <= 0) return setMsg("Mục tiêu không hợp lệ");

      setLoading(true);
      const res = await api.post("/campaign", { name, description, targetAmount: t, category });
      const created = res.data?.data;
      setMsg("✅ Tạo chiến dịch thành công!");
      setTimeout(() => nav(`/campaign/${created._id}`), 700);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Tạo chiến dịch</h1>
      <p className="mt-1 text-slate-600">Tạo campaign trên blockchain + lưu MongoDB.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="text-sm text-slate-600">Tên chiến dịch</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Ví dụ: Ủng hộ trẻ em vùng cao"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Mục tiêu, đối tượng, kế hoạch sử dụng..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Mục tiêu (VND)</label>
            <input
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="20000000"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white"
            >
              <option value="education">Education</option>
              <option value="disaster">Disaster</option>
              <option value="medical">Medical</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {msg ? <div className="text-sm">{msg}</div> : null}

        <button
          disabled={loading}
          onClick={submit}
          className="w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-semibold hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Đang tạo..." : "Tạo chiến dịch"}
        </button>
      </div>
    </section>
  );
}
