import { db } from "@/lib/db";
import { lots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const rows = await db.select().from(lots).where(eq(lots.userId, session.userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const body = await request.json();
  const inserted = await db.insert(lots).values({
    userId: session.userId,
    lotNo: body.lotNo,
    roughWeight: parseFloat(body.roughWeight),
    polishWeight: body.polishWeight ? parseFloat(body.polishWeight) : null,
    shape: body.shape,
    quality: body.quality,
    status: body.status || "लंबित",
  }).returning();
  return Response.json(inserted[0]);
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const { id } = await request.json();
  await db.delete(lots).where(eq(lots.id, id));
  return Response.json({ ok: true });
}