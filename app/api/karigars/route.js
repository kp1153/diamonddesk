import { db } from "@/lib/db";
import { karigars } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json([], { status: 401 });
  const userId = parseInt(session.userId);
  const rows = await db.select().from(karigars).where(eq(karigars.userId, userId));
  return Response.json(rows);
}

export async function POST(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  await db.insert(karigars).values({
    userId,
    name: body.name,
    phone: body.phone,
    stage: body.stage,
    advance: parseFloat(body.advance) || 0,
  });
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const { id } = await request.json();
  await db.delete(karigars).where(
    and(eq(karigars.id, id), eq(karigars.userId, userId))
  );
  return Response.json({ ok: true });
}