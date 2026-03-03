import { db } from "@/lib/turso";

export async function GET() {
  await db.execute(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lot_no TEXT NOT NULL,
    shape TEXT NOT NULL,
    weight REAL NOT NULL,
    quality TEXT NOT NULL,
    status TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS manufacturing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lot_no TEXT NOT NULL,
    worker TEXT NOT NULL,
    stage TEXT NOT NULL,
    rough_weight REAL NOT NULL,
    polish_weight REAL,
    status TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT NOT NULL,
    buyer TEXT NOT NULL,
    date TEXT NOT NULL,
    weight REAL NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS labour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id TEXT NOT NULL,
    name TEXT NOT NULL,
    stage TEXT NOT NULL,
    attendance TEXT NOT NULL,
    pieces_done INTEGER NOT NULL,
    wages REAL NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS gst (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT NOT NULL,
    party TEXT NOT NULL,
    date TEXT NOT NULL,
    taxable_amount REAL NOT NULL,
    gst_percent REAL NOT NULL,
    gst_amount REAL NOT NULL,
    total REAL NOT NULL
  )`);

  return Response.json({ message: "Tables created" });
}