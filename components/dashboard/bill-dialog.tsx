"use client";

import { useState, useEffect, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createBill, createBillWithCustomer } from "@/actions/billing";
import { Receipt, IndianRupee, User, Info, UserPlus, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: any[];
}

export function BillDialog({ open, onOpenChange, customers }: BillDialogProps) {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"new" | "existing">("new");

    // Bill State
    const [billData, setBillData] = useState({
        customerId: "",
        totalAmount: "",
        advanceAmount: "",
        dueAmount: "0",
        notes: "",
    });

    // New Customer State
    const [customerData, setCustomerData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        prescription: {
            rightSphere: "",
            rightCylinder: "",
            rightAxis: "",
            rightAdd: "",
            leftSphere: "",
            leftCylinder: "",
            leftAxis: "",
            leftAdd: "",
            pd: "",
            notes: ""
        }
    });

    useEffect(() => {
        const total = parseFloat(billData.totalAmount) || 0;
        const advance = parseFloat(billData.advanceAmount) || 0;
        const due = Math.max(0, total - advance);
        setBillData(prev => ({ ...prev, dueAmount: due.toFixed(2) }));
    }, [billData.totalAmount, billData.advanceAmount]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "existing") {
                if (!billData.customerId) throw new Error("Please select a customer");
                await createBill(billData);
            } else {
                if (!customerData.name || !customerData.phone) throw new Error("Name and Phone are required for new customer");
                await createBillWithCustomer({
                    customer: {
                        name: customerData.name,
                        email: customerData.email || undefined,
                        phone: customerData.phone,
                        address: customerData.address || undefined,
                    },
                    prescription: customerData.prescription,
                    bill: {
                        totalAmount: billData.totalAmount,
                        advanceAmount: billData.advanceAmount,
                        dueAmount: billData.dueAmount,
                        notes: billData.notes || undefined,
                    }
                });
            }

            toast.success("Bill generated successfully");
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setBillData({
            customerId: "",
            totalAmount: "",
            advanceAmount: "",
            dueAmount: "0",
            notes: "",
        });
        setCustomerData({
            name: "",
            email: "",
            phone: "",
            address: "",
            prescription: {
                rightSphere: "",
                rightCylinder: "",
                rightAxis: "",
                rightAdd: "",
                leftSphere: "",
                leftCylinder: "",
                leftAxis: "",
                leftAdd: "",
                pd: "",
                notes: ""
            }
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0 relative">
                    <SheetHeader>
                        <div className="flex items-center gap-4 mt-4 text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-bold text-slate-900 dark:text-white leading-none">New Invoice</SheetTitle>
                                <SheetDescription className="text-slate-500 text-xs mt-1 pr-12">
                                    Record a sale for walk-in or existing customers.
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
                    <form id="bill-form" onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Mode Selection */}
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-1.5 isolate">
                            <button
                                type="button"
                                onClick={() => setMode("new")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200",
                                    mode === "new"
                                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                New Walk-in
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("existing")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200",
                                    mode === "existing"
                                        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <User className="w-3.5 h-3.5" />
                                Existing Customer
                            </button>
                        </div>

                        {mode === "existing" ? (
                            <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3 text-indigo-400" /> Customer Search
                                    </Label>
                                    <select
                                        value={billData.customerId}
                                        onChange={(e) => setBillData({ ...billData, customerId: e.target.value })}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none font-medium"
                                        required={mode === "existing"}
                                    >
                                        <option value="">Choose or search customer...</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} — {c.phone}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-left-2 duration-300">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Identity
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Full Name"
                                                value={customerData.name}
                                                onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                                                className="h-11 rounded-xl"
                                                required={mode === "new"}
                                            />
                                            <Input
                                                placeholder="Phone Number"
                                                value={customerData.phone}
                                                onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="h-11 rounded-xl text-sm"
                                                required={mode === "new"}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Eye className="w-3.5 h-3.5 text-indigo-400" /> Prescription (Rx)
                                        </h3>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6">
                                            <div className="grid grid-cols-2 gap-8 relative">
                                                {/* Right Eye */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">OD (Right)</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <MetricInput label="SPH" placeholder="0.00" value={customerData.prescription.rightSphere} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, rightSphere: v } }))} />
                                                        <MetricInput label="CYL" placeholder="0.00" value={customerData.prescription.rightCylinder} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, rightCylinder: v } }))} />
                                                        <MetricInput label="Axis" placeholder="0" value={customerData.prescription.rightAxis} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, rightAxis: v } }))} />
                                                        <MetricInput label="Add" placeholder="0.00" value={customerData.prescription.rightAdd} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, rightAdd: v } }))} />
                                                    </div>
                                                </div>

                                                {/* Left Eye */}
                                                <div className="space-y-3 border-l border-slate-100 dark:border-slate-800 pl-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">OS (Left)</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <MetricInput label="SPH" placeholder="0.00" value={customerData.prescription.leftSphere} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, leftSphere: v } }))} />
                                                        <MetricInput label="CYL" placeholder="0.00" value={customerData.prescription.leftCylinder} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, leftCylinder: v } }))} />
                                                        <MetricInput label="Axis" placeholder="0" value={customerData.prescription.leftAxis} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, leftAxis: v } }))} />
                                                        <MetricInput label="Add" placeholder="0.00" value={customerData.prescription.leftAdd} onChange={v => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, leftAdd: v } }))} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 shrink-0">
                                                        <Label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 whitespace-nowrap">
                                                            PD (mm) <Info className="w-2.5 h-2.5" />
                                                        </Label>
                                                        <Input
                                                            placeholder="0.00"
                                                            value={customerData.prescription.pd}
                                                            onChange={(e) => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, pd: e.target.value } }))}
                                                            className="h-9 mt-1 font-mono font-bold text-xs"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label className="text-[9px] font-black text-slate-400 uppercase">Rx Notes</Label>
                                                        <Input
                                                            placeholder="Clinical remarks..."
                                                            value={customerData.prescription.notes}
                                                            onChange={(e) => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, notes: e.target.value } }))}
                                                            className="h-9 mt-1 text-xs italic"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Transaction Details
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase leading-none">Total Amount</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold font-mono">₹</div>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={billData.totalAmount}
                                            onChange={(e) => setBillData({ ...billData, totalAmount: e.target.value })}
                                            className="h-11 pl-8 font-mono font-bold text-lg text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-emerald-600 uppercase leading-none">Advance Paid</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-bold font-mono">₹</div>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={billData.advanceAmount}
                                            onChange={(e) => setBillData({ ...billData, advanceAmount: e.target.value })}
                                            className="h-11 pl-8 font-mono font-bold text-lg border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-red-600 uppercase leading-none">Net Balance</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-bold font-mono">₹</div>
                                        <Input
                                            value={billData.dueAmount}
                                            readOnly
                                            className="h-11 pl-8 font-mono font-bold text-lg bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                                    <Info className="w-3 h-3 text-slate-300" /> Sales/Product Notes
                                </Label>
                                <Input
                                    placeholder="Frame/lens specifics or discount info..."
                                    value={billData.notes}
                                    onChange={(e) => setBillData({ ...billData, notes: e.target.value })}
                                    className="h-11 italic text-[11px] border-slate-200 dark:border-slate-800"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="gap-3 sm:flex-row flex-col">
                        <SheetClose asChild>
                            <Button type="button" variant="ghost" className="h-11 px-8 font-semibold text-slate-500">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            form="bill-form"
                            className="h-11 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none sm:flex-1 text-sm"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : (mode === "new" ? "Register & Invoice" : "Finalize Invoice")}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function MetricInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="space-y-1">
            <Label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 transition-all text-center text-xs"
            />
        </div>
    );
}
