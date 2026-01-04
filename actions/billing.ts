"use server";

import { db } from "@/lib/db";
import { bill, store, customer, prescription } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAccess } from "@/lib/permissions";

const formatAmount = (val: string | undefined | null) => {
    if (!val || val.trim() === "") return "0";
    return val;
};

export async function createBill(data: {
    customerId: string;
    subtotal: string;
    taxType: string;
    taxRate: string;
    taxAmount: string;
    totalAmount: string;
    advanceAmount: string;
    dueAmount: string;
    notes?: string;
}) {
    const { store: userStore } = await requireAccess("write");

    const [newBill] = await db.insert(bill).values({
        customerId: data.customerId,
        subtotal: formatAmount(data.subtotal),
        taxType: data.taxType,
        taxRate: formatAmount(data.taxRate),
        taxAmount: formatAmount(data.taxAmount),
        totalAmount: formatAmount(data.totalAmount),
        advanceAmount: formatAmount(data.advanceAmount),
        dueAmount: formatAmount(data.dueAmount),
        notes: data.notes,
        storeId: userStore.id,
    }).returning();

    revalidatePath("/dashboard/billing");
    return newBill.id;
}

export async function getBills() {
    const { store: userStore } = await requireAccess("view");

    return await db.query.bill.findMany({
        where: eq(bill.storeId, userStore.id),
        with: {
            customer: true,
        },
        orderBy: [desc(bill.createdAt)],
    });
}
const formatPrescriptionValue = (val: string | undefined | null) => {
    if (!val || val.trim() === "") return "0.00";
    return val;
};

export async function createBillWithCustomer(data: {
    customer: {
        name: string;
        email?: string;
        phone: string;
        address?: string;
    };
    prescription?: {
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
    };
    bill: {
        subtotal: string;
        taxType: string;
        taxRate: string;
        taxAmount: string;
        totalAmount: string;
        advanceAmount: string;
        dueAmount: string;
        notes?: string;
    };
}) {
    const { store: userStore } = await requireAccess("write");

    return await db.transaction(async (tx) => {
        // 1. Create Customer
        const [newCustomer] = await tx.insert(customer).values({
            ...data.customer,
            storeId: userStore.id,
        }).returning();

        // 2. Create Prescription if provided
        if (data.prescription) {
            await tx.insert(prescription).values({
                rightSphere: formatPrescriptionValue(data.prescription.rightSphere),
                rightCylinder: formatPrescriptionValue(data.prescription.rightCylinder),
                rightAxis: formatPrescriptionValue(data.prescription.rightAxis),
                rightAdd: formatPrescriptionValue(data.prescription.rightAdd),
                leftSphere: formatPrescriptionValue(data.prescription.leftSphere),
                leftCylinder: formatPrescriptionValue(data.prescription.leftCylinder),
                leftAxis: formatPrescriptionValue(data.prescription.leftAxis),
                leftAdd: formatPrescriptionValue(data.prescription.leftAdd),
                pd: formatPrescriptionValue(data.prescription.pd),
                notes: data.prescription.notes || "",
                customerId: newCustomer.id,
            });
        }

        // 3. Create Bill
        const [newBill] = await tx.insert(bill).values({
            customerId: newCustomer.id,
            subtotal: formatAmount(data.bill.subtotal),
            taxType: data.bill.taxType,
            taxRate: formatAmount(data.bill.taxRate),
            taxAmount: formatAmount(data.bill.taxAmount),
            totalAmount: formatAmount(data.bill.totalAmount),
            advanceAmount: formatAmount(data.bill.advanceAmount),
            dueAmount: formatAmount(data.bill.dueAmount),
            notes: data.bill.notes || "",
            storeId: userStore.id,
        }).returning();

        revalidatePath("/dashboard/billing");
        revalidatePath("/dashboard/customers");

        return newBill.id;
    });
}

export async function deleteBill(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.delete(bill)
        .where(and(eq(bill.id, id), eq(bill.storeId, userStore.id)));

    revalidatePath("/dashboard/billing");
}

export async function getBill(id: string) {
    const { store: userStore } = await requireAccess("view");

    const result = await db.query.bill.findFirst({
        where: and(eq(bill.id, id), eq(bill.storeId, userStore.id)),
        with: {
            customer: true,
            store: true,
        },
    });

    if (!result) throw new Error("Bill not found");

    return result;
}
