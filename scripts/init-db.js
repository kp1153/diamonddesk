import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.executeMultiple(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'trial',
  expiry_date TEXT,
  reminder_sent TEXT DEFAULT 'no',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS karigars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  stage TEXT NOT NULL,
  advance REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  lot_no TEXT NOT NULL,
  rough_weight REAL NOT NULL,
  polish_weight REAL,
  shape TEXT,
  quality TEXT,
  color TEXT,
  status TEXT NOT NULL DEFAULT 'लंबित',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  karigar_id INTEGER NOT NULL,
  lot_id INTEGER NOT NULL,
  issued_weight REAL NOT NULL,
  returned_weight REAL,
  stage TEXT NOT NULL,
  wages REAL,
  status TEXT NOT NULL DEFAULT 'लंबित',
  issued_at TEXT DEFAULT (datetime('now')),
  returned_at TEXT
);

CREATE TABLE IF NOT EXISTS lab_certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  lot_id INTEGER NOT NULL,
  stone_no TEXT,
  lab_name TEXT NOT NULL,
  certificate_no TEXT,
  sent_date TEXT,
  received_date TEXT,
  carat_weight REAL,
  shape TEXT,
  color TEXT,
  clarity TEXT,
  cut TEXT,
  polish TEXT,
  symmetry TEXT,
  fluorescence TEXT,
  status TEXT NOT NULL DEFAULT 'भेजा',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  invoice_no TEXT NOT NULL,
  buyer TEXT NOT NULL,
  buyer_address TEXT,
  buyer_gstin TEXT,
  date TEXT NOT NULL,
  weight REAL NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'INR',
  sale_type TEXT DEFAULT 'domestic',
  status TEXT NOT NULL DEFAULT 'लंबित',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wage_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  karigar_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  advance_deducted REAL DEFAULT 0,
  net_paid REAL NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

console.log("✅ सभी tables बन गईं");
client.close();