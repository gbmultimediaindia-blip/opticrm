"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MoreHorizontal, Eye, History, User, Users, Mail, Phone, Calendar, Maximize2, ChevronLeft, ChevronRight, Search, Glasses, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomerSheet } from "./customer-sheet";
import { PrescriptionHistoryDialog } from "./prescription-history-dialog";
import { InvoiceHistoryDialog } from "./invoice-history-dialog";
import { PrescriptionDialog } from "./prescription-dialog";
import { LatestPrescriptionDialog } from "./latest-prescription-dialog";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { InvoiceDialog } from "./invoice-dialog";
import { Receipt } from "lucide-react";
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
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredCustomers = customers.filter((customer) => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.phone.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [invoiceHistoryOpen, setInvoiceHistoryOpen] = useState(false);
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [latestPrescriptionOpen, setLatestPrescriptionOpen] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
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

    const handleViewInvoiceHistory = (customer: any) => {
        setActiveCustomer(customer);
        setInvoiceHistoryOpen(true);
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

    const handleCreateInvoice = (customer: any) => {
        setActiveCustomer(customer);
        setInvoiceDialogOpen(true);
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Customers
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage and track customer vision records.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search name or phone..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-8 h-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all text-sm font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <Button onClick={handleCreate} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-10 px-5 rounded-lg gap-2 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm text-white">
                        <Plus className="w-4 h-4" /> Add Customer
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-indigo-400" /> Customer Overview
                    </h3>
                    <div className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Customer' : 'Customers'}
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[200px] text-xs font-semibold text-slate-500 py-3 px-4">Customer</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Contact Info</TableHead>
                            <TableHead className="w-[180px] text-xs font-semibold text-slate-500 py-3 px-4 bg-slate-50/30 dark:bg-slate-900/10">Latest Vision</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Old Presc.</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4">Invoices</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 py-3 px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold">No customers found</p>
                                        <Button variant="outline" size="sm" onClick={handleCreate} className="mt-1 border-slate-200 dark:border-slate-800 text-xs font-bold">
                                            Add Customer
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedCustomers.length === 0 && searchQuery ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300">
                                            <Search className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-bold">No results found</p>
                                            <p className="text-slate-500 text-xs mt-1">No customers matching "{searchQuery}"</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchQuery("")}
                                            className="mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 text-xs font-bold"
                                        >
                                            Clear Search
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCustomers.map((customer) => {
                                const latestPrescription = customer.prescriptions?.[0];
                                return (
                                    <TableRow
                                        key={customer.id}
                                        className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all border-slate-200 dark:border-slate-800 cursor-pointer outline-none select-none"
                                        onClick={() => handleEdit(customer)}
                                    >
                                        <TableCell className="py-3 px-4 border-r border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800/50 shadow-sm text-xs">
                                                    {getInitials(customer.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                                                        {customer.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                                                        ID: {customer.id.substring(0, 8)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Mail className="w-3 h-3 text-slate-400" />
                                                    <span className="truncate max-w-[120px]">{customer.email || "-"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Phone className="w-3 h-3 text-slate-400" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">{customer.phone}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            {latestPrescription ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col gap-1.5">
                                                        {/* Right Eye */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-4 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 rounded text-[10px] font-medium text-emerald-600 border border-emerald-100 dark:border-emerald-800 shrink-0">OD</div>
                                                            <div className="flex items-center gap-1.5 text-xs font-medium tabular-nums tracking-normal">
                                                                <span className="text-slate-700 dark:text-slate-200">{latestPrescription.rightSphere}</span>
                                                                <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
                                                                <span className="text-slate-700 dark:text-slate-200">{latestPrescription.rightCylinder}</span>
                                                                <span className="text-slate-300 dark:text-slate-700 text-[10px]">×</span>
                                                                <span className="text-slate-700 dark:text-slate-200">{latestPrescription.rightAxis}°</span>
                                                                {(latestPrescription.rightAdd && latestPrescription.rightAdd !== "0" && latestPrescription.rightAdd !== "0.00") && (
                                                                    <span className="ml-1 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1 rounded font-medium">+{latestPrescription.rightAdd}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Left Eye */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-4 flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 rounded text-[10px] font-medium text-amber-600 border border-amber-100 dark:border-amber-800 shrink-0">OS</div>
                                                            <div className="flex items-center gap-1.5 text-xs font-medium tabular-nums tracking-normal">
                                                                <span className="text-slate-700 dark:text-slate-200">{latestPrescription.leftSphere}</span>
                                                                <span className="text-slate-300 dark:text-slate-700 text-[10px]">/</span>
                                                                <span className="text-slate-700 dark:text-slate-200">{latestPrescription.leftCylinder}</span>
                                                                <span className="text-slate-300 dark:text-slate-700 text-[10px]">×</span>
                                                                <span className="text-slate-700 dark:text-slate-200">{latestPrescription.leftAxis}°</span>
                                                                {(latestPrescription.leftAdd && latestPrescription.leftAdd !== "0" && latestPrescription.leftAdd !== "0.00") && (
                                                                    <span className="ml-1 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-1 rounded font-medium">+{latestPrescription.leftAdd}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewLatest(customer);
                                                        }}
                                                        className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all flex-none border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                                    >
                                                        <Maximize2 className="w-4 h-4 text-slate-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">No History</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewHistory(customer);
                                                }}
                                                className="h-8 px-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-medium text-xs gap-1.5"
                                            >
                                                <History className="w-3 h-3 text-indigo-500" /> View Archive
                                            </Button>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewInvoiceHistory(customer);
                                                }}
                                                className="h-8 px-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-medium text-xs gap-1.5"
                                            >
                                                <Receipt className="w-3 h-3 text-emerald-500" /> View Invoices
                                            </Button>
                                        </TableCell>
                                        <TableCell className="py-3 text-right px-4">
                                            <div className="flex justify-end gap-1.5 isolate">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddPrescription(customer);
                                                                }}
                                                                className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 shadow-sm transition-all"
                                                            >
                                                                <Glasses className="w-4 h-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-emerald-600 text-white border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1.5">New Prescription</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCreateInvoice(customer);
                                                                }}
                                                                className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 shadow-sm transition-all"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-indigo-600 text-white border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1.5">Create Invoice</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(customer);
                                                            }}
                                                            className="gap-2.5 rounded-lg py-2"
                                                        >
                                                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-xs">Edit Profile</span>
                                                                <span className="text-[9px] text-slate-500">Update contact</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(customer);
                                                            }}
                                                            className="gap-2.5 rounded-lg py-2 text-red-600 focus:text-red-600"
                                                        >
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

                {filteredCustomers.length > itemsPerPage && (
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</span> of <span className="text-slate-900 dark:text-white">{filteredCustomers.length}</span> customers
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
                    <InvoiceHistoryDialog
                        open={invoiceHistoryOpen}
                        onOpenChange={setInvoiceHistoryOpen}
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
                    <InvoiceDialog
                        open={invoiceDialogOpen}
                        onOpenChange={setInvoiceDialogOpen}
                        customers={customers}
                        initialCustomerId={activeCustomer.id}
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
