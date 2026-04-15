import { db } from "@/lib/db";
import { sales } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const userId = parseInt(session.userId);
  const rows = await db.select().from(sales).where(eq(sales.userId, userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  if (!body.invoiceNo || !body.buyer || !body.date) {
    return Response.json({ error: "Required fields missing" }, { status: 400 });
  }
  await db.insert(sales).values({
    userId,
    invoiceNo: body.invoiceNo,
    buyer: body.buyer,
    buyerAddress: body.buyerAddress || null,
    buyerGstin: body.buyerGstin || null,
    date: body.date,
    weight: parseFloat(body.weight) || 0,
    amount: parseFloat(body.amount) || 0,
    currency: body.currency || "INR",
    saleType: body.saleType || "domestic",
    status: body.status || "लंबित",
  });
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const { id } = await request.json();
  await db.delete(sales).where(
    and(eq(sales.id, id), eq(sales.userId, userId))
  );
  return Response.json({ ok: true });
}