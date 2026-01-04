"use server";

import { db } from "@/lib/db";
import { invoice, customer, product } from "@/db/schema";
import { eq, sql, and, gte, lte } from "drizzle-orm";
import { requireAccess } from "@/lib/permissions";

export async function getDashboardStats(startDate?: Date, endDate?: Date) {
    const { store: userStore } = await requireAccess("view");

    const dateFilter = (table: any) => {
        const filters = [eq(table.storeId, userStore.id)];
        if (startDate) filters.push(gte(table.createdAt, startDate));
        if (endDate) filters.push(lte(table.createdAt, endDate));
        return and(...filters);
    };

    // 1. Total Revenue (Sum of totalAmount)
    const revenueResult = await db
        .select({
            total: sql<string>`sum(cast(${invoice.totalAmount} as numeric))`
        })
        .from(invoice)
        .where(dateFilter(invoice));

    // 2. Total Invoices (Sales count)
    const salesResult = await db
        .select({
            count: sql<number>`count(*)`
        })
        .from(invoice)
        .where(dateFilter(invoice));

    // 3. Total Customers
    const customersResult = await db
        .select({
            count: sql<number>`count(*)`
        })
        .from(customer)
        .where(dateFilter(customer));

    // 4. Total Products (Active Items)
    const productsResult = await db
        .select({
            count: sql<number>`count(*)`
        })
        .from(product)
        .where(dateFilter(product));

    // 5. Pending Deliveries (Always all-time)
    const deliveryResult = await db
        .select({
            count: sql<number>`count(*)`
        })
        .from(invoice)
        .where(and(eq(invoice.storeId, userStore.id), eq(invoice.deliveryStatus, "pending")));

    return {
        totalRevenue: revenueResult[0]?.total || "0",
        totalSales: Number(salesResult[0]?.count || 0),
        totalCustomers: Number(customersResult[0]?.count || 0),
        totalProducts: Number(productsResult[0]?.count || 0),
        pendingDeliveries: Number(deliveryResult[0]?.count || 0),
    };
}
