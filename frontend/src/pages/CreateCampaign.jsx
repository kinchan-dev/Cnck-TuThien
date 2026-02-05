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
      setMsg("✅ Tạo chiến dịch thành công (on-chain + MongoDB)!");
      setTimeout(() => nav(`/campaign/${created._id}`), 650);
    } catch (e) {
      const m = e?.response?.data?.message || (e?.response?.data?.errors ? JSON.stringify(e.response.data.errors) : "") || e.message;
      setMsg(m || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 bg-grid">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                        bg-white/5 border border-indigo-500/25 text-indigo-200">
          Create campaign • on-chain
        </div>

        <h1 className="mt-3 text-3xl font-extrabold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
            Tạo chiến dịch
          </span>
        </h1>
        <p className="mt-2 text-slate-400">Tạo campaign trên blockchain + lưu MongoDB để hiển thị nhanh.</p>

        <div className="mt-6 rounded-2xl glass neon-border p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-300">Tên chiến dịch</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3
                         outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Ví dụ: Ủng hộ trẻ em vùng cao"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full min-h-[120px] rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3
                         outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Mục tiêu, đối tượng, kế hoạch sử dụng..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300">Mục tiêu (VND)</label>
              <input
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3
                           outline-none focus:ring-2 focus:ring-cyan-400/30"
                placeholder="20000000"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
              >
                <option value="education">Education</option>
                <option value="disaster">Disaster</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {msg ? <div className="text-sm text-slate-200">{msg}</div> : null}

          <button
            disabled={loading}
            onClick={submit}
            className="w-full rounded-xl px-4 py-3 font-semibold disabled:opacity-60
                       bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400
                       text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
          >
            {loading ? "Đang tạo..." : "Tạo chiến dịch"}
          </button>
        </div>
      </section>

    </div>
  );
}
