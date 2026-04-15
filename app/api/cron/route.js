import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const DEVELOPER_EMAIL = "prasad.kamta@gmail.com";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allUsers = await db.select().from(users);
  const now = new Date();
  const results = [];

  for (const user of allUsers) {
    if (!user.expiryDate || !user.email) continue;
    if (user.email === DEVELOPER_EMAIL) continue;

    const expiry = new Date(user.expiryDate);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    let type = null;

    if (user.status === "trial") {
      if (daysLeft <= 0) {
        type = "trial_expired";
        await db.update(users).set({ status: "expired" }).where(eq(users.id, user.id));
      } else if (daysLeft === 1 && user.reminderSent === "no") {
        type = "trial_expiring";
      }
    } else if (user.status === "active") {
      if (daysLeft === 7 && user.reminderSent === "no") {
        type = "renewal_reminder";
      } else if (daysLeft <= 0) {
        await db.update(users).set({ status: "expired" }).where(eq(users.id, user.id));
      }
    }

    if (type) {
      try {
        const res = await fetch("https://www.nishantsoftwares.in/api/remind", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.CRON_SECRET,
            email: user.email,
            name: user.name,
            software: "heera",
            daysLeft,
            type,
          }),
        });
        if (res.ok) {
          await db.update(users).set({ reminderSent: "yes" }).where(eq(users.id, user.id));
          results.push({ email: user.email, type, status: "sent" });
        }
      } catch (e) {
        results.push({ email: user.email, type, status: "failed", error: e.message });
      }
    }
  }

  return Response.json({ ok: true, processed: results });
}