import { db } from "@/lib/db";
import { lots } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const userId = parseInt(session.userId);
  const rows = await db.select().from(lots).where(eq(lots.userId, userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  await db.insert(lots).values({
    userId,
    lotNo: body.lotNo,
    roughWeight: parseFloat(body.roughWeight) || 0,
    polishWeight: body.polishWeight ? parseFloat(body.polishWeight) : null,
    shape: body.shape || null,
    quality: body.quality || null,
    color: body.color || null,
    status: body.status || "लंबित",
  });
  return Response.json({ ok: true });
}

export async function PUT(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  const id = parseInt(body.id);
  if (!id) return Response.json({ error: "ID missing" }, { status: 400 });
  await db.update(lots).set({
    lotNo: body.lotNo,
    roughWeight: parseFloat(body.roughWeight) || 0,
    polishWeight: body.polishWeight ? parseFloat(body.polishWeight) : null,
    shape: body.shape || null,
    quality: body.quality || null,
    color: body.color || null,
    status: body.status || "लंबित",
  }).where(and(eq(lots.id, id), eq(lots.userId, userId)));
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const { id } = await request.json();
  await db.delete(lots).where(
    and(eq(lots.id, id), eq(lots.userId, userId))
  );
  return Response.json({ ok: true });
}