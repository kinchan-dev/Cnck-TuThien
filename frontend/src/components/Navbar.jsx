import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../services/api.js";

function shortAddr(a) {
  if (!a) return "";
  return a.slice(0, 6) + "…" + a.slice(-4);
}

function shortEmail(e) {
  if (!e) return "";
  return e.length > 18 ? `${e.slice(0, 8)}…${e.slice(-8)}` : e;
}

const NAV_ITEM =
  "px-3 py-2 rounded-xl text-sm font-semibold text-slate-200/90 hover:text-white hover:bg-white/5";
const NAV_ACTIVE =
  "px-3 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 border border-indigo-500/20";

function NavLinks({
  pathname,
  canCreate,
  isAdmin,
  onClick,
}) {
  return (
    <>
      <NavLink to="/" className={({ isActive }) => (isActive ? NAV_ACTIVE : NAV_ITEM)} end onClick={onClick}>
        Home
      </NavLink>

      <NavLink
        to="/campaigns"
        className={({ isActive }) => (pathname.startsWith("/campaign") || isActive ? NAV_ACTIVE : NAV_ITEM)}
        onClick={onClick}
      >
        Campaigns
      </NavLink>

      {canCreate ? (
        <NavLink to="/create" className={({ isActive }) => (isActive ? NAV_ACTIVE : NAV_ITEM)} onClick={onClick}>
          Create
        </NavLink>
      ) : null}

      <NavLink to="/about" className={({ isActive }) => (isActive ? NAV_ACTIVE : NAV_ITEM)} onClick={onClick}>
        About
      </NavLink>

      <NavLink to="/how-it-works" className={({ isActive }) => (isActive ? NAV_ACTIVE : NAV_ITEM)} onClick={onClick}>
        How it works
      </NavLink>

      <NavLink to="/privacy" className={({ isActive }) => (isActive ? NAV_ACTIVE : NAV_ITEM)} onClick={onClick}>
        Privacy
      </NavLink>

      {isAdmin ? (
        <NavLink to="/admin/orgs" className={({ isActive }) => (isActive ? NAV_ACTIVE : NAV_ITEM)} onClick={onClick}>
          Admin Panel
        </NavLink>
      ) : null}
    </>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const nav = useNavigate();

  // auth state
  const [authUser, setAuthUser] = useState(() => getAuth().user);

  // wallet state
  const [addr, setAddr] = useState("");
  const [chainId, setChainId] = useState(null);
  const [walletErr, setWalletErr] = useState("");

  // ui
  const [mobileOpen, setMobileOpen] = useState(false);

  const chainLabel = useMemo(() => {
    if (!chainId) return "—";
    if (chainId === 11155111) return "Sepolia";
    return `Chain ${chainId}`;
  }, [chainId]);

  const isAdmin = authUser?.role === "admin";

  const canCreate = useMemo(() => {
    if (!authUser) return false;
    if (authUser.role === "admin") return true;
    return authUser.accountType === "organization" && authUser.orgVerified === true;
  }, [authUser]);

  const isOrgPending = useMemo(() => {
    return !!authUser && authUser.accountType === "organization" && !authUser.orgVerified;
  }, [authUser]);

  // ---- wallet ----
  async function refreshWallet() {
    try {
      setWalletErr("");
      if (!window.ethereum) {
        setAddr("");
        setChainId(null);
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      setAddr(accounts?.[0] || "");
      const cid = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(cid, 16));
    } catch (e) {
      setWalletErr(e?.message || "Wallet error");
    }
  }

  async function connectWallet() {
    try {
      setWalletErr("");
      if (!window.ethereum) return setWalletErr("Chưa cài MetaMask");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddr(accounts?.[0] || "");
      const cid = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(cid, 16));
    } catch (e) {
      setWalletErr(e?.message || "Connect failed");
    }
  }

  async function switchToSepolia() {
    try {
      setWalletErr("");
      if (!window.ethereum) return setWalletErr("Chưa cài MetaMask");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // 11155111
      });
      await refreshWallet();
    } catch (e) {
      setWalletErr(e?.message || "Switch network failed");
    }
  }

  // init wallet + subscribe
  useEffect(() => {
    (async () => {
      await refreshWallet();
    })();

    if (!window.ethereum) return undefined;

    const onAccounts = (accs) => setAddr(accs?.[0] || "");
    const onChain = (cidHex) => setChainId(parseInt(cidHex, 16));

    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);

    return () => {
      try {
        window.ethereum.removeListener("accountsChanged", onAccounts);
        window.ethereum.removeListener("chainChanged", onChain);
      } catch {
        // ignore
      }
    };
  }, []);

  // sync auth changes (same tab + multi tab)
  useEffect(() => {
    const sync = () => setAuthUser(getAuth().user);
    window.addEventListener("auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function logout() {
    clearAuth();
    setAuthUser(null);
    nav("/login");
  }

  return (
    <header className="sticky top-0 z-40 bg-[#070A14]/80 backdrop-blur border-b border-indigo-500/15">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500/60 to-cyan-400/30 border border-indigo-500/25 shadow-[0_0_20px_rgba(34,211,238,0.08)]" />
          <div className="leading-tight hidden sm:block">
            <div className="font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                ChainCharity
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Transparent donation demo</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLinks
            pathname={pathname}
            canCreate={canCreate}
            isAdmin={isAdmin}
          />
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Network */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-indigo-500/15 bg-white/5 px-3 py-2">
            <span className="text-xs text-slate-400">Network</span>
            <span className={`text-xs font-semibold ${chainId === 11155111 ? "text-cyan-200" : "text-amber-200"}`}>
              {chainLabel}
            </span>
          </div>

          {chainId && chainId !== 11155111 ? (
            <button
              onClick={switchToSepolia}
              className="hidden md:inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                         bg-white/5 hover:bg-white/10 border border-amber-400/25 text-amber-200"
            >
              Switch
            </button>
          ) : null}

          {/* Wallet */}
          <button
            onClick={connectWallet}
            className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                       bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400
                       text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.10)]"
            title={addr ? addr : "Connect MetaMask"}
          >
            {addr ? shortAddr(addr) : "Connect"}
          </button>

          {/* Auth (desktop) */}
          {authUser ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-indigo-500/15 bg-white/5 px-3 py-2">
                <span className="text-xs text-slate-200/90 max-w-[160px] truncate">
                  {shortEmail(authUser.email)}
                </span>

                {isOrgPending ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-amber-400/25 bg-amber-400/10 text-amber-200">
                    Chờ duyệt
                  </span>
                ) : null}

                {isAdmin ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200">
                    Admin
                  </span>
                ) : null}
              </div>

              <button
                onClick={logout}
                className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                           bg-rose-500/10 hover:bg-rose-500/15 border border-rose-400/25 text-rose-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                           bg-white/5 hover:bg-white/10 border border-indigo-500/15 text-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                           bg-white/5 hover:bg-white/10 border border-indigo-500/15 text-slate-100"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                       bg-white/5 hover:bg-white/10 border border-indigo-500/15 text-slate-100"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen ? (
        <div className="lg:hidden border-t border-indigo-500/15 bg-[#070A14]/95">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <NavLinks
                pathname={pathname}
                canCreate={canCreate}
                isAdmin={isAdmin}
                onClick={() => setMobileOpen(false)}
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-400">
                {chainLabel} • {addr ? shortAddr(addr) : "No wallet"}
              </div>

              {authUser ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                             bg-rose-500/10 hover:bg-rose-500/15 border border-rose-400/25 text-rose-200"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                               bg-white/5 hover:bg-white/10 border border-indigo-500/15 text-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold
                               bg-white/5 hover:bg-white/10 border border-indigo-500/15 text-slate-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {walletErr ? <div className="text-xs text-rose-200">Wallet: {walletErr}</div> : null}
          </div>
        </div>
      ) : null}

      {/* Wallet error (desktop) */}
      {walletErr ? (
        <div className="hidden lg:block mx-auto max-w-6xl px-4 pb-3 text-xs text-rose-200">
          Wallet: {walletErr}
        </div>
      ) : null}
    </header>
  );
}
