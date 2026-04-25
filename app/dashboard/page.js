import { db } from "@/lib/db";
import { karigars, lots, assignments, sales } from "@/lib/schema";
import { eq, and, count, sum } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);

  const daysLeft = session.expiryDate
    ? Math.ceil((new Date(session.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const userId = parseInt(session.userId);

  const [karigarCount, lotCount, pendingAssign, totalSales, pendingWages] = await Promise.all([
    db.select({ count: count() }).from(karigars).where(eq(karigars.userId, userId)),
    db.select({ count: count() }).from(lots).where(eq(lots.userId, userId)),
    db.select({ count: count() }).from(assignments).where(
      and(eq(assignments.userId, userId), eq(assignments.status, "लंबित"))
    ),
    db.select({ total: sum(sales.amount) }).from(sales).where(eq(sales.userId, userId)),
    db.select({ total: sum(assignments.wages) }).from(assignments).where(
      and(eq(assignments.userId, userId), eq(assignments.status, "लंबित"))
    ),
  ]);

  const stats = [
    { label: "कुल कारीगर", value: karigarCount[0].count, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
    { label: "कुल लॉट", value: lotCount[0].count, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { label: "लंबित काम", value: pendingAssign[0].count, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    { label: "कुल बिक्री", value: `₹${totalSales[0]?.total || 0}`, color: "text-green-600", bg: "bg-green-50 border-green-200" },
    { label: "लंबित मजदूरी", value: `₹${pendingWages[0]?.total || 0}`, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">डैशबोर्ड</h1>
        <p className="text-stone-400 text-sm mt-1">नमस्ते, {session.name}</p>
      </div>

      {session.status === "trial" && daysLeft <= 3 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <p className="text-red-600 font-bold text-sm">⚠️ आपका मुफ्त परीक्षण {daysLeft} दिन में समाप्त होगा।</p>
          
            href={"https://www.nishantsoftwares.in/payment?email=" + encodeURIComponent(session.email)}
            className="inline-block mt-2 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            अभी खरीदें
          </a>
        </div>
      )}

      {session.status === "trial" && daysLeft > 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <p className="text-amber-600 font-semibold text-sm">⏳ मुफ्त परीक्षण चल रहा है — {daysLeft} दिन बचे हैं।</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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