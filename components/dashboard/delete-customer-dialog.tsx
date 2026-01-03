"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteCustomer } from "@/actions/customer";
import { toast } from "sonner";

interface DeleteCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function DeleteCustomerDialog({ open, onOpenChange, customerId, customerName }: DeleteCustomerDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCustomer(customerId);
            toast.success("Customer deleted successfully");
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-red-900 dark:text-red-100">Delete Customer</DialogTitle>
                            <DialogDescription className="text-red-700/70 dark:text-red-400/70">
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-950">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{customerName}</span>?
                        All their prescription history and personal records will be permanently removed from your store.
                    </p>
                </div>

                <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="flex-1 h-11 font-semibold text-slate-600 dark:text-slate-400"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 h-11 font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none gap-2"
                    >
                        {loading ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete Customer</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
