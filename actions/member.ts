"use server";

import { db } from "@/lib/db";
import { storeMember, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAccess } from "@/lib/permissions";

export async function addMember(storeId: string, email: string, role: string) {
    const { store: userStore } = await requireAccess("owner");

    if (userStore.id !== storeId) {
        throw new Error("Unauthorized: Store mismatch");
    }

    // Find the user to invite
    const userToInvite = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!userToInvite) {
        throw new Error("User not found with this email. Please ask them to sign up first.");
    }

    if (userToInvite.id === userStore.ownerId) {
        throw new Error("You cannot add yourself as a member.");
    }

    // Check if member already exists
    const existingMember = await db.query.storeMember.findFirst({
        where: and(
            eq(storeMember.storeId, storeId),
            eq(storeMember.userId, userToInvite.id)
        ),
    });

    if (existingMember) {
        throw new Error("User is already a member of this store.");
    }

    // Add member
    await db.insert(storeMember).values({
        storeId,
        userId: userToInvite.id,
        role, // 'admin', 'editor', 'viewer'
    });

    revalidatePath("/dashboard/settings");
}

export async function getMembers(storeId: string) {
    const { store: userStore } = await requireAccess("view");

    if (userStore.id !== storeId) {
        // If the requested store is not the active/authorized one, return empty or throw
        // For getMembers causing specific UI load, empty list is safest fallback or error
        return [];
    }

    const members = await db.query.storeMember.findMany({
        where: eq(storeMember.storeId, storeId),
        with: {
            user: true,
        },
    });

    return members;
}

export async function removeMember(memberId: string) {
    const { store: userStore } = await requireAccess("owner");

    // Get the member record to verify store context
    const memberRecord = await db.query.storeMember.findFirst({
        where: eq(storeMember.id, memberId),
    });

    if (!memberRecord) throw new Error("Member not found");

    if (memberRecord.storeId !== userStore.id) {
        throw new Error("Unauthorized: Member does not belong to active store");
    }

    await db.delete(storeMember).where(eq(storeMember.id, memberId));

    revalidatePath("/dashboard/settings");
}

export async function updateMemberRole(memberId: string, newRole: string) {
    const { store: userStore } = await requireAccess("owner");

    const memberRecord = await db.query.storeMember.findFirst({
        where: eq(storeMember.id, memberId),
    });

    if (!memberRecord) throw new Error("Member not found");

    if (memberRecord.storeId !== userStore.id) {
        throw new Error("Unauthorized: Member does not belong to active store");
    }

    await db.update(storeMember)
        .set({ role: newRole })
        .where(eq(storeMember.id, memberId));

    revalidatePath("/dashboard/settings");
}
