import { db } from "@/lib/turso";

export default async function Dashboard() {
  const [inventory, sales, manufacturing, labour] = await Promise.all([
    db.execute("SELECT COUNT(*) as count FROM inventory"),
    db.execute("SELECT COUNT(*) as count FROM sales WHERE date = date('now')"),
    db.execute("SELECT COUNT(*) as count FROM manufacturing WHERE status = 'Pending'"),
    db.execute("SELECT COUNT(*) as count FROM labour WHERE attendance = 'Present'"),
  ]);

  const stats = [
    { label: "Total Stock", value: inventory.rows[0].count, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { label: "Today's Sales", value: sales.rows[0].count, color: "text-green-600", bg: "bg-green-50 border-green-200" },
    { label: "Pending Orders", value: manufacturing.rows[0].count, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    { label: "Workers Present", value: labour.rows[0].count, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`border rounded-xl p-5 ${bg}`}>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">{label}</p>
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}