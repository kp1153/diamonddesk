import { db } from "@/lib/turso";

export default async function Inventory() {
  const { rows } = await db.execute("SELECT * FROM inventory");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Inventory</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Lot No.", "Shape", "Weight (Ct)", "Quality", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-400 font-medium">No records found</td></tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-stone-700">{row.lot_no}</td>
                  <td className="px-5 py-3 text-stone-600">{row.shape}</td>
                  <td className="px-5 py-3 text-stone-600">{row.weight}</td>
                  <td className="px-5 py-3 text-stone-600">{row.quality}</td>
                  <td className="px-5 py-3 text-stone-600">{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}