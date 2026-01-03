"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, MoreHorizontal, Box, Tag, Layers, Search, Package2 } from "lucide-react";
import { ProductSheet } from "./product-sheet";
import { DeleteProductDialog } from "./delete-product-dialog";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ProductListProps {
    data: any[];
}

export function ProductList({ data }: ProductListProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleEditClick = (product: any) => {
        setSelectedProduct(product);
        setSheetOpen(true);
    };

    const handleDeleteClick = (product: any) => {
        setSelectedProduct(product);
        setDeleteOpen(true);
    };

    const handleAddClick = () => {
        setSelectedProduct(null);
        setSheetOpen(true);
    };

    const getStockStatus = (stock: string) => {
        const count = parseInt(stock);
        if (count === 0) return <Badge variant="destructive" className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-0">Out of Stock</Badge>;
        if (count < 5) return <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-0">Low Stock</Badge>;
        return <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-0">In Stock</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Box className="w-5 h-5 text-indigo-500" />
                        Inventory
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your products, stock levels, and prices.</p>
                </div>
                <Button onClick={handleAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2 ml-auto text-xs font-medium text-slate-500">
                        <div className="px-3 py-1.5 rounded-md bg-white border border-slate-200 flex items-center gap-2">
                            <Package2 className="w-3.5 h-3.5" />
                            {filteredData.length} Items
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                <TableHead className="w-[300px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Product Name</TableHead>
                                <TableHead className="w-[150px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Category</TableHead>
                                <TableHead className="w-[150px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Brand</TableHead>
                                <TableHead className="w-[120px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 text-center">Stock</TableHead>
                                <TableHead className="w-[120px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 text-right">Price</TableHead>
                                <TableHead className="w-[80px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Box className="w-8 h-8 text-slate-300 mb-2" />
                                            <p>No products found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((product) => (
                                    <TableRow key={product.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-slate-50 dark:border-slate-800">
                                        <TableCell className="font-medium text-slate-900 dark:text-slate-100 py-3 px-4">
                                            {product.name}
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                <Layers className="w-3 h-3" />
                                                {product.category}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 py-3 px-4 text-sm">{product.brand || "-"}</TableCell>
                                        <TableCell className="py-3 px-4 text-center">
                                            {getStockStatus(product.stock)}
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 dark:text-slate-100 py-3 px-4 text-right tabular-nums">
                                            ${product.price}
                                        </TableCell>
                                        <TableCell className="py-3 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 p-1 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xl">
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(product)}
                                                        className="gap-2 rounded-md py-1.5 cursor-pointer"
                                                    >
                                                        <Edit className="w-3.5 h-3.5 text-indigo-500" />
                                                        <span className="font-bold text-xs">Edit Details</span>
                                                    </DropdownMenuItem>
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="gap-2 rounded-md py-1.5 text-red-600 focus:text-red-600 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span className="font-bold text-xs">Delete Item</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ProductSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                productToEdit={selectedProduct}
            />

            <DeleteProductDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                product={selectedProduct}
            />
        </div>
    );
}
