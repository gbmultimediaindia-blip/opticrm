import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id)
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt")
});

export const store = pgTable("store", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    ownerId: text("owner_id").notNull().references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customer = pgTable("customer", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone").notNull(),
    address: text("address"),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prescription = pgTable("prescription", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").notNull().references(() => customer.id, { onDelete: "cascade" }),

    // Right Eye (OD)
    rightSphere: text("right_sphere"),
    rightCylinder: text("right_cylinder"),
    rightAxis: text("right_axis"),
    rightAdd: text("right_add"),

    // Left Eye (OS)
    leftSphere: text("left_sphere"),
    leftCylinder: text("left_cylinder"),
    leftAxis: text("left_axis"),
    leftAdd: text("left_add"),

    pd: text("pd"), // Pupillary Distance
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const bill = pgTable("bill", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").notNull().references(() => customer.id, { onDelete: "cascade" }),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    totalAmount: text("total_amount").notNull(),
    advanceAmount: text("advance_amount").notNull().default("0"),
    dueAmount: text("due_amount").notNull().default("0"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

import { relations } from "drizzle-orm";

export const customerRelations = relations(customer, ({ many }) => ({
    prescriptions: many(prescription),
    bills: many(bill),
}));

export const prescriptionRelations = relations(prescription, ({ one }) => ({
    customer: one(customer, {
        fields: [prescription.customerId],
        references: [customer.id],
    }),
}));

export const billRelations = relations(bill, ({ one }) => ({
    customer: one(customer, {
        fields: [bill.customerId],
        references: [customer.id],
    }),
    store: one(store, {
        fields: [bill.storeId],
        references: [store.id],
    }),
}));
