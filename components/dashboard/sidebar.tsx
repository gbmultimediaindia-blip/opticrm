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
    store: any;
}

import { useSidebar } from "./sidebar-context";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardSidebar({ user, store }: DashboardSidebarProps) {
    const { isCollapsed } = useSidebar();
    const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        if (invoiceDialogOpen || prescriptionDialogOpen) {
            getAllCustomers().then(setCustomers).catch(console.error);
        }
    }, [invoiceDialogOpen, prescriptionDialogOpen]);

    if (!user) return null;

    return (
        <TooltipProvider delayDuration={0}>
            <>
                <aside
                    className={cn(
                        "hidden md:flex min-h-screen bg-slate-950 border-r border-slate-900 flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out",
                        isCollapsed ? "w-20" : "w-64"
                    )}
                >
                    <div className={cn(
                        "p-6 flex-1 overflow-y-auto custom-scrollbar transition-all duration-300",
                        isCollapsed ? "px-4" : "p-6"
                    )}>
                        <SidebarNav />
                    </div>

                    <div className="p-4 border-t border-slate-900 bg-slate-950/50">
                        <div className={cn(
                            "flex items-center transition-all duration-300",
                            isCollapsed ? "flex-col gap-4 justify-center" : "gap-3 px-2 py-2"
                        )}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Avatar className="h-9 w-9 border border-slate-800 shrink-0">
                                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                                        <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                                            {user.name?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                {isCollapsed && (
                                    <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white font-semibold">
                                        <p>{user.name}</p>
                                        <p className="text-xs text-slate-500 font-normal">{user.email}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>

                            {!isCollapsed ? (
                                <>
                                    <div className="flex-1 min-w-0 transition-all duration-300">
                                        <p className="text-sm font-semibold text-slate-200 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <SignOutButton />
                                </>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SignOutButton />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white font-semibold">
                                        Log out
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Global Dialogs - kept here to ensure they are rendered */}
                <CustomerSheet
                    open={customerSheetOpen}
                    onOpenChange={setCustomerSheetOpen}
                    store={store}
                />
                <InvoiceDialog
                    open={invoiceDialogOpen}
                    onOpenChange={setInvoiceDialogOpen}
                    customers={customers}
                    store={store}
                />
                <PrescriptionDialog
                    open={prescriptionDialogOpen}
                    onOpenChange={setPrescriptionDialogOpen}
                    customers={customers}
                    store={store}
                />
            </>
        </TooltipProvider>
    );
}
