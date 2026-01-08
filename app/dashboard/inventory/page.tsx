import { getProducts } from "@/actions/inventory";
import { ProductList } from "@/components/dashboard/product-list";
import { Suspense } from "react";

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="max-w-[1600px] mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
                <ProductList data={products} />
            </Suspense>
        </div>
    );
}
