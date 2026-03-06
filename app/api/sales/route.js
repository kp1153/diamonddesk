import { db } from "@/lib/turso";

export async function GET() {
  const { rows } = await db.execute("SELECT * FROM sales ORDER BY id DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const { invoice_no, buyer, date, weight, amount, status } = await req.json();
  await db.execute({
    sql: "INSERT INTO sales (invoice_no, buyer, date, weight, amount, status) VALUES (?,?,?,?,?,?)",
    args: [invoice_no, buyer, date, weight, amount, status],
  });
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM sales WHERE id = ?", args: [id] });
  return Response.json({ ok: true });
}