"use server";

import { db } from "@/lib/db";
import { invoice, store, customer, prescription } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAccess } from "@/lib/permissions";

const formatAmount = (val: string | undefined | null) => {
    if (!val || val.trim() === "") return "0";
    return val;
};

export async function createInvoice(data: {
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

    const [newInvoice] = await db.insert(invoice).values({
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

    revalidatePath("/dashboard/invoices");
    return newInvoice.id;
}

export async function getInvoices() {
    const { store: userStore } = await requireAccess("view");

    return await db.query.invoice.findMany({
        where: eq(invoice.storeId, userStore.id),
        with: {
            customer: true,
        },
        orderBy: [desc(invoice.createdAt)],
    });
}
const formatPrescriptionValue = (val: string | undefined | null) => {
    if (!val || val.trim() === "") return "0.00";
    return val;
};

export async function createInvoiceWithCustomer(data: {
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
    invoice: {
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

        // 3. Create Invoice
        const [newInvoice] = await tx.insert(invoice).values({
            customerId: newCustomer.id,
            subtotal: formatAmount(data.invoice.subtotal),
            taxType: data.invoice.taxType,
            taxRate: formatAmount(data.invoice.taxRate),
            taxAmount: formatAmount(data.invoice.taxAmount),
            totalAmount: formatAmount(data.invoice.totalAmount),
            advanceAmount: formatAmount(data.invoice.advanceAmount),
            dueAmount: formatAmount(data.invoice.dueAmount),
            notes: data.invoice.notes || "",
            storeId: userStore.id,
        }).returning();

        revalidatePath("/dashboard/invoices");
        revalidatePath("/dashboard/customers");

        return newInvoice.id;
    });
}

export async function deleteInvoice(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.delete(invoice)
        .where(and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)));

    revalidatePath("/dashboard/invoices");
}

export async function getInvoice(id: string) {
    const { store: userStore } = await requireAccess("view");

    const result = await db.query.invoice.findFirst({
        where: and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)),
        with: {
            customer: true,
            store: true,
        },
    });

    if (!result) throw new Error("Invoice not found");

    return result;
}

export async function getCustomerInvoices(customerId: string) {
    const { store: userStore } = await requireAccess("view");

    return await db.query.invoice.findMany({
        where: and(eq(invoice.customerId, customerId), eq(invoice.storeId, userStore.id)),
        orderBy: [desc(invoice.createdAt)],
    });
}
