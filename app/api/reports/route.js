import { db } from "@/lib/db";
import { karigars, lots, assignments, sales } from "@/lib/schema";
import { eq, and, gte, lte, count, sum, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from"); // "2024-01-01"
  const to = searchParams.get("to");     // "2024-12-31"

  // Date filter helper — applies to createdAt columns
  const dateFilter = (col) => {
    const filters = [eq(col, col)]; // always true base
    if (from) filters.push(gte(col, from));
    if (to)   filters.push(lte(col, to + "T23:59:59"));
    return filters;
  };

  const [
    karigarCount,
    lotCount,
    pendingAssign,
    completedAssign,
    totalWages,
    pendingWagesRes,
    totalSalesCount,
    totalSalesAmount,
    allLots,
    lotWages,
  ] = await Promise.all([
    db.select({ count: count() }).from(karigars).where(eq(karigars.userId, userId)),
    db.select({ count: count() }).from(lots).where(eq(lots.userId, userId)),
    db.select({ count: count() }).from(assignments).where(
      and(eq(assignments.userId, userId), eq(assignments.status, "लंबित"),
        ...(from ? [gte(assignments.issuedAt, from)] : []),
        ...(to   ? [lte(assignments.issuedAt, to + "T23:59:59")] : [])
      )
    ),
    db.select({ count: count() }).from(assignments).where(
      and(eq(assignments.userId, userId), eq(assignments.status, "पूर्ण"),
        ...(from ? [gte(assignments.issuedAt, from)] : []),
        ...(to   ? [lte(assignments.issuedAt, to + "T23:59:59")] : [])
      )
    ),
    db.select({ total: sum(assignments.wages) }).from(assignments).where(
      and(eq(assignments.userId, userId),
        ...(from ? [gte(assignments.issuedAt, from)] : []),
        ...(to   ? [lte(assignments.issuedAt, to + "T23:59:59")] : [])
      )
    ),
    db.select({ total: sum(assignments.wages) }).from(assignments).where(
      and(eq(assignments.userId, userId), eq(assignments.status, "लंबित"),
        ...(from ? [gte(assignments.issuedAt, from)] : []),
        ...(to   ? [lte(assignments.issuedAt, to + "T23:59:59")] : [])
      )
    ),
    db.select({ count: count() }).from(sales).where(
      and(eq(sales.userId, userId),
        ...(from ? [gte(sales.date, from)] : []),
        ...(to   ? [lte(sales.date, to)] : [])
      )
    ),
    db.select({ total: sum(sales.amount) }).from(sales).where(
      and(eq(sales.userId, userId),
        ...(from ? [gte(sales.date, from)] : []),
        ...(to   ? [lte(sales.date, to)] : [])
      )
    ),
    db.select().from(lots).where(eq(lots.userId, userId)),
    db.select({ lotId: assignments.lotId, total: sum(assignments.wages) })
      .from(assignments)
      .where(eq(assignments.userId, userId))
      .groupBy(assignments.lotId),
  ]);

  const wagesMap = Object.fromEntries(lotWages.map(r => [r.lotId, parseFloat(r.total) || 0]));
  const lotSummary = allLots.map(l => ({ ...l, totalWages: wagesMap[l.id] || 0 }));

  return Response.json({
    karigarCount: karigarCount[0].count,
    lotCount: lotCount[0].count,
    pendingAssignments: pendingAssign[0].count,
    completedAssignments: completedAssign[0].count,
    totalWages: parseFloat(totalWages[0]?.total) || 0,
    pendingWages: parseFloat(pendingWagesRes[0]?.total) || 0,
    totalSales: totalSalesCount[0].count,
    totalSalesAmount: parseFloat(totalSalesAmount[0]?.total) || 0,
    lotSummary,
  });
}