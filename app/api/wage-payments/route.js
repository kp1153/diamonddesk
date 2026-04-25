import { db } from "@/lib/db";
import { wagePayments, karigars, assignments } from "@/lib/schema";
import { eq, and, sum } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const userId = parseInt(session.userId);

  // All karigars with their wage summary
  const allKarigars = await db.select().from(karigars).where(eq(karigars.userId, userId));

  // Total pending wages per karigar (assignments not yet paid)
  const pendingWages = await db
    .select({ karigarId: assignments.karigarId, total: sum(assignments.wages) })
    .from(assignments)
    .where(and(eq(assignments.userId, userId), eq(assignments.status, "लंबित")))
    .groupBy(assignments.karigarId);

  // Total paid per karigar
  const paidAmounts = await db
    .select({ karigarId: wagePayments.karigarId, total: sum(wagePayments.netPaid) })
    .from(wagePayments)
    .where(eq(wagePayments.userId, userId))
    .groupBy(wagePayments.karigarId);

  // Payment history
  const payments = await db
    .select({
      id: wagePayments.id,
      karigarId: wagePayments.karigarId,
      amount: wagePayments.amount,
      advanceDeducted: wagePayments.advanceDeducted,
      netPaid: wagePayments.netPaid,
      date: wagePayments.date,
      note: wagePayments.note,
      createdAt: wagePayments.createdAt,
    })
    .from(wagePayments)
    .where(eq(wagePayments.userId, userId))
    .orderBy(wagePayments.createdAt);

  const pendingMap = Object.fromEntries(pendingWages.map(r => [r.karigarId, parseFloat(r.total) || 0]));
  const paidMap = Object.fromEntries(paidAmounts.map(r => [r.karigarId, parseFloat(r.total) || 0]));

  const summary = allKarigars.map(k => ({
    ...k,
    pendingWages: pendingMap[k.id] || 0,
    totalPaid: paidMap[k.id] || 0,
    netDue: (pendingMap[k.id] || 0) - (parseFloat(k.advance) || 0) - (paidMap[k.id] || 0),
  }));

  return Response.json({ summary, payments });
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  const karigarId = parseInt(body.karigarId);
  const amount = parseFloat(body.amount) || 0;
  const advanceDeducted = parseFloat(body.advanceDeducted) || 0;
  const netPaid = amount - advanceDeducted;
  if (!karigarId || !amount || !body.date) {
    return Response.json({ error: "Required fields missing" }, { status: 400 });
  }
  await db.insert(wagePayments).values({
    userId,
    karigarId,
    amount,
    advanceDeducted,
    netPaid,
    date: body.date,
    note: body.note || null,
  });
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const { id } = await request.json();
  await db.delete(wagePayments).where(
    and(eq(wagePayments.id, id), eq(wagePayments.userId, userId))
  );
  return Response.json({ ok: true });
}