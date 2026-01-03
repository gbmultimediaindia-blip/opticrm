"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MoreHorizontal, Eye, History, User, Mail, Phone, Calendar, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface CustomerListProps {
    customers: any[];
}

export function CustomerList({ customers }: CustomerListProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customers</h1>
                    <p className="text-xs text-slate-500 mt-1">Manage and track customer vision records.</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 h-10 px-5 rounded-lg gap-2 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                    <Plus className="w-4 h-4" /> Add Customer
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[240px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 underline-offset-4">Customer</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Contact Info</TableHead>
                            <TableHead className="w-[300px] font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 bg-slate-50/30 dark:bg-slate-900/10">Latest Prescription</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4">Registered Date</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest py-2.5 px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold">No customers found</p>
                                        <Button variant="outline" size="sm" onClick={handleCreate} className="mt-1 border-slate-200 dark:border-slate-800 text-xs font-bold">
                                            Add Your First Customer
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCustomers.map((customer) => {
                                const latestPrescription = customer.prescriptions?.[0];
                                return (
                                    <TableRow key={customer.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all border-slate-200 dark:border-slate-800">
                                        <TableCell className="py-3 px-4 border-r border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800/50 shadow-sm text-xs">
                                                    {getInitials(customer.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                                                        {customer.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">
                                                        ID: {customer.id.substring(0, 8)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                                    <Mail className="w-3 h-3 text-slate-400" />
                                                    <span className="truncate max-w-[120px]">{customer.email || "-"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                                    <Phone className="w-3 h-3 text-slate-400" />
                                                    <span className="font-bold text-slate-900 dark:text-slate-200">{customer.phone}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4 bg-slate-50/20 dark:bg-slate-900/5">
                                            {latestPrescription ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-100 dark:border-slate-800 shadow-sm divide-x divide-slate-100 dark:divide-slate-800">
                                                        <div className="flex items-center gap-1.5 pr-2">
                                                            <span className="text-[7px] font-black text-emerald-600 w-2">R</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <MetricPair label="S" value={latestPrescription.rightSphere} />
                                                                <MetricPair label="C" value={latestPrescription.rightCylinder} />
                                                                <MetricPair label="A" value={latestPrescription.rightAxis} />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 pl-2">
                                                            <span className="text-[7px] font-black text-amber-600 w-2">L</span>
                                                            <div className="flex items-center gap-1.5">
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
                                                        className="h-6 w-6 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 flex-none"
                                                    >
                                                        <Maximize2 className="w-3 h-3 text-indigo-600" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">No record</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                <span className="font-medium">{format(new Date(customer.createdAt), "MMM d")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-right px-4">
                                            <div className="flex justify-end gap-1 isolate">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewHistory(customer)}
                                                    className="h-8 px-2 border-indigo-100 dark:border-indigo-900/40 text-indigo-600 bg-indigo-50/30 hover:bg-indigo-600 hover:text-white rounded-md font-bold text-xs"
                                                >
                                                    <History className="w-3 h-3 mr-1.5" /> History
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                                        <DropdownMenuItem onClick={() => handleAddPrescription(customer)} className="gap-2.5 rounded-lg py-2">
                                                            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-xs">New Prescription</span>
                                                                <span className="text-[9px] text-slate-500">Record vision test</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(customer)} className="gap-2.5 rounded-lg py-2">
                                                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-xs">Edit Profile</span>
                                                                <span className="text-[9px] text-slate-500">Update contact</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(customer)} className="gap-2.5 rounded-lg py-2 text-red-600 focus:text-red-600">
                                                            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-xs">Delete Customer</span>
                                                                <span className="text-[9px] text-red-400/70">Remove permanently</span>
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

                {customers.length > itemsPerPage && (
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, customers.length)}</span> of <span className="text-slate-900 dark:text-white">{customers.length}</span> customers
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 rounded-md border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "h-8 w-8 rounded-md text-xs font-bold transition-all",
                                        currentPage === i + 1
                                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-100 dark:ring-0"
                                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                    )}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 rounded-md border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
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
        <div className="flex flex-col min-w-[28px]">
            <span className="text-[5px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</span>
            <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-slate-200 mt-0.5 leading-none">
                {value || "-"}
            </span>
        </div>
    );
}
