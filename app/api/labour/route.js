import { db } from "@/lib/turso";

export async function GET() {
  const { rows } = await db.execute("SELECT * FROM labour ORDER BY id DESC");
  return Response.json(rows);
}

export async function POST(req) {
  const { worker_id, name, stage, attendance, pieces_done, wages } = await req.json();
  await db.execute({
    sql: "INSERT INTO labour (worker_id, name, stage, attendance, pieces_done, wages) VALUES (?,?,?,?,?,?)",
    args: [worker_id, name, stage, attendance, pieces_done, wages],
  });
  return Response.json({ ok: true });
}

export async function DELETE(req) {
  const { id } = await req.json();
  await db.execute({ sql: "DELETE FROM labour WHERE id = ?", args: [id] });
  return Response.json({ ok: true });
}