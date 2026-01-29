import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
