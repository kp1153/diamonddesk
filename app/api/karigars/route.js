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
    rateAari: parseFloat(body.rateAari) || 0,
    rateGhisai: parseFloat(body.rateGhisai) || 0,
    ratePolish: parseFloat(body.ratePolish) || 0,
    rateJanch: parseFloat(body.rateJanch) || 0,
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
  await db.update(karigars).set({
    name: body.name,
    phone: body.phone,
    stage: body.stage,
    advance: parseFloat(body.advance) || 0,
    rateAari: parseFloat(body.rateAari) || 0,
    rateGhisai: parseFloat(body.rateGhisai) || 0,
    ratePolish: parseFloat(body.ratePolish) || 0,
    rateJanch: parseFloat(body.rateJanch) || 0,
  }).where(and(eq(karigars.id, id), eq(karigars.userId, userId)));
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