import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium border border-emerald-100">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
            Nền tảng từ thiện minh bạch nhất Việt Nam
          </div>

          <h1 className="mt-5 text-5xl sm:text-6xl font-extrabold leading-[1.05]">
            Mỗi đồng tiền <br />
            đều được <span className="text-emerald-600">Blockchain</span> bảo chứng.
          </h1>

          <p className="mt-5 text-slate-600 max-w-xl">
            Quyên góp VND off-chain (mock). Backend xác nhận và ghi nhận giao dịch lên Ethereum testnet để minh bạch.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              to="/campaigns"
              className="inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700 shadow-sm"
            >
              Bắt đầu quyên góp →
            </Link>

            <Link
              to="/create"
              className="inline-flex justify-center items-center rounded-xl border border-slate-200 px-5 py-3 font-semibold hover:bg-slate-50"
            >
              Tạo chiến dịch
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-200/40 blur-3xl rounded-full" />
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=60"
              alt="Hero"
              className="w-full h-[320px] sm:h-[380px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <Feature title="Minh bạch tuyệt đối" desc="Ghi nhận giao dịch lên blockchain, khó can thiệp/sửa đổi." />
          <Feature title="Dòng tiền thời gian thực" desc="Theo dõi tiến độ + lịch sử giao dịch trên từng chiến dịch." />
          <Feature title="Kết nối trực tiếp" desc="Tối ưu vận hành, giảm trung gian, tăng tin cậy." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[36px] bg-gradient-to-r from-slate-950 to-emerald-950 text-white px-6 py-10 shadow-xl">
          <h3 className="text-center text-2xl font-extrabold">Hệ sinh thái từ thiện số</h3>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="1.2K+" label="Chiến dịch" />
            <Stat value="5.5M" label="Người dùng" />
            <Stat value="25K+" label="VND đã quyên góp" />
            <Stat value="100%" label="Minh bạch" />
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100" />
      <div className="mt-4 font-bold">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-emerald-300">{value}</div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
    </div>
  );
}
