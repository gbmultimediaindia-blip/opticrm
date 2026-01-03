"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getEyesightHistory } from "@/actions/customer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface EyesightHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    customerName: string;
}

export function EyesightHistoryDialog({ open, onOpenChange, customerId, customerName }: EyesightHistoryDialogProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && customerId) {
            setLoading(true);
            getEyesightHistory(customerId).then(data => {
                setHistory(data);
                setLoading(false);
            });
        }
    }, [open, customerId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Eyesight History - {customerName}</DialogTitle>
                    <DialogDescription>
                        View all past prescriptions for this customer.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {loading ? (
                        <div className="py-8 text-center text-slate-500">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">No prescriptions found.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Right (OD)</TableHead>
                                    <TableHead>Left (OS)</TableHead>
                                    <TableHead>PD</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(record.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            S:{record.rightSphere} C:{record.rightCylinder} A:{record.rightAxis} Add:{record.rightAdd}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            S:{record.leftSphere} C:{record.leftCylinder} A:{record.leftAxis} Add:{record.leftAdd}
                                        </TableCell>
                                        <TableCell>{record.pd}</TableCell>
                                        <TableCell className="text-xs text-slate-500 max-w-[200px] truncate">
                                            {record.notes}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
