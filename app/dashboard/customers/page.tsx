import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { customer as customerTable, store as storeTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CustomerList } from "@/components/dashboard/customer-list";
import { getStore } from "@/actions/store";

export default async function CustomersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const store = await getStore();

    if (!store) {
        redirect("/onboarding");
    }

    const customers = await db.query.customer.findMany({
        where: eq(customerTable.storeId, store.id),
        with: {
            prescriptions: {
                orderBy: (prescription, { desc }) => [desc(prescription.createdAt)],
                limit: 1,
            }
        },
        orderBy: (customer, { desc }) => [desc(customer.createdAt)],
    });

    return <CustomerList customers={customers} />;
}
