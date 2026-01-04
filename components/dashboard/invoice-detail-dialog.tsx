"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Receipt, User, Phone, Mail, MapPin, Calendar, IndianRupee, Printer, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-8 border-b border-slate-200 dark:border-slate-800 relative">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                <Receipt className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
                                    Invoice Details
                                </h2>
                                <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-2 uppercase tracking-widest">
                                    #{invoice.id.substring(0, 8)}
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
                            isPaid
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                            {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {isPaid ? "Fully Paid" : "Payment Due"}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
                    <div className="grid grid-cols-2 gap-8">
                        {/* Customer Information */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Information
                            </h3>
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium">Full Name</span>
                                    <span className="font-bold text-slate-900 dark:text-white capitalize">{invoice.customer?.name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-medium">Phone</span>
                                        <span className="font-bold text-slate-900 dark:text-slate-200">{invoice.customer?.phone}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-medium">Email</span>
                                        <span className="font-bold text-slate-900 dark:text-slate-200 truncate">{invoice.customer?.email || "-"}</span>
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
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{invoice.subtotal}</span>
                                </div>
                                {invoice.taxType !== "none" && (
                                    <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                                        <span className="text-xs text-slate-500">Tax ({invoice.taxRate}%) - {invoice.taxType}</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">₹{invoice.taxAmount}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">Total Amount</span>
                                    <span className="text-lg font-mono font-black text-indigo-600 dark:text-indigo-400">₹{invoice.totalAmount}</span>
                                </div>
                                <div className="pt-2 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 font-bold">
                                        <span>Advance Paid</span>
                                        <span>₹{invoice.advanceAmount}</span>
                                    </div>
                                    {!isPaid && (
                                        <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-bold ring-1 ring-red-100 dark:ring-0">
                                            <span>Remaining Due</span>
                                            <span>₹{invoice.dueAmount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Notes */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> Timeline Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Created On</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{format(new Date(invoice.createdAt), "PPP p")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {invoice.notes && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Notes & Remarks
                                </h3>
                                <div className="p-4 rounded-xl bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-800/30 text-sm text-slate-600 dark:text-slate-400">
                                    "{invoice.notes}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 gap-3 sm:justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => onDelete(invoice)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-xs gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Invoice
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="font-bold text-xs"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => window.open(`/print/invoices/${invoice.id}`, '_blank')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 shadow-lg shadow-indigo-100 dark:shadow-none px-6"
                        >
                            <Printer className="w-4 h-4" /> Print Invoice
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
