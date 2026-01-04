"use client";

import { useState, useEffect, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createInvoice, updateInvoice } from "@/actions/invoice";
import { Receipt, IndianRupee, User, Info, UserPlus, Eye, X, Printer, CheckCircle2, Search, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomerSheet } from "./customer-sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: any[];
    initialCustomerId?: string;
    invoiceToEdit?: any;
}

export function InvoiceDialog({ open, onOpenChange, customers, initialCustomerId, invoiceToEdit }: InvoiceDialogProps) {
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [newInvoiceId, setNewInvoiceId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        customerId: "",
        subtotal: "",
        taxType: "none", // none, included, excluded
        taxRate: "18",
        taxAmount: "0",
        totalAmount: "0",
        advanceAmount: "",
        dueAmount: "0",
        notes: "",
        discountType: "fixed", // fixed, percentage
        discountValue: "0",
        discountAmount: "0",
    });

    const [showAddCustomerSheet, setShowAddCustomerSheet] = useState(false);
    const [localCustomers, setLocalCustomers] = useState<any[]>([]);

    useEffect(() => {
        setLocalCustomers(customers);
    }, [customers]);

    const filteredCustomers = localCustomers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const selectedCustomer = localCustomers.find(c => c.id === invoiceData.customerId);

    useEffect(() => {
        if (open) {
            if (invoiceToEdit) {
                setInvoiceData({
                    customerId: invoiceToEdit.customerId,
                    subtotal: invoiceToEdit.subtotal,
                    taxType: invoiceToEdit.taxType,
                    taxRate: invoiceToEdit.taxRate,
                    taxAmount: invoiceToEdit.taxAmount,
                    totalAmount: invoiceToEdit.totalAmount,
                    advanceAmount: invoiceToEdit.advanceAmount,
                    dueAmount: invoiceToEdit.dueAmount,
                    notes: invoiceToEdit.notes || "",
                    discountType: invoiceToEdit.discountType || "fixed",
                    discountValue: invoiceToEdit.discountValue || "0",
                    discountAmount: invoiceToEdit.discountAmount || "0",
                });
            } else {
                if (initialCustomerId) {
                    setInvoiceData(prev => ({ ...prev, customerId: initialCustomerId }));
                }
            }
        } else {
            resetForm();
        }
    }, [open, initialCustomerId, invoiceToEdit]);

    useEffect(() => {
        const base = parseFloat(invoiceData.subtotal) || 0;
        const rate = parseFloat(invoiceData.taxRate) || 0;
        let subtotal = base;
        let tax = 0;
        let total = base;

        if (invoiceData.taxType === "included") {
            total = base;
            subtotal = total / (1 + rate / 100);
            tax = total - subtotal;
        } else if (invoiceData.taxType === "excluded") {
            subtotal = base;
            tax = (subtotal * rate) / 100;
            total = subtotal + tax;
        } else {
            subtotal = base;
            tax = 0;
            total = base;
        }

        let discount = 0;
        const discountVal = parseFloat(invoiceData.discountValue) || 0;

        if (invoiceData.discountType === "percentage") {
            discount = (total * discountVal) / 100;
        } else {
            discount = discountVal;
        }

        total = Math.max(0, total - discount);

        const advance = parseFloat(invoiceData.advanceAmount) || 0;
        const due = Math.max(0, total - advance);

        setInvoiceData(prev => ({
            ...prev,
            taxAmount: tax.toFixed(2),
            totalAmount: total.toFixed(2),
            discountAmount: discount.toFixed(2),
            dueAmount: due.toFixed(2)
        }));
    }, [invoiceData.subtotal, invoiceData.taxType, invoiceData.taxRate, invoiceData.advanceAmount, invoiceData.discountType, invoiceData.discountValue]);

    const handleTotalChange = (newTotalStr: string) => {
        const newTotal = parseFloat(newTotalStr) || 0;
        const base = parseFloat(invoiceData.subtotal) || 0;
        const rate = parseFloat(invoiceData.taxRate) || 0;
        let subtotal = base;
        let preDiscountTotal = base;

        if (invoiceData.taxType === "included") {
            preDiscountTotal = base;
            subtotal = preDiscountTotal / (1 + rate / 100);
        } else if (invoiceData.taxType === "excluded") {
            subtotal = base;
            preDiscountTotal = subtotal + (subtotal * rate) / 100;
        } else {
            preDiscountTotal = base;
        }

        const discountNeeded = Math.max(0, preDiscountTotal - newTotal);

        setInvoiceData(prev => ({
            ...prev,
            discountType: "fixed",
            discountValue: discountNeeded.toFixed(2),
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (invoiceToEdit) {
                await updateInvoice(invoiceToEdit.id, invoiceData);
                toast.success("Invoice updated successfully");
                onOpenChange(false);
            } else {
                if (!invoiceData.customerId) {
                    toast.error("Please select a customer");
                    return;
                }
                const id = await createInvoice({
                    customerId: invoiceData.customerId,
                    subtotal: invoiceData.subtotal,
                    taxType: invoiceData.taxType,
                    taxRate: invoiceData.taxRate,
                    taxAmount: invoiceData.taxAmount,
                    totalAmount: invoiceData.totalAmount,
                    advanceAmount: invoiceData.advanceAmount,
                    dueAmount: invoiceData.dueAmount,
                    notes: invoiceData.notes || undefined,
                    discountType: invoiceData.discountType,
                    discountValue: invoiceData.discountValue,
                    discountAmount: invoiceData.discountAmount,
                });
                setNewInvoiceId(id);
                setShowSuccessDialog(true);
                onOpenChange(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to save invoice");
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerCreated = (newCustomer: any) => {
        setLocalCustomers(prev => [...prev, newCustomer]);
        setInvoiceData(prev => ({ ...prev, customerId: newCustomer.id }));
        setShowAddCustomerSheet(false);
        toast.success("Customer added and selected");
    };

    const resetForm = () => {
        setInvoiceData({
            customerId: "",
            subtotal: "",
            taxType: "none",
            taxRate: "18",
            taxAmount: "0",
            totalAmount: "0",
            advanceAmount: "",
            dueAmount: "0",
            notes: "",
            discountType: "fixed",
            discountValue: "0",
            discountAmount: "0",
        });
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden [&_[data-slot=sheet-close]]:hidden">
                    {/* Header */}
                    <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                                <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                                    {invoiceToEdit ? "Update Invoice" : "Create New Invoice"}
                                </SheetTitle>
                                <SheetDescription className="text-xs text-slate-500 font-medium">
                                    {invoiceToEdit
                                        ? `Updating invoice #${invoiceToEdit.id.substring(0, 8)}`
                                        : "Generate a new invoice for a customer."}
                                </SheetDescription>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
                        <form id="invoice-form" onSubmit={handleSubmit} className="p-6 space-y-8">
                            <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                                {/* Customer Search Section */}
                                <div className="space-y-2 relative">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Search className="w-3 h-3 text-indigo-400" /> Customer Search
                                    </Label>

                                    {!invoiceData.customerId ? (
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Search className="w-4 h-4" />
                                                </div>
                                                <Input
                                                    placeholder="Search by name or mobile number..."
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        setShowResults(true);
                                                    }}
                                                    onFocus={() => setShowResults(true)}
                                                    className="pl-9 pr-8 h-11 rounded-xl"
                                                />
                                                {searchQuery && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchQuery("");
                                                            setShowResults(false);
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {showResults && searchQuery && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                                                        {filteredCustomers.length > 0 ? (
                                                            <div className="p-1">
                                                                {filteredCustomers.map((c) => (
                                                                    <button
                                                                        key={c.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setInvoiceData({ ...invoiceData, customerId: c.id });
                                                                            setSearchQuery("");
                                                                            setShowResults(false);
                                                                        }}
                                                                        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="font-bold text-sm text-slate-900 dark:text-white capitalize">{c.name}</span>
                                                                            <span className="text-[10px] text-slate-500 font-mono tracking-wider">{c.phone}</span>
                                                                        </div>
                                                                        <Check className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-8 text-center text-slate-400">
                                                                <p className="text-xs font-bold uppercase tracking-widest">No customers found</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => setShowAddCustomerSheet(true)}
                                                className="h-11 w-11 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/20"
                                                size="icon"
                                            >
                                                <UserPlus className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-900/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedCustomer?.name}</span>
                                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-wider">{selectedCustomer?.phone}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setInvoiceData({ ...invoiceData, customerId: "" })}
                                                className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Details Grid */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Transaction Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Subtotal */}
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase leading-none">Subtotal Amount</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold font-mono">₹</div>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={invoiceData.subtotal}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, subtotal: e.target.value })}
                                                className="h-11 pl-8 font-mono font-bold text-lg text-slate-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Tax Settings */}
                                    <div className="col-span-2 space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tax Settings</Label>
                                            <div className="flex gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                {["none", "included", "excluded"].map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setInvoiceData({ ...invoiceData, taxType: t })}
                                                        className={cn(
                                                            "px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all",
                                                            invoiceData.taxType === t
                                                                ? "bg-indigo-600 text-white"
                                                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                        )}
                                                    >
                                                        {t === "none" ? "No Tax" : t === "included" ? "Incl." : "Excl."}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {invoiceData.taxType !== "none" && (
                                            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-1">
                                                <div className="flex-1 space-y-1.5">
                                                    <Label className="text-[10px] font-bold text-slate-400">Tax Rate (%)</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            value={invoiceData.taxRate}
                                                            onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: e.target.value })}
                                                            className="h-9 pr-8 font-mono font-bold text-xs"
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <Label className="text-[10px] font-bold text-slate-400">Tax Amount</Label>
                                                    <div className="relative">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">₹</div>
                                                        <Input
                                                            value={invoiceData.taxAmount}
                                                            readOnly
                                                            className="h-9 pl-6 font-mono font-bold text-xs bg-slate-50/50 dark:bg-slate-900/50 border-dashed"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Discount Settings */}
                                    <div className="col-span-2 space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discount</Label>
                                            <div className="flex gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                {["fixed", "percentage"].map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setInvoiceData({ ...invoiceData, discountType: t })}
                                                        className={cn(
                                                            "px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all",
                                                            invoiceData.discountType === t
                                                                ? "bg-amber-500 text-white"
                                                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                        )}
                                                    >
                                                        {t === "fixed" ? "Fixed (₹)" : "Percent (%)"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex-1 space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-400">Discount Value</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={invoiceData.discountValue}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, discountValue: e.target.value })}
                                                        className="h-9 pr-8 font-mono font-bold text-xs"
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                                                        {invoiceData.discountType === "percentage" ? "%" : "₹"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                <Label className="text-[10px] font-bold text-slate-400">Reduction</Label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">₹</div>
                                                    <Input
                                                        value={invoiceData.discountAmount}
                                                        readOnly
                                                        className="h-9 pl-6 font-mono font-bold text-xs bg-slate-50/50 dark:bg-slate-900/50 border-dashed text-red-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Amount */}
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] font-black text-indigo-600 uppercase leading-none">Total Amount</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-bold font-mono">₹</div>
                                            <Input
                                                type="number"
                                                value={invoiceData.totalAmount}
                                                onChange={(e) => handleTotalChange(e.target.value)}
                                                className="h-11 pl-8 font-mono font-bold text-lg bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Advance Paid */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-emerald-600 uppercase leading-none">Advance Paid</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold font-mono">₹</div>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={invoiceData.advanceAmount}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, advanceAmount: e.target.value })}
                                                className="h-11 pl-8 font-mono font-bold text-lg border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Balance Due */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-red-600 uppercase leading-none">Net Balance</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-bold font-mono">₹</div>
                                            <Input
                                                value={invoiceData.dueAmount}
                                                readOnly
                                                className="h-11 pl-8 font-mono font-bold text-lg bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                                            <Info className="w-3 h-3 text-slate-300" /> Sales/Product Notes
                                        </Label>
                                        <Input
                                            placeholder="Frame/lens specifics or discount info..."
                                            value={invoiceData.notes}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                                            className="h-11 text-[11px] border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <SheetFooter className="mt-0 flex-row w-full justify-end gap-3 items-center">
                            <SheetClose asChild>
                                <Button type="button" variant="ghost" className="h-11 px-8 font-semibold text-slate-500">
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button
                                type="submit"
                                form="invoice-form"
                                className="h-11 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none sm:flex-1 text-sm"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : (invoiceToEdit ? "Update Invoice" : "Finalize Invoice")}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Sub-Sheets and Dialogs */}
            <CustomerSheet
                open={showAddCustomerSheet}
                onOpenChange={setShowAddCustomerSheet}
                onSuccess={handleCustomerCreated}
            />

            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="max-w-[400px] border-none shadow-2xl">
                    <AlertDialogHeader className="items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-bold">Invoice Ready!</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 text-sm">
                                What would you like to do next?
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-col gap-2 pt-4">
                        <AlertDialogAction
                            onClick={() => {
                                if (newInvoiceId) window.open(`/print/invoices/${newInvoiceId}`, '_blank');
                                setShowSuccessDialog(false);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 w-full font-bold"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Invoice Now
                        </AlertDialogAction>
                        <AlertDialogCancel className="h-11 w-full font-semibold border-slate-200 dark:border-slate-800">
                            Close & Continue
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
