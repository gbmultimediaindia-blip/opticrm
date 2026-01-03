import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { store as storeTable, customer as customerTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BillList } from "@/components/dashboard/bill-list";
import { getBills } from "@/actions/billing";

export default async function BillingPage() {
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

    const bills = await getBills();
    const customers = await db.query.customer.findMany({
        where: eq(customerTable.storeId, store.id),
        orderBy: (customer, { asc }) => [asc(customer.name)],
    });

    return <BillList bills={bills} customers={customers} />;
}
