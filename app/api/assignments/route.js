import { db } from "@/lib/db";
import { assignments, karigars, lots } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const userId = parseInt(session.userId);
  const rows = await db.select({
    id: assignments.id,
    karigarId: assignments.karigarId,
    lotId: assignments.lotId,
    issuedWeight: assignments.issuedWeight,
    returnedWeight: assignments.returnedWeight,
    stage: assignments.stage,
    wages: assignments.wages,
    status: assignments.status,
    issuedAt: assignments.issuedAt,
    returnedAt: assignments.returnedAt,
    karigarName: karigars.name,
    lotNo: lots.lotNo,
  })
  .from(assignments)
  .leftJoin(karigars, eq(assignments.karigarId, karigars.id))
  .leftJoin(lots, eq(assignments.lotId, lots.id))
  .where(eq(assignments.userId, userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  const karigarId = parseInt(body.karigarId);
  const lotId = parseInt(body.lotId);
  const issuedWeight = parseFloat(body.issuedWeight);
  if (!karigarId || !lotId || !issuedWeight) {
    return Response.json({ error: "Required fields missing" }, { status: 400 });
  }
  await db.insert(assignments).values({
    userId,
    karigarId,
    lotId,
    issuedWeight,
    stage: body.stage,
    status: "लंबित",
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
  await db.update(assignments).set({
    returnedWeight: parseFloat(body.returnedWeight) || 0,
    wages: parseFloat(body.wages) || 0,
    status: "पूर्ण",
    returnedAt: new Date().toISOString(),
  }).where(
    and(eq(assignments.id, id), eq(assignments.userId, userId))
  );
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const { id } = await request.json();
  await db.delete(assignments).where(
    and(eq(assignments.id, id), eq(assignments.userId, userId))
  );
  return Response.json({ ok: true });
}