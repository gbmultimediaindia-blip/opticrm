"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Eye, Calendar, Info, Ruler } from "lucide-react";

interface LatestPrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    prescription: any;
    customerName: string;
}

export function LatestPrescriptionDialog({ open, onOpenChange, prescription, customerName }: LatestPrescriptionDialogProps) {
    if (!prescription) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl flex flex-col">
                <div className="p-8 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 mt-6">
                    <SheetHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div>
                                    <SheetTitle className="text-2xl font-bold text-slate-900 dark:text-white">Prescription Detail</SheetTitle>
                                    <SheetDescription className="text-slate-500">
                                        Clinical record for <span className="font-semibold text-indigo-600">{customerName}</span>
                                    </SheetDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                    <Calendar className="w-3 h-3" /> Test Date
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                    {format(new Date(prescription.createdAt), "MMM d, yyyy")}
                                </div>
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                <div className="p-8 space-y-8 bg-white dark:bg-slate-950">
                    <div className="grid grid-cols-2 gap-8 relative">
                        {/* Right Eye */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
                                <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Right Eye (OD)</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <DetailMetric label="Sphere (SPH)" value={prescription.rightSphere} highlight />
                                <DetailMetric label="Cylinder (CYL)" value={prescription.rightCylinder} highlight />
                                <DetailMetric label="Axis" value={prescription.rightAxis} />
                                <DetailMetric label="Addition (ADD)" value={prescription.rightAdd} />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800" />

                        {/* Left Eye */}
                        <div className="space-y-6 pl-4">
                            <div className="flex items-center gap-2 border-b border-amber-100 dark:border-amber-900/30 pb-2">
                                <div className="w-2 h-6 bg-amber-500 rounded-full" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Left Eye (OS)</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <DetailMetric label="Sphere (SPH)" value={prescription.leftSphere} highlight />
                                <DetailMetric label="Cylinder (CYL)" value={prescription.leftCylinder} highlight />
                                <DetailMetric label="Axis" value={prescription.leftAxis} />
                                <DetailMetric label="Addition (ADD)" value={prescription.leftAdd} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Ruler className="w-3 h-3" /> PD (mm)
                            </div>
                            <div className="text-xl font-mono font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 w-fit">
                                {prescription.pd}
                            </div>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Info className="w-3 h-3" /> Notes
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                {prescription.notes || "No additional clinical notes recorded."}
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function DetailMetric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
            <div className={`text-xl font-mono font-black ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                {value}
            </div>
        </div>
    );
}
