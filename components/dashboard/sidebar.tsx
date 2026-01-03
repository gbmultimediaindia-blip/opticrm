"use client";

import { cn } from "@/lib/utils";
import { CustomerSheet } from "./customer-sheet";
import { BillDialog } from "./bill-dialog";
import { PrescriptionDialog } from "./prescription-dialog";
import { useState, useEffect } from "react";
import { getAllCustomers } from "@/actions/customer";
import { SidebarNav } from "./sidebar-nav";

export function DashboardSidebar() {
    const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
    const [billDialogOpen, setBillDialogOpen] = useState(false);
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        if (billDialogOpen || prescriptionDialogOpen) {
            getAllCustomers().then(setCustomers).catch(console.error);
        }
    }, [billDialogOpen, prescriptionDialogOpen]);

    return (
        <>
            <aside className="hidden md:flex w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex-col gap-8 fixed left-0 top-0 z-50">
                <SidebarNav />
            </aside>

            {/* Global Dialogs - kept here to ensure they are rendered */}
            <CustomerSheet
                open={customerSheetOpen}
                onOpenChange={setCustomerSheetOpen}
            />
            <BillDialog
                open={billDialogOpen}
                onOpenChange={setBillDialogOpen}
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
