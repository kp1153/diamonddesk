import { db } from "@/lib/turso";

export async function GET() {
  const { rows } = await db.execute("SELECT * FROM manufacturing ORDER BY id DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const { lot_no, worker, stage, rough_weight, polish_weight, status } = await req.json();
  await db.execute({
    sql: "INSERT INTO manufacturing (lot_no, worker, stage, rough_weight, polish_weight, status) VALUES (?,?,?,?,?,?)",
    args: [lot_no, worker, stage, rough_weight, polish_weight ?? null, status],
  });
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM manufacturing WHERE id = ?", args: [id] });
  return Response.json({ ok: true });
}