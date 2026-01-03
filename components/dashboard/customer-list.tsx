"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MoreHorizontal, Eye, History } from "lucide-react";
import { CustomerSheet } from "./customer-sheet";
import { EyesightHistoryDialog } from "./eyesight-history-dialog";
import { EyesightSheet } from "./eyesight-sheet";
import { deleteCustomer } from "@/actions/customer";
import { toast } from "sonner";
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
    const [eyesightSheetOpen, setEyesightSheetOpen] = useState(false);
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

    const handleAddPrescription = (customer: any) => {
        setActiveCustomer(customer);
        setEyesightSheetOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(id);
                toast.success("Customer deleted successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete customer");
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customers</h1>
                    <p className="text-slate-500">Manage your store's customers and their contact details.</p>
                </div>
                <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="w-4 h-4" /> Add Customer
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Name</TableHead>
                            <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Email</TableHead>
                            <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Phone</TableHead>
                            <TableHead className="font-semibold text-slate-900 dark:text-slate-100 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                    No customers found. Click "Add Customer" to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{customer.name}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{customer.email}</TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400">{customer.phone}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewHistory(customer)} className="gap-2 text-indigo-600">
                                                <History className="w-4 h-4" /> History
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleAddPrescription(customer)} className="gap-2">
                                                        <Eye className="w-3.5 h-3.5" /> New Prescription
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEdit(customer)} className="gap-2">
                                                        <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400">
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
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
                    <EyesightHistoryDialog
                        open={historyOpen}
                        onOpenChange={setHistoryOpen}
                        customerId={activeCustomer.id}
                        customerName={activeCustomer.name}
                    />
                    <EyesightSheet
                        open={eyesightSheetOpen}
                        onOpenChange={setEyesightSheetOpen}
                        customerId={activeCustomer.id}
                        customerName={activeCustomer.name}
                    />
                </>
            )}
        </div>
    );
}
