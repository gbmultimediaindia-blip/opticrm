"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Receipt, User, Calendar, IndianRupee, MoreHorizontal, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { BillDialog } from "./bill-dialog";
import { DeleteBillDialog } from "./delete-bill-dialog";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BillListProps {
    bills: any[];
    customers: any[];
}

export function BillList({ bills: initialBills, customers }: BillListProps) {
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeBill, setActiveBill] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(initialBills.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBills = initialBills.slice(startIndex, startIndex + itemsPerPage);

    const handleDeleteClick = (bill: any) => {
        setActiveBill(bill);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Billing</h1>
                    <p className="text-xs text-slate-500 mt-1">Manage invoices and payment tracking.</p>
                </div>
                <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 h-10 px-5 rounded-lg gap-2 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                    <Plus className="w-4 h-4" /> Generate Bill
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[140px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 underline-offset-4">Invoice ID</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Customer</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Payments</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Status</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Date</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBills.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Receipt className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold">No invoices yet</p>
                                        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="mt-1 border-slate-200 dark:border-slate-800">
                                            Create Now
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBills.map((bill) => (
                                <TableRow key={bill.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-slate-200 dark:border-slate-800">
                                    <TableCell className="py-3 px-4 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                                        #{bill.id.substring(0, 8)}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-800">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                                                    {bill.customer?.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                                                    {bill.customer?.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bill</span>
                                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                                                    ₹{bill.totalAmount}
                                                </span>
                                            </div>
                                            <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-3">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Paid</span>
                                                <span className="text-sm font-mono font-bold text-emerald-600">
                                                    ₹{bill.advanceAmount}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        {parseFloat(bill.dueAmount) <= 0 ? (
                                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tight">
                                                Paid
                                            </span>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-red-600 uppercase tracking-tight">
                                                    Due: ₹{bill.dueAmount}
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-medium">{format(new Date(bill.createdAt), "dd MMM")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-right px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 p-1 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xl">
                                                <DropdownMenuItem className="gap-2 rounded-md py-1.5 cursor-pointer">
                                                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span className="font-bold text-xs">View Details</span>
                                                </DropdownMenuItem>
                                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(bill)}
                                                    className="gap-2 rounded-md py-1.5 text-red-600 focus:text-red-600 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span className="font-bold text-xs">Delete Bill</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {initialBills.length > itemsPerPage && (
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, initialBills.length)}</span> of <span className="text-slate-900 dark:text-white">{initialBills.length}</span> invoices
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

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "h-8 w-8 rounded-md text-xs font-bold transition-all",
                                        currentPage === i + 1
                                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-100 dark:ring-0"
                                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                    )}
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

            <BillDialog
                open={open}
                onOpenChange={setOpen}
                customers={customers}
            />

            {activeBill && (
                <DeleteBillDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    billId={activeBill.id}
                    invoiceNumber={activeBill.id.substring(0, 8).toUpperCase()}
                />
            )}
        </div>
    );
}
