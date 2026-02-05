import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DonateModal from "../components/DonateModal.jsx";
import { api } from "../services/api.js";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";
const pct = (raised, target) => (!target ? 0 : Math.round((Number(raised || 0) / Number(target)) * 100));

function ProgressBar({ value }) {
  return (
    <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-indigo-500/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function TxTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-slate-400">
          <tr className="border-b border-indigo-500/10">
            <th className="text-left py-2 pr-3">Time</th>
            <th className="text-right py-2 px-3">Amount</th>
            <th className="text-left py-2 pl-3">Tx</th>
          </tr>
        </thead>
        <tbody>
          {rows?.length ? rows.map((r) => (
            <tr key={r._id} className="border-b border-indigo-500/10">
              <td className="py-2 pr-3 text-slate-300">
                {new Date(r.createdAt).toLocaleString("vi-VN")}
              </td>
              <td className="py-2 px-3 text-right font-semibold text-slate-100">
                {fmt(r.amountVND)}
              </td>
              <td className="py-2 pl-3">
                {r.blockchainTxHash ? (
                  <a
                    className="font-mono text-cyan-200 hover:text-cyan-100"
                    href={`https://sepolia.etherscan.io/tx/${r.blockchainTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {r.blockchainTxHash.slice(0, 10)}…
                  </a>
                ) : <span className="text-slate-500">—</span>}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={3} className="py-4 text-slate-400">Chưa có giao dịch.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function CampaignDetail() {
  const { id } = useParams(); // Mongo _id
  const [campaign, setCampaign] = useState(null);
  const [onchain, setOnchain] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openDonate, setOpenDonate] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get(`/campaign/${id}`);
      setCampaign(res.data?.data);
      setOnchain(res.data?.onchain || null);

      const txRes = await api.get(`/donations/${id}`);
      setTxs(txRes.data?.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A14] text-slate-100 bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-10 text-slate-300">Đang tải…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-[#070A14] text-slate-100 bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-10 text-rose-200">Lỗi: {err}</div>
      </div>
    );
  }

  if (!campaign) return null;

  const progress = Math.min(100, Math.max(0, pct(campaign.totalRaised, campaign.targetAmount)));

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 bg-grid">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                            bg-white/5 border border-indigo-500/25 text-indigo-200">
              Chain Campaign #{campaign.blockchainCampaignId}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold">{campaign.name}</h1>
            <p className="mt-2 text-slate-400">{campaign.description || "—"}</p>

            <div className="mt-6 rounded-2xl glass neon-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Đã quyên góp</div>
                  <div className="text-2xl font-extrabold">{fmt(campaign.totalRaised)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Mục tiêu</div>
                  <div className="text-xl font-bold">{fmt(campaign.targetAmount)}</div>
                </div>
              </div>

              <div className="mt-4">
                <ProgressBar value={progress} />
                <div className="mt-2 text-xs text-slate-400">
                  Progress: <span className="text-cyan-200 font-semibold">{progress}%</span>
                </div>
              </div>

              <button
                onClick={() => setOpenDonate(true)}
                className="mt-5 w-full rounded-xl px-4 py-3 font-semibold
                           bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400
                           text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
              >
                Quyên góp
              </button>
            </div>

            {onchain ? (
              <div className="mt-6 rounded-2xl glass neon-border p-5">
                <div className="font-bold">On-chain snapshot</div>
                <div className="mt-3 text-sm text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400">Owner:</span>{" "}
                    <span className="font-mono text-cyan-200">{onchain.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Donations (VND):</span>{" "}
                    <span className="font-semibold">{fmt(onchain.totalDonations)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Donation Count:</span>{" "}
                    <span className="font-semibold">{onchain.donationCount}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full lg:w-[440px]">
            <div className="rounded-2xl glass neon-border p-5">
              <div className="font-bold">Lịch sử giao dịch</div>
              <div className="mt-4">
                <TxTable rows={txs} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <DonateModal
        open={openDonate}
        onClose={() => setOpenDonate(false)}
        campaignId={campaign._id}
        onSuccess={() => load()}
      />

    </div>
  );
}
