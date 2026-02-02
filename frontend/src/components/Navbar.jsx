import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { connectWallet, getWalletSnapshot, shortAddr, watchWallet } from "../services/wallet.js";

export default function Navbar() {
  const [wallet, setWallet] = useState(null);
  const [err, setErr] = useState("");

  async function refresh() {
    const snap = await getWalletSnapshot();
    setWallet(snap);
  }

  useEffect(() => {
    refresh();
    const un = watchWallet(refresh);
    return () => un();
  }, []);

  async function onConnect() {
    try {
      setErr("");
      const w = await connectWallet();
      setWallet(w);
    } catch (e) {
      setErr(e.message || "Connect failed");
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-100 grid place-items-center">
            <span className="text-emerald-700 font-bold">✓</span>
          </div>
          <div className="font-semibold">ChainCharity</div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <NavLink to="/campaigns" className={({isActive}) => isActive ? "text-slate-900 font-semibold" : "hover:text-slate-900"}>
            Khám phá
          </NavLink>
          <NavLink to="/how-it-works" className={({isActive}) => isActive ? "text-slate-900 font-semibold" : "hover:text-slate-900"}>
            Cách hoạt động
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "text-slate-900 font-semibold" : "hover:text-slate-900"}>
            Về chúng tôi
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {wallet?.address ? (
            <div className="text-xs px-3 py-2 rounded-full border border-slate-200 bg-white">
              <div className="font-semibold">{shortAddr(wallet.address)}</div>
              <div className="text-slate-500">Chain: {wallet.chainId}</div>
            </div>
          ) : null}

          <button
            onClick={onConnect}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-emerald-700"
          >
            Kết nối ví
          </button>
        </div>
      </div>

      {err ? (
        <div className="mx-auto max-w-6xl px-4 pb-3 text-sm text-red-700">{err}</div>
      ) : null}
    </header>
  );
}
