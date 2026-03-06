import { db } from "@/lib/turso";

export async function GET() {
  const { rows } = await db.execute("SELECT * FROM inventory ORDER BY id DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const { lot_no, shape, weight, quality, status } = await req.json();
  await db.execute({
    sql: "INSERT INTO inventory (lot_no, shape, weight, quality, status) VALUES (?,?,?,?,?)",
    args: [lot_no, shape, weight, quality, status],
  });
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM inventory WHERE id = ?", args: [id] });
  return Response.json({ ok: true });
}