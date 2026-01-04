"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { getCustomerInvoices } from "@/actions/invoice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Receipt, Calendar, Eye, FileText, ChevronLeft, ChevronRight, Printer, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InvoiceHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function InvoiceHistoryDialog({ open, onOpenChange, customerId, customerName }: InvoiceHistoryDialogProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (open && customerId) {
            setLoading(true);
            getCustomerInvoices(customerId).then(data => {
                setHistory(data);
                setLoading(false);
            });
        }
    }, [open, customerId]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-4xl flex flex-col p-0 border-slate-200 dark:border-slate-800 shadow-2xl [&_[data-slot=sheet-close]]:hidden">
                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 dark:shadow-none shrink-0">
                            <Receipt className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">Billing History</SheetTitle>
                            <SheetDescription className="text-xs text-slate-500 font-medium">
                                Invoice records for <span className="font-bold text-emerald-600">{customerName}</span>
                            </SheetDescription>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium anim-pulse">Loading invoices...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                <Receipt className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-bold text-lg">No invoices found</p>
                                <p className="text-slate-500 text-sm max-w-[280px]">This customer doesn't have any billing records yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[160px] text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">
                                            <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date</div>
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">
                                            Amount
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">
                                            Payment Status
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6 text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedHistory.map((inv) => (
                                        <TableRow key={inv.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-0">
                                            <TableCell className="py-5 px-6">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white">{format(new Date(inv.createdAt), "MMM d, yyyy")}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                                                    <span>{format(new Date(inv.createdAt), "h:mm a")}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>#{inv.id.substring(0, 8).toUpperCase()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center tabular-nums">
                                                        <IndianRupee className="w-3 h-3 mr-0.5" />
                                                        {inv.totalAmount}
                                                    </span>
                                                    {parseFloat(inv.dueAmount) > 0 && (
                                                        <span className="text-xs text-red-500 font-medium">
                                                            Due: ₹{inv.dueAmount}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6">
                                                {parseFloat(inv.dueAmount) === 0 ? (
                                                    <span className="px-2.5 py-1 rounded-md text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium border border-emerald-100 dark:border-emerald-800">Paid</span>
                                                ) : parseFloat(inv.advanceAmount) > 0 ? (
                                                    <span className="px-2.5 py-1 rounded-md text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium border border-amber-100 dark:border-amber-800">Partial</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-md text-xs bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium border border-red-100 dark:border-red-800">Unpaid</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-5 px-6 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-medium gap-2"
                                                >
                                                    <Link href={`/print/invoices/${inv.id}`} target="_blank">
                                                        <Printer className="w-3 h-3" />
                                                        Print
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {history.length > itemsPerPage && (
                                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of <span className="text-slate-900 dark:text-white">{totalPages}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-800"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-800"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="mt-0 flex-row w-full justify-end items-center">
                        <SheetClose asChild>
                            <Button variant="outline" className="font-bold text-xs px-8">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
