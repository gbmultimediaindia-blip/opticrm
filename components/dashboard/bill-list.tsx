"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Receipt, User, Calendar, IndianRupee, MoreHorizontal, FileText } from "lucide-react";
import { BillDialog } from "./bill-dialog";
import { DeleteBillDialog } from "./delete-bill-dialog";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BillListProps {
    bills: any[];
    customers: any[];
}

export function BillList({ bills, customers }: BillListProps) {
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeBill, setActiveBill] = useState<any>(null);

    const handleDeleteClick = (bill: any) => {
        setActiveBill(bill);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Billing</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage invoices, payments, and outstanding balances.</p>
                </div>
                <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-xl gap-2 font-bold shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="w-5 h-5" /> Generate New Bill
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[200px] font-bold text-slate-900 dark:text-slate-100 py-5 px-6">Invoice ID</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5 px-6">Customer</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5">Amount Details</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5">Status</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5">Date</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5 text-right px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bills.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Receipt className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold text-lg">No invoices yet</p>
                                        <p className="text-slate-500 text-sm max-w-[240px]">Record your first sale to start tracking payments.</p>
                                        <Button variant="outline" onClick={() => setOpen(true)} className="mt-2 border-slate-200 dark:border-slate-800">
                                            Create Invoice
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            bills.map((bill) => (
                                <TableRow key={bill.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-slate-200 dark:border-slate-800">
                                    <TableCell className="py-5 px-6 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                        #{bill.id.substring(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {bill.customer?.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {bill.customer?.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
                                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white flex items-center">
                                                    <IndianRupee className="w-3 h-3 mr-0.5" />{bill.totalAmount}
                                                </span>
                                            </div>
                                            <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Paid</span>
                                                <span className="text-sm font-mono font-bold text-emerald-600 flex items-center">
                                                    <IndianRupee className="w-3 h-3 mr-0.5" />{bill.advanceAmount}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        {parseFloat(bill.dueAmount) <= 0 ? (
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                Fully Paid
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <span className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest w-fit">
                                                    Payment Due
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-red-600 flex items-center px-1">
                                                    <IndianRupee className="w-2.5 h-2.5 mr-0.5" />{bill.dueAmount}
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-medium text-xs font-mono">{format(new Date(bill.createdAt), "dd/MM/yy")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 text-right px-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                                <DropdownMenuItem className="gap-3 rounded-lg py-2.5">
                                                    <FileText className="w-4 h-4 text-indigo-500" />
                                                    <span className="font-bold text-sm">View Details</span>
                                                </DropdownMenuItem>
                                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(bill)}
                                                    className="gap-3 rounded-lg py-2.5 text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="font-bold text-sm">Delete Bill</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <BillDialog
                open={open}
                onOpenChange={setOpen}
                customers={customers}
            />

            {activeBill && (
                <DeleteBillDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    billId={activeBill.id}
                    invoiceNumber={activeBill.id.substring(0, 8).toUpperCase()}
                />
            )}
        </div>
    );
}
