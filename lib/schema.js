import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const karigars = pgTable("karigars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  stage: text("stage").notNull(),
  advance: real("advance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lots = pgTable("lots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lotNo: text("lot_no").notNull(),
  roughWeight: real("rough_weight").notNull(),
  polishWeight: real("polish_weight"),
  shape: text("shape"),
  quality: text("quality"),
  status: text("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  karigarId: integer("karigar_id").notNull(),
  lotId: integer("lot_id").notNull(),
  issuedWeight: real("issued_weight").notNull(),
  returnedWeight: real("returned_weight"),
  stage: text("stage").notNull(),
  wages: real("wages"),
  status: text("status").notNull().default("Pending"),
  issuedAt: timestamp("issued_at").defaultNow(),
  returnedAt: timestamp("returned_at"),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  invoiceNo: text("invoice_no").notNull(),
  buyer: text("buyer").notNull(),
  date: text("date").notNull(),
  weight: real("weight").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
});