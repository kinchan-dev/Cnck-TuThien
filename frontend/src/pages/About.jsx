export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
          About ChainCharity
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
          Nền tảng quyên góp minh bạch với <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Blockchain</span>
        </h1>

        <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">
          ChainCharity là hệ thống demo giúp minh bạch hoạt động quyên góp: khoản đóng góp được ghi nhận trên blockchain (Sepolia testnet),
          đồng thời lưu dữ liệu nghiệp vụ trong MongoDB để truy vấn nhanh và hiển thị giao diện.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard title="Minh bạch" desc="Giao dịch ghi nhận on-chain, dễ kiểm chứng, khó chỉnh sửa." />
          <InfoCard title="Dễ sử dụng" desc="UI đơn giản, theo dõi tiến độ chiến dịch và lịch sử quyên góp." />
          <InfoCard title="Mô phỏng" desc="Tiền VND là mock; chỉ tốn gas testnet khi ghi nhận giao dịch." />
        </div>
      </div>

      {/* How it works */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-50">Cách hệ thống hoạt động</h2>
          <ol className="mt-4 space-y-3 text-slate-300 leading-relaxed">
            <li className="flex gap-3">
              <StepBadge>1</StepBadge>
              <div>
                <div className="font-semibold text-slate-100">Tạo chiến dịch</div>
                <div className="text-sm text-slate-300/90">
                  Tổ chức (Organization) sau khi được Admin duyệt có thể tạo chiến dịch. Backend sẽ tạo bản ghi MongoDB và đồng bộ
                  thông tin lên Smart Contract (tạo campaignId on-chain).
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <StepBadge>2</StepBadge>
              <div>
                <div className="font-semibold text-slate-100">Quyên góp (mock VND)</div>
                <div className="text-sm text-slate-300/90">
                  Người dùng nhập số tiền VND (mô phỏng). Backend xác nhận và gọi Smart Contract để <span className="text-cyan-200">recordDonation</span>,
                  tạo dấu vết minh bạch on-chain.
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <StepBadge>3</StepBadge>
              <div>
                <div className="font-semibold text-slate-100">Hiển thị minh bạch</div>
                <div className="text-sm text-slate-300/90">
                  UI hiển thị tiến độ, lịch sử giao dịch từ MongoDB (nhanh) và snapshot từ blockchain (để đối chiếu).
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* Roles */}
        <div className="rounded-3xl border border-indigo-500/15 bg-[#070A14]/60 backdrop-blur p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-50">Vai trò & phân quyền</h2>
          <div className="mt-4 grid gap-4">
            <RoleCard
              title="Cá nhân (Individual)"
              points={[
                "Đăng ký/đăng nhập",
                "Xem danh sách chiến dịch",
                "Quyên góp (mock VND) và xem lịch sử giao dịch",
              ]}
            />
            <RoleCard
              title="Tổ chức (Organization)"
              points={[
                "Đăng ký tài khoản tổ chức (có thông tin minh chứng)",
                "Chờ Admin duyệt orgVerified",
                "Sau khi duyệt: được tạo chiến dịch quyên góp",
              ]}
              highlight="Chỉ organization đã duyệt mới được Create Campaign"
            />
            <RoleCard
              title="Admin"
              points={[
                "Duyệt/huỷ duyệt tổ chức",
                "Quản lý danh sách organization pending/verified",
                "Có thể giám sát hoạt động hệ thống",
              ]}
            />
          </div>
        </div>
      </div>

      {/* Transparency + Disclaimer */}
      <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-amber-200">Lưu ý minh bạch & giới hạn demo</h2>
        <ul className="mt-3 space-y-2 text-sm text-amber-100/90 leading-relaxed">
          <li>
            • Đây là bản demo học tập: số tiền VND chỉ mô phỏng, <b>không</b> đại diện tiền thật.
          </li>
          <li>
            • Giao dịch on-chain diễn ra trên <b>Sepolia testnet</b> và tốn <b>gas testnet</b> (ETH testnet).
          </li>
          <li>
            • Backend dùng ví riêng để ghi nhận dữ liệu lên chain; client không lưu private key.
          </li>
          <li>
            • Dữ liệu được lưu song song: MongoDB (nghiệp vụ) + Blockchain (minh bạch/đối chiếu).
          </li>
        </ul>
      </div>
    </section>
  );
}

function InfoCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-5">
      <div className="text-sm font-bold text-slate-100">{title}</div>
      <div className="mt-2 text-sm text-slate-300/90">{desc}</div>
    </div>
  );
}

function StepBadge({ children }) {
  return (
    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 border border-indigo-500/20 text-xs font-extrabold text-cyan-100">
      {children}
    </div>
  );
}

function RoleCard({ title, points, highlight }) {
  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-bold text-slate-100">{title}</div>
        {highlight ? (
          <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-200">
            {highlight}
          </div>
        ) : null}
      </div>

      <ul className="mt-3 space-y-2 text-sm text-slate-300/90">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.45)]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
