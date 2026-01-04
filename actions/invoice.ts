"use server";

import { db } from "@/lib/db";
import { invoice, store, customer, prescription, invoiceItem, product } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
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
    status?: string;
    deliveryStatus?: string;
    notes?: string;
    discountType?: string;
    discountValue?: string;
    discountAmount?: string;
    items: {
        productId: string;
        quantity: string;
        unitPrice: string;
        totalPrice: string;
    }[];
}) {
    const { store: userStore } = await requireAccess("write");

    return await db.transaction(async (tx) => {
        // 1. Create Invoice
        const [newInvoice] = await tx.insert(invoice).values({
            customerId: data.customerId,
            subtotal: formatAmount(data.subtotal),
            taxType: data.taxType,
            taxRate: formatAmount(data.taxRate),
            taxAmount: formatAmount(data.taxAmount),
            totalAmount: formatAmount(data.totalAmount),
            advanceAmount: formatAmount(data.advanceAmount),
            dueAmount: formatAmount(data.dueAmount),
            status: parseFloat(formatAmount(data.dueAmount)) <= 0 ? "completed" : "pending",
            deliveryStatus: data.deliveryStatus || "pending",
            notes: data.notes,
            discountType: data.discountType || "fixed",
            discountValue: formatAmount(data.discountValue),
            discountAmount: formatAmount(data.discountAmount),
            storeId: userStore.id,
        }).returning();

        // 2. Create Invoice Items and Update Stock
        for (const item of data.items) {
            await tx.insert(invoiceItem).values({
                invoiceId: newInvoice.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            });

            // Debit stock from product table
            await tx.update(product)
                .set({
                    stock: sql`(${product.stock}::integer - ${parseInt(item.quantity)})::text`
                })
                .where(and(eq(product.id, item.productId), eq(product.storeId, userStore.id)));
        }

        revalidatePath("/dashboard/invoices");
        revalidatePath("/dashboard/inventory");
        revalidatePath("/dashboard");
        return newInvoice.id;
    });
}

export async function getInvoices() {
    const { store: userStore } = await requireAccess("view");

    return await db.query.invoice.findMany({
        where: eq(invoice.storeId, userStore.id),
        with: {
            customer: true,
            items: {
                with: {
                    product: true
                }
            }
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
        status?: string;
        deliveryStatus?: string;
        notes?: string;
        discountType?: string;
        discountValue?: string;
        discountAmount?: string;
        items: {
            productId: string;
            quantity: string;
            unitPrice: string;
            totalPrice: string;
        }[];
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
            status: parseFloat(formatAmount(data.invoice.dueAmount)) <= 0 ? "completed" : "pending",
            deliveryStatus: data.invoice.deliveryStatus || "pending",
            notes: data.invoice.notes || "",
            discountType: data.invoice.discountType || "fixed",
            discountValue: formatAmount(data.invoice.discountValue),
            discountAmount: formatAmount(data.invoice.discountAmount),
            storeId: userStore.id,
        }).returning();

        // 4. Create Invoice Items and Update Stock
        for (const item of data.invoice.items) {
            await tx.insert(invoiceItem).values({
                invoiceId: newInvoice.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            });

            await tx.update(product)
                .set({
                    stock: sql`(${product.stock}::integer - ${parseInt(item.quantity)})::text`
                })
                .where(and(eq(product.id, item.productId), eq(product.storeId, userStore.id)));
        }

        revalidatePath("/dashboard/invoices");
        revalidatePath("/dashboard/customers");
        revalidatePath("/dashboard/inventory");
        revalidatePath("/dashboard");

        return newInvoice.id;
    });
}

export async function deleteInvoice(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.transaction(async (tx) => {
        // Find invoice items to restore stock
        const items = await tx.query.invoiceItem.findMany({
            where: eq(invoiceItem.invoiceId, id),
        });

        for (const item of items) {
            await tx.update(product)
                .set({
                    stock: sql`(${product.stock}::integer + ${parseInt(item.quantity)})::text`
                })
                .where(and(eq(product.id, item.productId), eq(product.storeId, userStore.id)));
        }

        await tx.delete(invoice)
            .where(and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)));
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard");
}

