import { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { api } from "../services/api.js";

export default function Campaigns() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
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
  }

  useEffect(() => {
    load(); // initial
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 350); // debounce
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Tất cả chiến dịch</h1>
          <p className="mt-1 text-slate-600">Tìm kiếm & lọc chiến dịch theo nhu cầu.</p>
        </div>
      </div>

      <div className="mt-6">
        <SearchBar q={q} setQ={setQ} category={category} setCategory={setCategory} />
      </div>

      {loading ? <div className="mt-6 text-slate-600">Đang tải...</div> : null}
      {err ? <div className="mt-6 text-red-700">Lỗi: {err}</div> : null}

      {!loading && !err ? (
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {items.map((c) => (
            <CampaignCard key={c._id} c={c} />
          ))}
          {!items.length ? <div className="text-slate-600">Không có chiến dịch phù hợp.</div> : null}
        </div>
      ) : null}
    </section>
  );
}
