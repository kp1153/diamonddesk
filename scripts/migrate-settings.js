// Run once: node scripts/migrate-settings.js
import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "local.db");
const db = new Database(dbPath);

try {
  db.exec(`ALTER TABLE users ADD COLUMN shop_name TEXT;`);
  console.log("✅ shop_name column added");
} catch (e) {
  console.log("shop_name already exists or error:", e.message);
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN whatsapp TEXT;`);
  console.log("✅ whatsapp column added");
} catch (e) {
  console.log("whatsapp already exists or error:", e.message);
}

db.close();
console.log("Migration done.");