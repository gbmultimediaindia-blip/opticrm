"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Calendar, Info, Pencil } from "lucide-react";
import { PrescriptionDialog } from "./prescription-dialog";

interface LatestPrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    prescription: any;
    customer: any;
    onSuccess?: () => void;
}

export function LatestPrescriptionDialog({ open, onOpenChange, prescription, customer, onSuccess }: LatestPrescriptionDialogProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    if (!customer) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col border-l border-slate-200 dark:border-slate-800 shadow-xl [&_[data-slot=sheet-close]]:hidden">
                {/* Minimal Header */}
                <div className="h-16 px-6 flex items-center bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Eye className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Customer Profile & Rx</SheetTitle>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{customer.name}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-950">
                    {/* Customer Info Section */}
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</span>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{customer.phone}</p>
                            </div>
                            {customer.email && (
                                <div className="flex-1 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{customer.email}</p>
                                </div>
                            )}
                        </div>
                        {customer.address && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resident Address</span>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{customer.address}</p>
                            </div>
                        )}
                    </div>

                    {!prescription ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div className="space-y-1 px-8">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No Clinical Records Found</h4>
                                <p className="text-xs text-slate-500 max-w-[240px]">This customer doesn't have any prescription history yet.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden text-center">
                                {/* Right Eye */}
                                <div className="bg-white dark:bg-slate-950 p-5 space-y-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Right Eye (OD)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Metric value={prescription.rightSphere} label="SPH" />
                                        <Metric value={prescription.rightCylinder} label="CYL" />
                                        <Metric value={prescription.rightAxis} label="Axis" />
                                        <Metric value={prescription.rightAdd} label="Add" />
                                    </div>
                                </div>

                                {/* Left Eye */}
                                <div className="bg-white dark:bg-slate-950 p-5 space-y-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Left Eye (OS)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Metric value={prescription.leftSphere} label="SPH" />
                                        <Metric value={prescription.leftCylinder} label="CYL" />
                                        <Metric value={prescription.leftAxis} label="Axis" />
                                        <Metric value={prescription.leftAdd} label="Add" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">PD (mm)</span>
                                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{prescription.pd}</p>
                                </div>
                                <div className="col-span-2 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Clinical Notes</span>
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {prescription.notes || "No notes recorded."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
                                <Calendar className="w-3 h-3 text-blue-500" /> Recorded on {format(new Date(prescription.createdAt), "MMM d, yyyy")}
                            </div>
                        </>
                    )}
                </div>

                <div className="h-16 px-6 flex items-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                    <SheetFooter className="mt-0 flex-row w-full justify-end gap-3 items-center">
                        <SheetClose asChild>
                            <Button variant="ghost" className="h-11 flex-1 font-semibold text-slate-500">
                                Dismiss
                            </Button>
                        </SheetClose>
                        <Button
                            onClick={() => setShowEditDialog(true)}
                            className="h-11 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none text-sm gap-2"
                        >
                            {prescription ? (
                                <>
                                    <Pencil className="w-4 h-4" /> Edit Details
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4" /> Add Prescription
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>

            <PrescriptionDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                customerId={customer.id}
                customerName={customer.name}
                prescriptionId={prescription?.id}
                initialData={prescription}
                onSuccess={() => {
                    if (onSuccess) onSuccess();
                    onOpenChange(false);
                }}
            />
        </Sheet>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {value || "0.00"}
            </p>
        </div>
    );
}
