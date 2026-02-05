import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-indigo-500/15 bg-[#070A14]">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-extrabold text-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              ChainCharity
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-sm">
            Demo minh bạch quyên góp: VND off-chain (mock) + backend xác nhận + ghi nhận on-chain (Sepolia).
          </p>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-200">Pages</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
            <Link className="hover:text-white" to="/campaigns">Campaigns</Link>
            <Link className="hover:text-white" to="/create">Create Campaign</Link>
            <Link className="hover:text-white" to="/how-it-works">How it works</Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-200">Legal</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
            <Link className="hover:text-white" to="/about">About</Link>
            <Link className="hover:text-white" to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-indigo-500/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} ChainCharity Demo</div>
          <div className="font-mono">Sepolia • MongoDB • Ethers</div>
        </div>
      </div>
    </footer>
  );
}
