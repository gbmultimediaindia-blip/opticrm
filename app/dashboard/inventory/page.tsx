import { getProducts } from "@/actions/inventory";
import { ProductList } from "@/components/dashboard/product-list";

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="max-w-[1600px] mx-auto">
            <ProductList data={products} />
        </div>
    );
}
