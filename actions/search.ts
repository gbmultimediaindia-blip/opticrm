"use server";

import { db } from "@/lib/db";
import { customer, product, invoice, store } from "@/db/schema";
import { ilike, or, eq, and, sql } from "drizzle-orm";
import { getStore } from "./store";

export type SearchResult = {
    id: string;
    type: "customer" | "product" | "invoice";
    title: string;
    subtitle: string;
    href: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    const activeStore = await getStore();
    if (!activeStore) return [];

    const storeId = activeStore.id;
    const searchTerm = `%${query}%`;

    const results: SearchResult[] = [];

    // Search Customers
    const customers = await db.query.customer.findMany({
        where: and(
            eq(customer.storeId, storeId),
            or(
                ilike(customer.name, searchTerm),
                ilike(customer.phone, searchTerm)
            )
        ),
        limit: 5,
    });

    customers.forEach((c) => {
        results.push({
            id: c.id,
            type: "customer",
            title: c.name,
            subtitle: `Customer • ${c.phone}`,
            href: `/dashboard/customers?search=${c.phone}`,
        });
    });

    // Search Products
    const products = await db.query.product.findMany({
        where: and(
            eq(product.storeId, storeId),
            or(
                ilike(product.name, searchTerm),
                ilike(product.brand || "", searchTerm),
                ilike(product.category, searchTerm)
            )
        ),
        limit: 5,
    });

    products.forEach((p) => {
        results.push({
            id: p.id,
            type: "product",
            title: p.name,
            subtitle: `Product • ${p.category} ${p.brand ? `• ${p.brand}` : ""}`,
            href: `/dashboard/inventory?search=${p.name}`,
        });
    });

    // Search Invoices (search by ID fragment or customer name via join)
    // Note: ID is a UUID, ilike might not work directly without casting to text
    const invoices = await db.query.invoice.findMany({
        where: eq(invoice.storeId, storeId),
        with: {
            customer: true
        },
        limit: 50, // Fetch more to filter by query in JS if needed, or use a better query
    });

    // Filter invoices by query in JS for UUID fragment matching
    const filteredInvoices = invoices.filter(inv =>
        inv.id.toLowerCase().includes(query.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(query.toLowerCase()) ||
        inv.customer.phone.includes(query)
    ).slice(0, 5);

    filteredInvoices.forEach((inv) => {
        results.push({
            id: inv.id,
            type: "invoice",
            title: `Invoice #${inv.id.substring(0, 8).toUpperCase()}`,
            subtitle: `Invoice • ${inv.customer.name} • ₹${inv.totalAmount}`,
            href: `/dashboard/invoices?search=${inv.id.substring(0, 8)}`,
        });
    });

    return results;
}
