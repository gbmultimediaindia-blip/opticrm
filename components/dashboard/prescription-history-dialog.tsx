"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { getPrescriptionHistory, deletePrescription } from "@/actions/customer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { History, Calendar, Eye, FileText, ChevronLeft, ChevronRight, Pencil, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PrescriptionDialog } from "./prescription-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

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
    const [editingPrescription, setEditingPrescription] = useState<any | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [prescriptionToDelete, setPrescriptionToDelete] = useState<string | null>(null);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);

    const fetchHistory = async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const data = await getPrescriptionHistory(customerId);
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && customerId) {
            fetchHistory();
        }
    }, [open, customerId]);

    const handleDelete = (id: string) => {
        setPrescriptionToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!prescriptionToDelete) return;

        setLoading(true);
        try {
            await deletePrescription(prescriptionToDelete);
            toast.success("Prescription deleted successfully");
            fetchHistory();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete prescription");
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            setPrescriptionToDelete(null);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-4xl flex flex-col p-0 border-l border-slate-200 dark:border-slate-800 shadow-xl [&_[data-slot=sheet-close]]:hidden">
                <div className="h-16 px-6 flex items-center bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <History className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">Prescription History</SheetTitle>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{customerName}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-bold text-sm">No records found</p>
                                <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">No clinical history for this customer.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[140px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 px-6">Date</TableHead>
                                        <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 px-6 text-center border-l border-slate-200/50 dark:border-slate-800/50">Right Eye (OD)</TableHead>
                                        <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 px-6 text-center border-l border-slate-200/50 dark:border-slate-800/50">Left Eye (OS)</TableHead>
                                        <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 px-6 text-center border-l border-slate-200/50 dark:border-slate-800/50">PD</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 px-6 border-l border-slate-200/50 dark:border-slate-800/50">Notes</TableHead>
                                        <TableHead className="w-[60px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 px-6 text-right border-l border-slate-200/50 dark:border-slate-800/50">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedHistory.map((record) => (
                                        <TableRow key={record.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors border-b border-slate-100 dark:border-slate-900 last:border-0">
                                            <TableCell className="py-4 px-6 align-top">
                                                <p className="font-bold text-xs text-slate-900 dark:text-white">{format(new Date(record.createdAt), "MMM d, yyyy")}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{format(new Date(record.createdAt), "h:mm aa")}</p>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 border-l border-slate-200/30 dark:border-slate-800/30">
                                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                    <Metric label="SPH" value={record.rightSphere} />
                                                    <Metric label="CYL" value={record.rightCylinder} />
                                                    <Metric label="Axis" value={record.rightAxis} />
                                                    <Metric label="Add" value={record.rightAdd} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 border-l border-slate-200/30 dark:border-slate-800/30">
                                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                    <Metric label="SPH" value={record.leftSphere} />
                                                    <Metric label="CYL" value={record.leftCylinder} />
                                                    <Metric label="Axis" value={record.leftAxis} />
                                                    <Metric label="Add" value={record.leftAdd} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-center align-top border-l border-slate-200/30 dark:border-slate-800/30">
                                                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] tabular-nums">
                                                    {record.pd}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-top border-l border-slate-200/30 dark:border-slate-800/30">
                                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-medium line-clamp-2">
                                                    {record.notes || "-"}
                                                </p>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-top text-right border-l border-slate-200/30 dark:border-slate-800/30">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                            <MoreVertical className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 border-slate-200 dark:border-slate-800">
                                                        <DropdownMenuItem
                                                            onClick={() => setEditingPrescription(record)}
                                                            className="flex items-center gap-2 cursor-pointer text-xs font-bold"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 text-indigo-500" />
                                                            <span>Edit Record</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(record.id)}
                                                            className="flex items-center gap-2 cursor-pointer text-xs font-bold text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {history.length > itemsPerPage && (
                                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of {totalPages}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-7 w-7 rounded-md border-slate-200 dark:border-slate-800"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-14 px-6 flex items-center justify-end border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                    <SheetClose asChild>
                        <Button variant="ghost" className="h-11 px-8 font-semibold text-slate-500">Close</Button>
                    </SheetClose>
                </div>
            </SheetContent>

            <PrescriptionDialog
                open={!!editingPrescription}
                onOpenChange={(open) => !open && setEditingPrescription(null)}
                customerName={customerName}
                prescriptionId={editingPrescription?.id}
                initialData={editingPrescription}
                onSuccess={fetchHistory}
            />

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-red-900 dark:text-red-100">Delete Record</DialogTitle>
                                <DialogDescription className="text-red-700/70 dark:text-red-400/70">
                                    This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-950">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Are you sure you want to delete this prescription record for <span className="font-bold text-slate-900 dark:text-white">{customerName}</span>?
                            All clinical data associated with this entry will be permanently removed.
                        </p>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={loading}
                            className="flex-1 h-11 font-semibold text-slate-600 dark:text-slate-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={loading}
                            className="flex-1 h-11 font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none gap-2"
                        >
                            {loading ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete Record</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Sheet>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-0.5">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter block leading-none">{label}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {value || "0.00"}
            </span>
        </div>
    );
}
