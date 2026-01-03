"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Box, Receipt, PlusCircle, UserPlus, ClipboardPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomerSheet } from "./customer-sheet";
import { BillDialog } from "./bill-dialog";
import { PrescriptionDialog } from "./prescription-dialog";
import { useState, useEffect } from "react";
import { getAllCustomers } from "@/actions/customer";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        active: (pathname: string) => pathname === "/dashboard",
    },
    {
        label: "Billing",
        icon: Receipt,
        href: "/dashboard/billing",
        active: (pathname: string) => pathname === "/dashboard/billing",
    },
    {
        label: "Inventory",
        icon: Box,
        href: "/dashboard/inventory",
        active: (pathname: string) => pathname === "/dashboard/inventory",
    },
    {
        label: "Customers",
        icon: Users,
        href: "/dashboard/customers",
        active: (pathname: string) => pathname.startsWith("/dashboard/customers"),
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
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
        <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 fixed left-0 top-0">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">OptiCRM</div>

            <div className="flex flex-col gap-8 flex-1">
                <nav className="flex flex-col gap-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Main Menu</div>
                    {routes.map((route) => {
                        const isActive = route.active(pathname);
                        return (
                            <Link key={route.href} href={route.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 transition-all duration-200 h-11 rounded-xl",
                                        isActive
                                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm shadow-indigo-100/50 dark:shadow-none"
                                            : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                                    )}
                                >
                                    <route.icon className={cn("w-4 h-4", isActive ? "text-indigo-600 dark:text-indigo-400" : "")} />
                                    {route.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col gap-2 mt-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Quick Actions</div>
                    <Button
                        onClick={() => setBillDialogOpen(true)}
                        className="w-full justify-start gap-3 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Generate Bill
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setPrescriptionDialogOpen(true)}
                        className="w-full justify-start gap-3 h-11 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold mb-1"
                    >
                        <ClipboardPlus className="w-4 h-4 text-emerald-500" />
                        Add Prescription
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setCustomerSheetOpen(true)}
                        className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                        <UserPlus className="w-4 h-4 text-indigo-400/70" />
                        Add Customer
                    </Button>
                </div>
            </div>

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
        </aside>
    );
}
