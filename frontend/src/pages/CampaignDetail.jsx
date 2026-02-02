import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProgressBar from "../components/ProgressBar.jsx";
import DonateModal from "../components/DonateModal.jsx";
import TxTable from "../components/TxTable.jsx";
import { api } from "../services/api.js";

const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";
const pct = (raised, target) => (!target ? 0 : Math.round((Number(raised || 0) / Number(target)) * 100));

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [onchain, setOnchain] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openDonate, setOpenDonate] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get(`/campaign/${id}`);
      setCampaign(res.data?.data);
      setOnchain(res.data?.onchain || null);

      const txRes = await api.get(`/campaign/${id}/transactions`);
      setTxs(txRes.data?.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  // ✅ Không render Navbar/Footer ở đây nữa
  if (loading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        Đang tải...
      </div>
    );

  if (err)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-red-700">
        Lỗi: {err}
      </div>
    );

  if (!campaign) return null;

  const progress = Math.min(100, Math.max(0, pct(campaign.totalRaised, campaign.targetAmount)));

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="text-xs inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1">
              ChainID: #{campaign.blockchainCampaignId}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold">{campaign.name}</h1>
            <p className="mt-2 text-slate-600">{campaign.description || "—"}</p>

            <div className="mt-6 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Đã quyên góp</div>
                  <div className="text-2xl font-extrabold">{formatVND(campaign.totalRaised)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Mục tiêu</div>
                  <div className="text-xl font-bold">{formatVND(campaign.targetAmount)}</div>
                </div>
              </div>

              <div className="mt-4">
                <ProgressBar value={progress} />
              </div>

              <button
                onClick={() => setOpenDonate(true)}
                className="mt-5 w-full rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800"
              >
                Quyên góp
              </button>
            </div>

            {onchain ? (
              <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                <div className="font-bold">On-chain snapshot</div>
                <div className="mt-2 text-sm text-slate-700 space-y-1">
                  <div>
                    <span className="text-slate-500">Owner:</span>{" "}
                    <span className="font-mono">{onchain.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Donations (VND):</span>{" "}
                    {formatVND(onchain.totalDonations)}
                  </div>
                  <div>
                    <span className="text-slate-500">Donation Count:</span> {onchain.donationCount}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full md:w-[420px]">
            <div className="rounded-2xl border border-slate-200 p-5">
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
    </>
  );
}
