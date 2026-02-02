import { useState } from "react";
import { connectMetaMask, shortenAddress } from "../services/wallet";

export default function Header() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onConnect = async () => {
    setErr("");
    setLoading(true);
    try {
      const { address } = await connectMetaMask();
      setAddress(address);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[#070A14]/70 border-b border-indigo-500/20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-neon" />
          <div>
            <div className="font-semibold tracking-wide">Transparent Charity</div>
            <div className="text-xs text-white/60">On-chain audit · Off-chain VND payment</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {address ? (
            <div className="px-3 py-2 rounded-xl border border-indigo-400/30 bg-indigo-500/10 text-sm">
              {shortenAddress(address)}
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-90 disabled:opacity-60 shadow-neon"
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
        </div>
      </div>

      {err && (
        <div className="max-w-6xl mx-auto px-4 pb-3 text-sm text-red-300">
          {err}
        </div>
      )}
    </header>
  );
}
