"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPrescriptionHistory } from "@/actions/customer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { History, Calendar, Eye, FileText, Info } from "lucide-react";

interface PrescriptionHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function PrescriptionHistoryDialog({ open, onOpenChange, customerId, customerName }: PrescriptionHistoryDialogProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && customerId) {
            setLoading(true);
            getPrescriptionHistory(customerId).then(data => {
                setHistory(data);
                setLoading(false);
            });
        }
    }, [open, customerId]);

    return (
        <Dialog font-bold open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Prescription Archive</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Historical vision records for <span className="font-semibold text-indigo-600">{customerName}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium anim-pulse">Syncing clinical records...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-bold text-lg">No records found</p>
                                <p className="text-slate-500 text-sm max-w-[280px]">This patient hasn't had any clinical prescriptions recorded yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[160px] font-bold text-slate-900 dark:text-slate-100 py-4 px-6 uppercase text-[10px] tracking-widest">
                                            <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-indigo-500" /> Date</div>
                                        </TableHead>
                                        <TableHead className="w-[220px] font-bold text-slate-900 dark:text-slate-100 py-4 px-6 uppercase text-[10px] tracking-widest">
                                            <div className="flex items-center gap-2"><Eye className="w-3 h-3 text-emerald-500" /> Right Eye (OD)</div>
                                        </TableHead>
                                        <TableHead className="w-[220px] font-bold text-slate-900 dark:text-slate-100 py-4 px-6 uppercase text-[10px] tracking-widest">
                                            <div className="flex items-center gap-2"><Eye className="w-3 h-3 text-amber-500" /> Left Eye (OS)</div>
                                        </TableHead>
                                        <TableHead className="w-[100px] font-bold text-slate-900 dark:text-slate-100 py-4 px-6 uppercase text-[10px] tracking-widest text-center">PD</TableHead>
                                        <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-4 px-6 uppercase text-[10px] tracking-widest whitespace-nowrap">
                                            <div className="flex items-center gap-2"><Info className="w-3 h-3 text-slate-400" /> Notes</div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((record) => (
                                        <TableRow key={record.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-0">
                                            <TableCell className="py-5 px-6 align-top">
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{format(new Date(record.createdAt), "MMM d, yyyy")}</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{format(new Date(record.createdAt), "h:mm aa")}</p>
                                            </TableCell>
                                            <TableCell className="py-5 px-6">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Metric label="SPH" value={record.rightSphere} highlight />
                                                    <Metric label="CYL" value={record.rightCylinder} highlight />
                                                    <Metric label="Axis" value={record.rightAxis} />
                                                    <Metric label="Add" value={record.rightAdd} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Metric label="SPH" value={record.leftSphere} highlight />
                                                    <Metric label="CYL" value={record.leftCylinder} highlight />
                                                    <Metric label="Axis" value={record.leftAxis} />
                                                    <Metric label="Add" value={record.leftAdd} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 text-center">
                                                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs select-all">
                                                    {record.pd}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 align-top">
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                    {record.notes || "Standard vision test. No additional details recorded."}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5 min-w-[60px]">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
            <span className={`text-xs font-mono font-bold select-all ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {value}
            </span>
        </div>
    );
}
