import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center">
              <span className="text-emerald-300 font-bold">✓</span>
            </div>
            <div className="font-semibold">ChainCharity</div>
          </div>
          <p className="mt-4 text-sm text-white/70 max-w-sm">
            Nền tảng quyên góp minh bạch. VND off-chain (mock) + ghi nhận giao dịch on-chain.
          </p>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Liên kết</div>
          <ul className="mt-3 space-y-2 text-white/70">
            <li><Link className="hover:text-white" to="/campaigns">Khám phá</Link></li>
            <li><Link className="hover:text-white" to="/how-it-works">Cách hoạt động</Link></li>
            <li><Link className="hover:text-white" to="/about">Về chúng tôi</Link></li>
            <li><Link className="hover:text-white" to="/privacy">Bảo mật</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Liên hệ</div>
          <div className="mt-3 text-white/70 space-y-2">
            <div>contact@chaincharity.io</div>
            <div>Hà Nội, Việt Nam</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © 2026 ChainCharity. Developed with ❤ and blockchain technology.
      </div>
    </footer>
  );
}
