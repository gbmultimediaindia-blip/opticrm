"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { getPrescriptionHistory } from "@/actions/customer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { History, Calendar, Eye, FileText, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrescriptionHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function PrescriptionHistoryDialog({ open, onOpenChange, customerId, customerName }: PrescriptionHistoryDialogProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);

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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-4xl flex flex-col p-0 border-slate-200 dark:border-slate-800 shadow-2xl [&_[data-slot=sheet-close]]:hidden">
                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
                            <History className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">Prescription History</SheetTitle>
                            <SheetDescription className="text-xs text-slate-500 font-medium">
                                Historical vision records for <span className="font-bold text-indigo-600">{customerName}</span>
                            </SheetDescription>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium anim-pulse">Loading records...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-bold text-lg">No records found</p>
                                <p className="text-slate-500 text-sm max-w-[280px]">This customer hasn't had any clinical prescriptions recorded yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[160px] text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">
                                            <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date</div>
                                        </TableHead>
                                        <TableHead className="w-[220px] text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">
                                            <div className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-indigo-500" /> Right Eye (OD)</div>
                                        </TableHead>
                                        <TableHead className="w-[220px] text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">
                                            <div className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-indigo-500" /> Left Eye (OS)</div>
                                        </TableHead>
                                        <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6 text-center">PD</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-slate-400" /> Notes</div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedHistory.map((record) => (
                                        <TableRow key={record.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-0">
                                            <TableCell className="py-5 px-6 align-top">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white">{format(new Date(record.createdAt), "MMM d, yyyy")}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{format(new Date(record.createdAt), "h:mm aa")}</p>
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
                                                <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs select-all tabular-nums">
                                                    {record.pd}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 align-top">
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                    {record.notes || "No details"}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {history.length > itemsPerPage && (
                                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of <span className="text-slate-900 dark:text-white">{totalPages}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-800"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-800"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="mt-0 flex-row w-full justify-end items-center">
                        <SheetClose asChild>
                            <Button variant="outline" className="font-bold text-xs px-8">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5 min-w-[60px]">
            <span className="text-[10px] font-medium text-slate-500 uppercase">{label}</span>
            <span className={`text-xs font-medium tabular-nums select-all ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-300'}`}>
                {value}
            </span>
        </div>
    );
}
