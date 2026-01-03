"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteBill } from "@/actions/billing";
import { toast } from "sonner";

interface DeleteBillDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    billId: string;
    invoiceNumber: string;
}

export function DeleteBillDialog({ open, onOpenChange, billId, invoiceNumber }: DeleteBillDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteBill(billId);
            toast.success("Invoice deleted successfully");
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6 bg-red-50 dark:bg-red-950/20 flex flex-col items-center text-center gap-4 border-b border-red-100 dark:border-red-900/30">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-red-600 shadow-xl shadow-red-200 dark:shadow-none animate-pulse">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Invoice?</DialogTitle>
                        <DialogDescription className="text-red-600/80 font-medium mt-1 uppercase text-[10px] tracking-widest">
                            Permanent Action
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6 space-y-4 bg-white dark:bg-slate-950">
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                        Are you sure you want to delete invoice <span className="font-mono font-black text-slate-900 dark:text-white">#{invoiceNumber}</span>?
                        This will remove all financial records associated with this transaction.
                    </p>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-11 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            disabled={loading}
                        >
                            Keep Invoice
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg shadow-red-100 dark:shadow-none"
                            disabled={loading}
                        >
                            {loading ? (
                                "Deleting..."
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" /> Delete Bill
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
