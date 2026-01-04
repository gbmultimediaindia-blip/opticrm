"use client";

import { useState, useEffect } from "react";
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
import { Package, Tag, Layers, BadgeIndianRupee, Boxes, Plus, Edit2, Info } from "lucide-react";

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
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        brand: "",
        costPrice: "",
        sellingPrice: "",
        stock: "",
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || "",
                category: productToEdit.category || "",
                brand: productToEdit.brand || "",
                costPrice: productToEdit.costPrice || "",
                sellingPrice: productToEdit.sellingPrice || "",
                stock: productToEdit.stock || "0",
            });
        } else {
            setFormData({
                name: "",
                category: "",
                brand: "",
                costPrice: "",
                sellingPrice: "",
                stock: "0",
            });
        }
    }, [productToEdit, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dataToSubmit = {
            ...formData,
            category: formData.category || "Other"
        };

        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, dataToSubmit);
                toast.success("Product profile updated");
            } else {
                await createProduct(dataToSubmit);
                toast.success("New product added to list");
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden [&_[data-slot=sheet-close]]:hidden">
                {/* Header Section */}
                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
                            {productToEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                                {productToEdit ? "Edit Product" : "Add Product"}
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-500 font-medium">
                                {productToEdit ? `Updating details for ${productToEdit.name}` : "Categorize and track your products."}
                            </SheetDescription>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-indigo-400" /> General Identification
                        </h3>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase">Product Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Ray-Ban Aviator Classic"
                                className="h-11 rounded-xl"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                                                    {cat}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Brand (Optional)</Label>
                                <div className="relative">
                                    <Input
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="e.g. Ray-Ban"
                                        className="h-11 rounded-xl pl-9"
                                    />
                                    <Tag className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financials & Stock */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <BadgeIndianRupee className="w-3.5 h-3.5 text-indigo-400" /> Financials & Stock
                        </h3>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                                        Cost Price <Info className="w-2.5 h-2.5 text-slate-400" />
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.costPrice}
                                            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                            placeholder="0.00"
                                            className="h-11 rounded-xl pl-9 font-mono font-bold"
                                            required
                                        />
                                        <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500">Purchase price per unit</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                                        Selling Price <Info className="w-2.5 h-2.5 text-slate-400" />
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.sellingPrice}
                                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                            placeholder="0.00"
                                            className="h-11 rounded-xl pl-9 font-mono font-bold text-indigo-600 dark:text-indigo-400"
                                            required
                                        />
                                        <span className="absolute left-3.5 top-3 text-indigo-400 font-bold text-sm">₹</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500">Retail price for customers</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase">Available Stock</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="0"
                                            className="h-11 rounded-xl pl-9 font-bold"
                                            required
                                        />
                                        <Boxes className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Section */}
                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="mt-0 flex-row w-full justify-end gap-3 items-center">
                        <SheetClose asChild>
                            <Button type="button" variant="ghost" className="h-11 px-8 font-semibold text-slate-500">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            form="product-form"
                            className="h-11 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none sm:flex-1 text-sm"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : productToEdit ? "Save Changes" : "Add Product"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
