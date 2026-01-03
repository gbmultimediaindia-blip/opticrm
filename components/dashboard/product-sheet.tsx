"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/inventory";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productToEdit?: any;
}

const CATEGORIES = [
    "Frames",
    "Lenses",
    "Sunglasses",
    "Contact Lenses",
    "Accessories",
    "Other"
];

export function ProductSheet({ open, onOpenChange, productToEdit }: ProductSheetProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            brand: formData.get("brand") as string,
            price: formData.get("price") as string,
            stock: formData.get("stock") as string,
        };

        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, data);
                toast.success("Product updated successfully");
            } else {
                await createProduct(data);
                toast.success("Product added successfully");
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        {productToEdit ? "Edit Product" : "Add Product"}
                    </SheetTitle>
                    <SheetDescription className="text-slate-500 dark:text-slate-400">
                        {productToEdit ? "Update product details." : "Add a new item to your inventory."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={productToEdit?.name}
                            placeholder="e.g. Ray-Ban Aviator"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue={productToEdit?.category} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            name="brand"
                            defaultValue={productToEdit?.brand}
                            placeholder="e.g. Ray-Ban"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={productToEdit?.price}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                defaultValue={productToEdit?.stock}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <SheetFooter className="mt-8">
                        <SheetClose asChild>
                            <Button variant="ghost" type="button">Cancel</Button>
                        </SheetClose>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                            {loading ? "Saving..." : (productToEdit ? "Update Product" : "Add Product")}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
