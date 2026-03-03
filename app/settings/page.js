export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {["Company Profile", "Users & Roles", "GST Configuration", "Backup & Restore"].map(s => (
          <div key={s} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
            <p className="font-semibold text-stone-700">{s}</p>
            <span className="text-stone-400">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}