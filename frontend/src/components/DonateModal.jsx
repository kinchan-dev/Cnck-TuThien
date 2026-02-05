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
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">Quyên góp</div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-600">Số tiền (VND)</label>
          <input
            value={amountVND}
            onChange={(e) => setAmountVND(e.target.value)}
            placeholder="Ví dụ: 50000"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {msg ? <div className="mt-3 text-sm">{msg}</div> : null}

        <button
          disabled={loading}
          onClick={submit}
          className="mt-5 w-full rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Quyên góp"}
        </button>
      </div>
    </div>
  );
}
