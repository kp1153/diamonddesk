import { db } from "@/lib/db";
import { karigars, lots, assignments, sales } from "@/lib/schema";
import { eq, and, sum, count } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Reports() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) redirect("/");

  const userId = parseInt(session.userId);

  const [कुलकारीगर, कुललॉट, लंबितकाम, कुलबिक्री] = await Promise.all([
    db.select({ count: count() }).from(karigars).where(eq(karigars.userId, userId)),
    db.select({ count: count() }).from(lots).where(eq(lots.userId, userId)),
    db.select({ count: count() }).from(assignments).where(and(eq(assignments.userId, userId), eq(assignments.status, "लंबित"))),
    db.select({ total: sum(sales.amount) }).from(sales).where(eq(sales.userId, userId)),
  ]);

  const stats = [
    { शीर्षक: "कुल कारीगर", मूल्य: कुलकारीगर[0].count, रंग: "text-amber-500", पृष्ठभूमि: "bg-amber-50 border-amber-200" },
    { शीर्षक: "कुल लॉट", मूल्य: कुललॉट[0].count, रंग: "text-blue-600", पृष्ठभूमि: "bg-blue-50 border-blue-200" },
    { शीर्षक: "लंबित काम", मूल्य: लंबितकाम[0].count, रंग: "text-orange-600", पृष्ठभूमि: "bg-orange-50 border-orange-200" },
    { शीर्षक: "कुल बिक्री", मूल्य: `₹${कुलबिक्री[0]?.total || 0}`, रंग: "text-green-600", पृष्ठभूमि: "bg-green-50 border-green-200" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-stone-900">रिपोर्ट</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.शीर्षक} className={`border rounded-xl p-5 ${s.पृष्ठभूमि}`}>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">{s.शीर्षक}</p>
            <p className={`text-4xl font-extrabold ${s.रंग}`}>{s.मूल्य}</p>
          </div>
        ))}
      </div>
    </div>
  );
}