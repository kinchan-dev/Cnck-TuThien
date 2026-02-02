import ProgressBar from "./ProgressBar";
import { formatVND, pct } from "../services/format";
import { Link } from "react-router-dom";

export default function CampaignCard({ c }) {
  const percent = pct(c.totalRaised, c.targetAmount);

  return (
    <div className="rounded-2xl border border-indigo-400/20 bg-white/5 p-5 hover:border-indigo-400/40 transition shadow-[0_0_0_1px_rgba(99,102,241,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{c.name}</div>
          <div className="text-sm text-white/60 line-clamp-2">{c.description}</div>
        </div>
        <div className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-400/20">
          ChainID: #{c.blockchainCampaignId}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <ProgressBar value={percent} />
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Raised: <b className="text-white">{formatVND(c.totalRaised)}</b></span>
          <span>Target: <b className="text-white">{formatVND(c.targetAmount)}</b></span>
        </div>
      </div>

      <Link
        to={`/campaign/${c._id}`}
        className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-xl border border-indigo-400/25 bg-indigo-500/10 hover:bg-indigo-500/15"
      >
        View Details
      </Link>
    </div>
  );
}
