import { db } from "@/lib/turso";

export async function GET() {
  const { rows } = await db.execute("SELECT * FROM gst ORDER BY id DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const { invoice_no, party, date, taxable_amount, gst_percent, gst_amount, total } = await req.json();
  await db.execute({
    sql: "INSERT INTO gst (invoice_no, party, date, taxable_amount, gst_percent, gst_amount, total) VALUES (?,?,?,?,?,?,?)",
    args: [invoice_no, party, date, taxable_amount, gst_percent, gst_amount, total],
  });
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM gst WHERE id = ?", args: [id] });
  return Response.json({ ok: true });
}