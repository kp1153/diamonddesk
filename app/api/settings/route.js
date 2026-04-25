import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession, createSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const [user] = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    shopName: users.shopName,
    whatsapp: users.whatsapp,
  }).from(users).where(eq(users.id, userId));
  return Response.json(user || {});
}

export async function PUT(request) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get("session")?.value);
  if (!session) return Response.json({}, { status: 401 });
  const userId = parseInt(session.userId);
  const body = await request.json();
  await db.update(users).set({
    name: body.name?.trim() || session.name,
    shopName: body.shopName?.trim() || null,
    whatsapp: body.whatsapp?.trim() || null,
  }).where(eq(users.id, userId));

  // Refresh session cookie with updated name
  const newToken = await createSession(
    session.userId, session.email,
    body.name?.trim() || session.name,
    session.status, session.expiryDate
  );
  const response = NextResponse.json({ ok: true });
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set("session", newToken, {
    httpOnly: true, maxAge: 60 * 60 * 24 * 7,
    path: "/", sameSite: "lax", secure: isProduction,
  });
  return response;
}