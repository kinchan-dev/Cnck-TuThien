const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + " đ";

export default function TxTable({ rows = [] }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="text-left px-4 py-3">Số tiền</th>
            <th className="text-left px-4 py-3">Blockchain Tx</th>
            <th className="text-left px-4 py-3">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-semibold">{formatVND(r.amountVND)}</td>
              <td className="px-4 py-3">
                {r.blockchainTxHash ? (
                  <span className="font-mono text-xs">{r.blockchainTxHash.slice(0, 12)}...{r.blockchainTxHash.slice(-8)}</span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(r.createdAt).toLocaleString("vi-VN")}
              </td>
            </tr>
          ))}
          {!rows.length ? (
            <tr>
              <td className="px-4 py-6 text-slate-500" colSpan={3}>
                Chưa có giao dịch.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
