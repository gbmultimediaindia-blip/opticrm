"use client";

import { cn } from "@/lib/utils";
import { CustomerSheet } from "./customer-sheet";
import { InvoiceDialog } from "./invoice-dialog";
import { PrescriptionDialog } from "./prescription-dialog";
import { useState, useEffect } from "react";
import { getAllCustomers } from "@/actions/customer";
import { SidebarNav } from "./sidebar-nav";

import { SignOutButton } from "../auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardSidebarProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
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

                <div className="p-4 border-t border-slate-900 bg-slate-950/50">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar className="h-9 w-9 border border-slate-800">
                            {user.image && <AvatarImage src={user.image} alt={user.name} />}
                            <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                                {user.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <SignOutButton />
                    </div>
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
