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

export async function getStore() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const userStore = await db.query.store.findFirst({
        where: eq(store.ownerId, session.user.id),
    });

    return userStore;
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
