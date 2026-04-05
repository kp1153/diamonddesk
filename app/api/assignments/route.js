import { db } from "@/lib/db";
import { assignments, karigars, lots } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
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
  .where(eq(assignments.userId, session.userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const body = await request.json();
  const inserted = await db.insert(assignments).values({
    userId: session.userId,
    karigarId: parseInt(body.karigarId),
    lotId: parseInt(body.lotId),
    issuedWeight: parseFloat(body.issuedWeight),
    stage: body.stage,
    status: "लंबित",
  }).returning();
  return Response.json(inserted[0]);
}

export async function PUT(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const body = await request.json();
  await db.update(assignments).set({
    returnedWeight: parseFloat(body.returnedWeight),
    wages: parseFloat(body.wages),
    status: "पूर्ण",
    returnedAt: new Date(),
  }).where(and(eq(assignments.id, body.id), eq(assignments.userId, session.userId)));
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const { id } = await request.json();
  await db.delete(assignments).where(eq(assignments.id, id));
  return Response.json({ ok: true });
}