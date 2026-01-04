import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { store as storeTable, customer as customerTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InvoiceList } from "@/components/dashboard/invoice-list";
import { getInvoices } from "@/actions/invoice";
import { getStore } from "@/actions/store";

export default async function InvoicesPage() {
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

    const invoices = await getInvoices();
    const customers = await db.query.customer.findMany({
        where: eq(customerTable.storeId, store.id),
        orderBy: (customer, { asc }) => [asc(customer.name)],
    });

    return <InvoiceList invoices={invoices} customers={customers} />;
}
