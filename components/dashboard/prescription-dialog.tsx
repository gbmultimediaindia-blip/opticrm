"use client";

import { useState, useEffect, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPrescription, updatePrescription } from "@/actions/customer";
import { FileText, Info, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId?: string;
    customerName?: string;
    customers?: any[]; // For cross-page quick action
    prescriptionId?: string;
    initialData?: any;
    onSuccess?: () => void;
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
                    {!initialCustomerId && customers && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</Label>
                            <select
                                value={selectedCustomerId}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                                className="w-full h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none font-medium"
                                required={!initialCustomerId}
                            >
                                <option value="">Select customer...</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.phone}
                                    </option>
                                ))}
                            </select>
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
