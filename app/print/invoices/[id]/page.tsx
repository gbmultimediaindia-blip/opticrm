import { getInvoice } from "@/actions/invoice";
import { InvoicePrint } from "@/components/dashboard/invoice-print";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PrintInvoicePage({ params }: PageProps) {
    const { id } = await params;
    let invoice;

    try {
        invoice = await getInvoice(id);
    } catch (error) {
        return notFound();
    }

    if (!invoice) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <InvoicePrint invoice={invoice} store={invoice.store} />
        </div>
    );
}
