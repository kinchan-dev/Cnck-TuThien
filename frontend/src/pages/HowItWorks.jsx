export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
          <span className="h-2 w-2 rounded-full bg-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.65)]" />
          How it works
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
          Cách ChainCharity hoạt động (Off-chain + On-chain)
        </h1>

        <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">
          Hệ thống chia làm 2 lớp: <b>nghiệp vụ (MongoDB)</b> để xử lý nhanh và <b>blockchain (Sepolia)</b> để tạo bằng chứng minh bạch.
          Người dùng thao tác trên UI, backend là nơi xác thực + ghi nhận on-chain.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MiniCard title="Off-chain (MongoDB)" desc="Lưu campaign, tổng tiền, lịch sử giao dịch để truy vấn nhanh." />
          <MiniCard title="On-chain (Sepolia)" desc="Ghi snapshot minh bạch: campaignId, totalDonations, donationCount." />
          <MiniCard title="Frontend UI" desc="Hiển thị tiến độ + đối chiếu dữ liệu on-chain để tăng tin cậy." />
        </div>
      </div>

      {/* Flow diagram */}
      <div className="mt-8 rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-50">Luồng tổng quát</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <FlowBox title="User / Org" desc="Tạo chiến dịch / Quyên góp" />
          <Arrow />
          <FlowBox title="Frontend" desc="Gọi API backend + hiển thị UI" />
          <Arrow />
          <FlowBox title="Backend" desc="Xác thực, ghi MongoDB, gọi Smart Contract" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <FlowBox title="MongoDB" desc="Campaign + DonationTransactions" />
          <Arrow />
          <FlowBox title="Smart Contract" desc="createCampaign / recordDonation (Sepolia)" />
          <div className="hidden lg:block" />
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Step-by-step */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-50">1) Tạo chiến dịch (Organization)</h2>
          <div className="mt-4 space-y-3 text-slate-300 leading-relaxed">
            <StepRow
              n="1"
              title="Org đăng nhập (đã được Admin duyệt)"
              desc="Org phải có orgVerified=true thì mới được phép tạo chiến dịch."
            />
            <StepRow
              n="2"
              title="Frontend gọi API tạo campaign"
              desc="Gửi name, description, targetAmount, category lên backend."
            />
            <StepRow
              n="3"
              title="Backend gọi Smart Contract"
              desc="Backend dùng ví riêng để gọi createCampaign → trả về blockchainCampaignId (ID on-chain)."
            />
            <StepRow
              n="4"
              title="Backend lưu MongoDB"
              desc="Lưu campaign cùng blockchainCampaignId để map dữ liệu off-chain ↔ on-chain."
            />
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100/90">
            <b>Ý nghĩa:</b> Mỗi chiến dịch có 2 “định danh”: Mongo _id (cho UI/DB) và blockchainCampaignId (cho minh bạch).
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-50">2) Quyên góp (Individual)</h2>
          <div className="mt-4 space-y-3 text-slate-300 leading-relaxed">
            <StepRow
              n="1"
              title="User nhập số tiền VND (mock)"
              desc="UI nhận amountVND và gửi về backend."
            />
            <StepRow
              n="2"
              title="Backend xác nhận thanh toán (mô phỏng)"
              desc="Trong demo, paymentTxHash có thể là mock-<timestamp>."
            />
            <StepRow
              n="3"
              title="Ghi nhận on-chain"
              desc="Backend gọi recordDonation(blockchainCampaignId, amountVND, paymentTxHash) → tạo txHash minh bạch."
            />
            <StepRow
              n="4"
              title="Cập nhật MongoDB"
              desc="Tăng totalRaised và lưu DonationTransaction (amountVND, txHash, thời gian)."
            />
          </div>

          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100/90">
            <b>Lưu ý:</b> ETH trong MetaMask giảm là do <b>phí gas</b> khi ghi giao dịch lên Sepolia. Giá trị chuyển có thể là 0 ETH,
            nhưng vẫn tốn gas cho việc ghi dữ liệu.
          </div>
        </div>
      </div>

      {/* Transparency section */}
      <div className="mt-8 rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-50">3) Minh bạch & đối chiếu dữ liệu</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-5">
            <div className="font-bold text-slate-100">Frontend hiển thị từ MongoDB</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-300/90">
              <li>• Danh sách campaign, mô tả, mục tiêu, tổng tiền, lịch sử giao dịch</li>
              <li>• Tối ưu tốc độ tải và trải nghiệm người dùng</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-5">
            <div className="font-bold text-slate-100">Frontend đối chiếu từ Blockchain</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-300/90">
              <li>• Snapshot: owner, totalDonations, donationCount</li>
              <li>• Người dùng có thể kiểm tra txHash trên explorer (Sepolia)</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 text-sm text-slate-300/90 leading-relaxed">
          <b>Kết luận:</b> MongoDB giúp hệ thống chạy mượt, còn Blockchain đóng vai trò “bằng chứng không thể sửa đổi” để tăng niềm tin.
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-50">FAQ nhanh</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Faq
            q="Vì sao quyên góp lại tốn ETH trong MetaMask?"
            a="ETH giảm là do gas fee khi ghi dữ liệu lên Sepolia. Đây là phí cho việc thực thi transaction, không phải chuyển ETH cho chiến dịch (trong demo)."
          />
          <Faq
            q="Tiền quyên góp đi đâu?"
            a="Trong demo, VND là mock và không chuyển tiền thật. Blockchain chỉ lưu chứng cứ giao dịch; còn nghiệp vụ được lưu MongoDB."
          />
          <Faq
            q="Vì sao mọi giao dịch lại đến cùng một ví?"
            a="Vì backend dùng 1 ví (deployer/owner) để gọi smart contract và ghi nhận recordDonation. Bạn có thể mở rộng để mỗi campaign có ví riêng hoặc cơ chế rút tiền."
          />
          <Faq
            q="Khi chiến dịch đạt 100% thì sao?"
            a="Bạn có thể thêm logic 'endCampaign' trên contract + backend cập nhật trạng thái campaign để khóa donate khi đạt mục tiêu."
          />
        </div>
      </div>
    </section>
  );
}

function MiniCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-5">
      <div className="text-sm font-bold text-slate-100">{title}</div>
      <div className="mt-2 text-sm text-slate-300/90">{desc}</div>
    </div>
  );
}

function StepRow({ n, title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 border border-indigo-500/20 text-xs font-extrabold text-cyan-100">
        {n}
      </div>
      <div>
        <div className="font-semibold text-slate-100">{title}</div>
        <div className="text-sm text-slate-300/90">{desc}</div>
      </div>
    </div>
  );
}

function FlowBox({ title, desc }) {
  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-4">
      <div className="text-sm font-bold text-slate-100">{title}</div>
      <div className="mt-1 text-sm text-slate-300/90">{desc}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden lg:flex items-center justify-center text-slate-500">
      <span className="rounded-full border border-indigo-500/15 bg-white/5 px-3 py-1 text-xs">→</span>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-5">
      <div className="font-bold text-slate-100">{q}</div>
      <div className="mt-2 text-sm text-slate-300/90 leading-relaxed">{a}</div>
    </div>
  );
}
