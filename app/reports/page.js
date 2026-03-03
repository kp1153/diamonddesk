export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Stock Report", "Sales Report", "Labour Report", "GST Report", "Manufacturing Report", "MIS Report"].map(r => (
          <div key={r} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-400 cursor-pointer transition-colors">
            <p className="font-bold text-stone-700">{r}</p>
            <p className="text-xs text-stone-400 mt-1">Will load from Turso</p>
          </div>
        ))}
      </div>
    </div>
  );
}