import { getPrescription } from "@/actions/customer";
import { PrescriptionPrint } from "@/components/dashboard/prescription-print";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PrintPrescriptionPage({ params }: PageProps) {
    const { id } = await params;

    try {
        const prescription = await getPrescription(id);

        if (!prescription) {
            return notFound();
        }

        // Extract store from the nested customer relation
        const store = prescription.customer?.store;

        return (
            <div className="min-h-screen bg-white">
                <PrescriptionPrint prescription={prescription} store={store} />
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
