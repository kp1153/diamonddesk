import { db } from "@/lib/turso";

export default async function GST() {
  const { rows } = await db.execute("SELECT * FROM gst");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">GST</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Invoice No.", "Party", "Date", "Taxable Amt", "GST %", "GST Amt", "Total"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-stone-400 font-medium">No records found</td></tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-stone-700">{row.invoice_no}</td>
                  <td className="px-5 py-3 text-stone-600">{row.party}</td>
                  <td className="px-5 py-3 text-stone-600">{row.date}</td>
                  <td className="px-5 py-3 text-stone-600">{row.taxable_amount}</td>
                  <td className="px-5 py-3 text-stone-600">{row.gst_percent}</td>
                  <td className="px-5 py-3 text-stone-600">{row.gst_amount}</td>
                  <td className="px-5 py-3 text-stone-600">{row.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}