"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, MoreHorizontal, Box, Tag, Layers, Search, Package2, ChevronLeft, ChevronRight } from "lucide-react";
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
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredData = data.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
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
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 h-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all text-sm font-medium"
                        />
                    </div>
                    <Button onClick={handleAddClick} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-10 px-5 rounded-lg gap-2 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm text-white">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" /> Stock Overview
                    </h3>
                    <div className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <Package2 className="w-3 h-3" />
                        {filteredData.length} {filteredData.length === 1 ? 'Product' : 'Products'}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                <TableHead className="w-[300px] text-xs font-semibold text-slate-500 py-3 px-4">Product Name</TableHead>
                                <TableHead className="w-[150px] text-xs font-semibold text-slate-500 py-3 px-4">Category</TableHead>
                                <TableHead className="w-[150px] text-xs font-semibold text-slate-500 py-3 px-4">Brand</TableHead>
                                <TableHead className="w-[120px] text-xs font-semibold text-slate-500 py-3 px-4 text-center">Stock Status</TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-slate-500 py-3 px-4 text-right">Cost Price</TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-slate-500 py-3 px-4 text-right">Selling Price</TableHead>
                                <TableHead className="w-[80px] text-xs font-semibold text-slate-500 py-3 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300">
                                                {searchQuery ? <Search className="w-8 h-8" /> : <Box className="w-8 h-8" />}
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="text-slate-900 dark:text-white font-bold text-sm">
                                                    {searchQuery ? "No matches found" : "Your inventory is empty"}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-1">
                                                    {searchQuery
                                                        ? `No products found for "${searchQuery}". Try a different term.`
                                                        : "Start tracking your products and stock levels today."}
                                                </p>
                                            </div>
                                            {searchQuery && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setCurrentPage(1);
                                                    }}
                                                    className="mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-xs font-bold"
                                                >
                                                    Clear Search
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((product) => (
                                    <TableRow key={product.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-slate-50 dark:border-slate-800">
                                        <TableCell className="font-medium text-sm text-slate-900 dark:text-slate-100 py-3 px-4">
                                            {product.name}
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                <Layers className="w-3 h-3" />
                                                {product.category}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 py-3 px-4 text-xs">{product.brand || "-"}</TableCell>
                                        <TableCell className="py-3 px-4 text-center">
                                            {getStockStatus(product.stock)}
                                        </TableCell>
                                        <TableCell className="text-slate-500 py-3 px-4 text-right tabular-nums text-sm">
                                            ₹{product.costPrice}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-900 dark:text-slate-100 py-3 px-4 text-right tabular-nums text-sm">
                                            ₹{product.sellingPrice}
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

                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                            Showing <span className="text-indigo-600 dark:text-indigo-400">{(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of {filteredData.length}
                        </p>
                        <div className="flex gap-1.5">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 rounded-md border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={i + 1 > 5 && totalPages > 8 ? "hidden" : `h-8 w-8 p-0 rounded-md font-bold text-xs ${currentPage === i + 1 ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100" : "border-slate-200 dark:border-slate-800"}`}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 rounded-md border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
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
