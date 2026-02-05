import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function AdminOrgs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      setMsg("");
      setLoading(true);
      const res = await api.get("/admin/organizations", { params: { status: "pending" } });
      setItems(res.data?.data || []);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function verify(id) {
    try {
      setMsg("");
      await api.patch(`/admin/organizations/${id}/verify`);
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Verify failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#050712] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">Admin • Pending organizations</h1>
        <p className="mt-1 text-slate-400">Duyệt tài khoản tổ chức để được tạo campaign.</p>

        {msg ? <div className="mt-4 text-rose-200">{msg}</div> : null}
        {loading ? <div className="mt-6 text-slate-400">Đang tải...</div> : null}

        {!loading ? (
          <div className="mt-6 space-y-3">
            {items.map((u) => (
              <div key={u._id} className="rounded-2xl border border-indigo-500/20 bg-white/5 p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{u.name || "—"}</div>
                  <div className="text-sm text-slate-400">{u.email}</div>
                  {u.orgDocUrl ? (
                    <div className="text-xs text-cyan-200 mt-1 break-all">{u.orgDocUrl}</div>
                  ) : null}
                </div>

                <button
                  onClick={() => verify(u._id)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400"
                >
                  Verify
                </button>
              </div>
            ))}
            {!items.length ? <div className="text-slate-400">Không có org pending.</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
