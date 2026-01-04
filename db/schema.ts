import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    role: text("role").notNull().default("user"), // admin, user
});

export const session = pgTable("sessions", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => users.id)
});

export const account = pgTable("accounts", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => users.id),
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

export const verification = pgTable("verifications", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt")
});

export const store = pgTable("stores", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    gstNumber: text("gst_number"),
    ownerId: text("owner_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storeMember = pgTable("store_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("viewer"), // admin, editor, viewer
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customer = pgTable("customers", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone").notNull(),
    address: text("address"),
    gender: text("gender"),
    dateOfBirth: timestamp("date_of_birth"),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prescription = pgTable("prescriptions", {
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
export const invoice = pgTable("invoices", {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").notNull().references(() => customer.id, { onDelete: "cascade" }),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    subtotal: text("subtotal").notNull().default("0"),
    taxType: text("tax_type").notNull().default("none"), // 'included', 'excluded', 'none'
    taxRate: text("tax_rate").notNull().default("0"),
    taxAmount: text("tax_amount").notNull().default("0"),
    totalAmount: text("total_amount").notNull(),
    advanceAmount: text("advance_amount").notNull().default("0"),
    dueAmount: text("due_amount").notNull().default("0"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const product = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    category: text("category").notNull(), // 'Frames', 'Lenses', 'Sunglasses', 'Accessories'
    brand: text("brand"),
    price: text("price").notNull(),
    stock: text("stock").notNull().default("0"),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

import { relations } from "drizzle-orm";

export const customerRelations = relations(customer, ({ many }) => ({
    prescriptions: many(prescription),
    invoices: many(invoice),
}));

export const prescriptionRelations = relations(prescription, ({ one }) => ({
    customer: one(customer, {
        fields: [prescription.customerId],
        references: [customer.id],
    }),
}));

export const invoiceRelations = relations(invoice, ({ one }) => ({
    customer: one(customer, {
        fields: [invoice.customerId],
        references: [customer.id],
    }),
    store: one(store, {
        fields: [invoice.storeId],
        references: [store.id],
    }),
}));

export const storeRelations = relations(store, ({ many }) => ({
    products: many(product),
    customers: many(customer),
    invoices: many(invoice),
    members: many(storeMember),
}));

export const productRelations = relations(product, ({ one }) => ({
    store: one(store, {
        fields: [product.storeId],
        references: [store.id],
    }),
}));

export const storeMemberRelations = relations(storeMember, ({ one }) => ({
    store: one(store, {
        fields: [storeMember.storeId],
        references: [store.id],
    }),
    user: one(users, {
        fields: [storeMember.userId],
        references: [users.id],
    }),
}));
