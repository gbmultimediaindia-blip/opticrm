"use client";

import { useState, useEffect, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPrescription, updatePrescription } from "@/actions/customer";
import { Plus, Info, User, FileText, Search, Check, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomerSheet } from "./customer-sheet";

interface PrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId?: string;
    customerName?: string;
    customers?: any[]; // For cross-page quick action
    prescriptionId?: string;
    initialData?: any;
    onSuccess?: () => void;
    store?: any;
}

export function PrescriptionDialog({
    open,
    onOpenChange,
    customerId: initialCustomerId,
    customerName: initialCustomerName,
    customers,
    prescriptionId,
    initialData,
    onSuccess,
    store,
}: PrescriptionDialogProps) {
    const [loading, setLoading] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId || "");
    const [formData, setFormData] = useState({
        rightSphere: initialData?.rightSphere || "",
        rightCylinder: initialData?.rightCylinder || "",
        rightAxis: initialData?.rightAxis || "",
        rightAdd: initialData?.rightAdd || "",
        leftSphere: initialData?.leftSphere || "",
        leftCylinder: initialData?.leftCylinder || "",
        leftAxis: initialData?.leftAxis || "",
        leftAdd: initialData?.leftAdd || "",
        pd: initialData?.pd || "",
        notes: initialData?.notes || "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [showAddCustomerSheet, setShowAddCustomerSheet] = useState(false);
    const [localCustomers, setLocalCustomers] = useState<any[]>([]);

    useEffect(() => {
        if (customers) {
            setLocalCustomers(customers);
        }
    }, [customers]);

    const filteredCustomers = localCustomers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const selectedCustomer = localCustomers.find(c => c.id === selectedCustomerId);

    const handleCustomerCreated = (newCustomer: any) => {
        setLocalCustomers(prev => [...prev, newCustomer]);
        setSelectedCustomerId(newCustomer.id);
        setShowAddCustomerSheet(false);
        toast.success("Customer added and selected");
    };

    // Sync form data if initialData changes (for editing)
    useEffect(() => {
        if (initialData) {
            setFormData({
                rightSphere: initialData.rightSphere || "",
                rightCylinder: initialData.rightCylinder || "",
                rightAxis: initialData.rightAxis || "",
                rightAdd: initialData.rightAdd || "",
                leftSphere: initialData.leftSphere || "",
                leftCylinder: initialData.leftCylinder || "",
                leftAxis: initialData.leftAxis || "",
                leftAdd: initialData.leftAdd || "",
                pd: initialData.pd || "",
                notes: initialData.notes || "",
            });
        } else if (!prescriptionId) {
            setFormData({
                rightSphere: "",
                rightCylinder: "",
                rightAxis: "",
                rightAdd: "",
                leftSphere: "",
                leftCylinder: "",
                leftAxis: "",
                leftAdd: "",
                pd: "",
                notes: "",
            });
        }
    }, [initialData, prescriptionId, open]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const finalCustomerId = initialCustomerId || selectedCustomerId;

        if (!finalCustomerId && !prescriptionId) {
            toast.error("Please select a customer");
            return;
        }

        setLoading(true);

        try {
            if (prescriptionId) {
                await updatePrescription(prescriptionId, formData);
                toast.success("Prescription updated successfully");
            } else {
                await createPrescription(finalCustomerId, formData);
                toast.success("Prescription saved to records");
            }

            if (onSuccess) onSuccess();
            onOpenChange(false);

            if (!prescriptionId) {
                setFormData({
                    rightSphere: "",
                    rightCylinder: "",
                    rightAxis: "",
                    rightAdd: "",
                    leftSphere: "",
                    leftCylinder: "",
                    leftAxis: "",
                    leftAdd: "",
                    pd: "",
                    notes: "",
                });
                if (!initialCustomerId) setSelectedCustomerId("");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden [&_[data-slot=sheet-close]]:hidden bg-white dark:bg-slate-950">
                <div className="h-16 px-6 flex items-center bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {prescriptionId ? "Edit Prescription" : "New Prescription"}
                            </SheetTitle>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{initialCustomerName || "Clinical Entry"}</p>
                        </div>
                    </div>
                </div>

                <form id="rx-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                    {/* Customer Selection (Only if not pre-selected) */}
                    {!initialCustomerId && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-indigo-500" /> Customer Details
                            </Label>
                            {!selectedCustomerId ? (
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Input
                                            placeholder="Search by name or phone..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowResults(true);
                                            }}
                                            onFocus={() => setShowResults(true)}
                                            className="h-10 pl-10 bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                        />
                                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />

                                        {showResults && searchQuery && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                {filteredCustomers.length > 0 ? (
                                                    <div className="p-1">
                                                        {filteredCustomers.map((c) => (
                                                            <button
                                                                key={c.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedCustomerId(c.id);
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
                                        className="h-10 w-11 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/20"
                                        size="icon"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-900/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedCustomer?.name}</span>
                                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-wider">{selectedCustomer?.phone}</span>
                                        </div>
                                    </div>
                                    {!initialCustomerId && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCustomerId("")}
                                            className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {/* Right Eye */}
                            <div className="bg-white dark:bg-slate-950 p-5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Right Eye (OD)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricInput label="Sphere (SPH)" value={formData.rightSphere} onChange={(v) => setFormData({ ...formData, rightSphere: v })} placeholder="0.00" />
                                    <MetricInput label="Cynlinder (CYL)" value={formData.rightCylinder} onChange={(v) => setFormData({ ...formData, rightCylinder: v })} placeholder="0.00" />
                                    <MetricInput label="Axis" value={formData.rightAxis} onChange={(v) => setFormData({ ...formData, rightAxis: v })} placeholder="0" />
                                    <MetricInput label="Addition" value={formData.rightAdd} onChange={(v) => setFormData({ ...formData, rightAdd: v })} placeholder="0.00" />
                                </div>
                            </div>

                            {/* Left Eye */}
                            <div className="bg-white dark:bg-slate-950 p-5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Left Eye (OS)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricInput label="Sphere (SPH)" value={formData.leftSphere} onChange={(v) => setFormData({ ...formData, leftSphere: v })} placeholder="0.00" />
                                    <MetricInput label="Cynlinder (CYL)" value={formData.leftCylinder} onChange={(v) => setFormData({ ...formData, leftCylinder: v })} placeholder="0.00" />
                                    <MetricInput label="Axis" value={formData.leftAxis} onChange={(v) => setFormData({ ...formData, leftAxis: v })} placeholder="0" />
                                    <MetricInput label="Addition" value={formData.leftAdd} onChange={(v) => setFormData({ ...formData, leftAdd: v })} placeholder="0.00" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PD (mm)</Label>
                                <Input
                                    placeholder="0.00"
                                    value={formData.pd}
                                    onChange={(e) => setFormData({ ...formData, pd: e.target.value })}
                                    className="font-bold tabular-nums"
                                />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes</Label>
                                <Input
                                    placeholder="Clinical remarks..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="h-14 px-6 flex items-center justify-end border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                    <SheetFooter className="mt-0 flex-row w-full justify-end gap-2 items-center">
                        <SheetClose asChild>
                            <Button type="button" variant="ghost" className="flex-1 font-semibold text-slate-500">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            form="rx-form"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none text-sm"
                            disabled={loading}
                        >
                            {loading
                                ? (prescriptionId ? "Saving..." : "Recording...")
                                : (prescriptionId ? "Update Prescription" : "Save Record")}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>

            <CustomerSheet
                open={showAddCustomerSheet}
                onOpenChange={setShowAddCustomerSheet}
                onSuccess={handleCustomerCreated}
                store={store}
            />
        </Sheet>
    );
}

function MetricInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="space-y-1">
            <Label className="text-[9px] font-bold text-slate-400 uppercase leading-none">{label}</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
            />
        </div>
    );
}
