"use client";

import { cn } from "@/lib/utils";
import { CustomerSheet } from "./customer-sheet";
import { InvoiceDialog } from "./invoice-dialog";
import { PrescriptionDialog } from "./prescription-dialog";
import { useState, useEffect } from "react";
import { getAllCustomers } from "@/actions/customer";
import { SidebarNav } from "./sidebar-nav";

export function DashboardSidebar() {
    const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        if (invoiceDialogOpen || prescriptionDialogOpen) {
            getAllCustomers().then(setCustomers).catch(console.error);
        }
    }, [invoiceDialogOpen, prescriptionDialogOpen]);

    return (
        <>
            <aside className="hidden md:flex w-64 min-h-screen bg-slate-950 border-r border-slate-900 flex-col fixed left-0 top-0 z-50">
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <SidebarNav />
                </div>

            </aside>

            {/* Global Dialogs - kept here to ensure they are rendered */}
            <CustomerSheet
                open={customerSheetOpen}
                onOpenChange={setCustomerSheetOpen}
            />
            <InvoiceDialog
                open={invoiceDialogOpen}
                onOpenChange={setInvoiceDialogOpen}
                customers={customers}
            />
            <PrescriptionDialog
                open={prescriptionDialogOpen}
                onOpenChange={setPrescriptionDialogOpen}
                customers={customers}
            />
        </>
    );
}
