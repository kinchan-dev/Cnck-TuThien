import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";
const pct = (raised, target) => (!target ? 0 : Math.floor((Number(raised || 0) / Number(target)) * 100));

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

export default function Campaigns() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/campaign", { params: { q, category } });
      setItems(res.data?.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }, [q, category]);

  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  const categories = useMemo(() => ([
    { value: "", label: "All" },
    { value: "education", label: "Education" },
    { value: "disaster", label: "Disaster" },
    { value: "medical", label: "Medical" },
    { value: "other", label: "Other" },
  ]), []);

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 bg-grid">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                            bg-white/5 border border-indigo-500/25 text-indigo-200">
              Browse • filter • donate
            </div>
            <h1 className="mt-3 text-3xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                Campaign Listing
              </span>
            </h1>
            <p className="mt-2 text-slate-400">Tìm kiếm và lọc chiến dịch. Quyên góp sẽ được ghi nhận on-chain để minh bạch.</p>
          </div>

          <Link
            to="/create"
            className="inline-flex justify-center items-center rounded-xl px-4 py-3 font-semibold
                       bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400
                       text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
          >
            + Create Campaign
          </Link>
        </div>

        <div className="mt-6 rounded-2xl glass neon-border p-4 md:p-5">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="text-xs text-slate-400">Search</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên hoặc mô tả…"
                className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3
                           outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <div className="text-xs text-slate-400">Category</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? <div className="mt-6 text-slate-300">Đang tải…</div> : null}
        {err ? <div className="mt-6 text-rose-200">Lỗi: {err}</div> : null}

        {!loading && !err ? (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {items.map((c) => {
              const progress = Math.min(100, Math.max(0, pct(c.totalRaised, c.targetAmount)));
              return (
                <Link
                  key={c._id}
                  to={`/campaign/${c._id}`}
                  className="rounded-2xl glass neon-border p-5 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-indigo-200 bg-white/5 border border-indigo-500/20 rounded-full px-2 py-1">
                      ChainID #{c.blockchainCampaignId}
                    </div>
                    <div className="text-xs text-slate-400">{(c.category || "other").toUpperCase()}</div>
                  </div>

                  <div className="mt-3 text-lg font-extrabold">{c.name}</div>
                  <div className="mt-1 text-sm text-slate-400 line-clamp-2">{c.description || "—"}</div>

                  <div className="mt-4">
                    <ProgressBar value={progress} />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <div>Raised: <span className="text-slate-200 font-semibold">{fmt(c.totalRaised)}</span></div>
                      <div>Target: <span className="text-slate-200 font-semibold">{fmt(c.targetAmount)}</span></div>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                    View detail →
                  </div>
                </Link>
              );
            })}
            {!items.length ? <div className="text-slate-400">Không có chiến dịch phù hợp.</div> : null}
          </div>
        ) : null}
      </section>

    </div>
  );
}
