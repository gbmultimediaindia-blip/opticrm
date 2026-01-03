"use server";

import { db } from "@/lib/db";
import { product, store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getStore(userId: string) {
    const userStore = await db.query.store.findFirst({
        where: eq(store.ownerId, userId),
    });
    if (!userStore) throw new Error("Store not found");
    return userStore;
}

export async function createProduct(data: {
    name: string;
    category: string;
    brand?: string;
    price: string;
    stock: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

    await db.insert(product).values({
        ...data,
        storeId: userStore.id,
    });

    revalidatePath("/dashboard/inventory");
}

export async function getProducts() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

    return await db.query.product.findMany({
        where: eq(product.storeId, userStore.id),
        orderBy: [desc(product.createdAt)],
    });
}

export async function deleteProduct(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

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
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

    await db.update(product)
        .set(data)
        .where(and(eq(product.id, id), eq(product.storeId, userStore.id)));

    revalidatePath("/dashboard/inventory");
}
