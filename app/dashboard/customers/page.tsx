import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { customer as customerTable, store as storeTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CustomerList } from "@/components/dashboard/customer-list";

export default async function CustomersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const store = await db.query.store.findFirst({
        where: eq(storeTable.ownerId, session.user.id),
    });

    if (!store) {
        redirect("/onboarding");
    }

    const customers = await db.query.customer.findMany({
        where: eq(customerTable.storeId, store.id),
        orderBy: (customer, { desc }) => [desc(customer.createdAt)],
    });

    return <CustomerList customers={customers} />;
}
