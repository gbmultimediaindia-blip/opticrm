"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createEyesight } from "@/actions/customer";

interface EyesightSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function EyesightSheet({ open, onOpenChange, customerId, customerName }: EyesightSheetProps) {
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
            await createEyesight(customerId, formData);
            toast.success("Prescription added successfully");
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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md border-l border-slate-200 dark:border-slate-800">
                <SheetHeader>
                    <SheetTitle>New Prescription</SheetTitle>
                    <SheetDescription>
                        Add eyesight details for {customerName}.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-6">
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Right Eye (OD)</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Sphere</Label>
                                        <Input placeholder="-1.00" value={formData.rightSphere} onChange={(e) => setFormData({ ...formData, rightSphere: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Cyl</Label>
                                        <Input placeholder="-0.25" value={formData.rightCylinder} onChange={(e) => setFormData({ ...formData, rightCylinder: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Axis</Label>
                                        <Input placeholder="180" value={formData.rightAxis} onChange={(e) => setFormData({ ...formData, rightAxis: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Add</Label>
                                        <Input placeholder="+2.00" value={formData.rightAdd} onChange={(e) => setFormData({ ...formData, rightAdd: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Left Eye (OS)</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Sphere</Label>
                                        <Input placeholder="-1.25" value={formData.leftSphere} onChange={(e) => setFormData({ ...formData, leftSphere: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Cyl</Label>
                                        <Input placeholder="-0.50" value={formData.leftCylinder} onChange={(e) => setFormData({ ...formData, leftCylinder: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Axis</Label>
                                        <Input placeholder="170" value={formData.leftAxis} onChange={(e) => setFormData({ ...formData, leftAxis: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-slate-400">Add</Label>
                                        <Input placeholder="+2.00" value={formData.leftAdd} onChange={(e) => setFormData({ ...formData, leftAdd: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">PD (mm)</Label>
                                <Input placeholder="64" value={formData.pd} onChange={(e) => setFormData({ ...formData, pd: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Internal Notes</Label>
                            <Input placeholder="Patient needs anti-glare coating" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                        </div>
                    </div>
                    <SheetFooter className="pt-6">
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11" disabled={loading}>
                            {loading ? "Saving..." : "Save Prescription"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
