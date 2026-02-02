export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Cách hoạt động</h1>

      <ol className="mt-5 list-decimal pl-6 text-slate-700 space-y-2">
        <li>Tạo chiến dịch: backend gọi smart contract <b>createCampaign</b>.</li>
        <li>Người dùng quyên góp VND (mock): backend xác nhận thanh toán.</li>
        <li>Backend lưu MongoDB và gọi <b>recordDonation</b> lên Ethereum để minh bạch.</li>
        <li>Frontend hiển thị tiến độ + lịch sử giao dịch theo từng chiến dịch.</li>
      </ol>
    </section>
  );
}

