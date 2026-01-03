"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createBill, createBillWithCustomer } from "@/actions/billing";
import { Receipt, IndianRupee, User, Info, UserPlus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: any[];
}

export function BillDialog({ open, onOpenChange, customers }: BillDialogProps) {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"existing" | "new">("existing");

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
            pd: ""
        }
    });

    useEffect(() => {
        const total = parseFloat(billData.totalAmount) || 0;
        const advance = parseFloat(billData.advanceAmount) || 0;
        const due = Math.max(0, total - advance);
        setBillData(prev => ({ ...prev, dueAmount: due.toFixed(2) }));
    }, [billData.totalAmount, billData.advanceAmount]);

    const handleSubmit = async (e: React.FormEvent) => {
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
                pd: ""
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl border-slate-200 dark:border-slate-800 shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Receipt className="w-6 h-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">New Invoice</DialogTitle>
                                    <DialogDescription className="text-slate-500 text-xs">
                                        Choose an existing customer or create a new profile.
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setMode("existing")}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                                        mode === "existing"
                                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <User className="w-3.5 h-3.5" /> Existing
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("new")}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                                        mode === "new"
                                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <UserPlus className="w-3.5 h-3.5" /> New Walk-in
                                </button>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                    {mode === "existing" ? (
                        <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3 text-indigo-400" /> Selective Search
                                </Label>
                                <select
                                    value={billData.customerId}
                                    onChange={(e) => setBillData({ ...billData, customerId: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none font-medium"
                                    required={mode === "existing"}
                                >
                                    <option value="">Search customer list...</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} — {c.phone}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right-2 duration-300">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-indigo-400" /> Identity
                                    </h3>
                                    <div className="space-y-3">
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
                                            className="h-11 rounded-xl"
                                            required={mode === "new"}
                                        />
                                        <Input
                                            placeholder="Email (Optional)"
                                            type="email"
                                            value={customerData.email}
                                            onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Eye className="w-3.5 h-3.5 text-indigo-400" /> Initial Rx
                                    </h3>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">OD (Right)</span>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <Input placeholder="S" className="h-8 text-[10px] font-mono p-1" value={customerData.prescription.rightSphere} onChange={e => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, rightSphere: e.target.value } }))} />
                                                    <Input placeholder="C" className="h-8 text-[10px] font-mono p-1" value={customerData.prescription.rightCylinder} onChange={e => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, rightCylinder: e.target.value } }))} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">OS (Left)</span>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <Input placeholder="S" className="h-8 text-[10px] font-mono p-1" value={customerData.prescription.leftSphere} onChange={e => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, leftSphere: e.target.value } }))} />
                                                    <Input placeholder="C" className="h-8 text-[10px] font-mono p-1" value={customerData.prescription.leftCylinder} onChange={e => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, leftCylinder: e.target.value } }))} />
                                                </div>
                                            </div>
                                        </div>
                                        <Input placeholder="PD (Distance)" className="h-8 text-[10px] font-mono" value={customerData.prescription.pd} onChange={e => setCustomerData(p => ({ ...p, prescription: { ...p.prescription, pd: e.target.value } }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Billing Details
                        </h3>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Total Bill</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={billData.totalAmount}
                                        onChange={(e) => setBillData({ ...billData, totalAmount: e.target.value })}
                                        className="h-11 pl-9 font-mono font-bold text-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-emerald-600 uppercase">Paid Amount</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={billData.advanceAmount}
                                        onChange={(e) => setBillData({ ...billData, advanceAmount: e.target.value })}
                                        className="h-11 pl-9 font-mono font-bold text-lg border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-red-600 uppercase">Balance Due</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                    <Input
                                        value={billData.dueAmount}
                                        readOnly
                                        className="h-11 pl-9 font-mono font-bold text-lg bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                                <Info className="w-3 h-3 text-slate-300" /> Internal Notes
                            </Label>
                            <Input
                                placeholder="Frame details, lens coatings, or payment comments..."
                                value={billData.notes}
                                onChange={(e) => setBillData({ ...billData, notes: e.target.value })}
                                className="h-11 italic text-sm border-slate-200 dark:border-slate-800"
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <DialogFooter className="gap-3">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-8 font-semibold text-slate-500">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="h-11 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none min-w-[200px]"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : (mode === "new" ? "Create Profile & Bill" : "Finalize Invoice")}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
