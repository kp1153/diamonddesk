import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  status: text("status").notNull().default("trial"),
  expiryDate: text("expiry_date"),
  reminderSent: text("reminder_sent").default("no"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ─── KARIGARS ────────────────────────────────────────────────────────────────
export const karigars = sqliteTable("karigars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  stage: text("stage").notNull(),        // आरी | घिसाई | पॉलिश | जाँच
  advance: real("advance").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ─── LOTS ────────────────────────────────────────────────────────────────────
export const lots = sqliteTable("lots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  lotNo: text("lot_no").notNull(),
  roughWeight: real("rough_weight").notNull(),
  polishWeight: real("polish_weight"),
  shape: text("shape"),                  // Round | Princess | Oval | Pear | Marquise | Emerald | Radiant
  quality: text("quality"),             // VVS1 | VVS2 | VS1 | VS2 | SI1 | SI2
  color: text("color"),                  // D | E | F | G | H | I | J
  status: text("status").notNull().default("लंबित"), // लंबित | काम चल रहा है | पूर्ण | बिका
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ─── ASSIGNMENTS ─────────────────────────────────────────────────────────────
export const assignments = sqliteTable("assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  karigarId: integer("karigar_id").notNull(),
  lotId: integer("lot_id").notNull(),
  issuedWeight: real("issued_weight").notNull(),
  returnedWeight: real("returned_weight"),
  stage: text("stage").notNull(),        // आरी | घिसाई | ब्लॉकिंग | पॉलिश | जाँच
  wages: real("wages"),
  status: text("status").notNull().default("लंबित"),
  issuedAt: text("issued_at").default(sql`(datetime('now'))`),
  returnedAt: text("returned_at"),
});

// ─── LAB CERTIFICATES ────────────────────────────────────────────────────────
// GIA/IGI/SGL certificate — export के लिए अनिवार्य
export const labCertificates = sqliteTable("lab_certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  lotId: integer("lot_id").notNull(),
  stoneNo: text("stone_no"),             // एक lot में multiple stones — हर stone का अलग record
  labName: text("lab_name").notNull(),   // GIA | IGI | HRD | SGL | GTLI
  certificateNo: text("certificate_no"),
  sentDate: text("sent_date"),
  receivedDate: text("received_date"),
  caratWeight: real("carat_weight"),
  shape: text("shape"),
  color: text("color"),                  // D-Z scale
  clarity: text("clarity"),             // FL | IF | VVS1 | VVS2 | VS1 | VS2 | SI1 | SI2
  cut: text("cut"),                      // Excellent | Very Good | Good | Fair | Poor
  polish: text("polish"),
  symmetry: text("symmetry"),
  fluorescence: text("fluorescence"),
  status: text("status").notNull().default("भेजा"), // भेजा | मिला | रद्द
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ─── SALES / INVOICES ────────────────────────────────────────────────────────
export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  buyer: text("buyer").notNull(),
  buyerAddress: text("buyer_address"),
  buyerGstin: text("buyer_gstin"),
  date: text("date").notNull(),
  weight: real("weight").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("INR"),          // INR | USD
  saleType: text("sale_type").default("domestic"),    // domestic | export
  status: text("status").notNull().default("लंबित"),  // लंबित | भुगतान हो गया | रद्द
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ─── EXPENSES ────────────────────────────────────────────────────────────────
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),  // बिजली | लैब फीस | परिवहन | औजार | अन्य
  description: text("description"),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ─── WAGE PAYMENTS ───────────────────────────────────────────────────────────
// karigar को actual payment — advance deduct करके
export const wagePayments = sqliteTable("wage_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  karigarId: integer("karigar_id").notNull(),
  amount: real("amount").notNull(),
  advanceDeducted: real("advance_deducted").default(0),
  netPaid: real("net_paid").notNull(),
  date: text("date").notNull(),
  note: text("note"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});