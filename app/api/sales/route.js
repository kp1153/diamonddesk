import { db } from "@/lib/db";
import { sales } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const rows = await db.select().from(sales).where(eq(sales.userId, session.userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const body = await request.json();
  const inserted = await db.insert(sales).values({
    userId: session.userId,
    invoiceNo: body.invoiceNo,
    buyer: body.buyer,
    date: body.date,
    weight: parseFloat(body.weight),
    amount: parseFloat(body.amount),
    status: body.status || "लंबित",
  }).returning();
  return Response.json(inserted[0]);
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const { id } = await request.json();
  await db.delete(sales).where(eq(sales.id, id));
  return Response.json({ ok: true });
}