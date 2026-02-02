import { useEffect, useState } from "react";
import { donateVND } from "../services/api";
import { formatVND } from "../services/format";

export default function DonateModal({ open, onClose, campaign }) {
  const [amountVND, setAmountVND] = useState(50000);
  const [provider, setProvider] = useState("VNPay");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setOkMsg("");
      setErr("");
    }
  }, [open]);

  if (!open) return null;

  const onSubmit = async () => {
    setErr("");
    setOkMsg("");
    setLoading(true);
    try {
      const r = await donateVND({
        campaignMongoId: campaign._id,
        amountVND: Number(amountVND),
        paymentProvider: provider
      });
      setOkMsg(`Success! Blockchain tx: ${r.blockchain.txHash}`);
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[92%] max-w-lg rounded-2xl border border-indigo-400/30 bg-[#0A0F22] p-6 shadow-neon">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Donate (VND)</div>
            <div className="text-sm text-white/60">{campaign.name}</div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="text-sm text-white/70 mb-1">Payment Provider (mock)</div>
            <select
              className="w-full rounded-xl bg-white/5 border border-indigo-400/20 px-3 py-2"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="VNPay">VNPay</option>
              <option value="MoMo">MoMo</option>
            </select>
          </div>

          <div>
            <div className="text-sm text-white/70 mb-1">Amount</div>
            <input
              type="number"
              min={1}
              className="w-full rounded-xl bg-white/5 border border-indigo-400/20 px-3 py-2"
              value={amountVND}
              onChange={(e) => setAmountVND(e.target.value)}
            />
            <div className="text-xs text-white/50 mt-1">Preview: {formatVND(amountVND)}</div>
          </div>

          {err && <div className="text-sm text-red-300">{err}</div>}
          {okMsg && <div className="text-sm text-emerald-300">{okMsg}</div>}

          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Quyên góp"}
          </button>

          <div className="text-xs text-white/50">
            * Tiền VND xử lý off-chain (mock). Sau đó backend ghi nhận on-chain để minh bạch.
          </div>
        </div>
      </div>
    </div>
  );
}
