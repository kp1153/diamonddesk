import { db } from "@/lib/db";
import { users, preActivations } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  const body = await request.json();
  const { email, name, plan } = body;

  const bearerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const secret = bearerSecret || body.secret;

  if (secret !== process.env.HUB_SECRET) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!email) {
    return Response.json({ success: false, error: "Email required" }, { status: 400 });
  }

  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  const expiryISO = expiry.toISOString();

  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length === 0) {
    await db.insert(preActivations).values({ email }).onConflictDoNothing();
    return Response.json({ success: true, action: "pre_activation_saved" });
  } else {
    await db.update(users).set({
      status: "active",
      active: 1,
      expiryDate: expiryISO,
      reminderSent: "no",
    }).where(eq(users.email, email));
    return Response.json({ success: true, action: "user_activated" });
  }
}