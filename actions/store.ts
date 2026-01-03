"use server";

import { db } from "@/lib/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createStore(formData: {
    name: string;
    address: string;
    email: string;
    phone: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { name, address, email, phone } = formData;

    await db.insert(store).values({
        name,
        address,
        email,
        phone,
        ownerId: session.user.id,
    });
}

import { cookies } from "next/headers";

export async function getStore() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const cookieStore = await cookies();
    const activeStoreId = cookieStore.get("opticrm-store-id")?.value;

    let userStore;

    if (activeStoreId) {
        userStore = await db.query.store.findFirst({
            where: (store, { and, eq }) => and(
                eq(store.id, activeStoreId),
                eq(store.ownerId, session.user.id)
            ),
        });
    }

    // Fallback if no cookie or invalid store found
    if (!userStore) {
        userStore = await db.query.store.findFirst({
            where: eq(store.ownerId, session.user.id),
        });
    }

    return userStore;
}

export async function getAllStores() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    return await db.query.store.findMany({
        where: eq(store.ownerId, session.user.id),
        orderBy: (store, { desc }) => [desc(store.createdAt)],
    });
}

export async function switchStore(storeId: string) {
    const cookieStore = await cookies();
    cookieStore.set("opticrm-store-id", storeId);
    revalidatePath("/dashboard");
}

export async function updateStore(formData: {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { id, name, address, email, phone } = formData;

    // Verify ownership
    const userStore = await db.query.store.findFirst({
        where: eq(store.id, id),
    });

    if (!userStore || userStore.ownerId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await db.update(store)
        .set({
            name,
            address,
            email,
            phone,
            updatedAt: new Date(),
        })
        .where(eq(store.id, id));

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
}

export async function deleteStore(storeId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Verify ownership
    const userStore = await db.query.store.findFirst({
        where: eq(store.id, storeId),
    });

    if (!userStore || userStore.ownerId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    // Delete store
    await db.delete(store).where(eq(store.id, storeId));

    // Handle cookie if needed
    const cookieStore = await cookies();
    const activeStoreId = cookieStore.get("opticrm-store-id")?.value;

    if (activeStoreId === storeId) {
        cookieStore.delete("opticrm-store-id");

        // Find another store to switch to, if any
        const remainingStore = await db.query.store.findFirst({
            where: eq(store.ownerId, session.user.id),
        });

        if (remainingStore) {
            cookieStore.set("opticrm-store-id", remainingStore.id);
        }
    }

    revalidatePath("/dashboard");
    return true;
}
