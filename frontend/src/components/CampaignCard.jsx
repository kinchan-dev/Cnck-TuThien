import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar.jsx";

const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";
const pct = (raised, target) => (!target ? 0 : Math.round((Number(raised || 0) / Number(target)) * 100));

export default function CampaignCard({ c }) {
  const progress = Math.min(100, Math.max(0, pct(c.totalRaised, c.targetAmount)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="h-44 bg-slate-100">
        <img
          alt="campaign"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1520975958225-4b65b0b9a3e3?w=1400&auto=format&fit=crop&q=60"
        />
      </div>

      <div className="p-5">
        <div className="text-xs inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1">
          ChainID: #{c.blockchainCampaignId}
        </div>

        <h3 className="mt-3 font-bold text-lg line-clamp-1">{c.name}</h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{c.description || "—"}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="font-semibold text-slate-900">{formatVND(c.totalRaised)}</div>
          <div className="text-slate-500">mục tiêu {formatVND(c.targetAmount)}</div>
        </div>

        <div className="mt-3">
          <ProgressBar value={progress} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={`/campaign/${c._id}`}
            className="flex-1 inline-flex justify-center items-center rounded-xl border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
          >
            Xem chi tiết
          </Link>

          <Link
            to={`/campaign/${c._id}`}
            className="inline-flex justify-center items-center rounded-xl bg-slate-900 text-white px-4 py-2 font-semibold hover:bg-slate-800"
          >
            Quyên góp
          </Link>
        </div>
      </div>
    </div>
  );
}
