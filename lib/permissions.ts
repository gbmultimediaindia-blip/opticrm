"use server";

import { db } from "@/lib/db";
import { store, storeMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

import { getStore } from "@/actions/store";

export type Role = "owner" | "admin" | "editor" | "viewer";

export async function getCurrentRole(storeId: string): Promise<Role | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    // Check ownership
    const userStore = await db.query.store.findFirst({
        where: and(eq(store.id, storeId), eq(store.ownerId, session.user.id)),
    });

    if (userStore) return "owner";

    // Check membership
    const member = await db.query.storeMember.findFirst({
        where: and(
            eq(storeMember.storeId, storeId),
            eq(storeMember.userId, session.user.id)
        ),
    });

    if (member) return member.role as Role;

    return null;
}

export async function canWrite(role: Role | null) {
    return role === "owner" || role === "admin" || role === "editor";
}

export async function canManageSettings(role: Role | null) {
    return role === "owner" || role === "admin";
}

export async function canDeleteStore(role: Role | null) {
    return role === "owner";
}

export async function requireAccess(level: 'view' | 'write' | 'settings' | 'delete' | 'owner' = 'view') {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userStore = await getStore();
    if (!userStore) throw new Error("Store not found");

    const role = await getCurrentRole(userStore.id);

    // If no role found, user has no access at all
    if (!role) throw new Error("Unauthorized: You do not have access to this store");

    const allowed =
        level === 'view' ? true : // Any role can view
            level === 'write' ? await canWrite(role) :
                level === 'settings' ? await canManageSettings(role) :
                    level === 'delete' ? await canDeleteStore(role) :
                        level === 'owner' ? role === 'owner' : false;

    if (!allowed) {
        throw new Error("Unauthorized: Insufficient permissions");
    }

    return { session, store: userStore, role };
}
