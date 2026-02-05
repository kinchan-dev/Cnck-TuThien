import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { setAuth } from "../services/authStore.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setMsg("");
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      // backend của bạn đang trả kiểu { ok:true, data:{ user, token } }
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      if (!token || !user) throw new Error("Missing token/user from server");

      setAuth({ token, user });     // ✅ bắn auth-changed luôn
      nav("/");
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050712] text-slate-100 grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-indigo-500/20 bg-white/5 backdrop-blur p-6">
        <h1 className="text-2xl font-extrabold">Login</h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
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

          {msg ? <div className="text-sm text-rose-200">{msg}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 font-semibold text-slate-950
                       bg-gradient-to-r from-indigo-500 to-cyan-500 disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-400">
          Chưa có tài khoản?{" "}
          <Link className="text-cyan-300 font-semibold" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
