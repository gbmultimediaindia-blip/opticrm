"use server";

import { db } from "@/lib/db";
import { customer, store, eyesight } from "@/db/schema";
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

export async function createCustomer(formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    eyesight?: {
        rightSphere?: string;
        rightCylinder?: string;
        rightAxis?: string;
        rightAdd?: string;
        leftSphere?: string;
        leftCylinder?: string;
        leftAxis?: string;
        leftAdd?: string;
        pd?: string;
        notes?: string;
    }
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

    const { eyesight: eyesightData, ...customerData } = formData;

    const [newCustomer] = await db.insert(customer).values({
        ...customerData,
        storeId: userStore.id,
    }).returning();

    if (eyesightData && Object.values(eyesightData).some(v => v !== "")) {
        await db.insert(eyesight).values({
            ...eyesightData,
            customerId: newCustomer.id,
        });
    }

    revalidatePath("/dashboard/customers");
}

export async function updateCustomer(id: string, formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

    await db.update(customer)
        .set(formData)
        .where(and(eq(customer.id, id), eq(customer.storeId, userStore.id)));

    revalidatePath("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore(session.user.id);

    await db.delete(customer)
        .where(and(eq(customer.id, id), eq(customer.storeId, userStore.id)));

    revalidatePath("/dashboard/customers");
}

export async function createEyesight(customerId: string, data: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    await db.insert(eyesight).values({
        ...data,
        customerId,
    });

    revalidatePath("/dashboard/customers");
}

export async function getEyesightHistory(customerId: string) {
    return await db.query.eyesight.findMany({
        where: eq(eyesight.customerId, customerId),
        orderBy: [desc(eyesight.createdAt)],
    });
}
