"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Box, Receipt, PlusCircle, UserPlus, ClipboardPlus, Eye, Settings } from "lucide-react";
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
        <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 fixed left-0 top-0 z-50">

            <div className="flex flex-col gap-8 flex-1">
                <nav className="flex flex-col gap-2">
                    {routes.map((route) => {
                        const isActive = route.active(pathname);
                        return (
                            <Link key={route.href} href={route.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 transition-all duration-200 h-10 rounded-md group",
                                        isActive
                                            ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/20 hover:bg-indigo-500"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <route.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-indigo-200 group-hover:text-white" : "text-slate-400 group-hover:text-white")} />
                                    {route.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col gap-2 mt-auto">
                    <Link href="/dashboard/settings">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 transition-all duration-200 h-10 rounded-md group",
                                pathname === "/dashboard/settings"
                                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/20 hover:bg-indigo-500"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <Settings className={cn("w-4 h-4 transition-colors", pathname === "/dashboard/settings" ? "text-indigo-200 group-hover:text-white" : "text-slate-400 group-hover:text-white")} />
                            Settings
                        </Button>
                    </Link>
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