export async function updateInvoice(id: string, data: {
    customerId?: string;
    subtotal: string;
    taxType: string;
    taxRate: string;
    taxAmount: string;
    totalAmount: string;
    advanceAmount: string;
    dueAmount: string;
    status?: string;
    deliveryStatus?: string;
    notes?: string;
    discountType?: string;
    discountValue?: string;
    discountAmount?: string;
    items?: {
        productId: string;
        quantity: string;
        unitPrice: string;
        totalPrice: string;
    }[];
}) {
    const { store: userStore } = await requireAccess("write");

    await db.transaction(async (tx) => {
        // 1. Update Invoice Basic Info
        await tx.update(invoice)
            .set({
                customerId: data.customerId,
                subtotal: formatAmount(data.subtotal),
                taxType: data.taxType,
                taxRate: formatAmount(data.taxRate),
                taxAmount: formatAmount(data.taxAmount),
                totalAmount: formatAmount(data.totalAmount),
                advanceAmount: formatAmount(data.advanceAmount),
                dueAmount: formatAmount(data.dueAmount),
                status: parseFloat(formatAmount(data.dueAmount)) <= 0 ? "completed" : "pending",
                deliveryStatus: data.deliveryStatus,
                notes: data.notes,
                discountType: data.discountType,
                discountValue: formatAmount(data.discountValue),
                discountAmount: formatAmount(data.discountAmount),
                updatedAt: new Date(),
            })
            .where(and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)));

        // 2. Handle Items if provided
        if (data.items) {
            // Restore stock for old items
            const oldItems = await tx.query.invoiceItem.findMany({
                where: eq(invoiceItem.invoiceId, id),
            });

            for (const item of oldItems) {
                await tx.update(product)
                    .set({
                        stock: sql`(${product.stock}::integer + ${parseInt(item.quantity)})::text`
                    })
                    .where(and(eq(product.id, item.productId), eq(product.storeId, userStore.id)));
            }

            // Remove old items
            await tx.delete(invoiceItem).where(eq(invoiceItem.invoiceId, id));

            // Add new items and debit stock
            for (const item of data.items) {
                await tx.insert(invoiceItem).values({
                    invoiceId: id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                });

                await tx.update(product)
                    .set({
                        stock: sql`(${product.stock}::integer - ${parseInt(item.quantity)})::text`
                    })
                    .where(and(eq(product.id, item.productId), eq(product.storeId, userStore.id)));
            }
        }
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard");
}

export async function completeInvoice(id: string) {
    const { store: userStore } = await requireAccess("write");

    const inv = await db.query.invoice.findFirst({
        where: and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)),
    });

    if (!inv) throw new Error("Invoice not found");

    await db.update(invoice)
        .set({
            status: "completed",
            advanceAmount: inv.totalAmount,
            dueAmount: "0",
            updatedAt: new Date(),
        })
        .where(and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)));

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");
}

export async function toggleDeliveryStatus(id: string, deliveryStatus: string) {
    const { store: userStore } = await requireAccess("write");

    const inv = await db.query.invoice.findFirst({
        where: and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)),
    });

    if (!inv) throw new Error("Invoice not found");

    if (deliveryStatus === "delivered" && inv.status === "pending") {
        throw new Error("Cannot mark as delivered while payment is pending. Please complete payment first.");
    }

    await db.update(invoice)
        .set({
            deliveryStatus: deliveryStatus,
            updatedAt: new Date(),
        })
        .where(and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)));

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");
}

export async function getInvoice(id: string) {
    const { store: userStore } = await requireAccess("view");

    const result = await db.query.invoice.findFirst({
        where: and(eq(invoice.id, id), eq(invoice.storeId, userStore.id)),
        with: {
            customer: true,
            store: true,
            items: {
                with: {
                    product: true
                }
            }
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
