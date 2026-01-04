import { pgTable, text, timestamp, boolean, uuid, index } from "drizzle-orm/pg-core";

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
    discountType: text("discount_type").notNull().default("fixed"),
    discountValue: text("discount_value").notNull().default("0"),
    discountAmount: text("discount_amount").notNull().default("0"),
    status: text("status").notNull().default("pending"), // 'pending', 'completed' (payment status)
    deliveryStatus: text("delivery_status").notNull().default("pending"), // 'pending', 'delivered'
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const product = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    category: text("category").notNull(), // 'Frames', 'Lenses', 'Sunglasses', 'Accessories'
    brand: text("brand"),
    sellingPrice: text("selling_price").notNull(),
    costPrice: text("cost_price").notNull().default("0"),
    stock: text("stock").notNull().default("0"),
    storeId: uuid("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("product_name_idx").on(table.name),
    index("product_brand_idx").on(table.brand),
    index("product_category_idx").on(table.category),
    index("product_store_id_idx").on(table.storeId),
]);

export const invoiceItem = pgTable("invoice_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id").notNull().references(() => invoice.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "restrict" }),
    quantity: text("quantity").notNull().default("1"),
    unitPrice: text("unit_price").notNull(),
    totalPrice: text("total_price").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

import { relations } from "drizzle-orm";

export const customerRelations = relations(customer, ({ many, one }) => ({
    prescriptions: many(prescription),
    invoices: many(invoice),
    store: one(store, {
        fields: [customer.storeId],
        references: [store.id],
    }),
}));

export const prescriptionRelations = relations(prescription, ({ one }) => ({
    customer: one(customer, {
        fields: [prescription.customerId],
        references: [customer.id],
    }),
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
    customer: one(customer, {
        fields: [invoice.customerId],
        references: [customer.id],
    }),
    store: one(store, {
        fields: [invoice.storeId],
        references: [store.id],
    }),
    items: many(invoiceItem),
}));

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
    invoice: one(invoice, {
        fields: [invoiceItem.invoiceId],
        references: [invoice.id],
    }),
    product: one(product, {
        fields: [invoiceItem.productId],
        references: [product.id],
    }),
}));

export const storeRelations = relations(store, ({ many }) => ({
    products: many(product),
    customers: many(customer),
    invoices: many(invoice),
    members: many(storeMember),
}));

export const productRelations = relations(product, ({ one, many }) => ({
    store: one(store, {
        fields: [product.storeId],
        references: [store.id],
    }),
    invoiceItems: many(invoiceItem),
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
