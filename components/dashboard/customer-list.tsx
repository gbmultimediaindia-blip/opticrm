"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MoreHorizontal, Eye, History, User, Mail, Phone, Calendar, Maximize2 } from "lucide-react";
import { CustomerSheet } from "./customer-sheet";
import { PrescriptionHistoryDialog } from "./prescription-history-dialog";
import { PrescriptionDialog } from "./prescription-dialog";
import { LatestPrescriptionDialog } from "./latest-prescription-dialog";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerListProps {
    customers: any[];
}

export function CustomerList({ customers }: CustomerListProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [latestPrescriptionOpen, setLatestPrescriptionOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeCustomer, setActiveCustomer] = useState<any>(null);

    const handleEdit = (customer: any) => {
        setSelectedCustomer(customer);
        setSheetOpen(true);
    };

    const handleCreate = () => {
        setSelectedCustomer(null);
        setSheetOpen(true);
    };

    const handleViewHistory = (customer: any) => {
        setActiveCustomer(customer);
        setHistoryOpen(true);
    };

    const handleViewLatest = (customer: any) => {
        setActiveCustomer(customer);
        setLatestPrescriptionOpen(true);
    };

    const handleAddPrescription = (customer: any) => {
        setActiveCustomer(customer);
        setPrescriptionDialogOpen(true);
    };

    const handleDeleteClick = (customer: any) => {
        setActiveCustomer(customer);
        setDeleteDialogOpen(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customers</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your relationships and archive vision records.</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-xl gap-2 font-bold shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="w-5 h-5" /> Add New Customer
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[280px] font-bold text-slate-900 dark:text-slate-100 py-5 px-6 border-r border-slate-100 dark:border-slate-800/50">Customer</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5 px-6">Contact Details</TableHead>
                            <TableHead className="w-[320px] font-bold text-slate-900 dark:text-slate-100 py-5 px-6 bg-slate-50/30 dark:bg-slate-900/10">Prescription (Latest)</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5 px-6">Added Date</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-slate-100 py-5 text-right px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold text-lg">No customers yet</p>
                                        <p className="text-slate-500 text-sm max-w-[240px]">Get started by adding your first customer to the system.</p>
                                        <Button variant="outline" onClick={handleCreate} className="mt-2 border-slate-200 dark:border-slate-800">
                                            Create Now
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => {
                                const latestPrescription = customer.prescriptions?.[0];
                                return (
                                    <TableRow key={customer.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all border-slate-200 dark:border-slate-800">
                                        <TableCell className="py-5 px-6 border-r border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800/50 shadow-sm group-hover:scale-105 transition-transform">
                                                    {getInitials(customer.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                                                        {customer.name}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter mt-1 bg-slate-100 dark:bg-slate-800 w-fit px-1.5 rounded">
                                                        ID: {customer.id.substring(0, 8)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 px-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="font-medium truncate max-w-[150px]">{customer.email || "No email"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{customer.phone}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 px-6 bg-slate-50/20 dark:bg-slate-900/5">
                                            {latestPrescription ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="space-y-1.5 flex-none bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-5 h-2.5 rounded-[2px] bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                                <span className="text-[6px] font-black text-emerald-600">OD</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <MetricPair label="S" value={latestPrescription.rightSphere} />
                                                                <MetricPair label="C" value={latestPrescription.rightCylinder} />
                                                                <MetricPair label="A" value={latestPrescription.rightAxis} />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-5 h-2.5 rounded-[2px] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                                <span className="text-[6px] font-black text-amber-600">OS</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <MetricPair label="S" value={latestPrescription.leftSphere} />
                                                                <MetricPair label="C" value={latestPrescription.leftCylinder} />
                                                                <MetricPair label="A" value={latestPrescription.leftAxis} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewLatest(customer)}
                                                        className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex-none"
                                                    >
                                                        <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No record found</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-5 px-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-medium">{format(new Date(customer.createdAt), "MMM d, yyyy")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 text-right px-6">
                                            <div className="flex justify-end gap-2 isolate">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewHistory(customer)}
                                                    className="border-indigo-100 dark:border-indigo-900/40 text-indigo-600 bg-indigo-50/30 hover:bg-indigo-600 hover:text-white h-9 rounded-lg font-bold transition-all"
                                                >
                                                    <History className="w-3.5 h-3.5 mr-2" /> History
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                                        <DropdownMenuItem onClick={() => handleAddPrescription(customer)} className="gap-3 rounded-lg py-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                                <Eye className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">New Prescription</span>
                                                                <span className="text-[10px] text-slate-500">Add latest vision test</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(customer)} className="gap-3 rounded-lg py-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                                <Edit2 className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">Edit Profile</span>
                                                                <span className="text-[10px] text-slate-500">Update contact info</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(customer)} className="gap-3 rounded-lg py-2.5 text-red-600 focus:text-red-600">
                                                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                                                <Trash2 className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">Delete Customer</span>
                                                                <span className="text-[10px] text-red-400/70">Permanent action</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <CustomerSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                customer={selectedCustomer}
            />

            {activeCustomer && (
                <>
                    <PrescriptionHistoryDialog
                        open={historyOpen}
                        onOpenChange={setHistoryOpen}
                        customerId={activeCustomer.id}
                        customerName={activeCustomer.name}
                    />
                    <LatestPrescriptionDialog
                        open={latestPrescriptionOpen}
                        onOpenChange={setLatestPrescriptionOpen}
                        prescription={activeCustomer.prescriptions?.[0]}
                        customerName={activeCustomer.name}
                    />
                    <PrescriptionDialog
                        open={prescriptionDialogOpen}
                        onOpenChange={setPrescriptionDialogOpen}
                        customerId={activeCustomer.id}
                        customerName={activeCustomer.name}
                    />
                    <DeleteCustomerDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        customerId={activeCustomer.id}
                        customerName={activeCustomer.name}
                    />
                </>
            )}
        </div>
    );
}

function MetricPair({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col min-w-[32px]">
            <span className="text-[6px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{label}</span>
            <span className="text-[9px] font-mono font-bold text-slate-900 dark:text-slate-200 mt-0.5 leading-none">
                {value || "-"}
            </span>
        </div>
    );
}
