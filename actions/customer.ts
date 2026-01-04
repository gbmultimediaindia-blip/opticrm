"use server";

import { db } from "@/lib/db";
import { customer, store, prescription } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAccess } from "@/lib/permissions";

const formatPrescriptionValue = (val: string | undefined | null) => {
    if (!val || val.trim() === "") return "0.00";
    return val;
};

export async function createCustomer(formData: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
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
    }
}) {
    const { store: userStore } = await requireAccess("write");

    const { prescription: prescriptionData, ...customerData } = formData;

    const [newCustomer] = await db.insert(customer).values({
        ...customerData,
        storeId: userStore.id,
    }).returning();

    if (prescriptionData) {
        await db.insert(prescription).values({
            rightSphere: formatPrescriptionValue(prescriptionData.rightSphere),
            rightCylinder: formatPrescriptionValue(prescriptionData.rightCylinder),
            rightAxis: formatPrescriptionValue(prescriptionData.rightAxis),
            rightAdd: formatPrescriptionValue(prescriptionData.rightAdd),
            leftSphere: formatPrescriptionValue(prescriptionData.leftSphere),
            leftCylinder: formatPrescriptionValue(prescriptionData.leftCylinder),
            leftAxis: formatPrescriptionValue(prescriptionData.leftAxis),
            leftAdd: formatPrescriptionValue(prescriptionData.leftAdd),
            pd: formatPrescriptionValue(prescriptionData.pd),
            notes: prescriptionData.notes || "",
            customerId: newCustomer.id,
        });
    }

    revalidatePath("/dashboard/customers");
}

export async function updateCustomer(id: string, formData: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
}) {
    const { store: userStore } = await requireAccess("write");

    await db.update(customer)
        .set(formData)
        .where(and(eq(customer.id, id), eq(customer.storeId, userStore.id)));

    revalidatePath("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.delete(customer)
        .where(and(eq(customer.id, id), eq(customer.storeId, userStore.id)));

    revalidatePath("/dashboard/customers");
}

export async function createPrescription(customerId: string, data: any) {
    const { store: userStore } = await requireAccess("write");

    await db.insert(prescription).values({
        rightSphere: formatPrescriptionValue(data.rightSphere),
        rightCylinder: formatPrescriptionValue(data.rightCylinder),
        rightAxis: formatPrescriptionValue(data.rightAxis),
        rightAdd: formatPrescriptionValue(data.rightAdd),
        leftSphere: formatPrescriptionValue(data.leftSphere),
        leftCylinder: formatPrescriptionValue(data.leftCylinder),
        leftAxis: formatPrescriptionValue(data.leftAxis),
        leftAdd: formatPrescriptionValue(data.leftAdd),
        pd: formatPrescriptionValue(data.pd),
        notes: data.notes || "",
        customerId,
    });

    revalidatePath("/dashboard/customers");
}

export async function getPrescriptionHistory(customerId: string) {
    return await db.query.prescription.findMany({
        where: eq(prescription.customerId, customerId),
        orderBy: [desc(prescription.createdAt)],
    });
}

export async function getAllCustomers() {
    const { store: userStore } = await requireAccess("view");

    return await db.query.customer.findMany({
        where: eq(customer.storeId, userStore.id),
        orderBy: (customer, { asc }) => [asc(customer.name)],
        columns: {
            id: true,
            name: true,
            phone: true,
        }
    });
}
