"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Receipt, User, Calendar, IndianRupee, MoreHorizontal, FileText, ChevronLeft, ChevronRight, Printer, Search, Edit, CheckCircle, Truck, Package, ChevronDown, Clock, X } from "lucide-react";
import { completeInvoice, toggleDeliveryStatus } from "@/actions/invoice";
import { toast } from "sonner";
import { InvoiceDialog } from "./invoice-dialog";
import { InvoiceDetailDialog } from "./invoice-detail-dialog";
import { DeleteInvoiceDialog } from "./delete-invoice-dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface InvoiceListProps {
    invoices: any[];
    customers: any[];
}

export function InvoiceList({ invoices: initialInvoices, customers }: InvoiceListProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeInvoice, setActiveInvoice] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredInvoices = initialInvoices.filter(inv =>
        inv.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer?.phone.includes(searchQuery) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

    const handleRowClick = (invoice: any) => {
        setActiveInvoice(invoice);
        setOpen(true);
    };

    const handleDeleteClick = (invoice: any) => {
        setActiveInvoice(invoice);
        setDeleteDialogOpen(true);
    };

    const handleMarkCompleted = async (invoice: any) => {
        try {
            await completeInvoice(invoice.id);
            toast.success("Invoice marked as payment completed");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeliveryChange = async (invoice: any, newStatus: string) => {
        try {
            await toggleDeliveryStatus(invoice.id, newStatus);
            toast.success(`Delivery status updated to ${newStatus}`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update delivery status");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Invoices
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage invoices and payment tracking.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search name, phone or ID..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-8 h-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all text-sm font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <Button onClick={() => { setActiveInvoice(null); setOpen(true); }} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-10 px-5 rounded-lg gap-2 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm text-white shrink-0">
                        <Plus className="w-4 h-4" /> Generate Invoice
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> Invoice Overview
                    </h3>
                    <div className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {filteredInvoices.length} {filteredInvoices.length === 1 ? 'Invoice' : 'Invoices'}
                    </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden lg:block overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[140px] text-xs font-semibold text-slate-500 py-3 px-4">Invoice ID</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Customer</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Total</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Paid</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Due</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Payment Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Delivery Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedInvoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300">
                                                {searchQuery ? <Search className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                            </div>
                                            <div className="max-w-sm px-6">
                                                <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight text-center">
                                                    {searchQuery ? "No matches found" : "No invoices registered yet"}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed text-center">
                                                    {searchQuery
                                                        ? `No results for "${searchQuery}". Try searching by ID or customer name.`
                                                        : "Track your sales and revenue by generating your first business invoice."}
                                                </p>
                                            </div>
                                            {searchQuery && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSearchQuery("")}
                                                    className="mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-xs font-bold"
                                                >
                                                    Clear Search
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedInvoices.map((inv) => (
                                    <TableRow
                                        key={inv.id}
                                        className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-slate-200 dark:border-slate-800 cursor-pointer outline-none select-none"
                                        onClick={() => handleRowClick(inv)}
                                    >
                                        <TableCell className="py-3 px-4 font-medium text-xs text-slate-700 dark:text-slate-300">
                                            #{inv.id.substring(0, 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-800">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                                                        {inv.customer?.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {inv.customer?.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white tabular-nums">
                                                ₹{inv.totalAmount}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <span className="text-sm font-medium text-emerald-600 tabular-nums">
                                                ₹{inv.advanceAmount}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            {parseFloat(inv.dueAmount) > 0 ? (
                                                <span className="text-sm font-bold text-red-600 tabular-nums">
                                                    ₹{inv.dueAmount}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">
                                                    No Due
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            {inv.status === "completed" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Pending
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <div
                                                        className={cn(
                                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer select-none transition-all hover:opacity-80",
                                                            inv.deliveryStatus === "delivered"
                                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                                                        )}
                                                    >
                                                        {inv.deliveryStatus === "delivered" ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                                        {inv.deliveryStatus === "delivered" ? "Delivered" : "Pending"}
                                                        <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-[140px] p-1 rounded-lg border-slate-200 dark:border-slate-800 shadow-xl">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeliveryChange(inv, "pending");
                                                        }}
                                                        className="gap-2 rounded-md py-1.5 cursor-pointer"
                                                    >
                                                        <Package className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="font-bold text-xs">Pending</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeliveryChange(inv, "delivered");
                                                        }}
                                                        className="gap-2 rounded-md py-1.5 cursor-pointer"
                                                    >
                                                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="font-bold text-xs">Delivered</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">{format(new Date(inv.createdAt), "dd MMM, yyyy")}</span>
                                                <span className="text-[10px] text-slate-500">{format(new Date(inv.createdAt), "h:mm a")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-right px-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 p-1 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xl">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowClick(inv);
                                                        }}
                                                        className="gap-2 rounded-md py-1.5 cursor-pointer"
                                                    >
                                                        <Edit className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="font-bold text-xs">Edit Details</span>
                                                    </DropdownMenuItem>
                                                    {inv.status !== "completed" && (
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkCompleted(inv);
                                                            }}
                                                            className="gap-2 rounded-md py-1.5 cursor-pointer text-emerald-600 focus:text-emerald-600"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span className="font-bold text-xs">Mark as Paid</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveInvoice(inv);
                                                            setDetailDialogOpen(true);
                                                        }}
                                                        className="gap-2 rounded-md py-1.5 cursor-pointer"
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                                        <span className="font-bold text-xs">View Information</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`/print/invoices/${inv.id}`, '_blank');
                                                        }}
                                                        className="gap-2 rounded-md py-1.5 cursor-pointer"
                                                    >
                                                        <Printer className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="font-bold text-xs">Print Invoice</span>
                                                    </DropdownMenuItem>
                                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(inv);
                                                        }}
                                                        className="gap-2 rounded-md py-1.5 text-red-600 focus:text-red-600 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span className="font-bold text-xs">Delete Invoice</span>
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

                {/* Mobile & Tablet Card View */}
                <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800 md:grid md:grid-cols-2 md:divide-y-0 md:gap-px md:bg-slate-100 md:dark:bg-slate-800">
                    {paginatedInvoices.length === 0 ? (
                        <div className="py-20 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-900 dark:text-white font-bold text-sm">No invoices found</p>
                            <p className="text-slate-500 text-xs mt-1">Try a different search term.</p>
                        </div>
                    ) : (
                        paginatedInvoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="p-4 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors cursor-pointer"
                                onClick={() => handleRowClick(inv)}
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-800 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{inv.customer?.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">#{inv.id.substring(0, 8).toUpperCase()}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-[10px] text-slate-500 font-medium">{format(new Date(inv.createdAt), "dd MMM")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100" onClick={() => window.open(`/print/invoices/${inv.id}`, '_blank')}>
                                            <Printer className="w-4 h-4 text-slate-500" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem onClick={() => handleRowClick(inv)} className="gap-2 py-2">
                                                    <Edit className="w-3.5 h-3.5" /> Edit Details
                                                </DropdownMenuItem>
                                                {inv.status !== "completed" && (
                                                    <DropdownMenuItem onClick={() => handleMarkCompleted(inv)} className="gap-2 py-2 text-emerald-600">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Mark as Paid
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => handleDeleteClick(inv)} className="gap-2 py-2 text-red-600">
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Invoice
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Amount Status</span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">Total: ₹{inv.totalAmount}</span>
                                            {parseFloat(inv.dueAmount) > 0 ? (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/10 px-1.5 py-0.5 rounded w-fit">Due: ₹{inv.dueAmount}</span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-1.5 py-0.5 rounded w-fit">Fully Paid</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 text-right">Workflow Status</span>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className={cn(
                                                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer uppercase tracking-tighter",
                                                            inv.deliveryStatus === "delivered"
                                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 border-blue-200"
                                                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200"
                                                        )}>
                                                            {inv.deliveryStatus === "delivered" ? "Delivered" : "Pending Order"}
                                                            <ChevronDown className="w-2.5 h-2.5" />
                                                        </div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleDeliveryChange(inv, "pending")} className="text-xs font-bold">Pending</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeliveryChange(inv, "delivered")} className="text-xs font-bold text-blue-600">Delivered</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tighter",
                                                inv.status === "completed"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            )}>
                                                {inv.status === "completed" ? "Payment: Completed" : "Payment: Pending"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {filteredInvoices.length > itemsPerPage && (
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredInvoices.length)}</span> of <span className="text-slate-900 dark:text-white">{filteredInvoices.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 rounded-md border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {/* Mobile Pagination Simple View */}
                            <div className="flex sm:hidden items-center px-4">
                                <span className="text-xs font-bold text-slate-600">{currentPage} / {totalPages}</span>
                            </div>

                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={currentPage === i + 1 ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={cn(
                                            "h-8 w-8 rounded-md text-xs font-bold transition-all",
                                            currentPage === i + 1
                                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                        )}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

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

            <InvoiceDialog
                open={open}
                onOpenChange={setOpen}
                customers={customers}
                invoiceToEdit={activeInvoice}
            />

            <InvoiceDetailDialog
                invoice={activeInvoice}
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
                onDelete={(inv) => {
                    setDetailDialogOpen(false);
                    handleDeleteClick(inv);
                }}
            />

            {
                activeInvoice && (
                    <DeleteInvoiceDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        invoiceId={activeInvoice.id}
                        invoiceNumber={activeInvoice.id.substring(0, 8).toUpperCase()}
                    />
                )
            }
        </div >

    );
}
