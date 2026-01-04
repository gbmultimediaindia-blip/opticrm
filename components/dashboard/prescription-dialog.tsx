"use client";

import { useState, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPrescription } from "@/actions/customer";
import { Eye, FileText, Info, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId?: string;
    customerName?: string;
    customers?: any[]; // For cross-page quick action
}

export function PrescriptionDialog({ open, onOpenChange, customerId: initialCustomerId, customerName: initialCustomerName, customers }: PrescriptionDialogProps) {
    const [loading, setLoading] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId || "");
    const [formData, setFormData] = useState({
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const finalCustomerId = initialCustomerId || selectedCustomerId;

        if (!finalCustomerId) {
            toast.error("Please select a customer");
            return;
        }

        setLoading(true);

        try {
            await createPrescription(finalCustomerId, formData);
            toast.success("Prescription saved to records");
            onOpenChange(false);
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
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0 relative">
                    <SheetHeader>
                        <div className="flex items-center gap-4 mt-4 text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-bold text-slate-900 dark:text-white leading-none">New Prescription</SheetTitle>
                                <SheetDescription className="text-slate-500 text-xs mt-1 pr-12">
                                    {initialCustomerName ? (
                                        <>Record clinical test results for <span className="font-semibold text-indigo-600">{initialCustomerName}</span></>
                                    ) : (
                                        "Record new vision test results for a customer."
                                    )}
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                <form id="rx-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                    {/* Customer Selection (Only if not pre-selected) */}
                    {!initialCustomerId && customers && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3 text-indigo-400" /> Customer Selection
                            </Label>
                            <select
                                value={selectedCustomerId}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none font-medium"
                                required={!initialCustomerId}
                            >
                                <option value="">Choose customer profile...</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id} className="text-sm font-medium">
                                        {c.name} — {c.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Eyes Layout */}
                        <div className="grid grid-cols-2 gap-8 relative">
                            {/* Right Eye */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Right Eye (OD)</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <MetricInput label="Sphere (SPH)" value={formData.rightSphere} onChange={(v) => setFormData({ ...formData, rightSphere: v })} placeholder="0.00" />
                                    <MetricInput label="Cylinder (CYL)" value={formData.rightCylinder} onChange={(v) => setFormData({ ...formData, rightCylinder: v })} placeholder="0.00" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricInput label="Axis" value={formData.rightAxis} onChange={(v) => setFormData({ ...formData, rightAxis: v })} placeholder="0" />
                                        <MetricInput label="Add" value={formData.rightAdd} onChange={(v) => setFormData({ ...formData, rightAdd: v })} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800" />

                            {/* Left Eye */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Left Eye (OS)</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <MetricInput label="Sphere (SPH)" value={formData.leftSphere} onChange={(v) => setFormData({ ...formData, leftSphere: v })} placeholder="0.00" />
                                    <MetricInput label="Cylinder (CYL)" value={formData.leftCylinder} onChange={(v) => setFormData({ ...formData, leftCylinder: v })} placeholder="0.00" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricInput label="Axis" value={formData.leftAxis} onChange={(v) => setFormData({ ...formData, leftAxis: v })} placeholder="0" />
                                        <MetricInput label="Add" value={formData.leftAdd} onChange={(v) => setFormData({ ...formData, leftAdd: v })} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PD & Notes */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                                        PD (mm) <Info className="w-3 h-3 text-slate-300" />
                                    </Label>
                                    <Input
                                        placeholder="0.00"
                                        value={formData.pd}
                                        onChange={(e) => setFormData({ ...formData, pd: e.target.value })}
                                        className="h-11 font-mono font-bold text-lg focus:ring-indigo-500 bg-slate-50/50 dark:bg-slate-900/30"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase">Clinical Notes</Label>
                                    <Input
                                        placeholder="e.g. Near vision difficulty, frame preference..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="h-11 italic text-xs border-slate-200 dark:border-slate-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="gap-3 sm:flex-row flex-col">
                        <SheetClose asChild>
                            <Button type="button" variant="ghost" className="h-11 px-8 font-semibold text-slate-500">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            form="rx-form"
                            className="h-11 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none sm:flex-1"
                            disabled={loading}
                        >
                            {loading ? "Saving Record..." : "Confirm & Save"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function MetricInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 font-mono font-bold text-slate-900 dark:text-white bg-slate-50/30 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-center text-sm"
            />
        </div>
    );
}
