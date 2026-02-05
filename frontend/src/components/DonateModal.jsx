import { useState } from "react";
import { api } from "../services/api.js";

export default function DonateModal({ open, onClose, campaignId, onSuccess }) {
  const [amountVND, setAmountVND] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!open) return null;

  async function submit() {
    try {
      setMsg("");
      const n = Number(amountVND);
      if (!Number.isFinite(n) || n <= 0) return setMsg("Số tiền không hợp lệ");

      setLoading(true);
      const res = await api.post("/donate", {
                          campaignMongoId: campaignId,    
                          amountVND: Number(amountVND),     
                          paymentTxHash: `mock-${Date.now()}`
                        });
      setMsg("✅ Quyên góp thành công!");
      onSuccess?.(res.data);
      setTimeout(() => onClose?.(), 700);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Donate failed");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center px-4">
    <div className="w-full max-w-md rounded-2xl glass neon-border p-5">
      <div className="flex items-center justify-between">
        <div className="font-bold text-lg">Quyên góp</div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <div className="mt-4">
        <label className="text-sm text-slate-300">Số tiền (VND)</label>
        <input
          value={amountVND}
          onChange={(e) => setAmountVND(e.target.value)}
          placeholder="Ví dụ: 50000"
          className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/25 px-4 py-3
                     outline-none focus:ring-2 focus:ring-cyan-400/30"
        />
      </div>

      {msg ? <div className="mt-3 text-sm text-slate-200">{msg}</div> : null}

      <button
        disabled={loading}
        onClick={submit}
        className="mt-5 w-full rounded-xl px-4 py-3 font-semibold disabled:opacity-60
                   bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400
                   text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
      >
        {loading ? "Đang xử lý..." : "Quyên góp"}
      </button>
    </div>
  </div>
);
}
