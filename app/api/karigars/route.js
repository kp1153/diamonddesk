import { db } from "@/lib/db";
import { karigars } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const rows = await db.select().from(karigars).where(eq(karigars.userId, session.userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const body = await request.json();
  const inserted = await db.insert(karigars).values({
    userId: session.userId,
    name: body.name,
    phone: body.phone,
    stage: body.stage,
    advance: parseFloat(body.advance) || 0,
  }).returning();
  return Response.json(inserted[0]);
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const { id } = await request.json();
  await db.delete(karigars).where(eq(karigars.id, id));
  return Response.json({ ok: true });
}