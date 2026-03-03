import { db } from "@/lib/turso";

export default async function Manufacturing() {
  const { rows } = await db.execute("SELECT * FROM manufacturing");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Manufacturing</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Lot No.", "Worker", "Stage", "Rough Wt (Ct)", "Polish Wt (Ct)", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-stone-400 font-medium">No records found</td></tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-stone-700">{row.lot_no}</td>
                  <td className="px-5 py-3 text-stone-600">{row.worker}</td>
                  <td className="px-5 py-3 text-stone-600">{row.stage}</td>
                  <td className="px-5 py-3 text-stone-600">{row.rough_weight}</td>
                  <td className="px-5 py-3 text-stone-600">{row.polish_weight}</td>
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