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
    gender?: string;
    dateOfBirth?: Date;
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
    revalidatePath("/dashboard");
    return newCustomer;
}

export async function updateCustomer(id: string, data: any) {
    const { store: userStore } = await requireAccess("write");
    const { prescription: prescriptionData, ...customerData } = data;

    await db.update(customer)
        .set(customerData)
        .where(and(eq(customer.id, id), eq(customer.storeId, userStore.id)));

    if (prescriptionData) {
        if (prescriptionData.id) {
            await updatePrescription(prescriptionData.id, prescriptionData);
        } else {
            // Check if any clinical data was actually entered
            const hasData = prescriptionData.rightSphere || prescriptionData.rightCylinder ||
                prescriptionData.leftSphere || prescriptionData.leftCylinder ||
                prescriptionData.pd;
            if (hasData) {
                await createPrescription(id, prescriptionData);
            }
        }
    }

    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
}

export async function deleteCustomer(id: string) {
    const { store: userStore } = await requireAccess("write");

    await db.delete(customer)
        .where(and(eq(customer.id, id), eq(customer.storeId, userStore.id)));

    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
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
    revalidatePath("/dashboard");
}

export async function getPrescriptionHistory(customerId: string) {
    return await db.query.prescription.findMany({
        where: eq(prescription.customerId, customerId),
        orderBy: [desc(prescription.createdAt)],
    });
}

export async function getPrescription(id: string) {
    const result = await db.query.prescription.findFirst({
        where: eq(prescription.id, id),
        with: {
            customer: {
                with: {
                    store: true,
                }
            }
        }
    });
    return result;
}

export async function updatePrescription(id: string, data: any) {
    const { store: userStore } = await requireAccess("write");

    // Verify ownership via customer join
    const existing = await db.query.prescription.findFirst({
        where: eq(prescription.id, id),
        with: {
            customer: true
        }
    });

    if (!existing || existing.customer.storeId !== userStore.id) {
        throw new Error("Prescription not found or access denied");
    }

    await db.update(prescription)
        .set({
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
            updatedAt: new Date(),
        })
        .where(eq(prescription.id, id));

    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
}

export async function deletePrescription(id: string) {
    const { store: userStore } = await requireAccess("write");

    // Verify ownership via customer join
    const existing = await db.query.prescription.findFirst({
        where: eq(prescription.id, id),
        with: {
            customer: true
        }
    });

    if (!existing || existing.customer.storeId !== userStore.id) {
        throw new Error("Prescription not found or access denied");
    }

    await db.delete(prescription)
        .where(eq(prescription.id, id));

    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
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
