import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 bg-grid">
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                          bg-white/5 border border-indigo-500/25 text-indigo-200">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
            Nền tảng từ thiện minh bạch (demo) — ghi nhận on-chain
          </div>

          <h1 className="mt-5 text-5xl sm:text-6xl font-extrabold leading-[1.05]">
            Minh bạch quyên góp <br />
            với <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Blockchain</span>
          </h1>

          <p className="mt-5 text-slate-300 max-w-xl">
            Quyên góp VND off-chain (mock). Backend xác nhận và ghi giao dịch lên Ethereum testnet để đảm bảo minh bạch.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              to="/campaigns"
              className="inline-flex justify-center items-center gap-2 rounded-xl px-5 py-3 font-semibold
                         bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400
                         text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
            >
              Bắt đầu quyên góp →
            </Link>

            <Link
              to="/create"
              className="inline-flex justify-center items-center rounded-xl px-5 py-3 font-semibold
                         bg-white/5 border border-indigo-500/25 hover:bg-white/10"
            >
              Tạo chiến dịch
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
            <MiniStat label="On-chain records" value="100%" />
            <MiniStat label="Testnet" value="Sepolia" />
            <MiniStat label="Wallet" value="MetaMask" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/20 to-cyan-400/10 blur-3xl rounded-full" />
          <div className="relative rounded-3xl overflow-hidden glass neon-border">
            <img
              src="https://images.unsplash.com/photo-1639322537138-5e513100b36e?w=1400&auto=format&fit=crop&q=60"
              alt="Hero"
              className="w-full h-[320px] sm:h-[380px] object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#070A14]/70 via-transparent to-[#070A14]/30" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <Feature title="Minh bạch tuyệt đối" desc="Ghi nhận giao dịch lên blockchain, khó can thiệp/sửa đổi." />
          <Feature title="Theo dõi tiến độ" desc="Progress + lịch sử giao dịch theo từng chiến dịch." />
          <Feature title="Hệ thống mô phỏng" desc="VND off-chain mock + backend xác nhận + recordDonation." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[36px] glass neon-border px-6 py-10">
          <h3 className="text-center text-2xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Hệ sinh thái từ thiện số
            </span>
          </h3>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="Demo" label="MVP" />
            <Stat value="Sepolia" label="Network" />
            <Stat value="MongoDB" label="Database" />
            <Stat value="Ethers v6" label="Library" />
          </div>
        </div>
      </section>

    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl glass neon-border p-6">
      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-cyan-400/20 border border-indigo-500/25" />
      <div className="mt-4 font-bold">{title}</div>
      <div className="mt-2 text-sm text-slate-300">{desc}</div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-cyan-200">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-xl glass border border-indigo-500/20 px-3 py-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-semibold text-slate-100">{value}</div>
    </div>
  );
}
