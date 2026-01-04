"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Calendar, Info, Ruler, Printer } from "lucide-react";

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
            <SheetContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl flex flex-col [&_[data-slot=sheet-close]]:hidden">
                <div className="h-16 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
                            <Eye className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">Prescription Details</SheetTitle>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-medium">Vision record for <span className="font-bold text-indigo-600">{customerName}</span></span>
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-mono font-bold tracking-tight">{format(new Date(prescription.createdAt), "MMM d, yyyy")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 bg-white dark:bg-slate-950">
                    <div className="grid grid-cols-2 gap-8 relative">
                        {/* Right Eye */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
                                <div className="w-2 h-6 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200 dark:shadow-none" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Right Eye (OD)</h3>
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
                                <div className="w-2 h-6 bg-amber-500 rounded-full shadow-sm shadow-amber-200 dark:shadow-none" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Left Eye (OS)</h3>
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
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Ruler className="w-3.5 h-3.5" /> PD (mm)
                            </div>
                            <div className="text-lg font-bold tabular-nums text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 w-fit">
                                {prescription.pd}
                            </div>
                        </div>
                        <div className="col-span-2 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Info className="w-3.5 h-3.5" /> Notes
                            </div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                {prescription.notes || "No additional clinical notes recorded."}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0 mt-auto">
                    <SheetFooter className="mt-0 flex-row w-full justify-end gap-3">
                        <div className="flex gap-3 w-full sm:w-auto ml-auto">
                            <SheetClose asChild>
                                <Button variant="outline" className="font-bold text-xs">Close</Button>
                            </SheetClose>
                            <Button
                                onClick={() => window.open(`/print/prescriptions/${prescription.id}`, '_blank')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 shadow-lg shadow-indigo-100 dark:shadow-none px-6"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </Button>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function DetailMetric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="space-y-1">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
            <div className={`text-xl font-bold tabular-nums ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                {value}
            </div>
        </div>
    );
}
