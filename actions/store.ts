"use server";

import { db } from "@/lib/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

    redirect("/dashboard");
}
