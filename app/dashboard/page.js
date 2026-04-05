import { db } from "@/lib/db";
import { karigars, lots, assignments } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);

  if (!session) redirect("/");

  const [karigarCount, lotCount, pendingAssign] = await Promise.all([
    db.select({ count: count() }).from(karigars).where(eq(karigars.userId, session.userId)),
    db.select({ count: count() }).from(lots).where(eq(lots.userId, session.userId)),
    db.select({ count: count() }).from(assignments).where(
      and(eq(assignments.userId, session.userId), eq(assignments.status, "Pending"))
    ),
  ]);

  const stats = [
    { label: "Total Karigars", value: karigarCount[0].count, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
    { label: "Total Lots", value: lotCount[0].count, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { label: "Pending Work", value: pendingAssign[0].count, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Dashboard</h1>
        <p className="text-stone-400 text-sm mt-1">Welcome, {session.name}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`border rounded-xl p-5 ${bg}`}>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">{label}</p>
            <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}