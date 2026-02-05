import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { setAuth } from "../services/authStore.js";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("individual");
  const [name, setName] = useState("");
  const [orgDocUrl, setOrgDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setMsg("");
      setLoading(true);

      const payload = { email, password, accountType, name };
      if (accountType === "organization") payload.orgDocUrl = orgDocUrl;

      const res = await api.post("/auth/register", payload);
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      if (!token || !user) throw new Error("Missing token/user from server");

      setAuth({ token, user });   // ✅ bắn auth-changed
      nav("/");
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050712] text-slate-100 grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-indigo-500/20 bg-white/5 backdrop-blur p-6">
        <h1 className="text-2xl font-extrabold">Register</h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-300">Account type</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
            >
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
            />
          </div>

          {accountType === "organization" ? (
            <div>
              <label className="text-sm text-slate-300">Org proof URL</label>
              <input
                value={orgDocUrl}
                onChange={(e) => setOrgDocUrl(e.target.value)}
                className="mt-2 w-full rounded-xl bg-black/30 border border-indigo-500/20 px-4 py-3"
              />
              <div className="mt-1 text-xs text-slate-400">
                Tổ chức sẽ ở trạng thái <b>Chờ duyệt</b>.
              </div>
            </div>
          ) : null}

          {msg ? <div className="text-sm text-rose-200">{msg}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 font-semibold text-slate-950
                       bg-gradient-to-r from-indigo-500 to-cyan-500 disabled:opacity-60"
          >
            {loading ? "Đang tạo..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-400">
          Đã có tài khoản?{" "}
          <Link className="text-cyan-300 font-semibold" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
