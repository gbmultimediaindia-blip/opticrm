"use server";

import { db } from "@/lib/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createStore(formData: {
    name: string;
    address: string;
    email: string;
    phone: string;
    gstNumber?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { name, address, email, phone, gstNumber } = formData;

    await db.insert(store).values({
        name,
        address,
        email,
        phone,
        gstNumber,
        ownerId: session.user.id,
    });
}

import { cookies } from "next/headers";

import { storeMember } from "@/db/schema";

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
        // Check ownership
        userStore = await db.query.store.findFirst({
            where: (store, { and, eq }) => and(
                eq(store.id, activeStoreId),
                eq(store.ownerId, session.user.id)
            ),
        });

        // If not owner, check membership
        if (!userStore) {
            const memberRecord = await db.query.storeMember.findFirst({
                where: and(
                    eq(storeMember.storeId, activeStoreId),
                    eq(storeMember.userId, session.user.id)
                ),
                with: {
                    store: true
                }
            });
            if (memberRecord) {
                userStore = memberRecord.store;
            }
        }
    }

    // Fallback if no cookie or invalid/unauthorized store found
    if (!userStore) {
        // Try to find first owned store
        userStore = await db.query.store.findFirst({
            where: eq(store.ownerId, session.user.id),
        });

        // If no owned store, try to find first member store
        if (!userStore) {
            const memberRecord = await db.query.storeMember.findFirst({
                where: eq(storeMember.userId, session.user.id),
                with: {
                    store: true
                }
            });
            if (memberRecord) {
                userStore = memberRecord.store;
            }
        }
    }

    // Set cookie if we found a fallback store and didn't have a valid active one
    if (userStore && (!activeStoreId || activeStoreId !== userStore.id)) {
        // Ideally we shouldn't set cookies in a GET action if it's called during rendering, 
        // but this is an action often called in layouts. 
        // However, Next.js might complain if we set cookies in a Server Component render pass.
        // For now, let's just return the store. The UI will eventually call switchStore if needed, or we rely on the implicit "active" state.
        // Actually, if we return a store that isn't the one in the cookie, data isolation might be desynced if we relied solely on cookie elsewhere.
        // But since we use getStore() everywhere to resolve the store, it's self-correcting.
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

    // Fetch owned stores
    const ownedStores = await db.query.store.findMany({
        where: eq(store.ownerId, session.user.id),
        orderBy: (store, { desc }) => [desc(store.createdAt)],
    });

    // Fetch member stores
    const memberRecords = await db.query.storeMember.findMany({
        where: eq(storeMember.userId, session.user.id),
        with: {
            store: true,
        },
    });

    const memberStores = memberRecords.map(mr => mr.store);

    // Combine and deduplicate (though logic shouldn't allow being owner AND member of same store usually)
    const allStores = [...ownedStores, ...memberStores];

    // Simple dedupe by ID just in case
    const uniqueStores = Array.from(new Map(allStores.map(item => [item.id, item])).values());

    // Sort by createdAt descending
    return uniqueStores.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    gstNumber?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { id, name, address, email, phone, gstNumber } = formData;

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
            gstNumber,
            updatedAt: new Date(),
        })
        .where(eq(store.id, id));

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
}

export async function updateStoreSettings(id: string, customerSettings: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Verify ownership
    const userStore = await db.query.store.findFirst({
        where: eq(store.id, id),
    });

    if (!userStore || userStore.ownerId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await db.update(store)
        .set({
            customerSettings,
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
