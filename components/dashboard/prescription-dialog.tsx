"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPrescription } from "@/actions/customer";
import { Eye, FileText, Info } from "lucide-react";

interface PrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function PrescriptionDialog({ open, onOpenChange, customerId, customerName }: PrescriptionDialogProps) {
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createPrescription(customerId, formData);
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
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl border-slate-200 dark:border-slate-800 shadow-2xl p-0 overflow-hidden">
                <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">New Prescription</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Record clinical test results for <span className="font-semibold text-indigo-600">{customerName}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white dark:bg-slate-950">
                    <div className="grid md:grid-cols-2 gap-8 relative">
                        {/* Right Eye */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Right Eye (OD)</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <MetricInput label="Sphere (SPH)" value={formData.rightSphere} onChange={(v) => setFormData({ ...formData, rightSphere: v })} placeholder="0.00" />
                                <MetricInput label="Cylinder (CYL)" value={formData.rightCylinder} onChange={(v) => setFormData({ ...formData, rightCylinder: v })} placeholder="0.00" />
                                <MetricInput label="Axis" value={formData.rightAxis} onChange={(v) => setFormData({ ...formData, rightAxis: v })} placeholder="0" />
                                <MetricInput label="Add" value={formData.rightAdd} onChange={(v) => setFormData({ ...formData, rightAdd: v })} placeholder="0.00" />
                            </div>
                        </div>

                        {/* Divider for Desktop */}
                        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800" />

                        {/* Left Eye */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-6 bg-amber-500 rounded-full" />
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Left Eye (OS)</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <MetricInput label="Sphere (SPH)" value={formData.leftSphere} onChange={(v) => setFormData({ ...formData, leftSphere: v })} placeholder="0.00" />
                                <MetricInput label="Cylinder (CYL)" value={formData.leftCylinder} onChange={(v) => setFormData({ ...formData, leftCylinder: v })} placeholder="0.00" />
                                <MetricInput label="Axis" value={formData.leftAxis} onChange={(v) => setFormData({ ...formData, leftAxis: v })} placeholder="0" />
                                <MetricInput label="Add" value={formData.leftAdd} onChange={(v) => setFormData({ ...formData, leftAdd: v })} placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                PD (mm) <Info className="w-3 h-3 text-slate-300" />
                            </Label>
                            <Input
                                placeholder="0.00"
                                value={formData.pd}
                                onChange={(e) => setFormData({ ...formData, pd: e.target.value })}
                                className="h-12 font-mono font-bold text-lg focus:ring-indigo-500 border-slate-200 dark:border-slate-800"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase">Notes</Label>
                            <Input
                                placeholder="Patient needs anti-reflective coating, etc..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="h-12 italic text-sm focus:ring-indigo-500 border-slate-200 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-12 px-8 font-semibold text-slate-500">
                            Cancel
                        </Button>
                        <Button type="submit" className="h-12 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none" disabled={loading}>
                            {loading ? "Saving Record..." : "Confirm & Save Prescription"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function MetricInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 font-mono font-bold text-slate-900 dark:text-white bg-slate-50/30 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-center"
            />
        </div>
    );
}
