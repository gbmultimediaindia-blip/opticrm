"use server";

import { db } from "@/lib/db";
import { product, store } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAccess } from "@/lib/permissions";

export async function createProduct(data: {
    name: string;
    category: string;
    brand?: string;
    price: string;
    stock: string;
}) {
    const { store: userStore } = await requireAccess("write");

    await db.insert(product).values({
        ...data,
        storeId: userStore.id,
    });

    revalidatePath("/dashboard/inventory");
}

export async function getProducts() {
    const { store: userStore } = await requireAccess("view");

    return await db.query.product.findMany({
        where: eq(product.storeId, userStore.id),
        orderBy: [desc(product.createdAt)],
    });
}

export async function deleteProduct(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.delete(product)
        .where(and(eq(product.id, id), eq(product.storeId, userStore.id)));

    revalidatePath("/dashboard/inventory");
}

export async function updateProduct(id: string, data: {
    name: string;
    category: string;
    brand?: string;
    price: string;
    stock: string;
}) {
    const { store: userStore } = await requireAccess("write");

    await db.update(product)
        .set(data)
        .where(and(eq(product.id, id), eq(product.storeId, userStore.id)));

    revalidatePath("/dashboard/inventory");
}
