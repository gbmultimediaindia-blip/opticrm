import { getBill } from "@/actions/billing";
import { BillPrint } from "@/components/dashboard/bill-print";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PrintBillPage({ params }: PageProps) {
    const { id } = await params;

    try {
        const bill = await getBill(id);
        return (
            <div className="min-h-screen bg-white">
                <BillPrint bill={bill} store={bill.store} />
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
