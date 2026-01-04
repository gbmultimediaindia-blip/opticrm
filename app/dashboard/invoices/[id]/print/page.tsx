import { getInvoice } from "@/actions/invoice";
import { InvoicePrint } from "@/components/dashboard/invoice-print";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PrintInvoicePage({ params }: PageProps) {
    const { id } = await params;

    try {
        const invoice = await getInvoice(id);
        return (
            <div className="min-h-screen bg-white">
                <InvoicePrint invoice={invoice} store={invoice.store} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.print();`,
                    }}
                />
            </div>
        );
    } catch (error) {
        return notFound();
    }
}
