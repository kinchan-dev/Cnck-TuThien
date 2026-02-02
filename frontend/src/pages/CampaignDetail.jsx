import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCampaignDetail, fetchDonationsByCampaign } from "../services/api";
import { formatVND, pct } from "../services/format";
import ProgressBar from "../components/ProgressBar";
import DonateModal from "../components/DonateModal";
import { ETH_EXPLORER_BASE } from "../services/config";

export default function CampaignDetail() {
  const { id } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [onchain, setOnchain] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openDonate, setOpenDonate] = useState(false);

  const percent = useMemo(() => {
    if (!campaign) return 0;
    return pct(campaign.totalRaised, campaign.targetAmount);
  }, [campaign]);

  const reload = async () => {
    setErr("");
    setLoading(true);
    try {
      const detail = await fetchCampaignDetail(id);
      setCampaign(detail.data);
      setOnchain(detail.onchain);

      const list = await fetchDonationsByCampaign(id);
      setTxs(list);
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10 text-white/70">Loading...</div>;
  }

  if (err) {
    return <div className="max-w-6xl mx-auto px-4 py-10 text-red-300">{err}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-3xl border border-indigo-400/20 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div>
            <div className="text-2xl font-semibold">{campaign.name}</div>
            <div className="text-white/60 mt-2">{campaign.description}</div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-400/20">
                MongoID: {campaign._id}
              </span>
              <span className="px-2 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-400/20">
                Chain CampaignID: #{campaign.blockchainCampaignId}
              </span>
              {onchain?.owner && (
                <span className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                  On-chain Owner: {onchain.owner}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setOpenDonate(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-90 shadow-neon"
          >
            Donate
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <ProgressBar value={percent} />
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Raised (DB): <b className="text-white">{formatVND(campaign.totalRaised)}</b></span>
            <span>Target: <b className="text-white">{formatVND(campaign.targetAmount)}</b></span>
          </div>

          {onchain && (
            <div className="text-xs text-white/50 mt-2">
              On-chain totalDonations: <b className="text-white">{formatVND(onchain.totalDonations)}</b> ·
              donationCount: <b className="text-white">{onchain.donationCount}</b>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-indigo-400/20 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Donation History</div>
          <button
            onClick={reload}
            className="px-3 py-2 rounded-xl border border-indigo-400/25 bg-indigo-500/10 hover:bg-indigo-500/15 text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-3">Time</th>
                <th className="text-left py-2 pr-3">Amount</th>
                <th className="text-left py-2 pr-3">PaymentTxHash</th>
                <th className="text-left py-2 pr-3">Blockchain Tx</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 pr-3 text-white/70">{new Date(t.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="py-3 pr-3">{formatVND(t.amountVND)}</td>
                  <td className="py-3 pr-3 text-white/70">{t.paymentTxHash || "-"}</td>
                  <td className="py-3 pr-3">
                    <a
                      className="text-indigo-300 hover:text-indigo-200 underline"
                      href={`${ETH_EXPLORER_BASE}${t.blockchainTxHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.blockchainTxHash.slice(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-white/50">
                    No donations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DonateModal
        open={openDonate}
        onClose={() => {
          setOpenDonate(false);
          reload(); // refresh after donate
        }}
        campaign={campaign}
      />
    </div>
  );
}
