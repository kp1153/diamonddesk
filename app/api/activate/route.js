import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
  const { email, name, phone, plan, secret } = await request.json();
  if (secret !== process.env.ACTIVATION_SECRET) {
    return Response.json({ success: false }, { status: 401 });
  }
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length === 0) {
    await sql`INSERT INTO users (email, name, status, expiry_date, reminder_sent) VALUES (${email}, ${name}, 'active', ${expiry.toISOString()}, 'no')`;
  } else {
    await sql`UPDATE users SET status = 'active', expiry_date = ${expiry.toISOString()}, reminder_sent = 'no' WHERE email = ${email}`;
  }
  return Response.json({ success: true });
}