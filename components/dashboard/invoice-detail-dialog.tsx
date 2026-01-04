"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Receipt, User, Clock, CheckCircle2, AlertCircle, Calendar, IndianRupee, Printer, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceDetailDialogProps {
    invoice: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (invoice: any) => void;
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onDelete }: InvoiceDetailDialogProps) {
    if (!invoice) return null;

    const isPaid = parseFloat(invoice.dueAmount) <= 0;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden [&_[data-slot=sheet-close]]:hidden">
                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
                            <Receipt className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                                Invoice Details
                            </SheetTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    #{invoice.id.substring(0, 8)}
                                </span>
                                <div className={cn(
                                    "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-sm border",
                                    isPaid
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                        : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                )}>
                                    {isPaid ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                    {isPaid ? "Paid" : "Due"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                    {/* Customer Information */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Information
                        </h3>
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-medium">Full Name</span>
                                <span className="font-bold text-slate-900 dark:text-white capitalize text-sm">{invoice.customer?.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium">Phone</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">{invoice.customer?.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium">Email</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-200 truncate text-sm">{invoice.customer?.email || "-"}</span>
                                </div>
                            </div>
                            {invoice.customer?.address && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium">Address</span>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{invoice.customer.address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transaction Summary */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Payment Summary
                        </h3>
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                                <span className="text-xs text-slate-500">Subtotal</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">₹{invoice.subtotal}</span>
                            </div>
                            {invoice.taxType !== "none" && (
                                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <span className="text-xs text-slate-500">Tax ({invoice.taxRate}%) - {invoice.taxType}</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">₹{invoice.taxAmount}</span>
                                </div>
                            )}
                            {parseFloat(invoice.discountAmount) > 0 && (
                                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <span className="text-xs text-slate-500">Discount ({invoice.discountType === "percentage" ? `${invoice.discountValue}%` : "Fixed"})</span>
                                    <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">-₹{invoice.discountAmount}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">Total Amount</span>
                                <span className="text-lg font-mono font-black text-indigo-600 dark:text-indigo-400">₹{invoice.totalAmount}</span>
                            </div>
                            <div className="pt-2 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-100/50 dark:border-emerald-800/20">
                                    <span>Advance Paid</span>
                                    <span>₹{invoice.advanceAmount}</span>
                                </div>
                                {!isPaid && (
                                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-bold border border-red-100/50 dark:border-red-800/20">
                                        <span>Remaining Due</span>
                                        <span>₹{invoice.dueAmount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products / Items */}
                    {invoice.items && invoice.items.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Receipt className="w-3.5 h-3.5 text-orange-500" /> Itemized Billing
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-800/30 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {invoice.items.map((item: any) => (
                                        <div key={item.id} className="p-3 flex items-center justify-between group transition-colors hover:bg-white dark:hover:bg-slate-900">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white capitalize leading-tight">
                                                    {item.product?.name}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                                    <span className="font-mono">₹{item.unitPrice}</span>
                                                    <span className="text-slate-300">×</span>
                                                    <span className="font-bold text-slate-800 dark:text-slate-300">{item.quantity} Qty</span>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                                ₹{item.totalPrice}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> Timeline Details
                            </h3>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Created On</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{format(new Date(invoice.createdAt), "PPP p")}</span>
                                </div>
                            </div>
                        </div>
                        {invoice.notes && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Notes & Remarks
                                </h3>
                                <div className="p-4 rounded-xl bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-800/30 text-sm text-slate-600 dark:text-slate-400 italic">
                                    "{invoice.notes}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="mt-0 flex-row w-full justify-between items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => onDelete(invoice)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-xs gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Invoice
                        </Button>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <SheetClose asChild>
                                <Button
                                    variant="outline"
                                    className="font-bold text-xs flex-1 sm:flex-none"
                                >
                                    Close
                                </Button>
                            </SheetClose>
                            <Button
                                onClick={() => window.open(`/print/invoices/${invoice.id}`, '_blank')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 shadow-lg shadow-indigo-100 dark:shadow-none px-6 flex-1 sm:flex-none"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </Button>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
