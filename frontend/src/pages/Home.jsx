import { useEffect, useState } from "react";
import { fetchCampaigns } from "../services/api";
import CampaignCard from "../components/CampaignCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const data = await fetchCampaigns();
        if (alive) setItems(data);
      } catch (e) {
        setErr(e.response?.data?.message || e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-grid rounded-3xl border border-indigo-500/20 p-6 md:p-10 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-500/15 blur-3xl rounded-full" />

        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Minh bạch quyên góp · ghi nhận on-chain
          </h1>
          <p className="text-white/60 mt-2 max-w-2xl">
            Thanh toán VND off-chain (mock). Backend xác nhận và ghi nhận giao dịch lên Ethereum testnet.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {loading && <div className="text-white/70">Loading campaigns...</div>}
        {err && <div className="text-red-300">{err}</div>}

        {!loading && !err && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((c) => (
              <CampaignCard key={c._id} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
