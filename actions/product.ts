"use server";

import { db } from "@/lib/db";
import { product } from "@/db/schema";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAccess } from "@/lib/permissions";

export async function getProducts() {
    const { store: userStore } = await requireAccess("view");

    return await db.query.product.findMany({
        where: eq(product.storeId, userStore.id),
        orderBy: [desc(product.createdAt)],
    });
}

export async function searchProducts(query: string) {
    const { store: userStore } = await requireAccess("view");

    return await db.query.product.findMany({
        where: and(
            eq(product.storeId, userStore.id),
            or(
                ilike(product.name, `%${query}%`),
                ilike(product.brand, `%${query}%`),
                ilike(product.category, `%${query}%`)
            )
        ),
        limit: 10,
    });
}

export async function createProduct(data: {
    name: string;
    category: string;
    brand?: string;
    sellingPrice: string;
    costPrice?: string;
    stock: string;
}) {
    const { store: userStore } = await requireAccess("write");

    const [newProduct] = await db.insert(product).values({
        ...data,
        costPrice: data.costPrice || "0",
        storeId: userStore.id,
    }).returning();

    revalidatePath("/dashboard/inventory");
    return newProduct;
}

export async function updateProduct(id: string, data: Partial<{
    name: string;
    category: string;
    brand: string;
    sellingPrice: string;
    costPrice: string;
    stock: string;
}>) {
    const { store: userStore } = await requireAccess("write");

    await db.update(product)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(product.id, id), eq(product.storeId, userStore.id)));

    revalidatePath("/dashboard/inventory");
}

export async function deleteProduct(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.delete(product)
        .where(and(eq(product.id, id), eq(product.storeId, userStore.id)));

    revalidatePath("/dashboard/inventory");
}
