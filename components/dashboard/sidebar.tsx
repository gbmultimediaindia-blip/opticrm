"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Box, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

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

    return (
        <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 fixed left-0 top-0">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">OptiCRM</div>
            <nav className="flex flex-col gap-2">
                {routes.map((route) => {
                    const isActive = route.active(pathname);
                    return (
                        <Link key={route.href} href={route.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-2 transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                                )}
                            >
                                <route.icon className={cn("w-4 h-4", isActive ? "text-indigo-600 dark:text-indigo-400" : "")} />
                                {route.label}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
