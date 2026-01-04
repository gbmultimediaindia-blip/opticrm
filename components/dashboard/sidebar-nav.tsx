"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Box, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        active: (pathname: string) => pathname === "/dashboard",
    },
    {
        label: "Invoices",
        icon: FileText,
        href: "/dashboard/invoices",
        active: (pathname: string) => pathname === "/dashboard/invoices",
    },
    {
        label: "Products",
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

interface SidebarNavProps {
    onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <nav className="space-y-1.5">
                {routes.map((route) => {
                    const isActive = route.active(pathname);
                    return (
                        <Link key={route.href} href={route.href} onClick={onNavigate} className="block group">
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-indigo-500/15 to-indigo-500/5 text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.2)]"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                                )}
                            >
                                {/* Active Indicator */}
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                                )} />

                                <route.icon className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    isActive ? "text-indigo-400 scale-100" : "text-slate-500 group-hover:scale-110 group-hover:text-slate-300"
                                )} />

                                <span className={cn(
                                    "text-sm font-semibold tracking-wide transition-all",
                                    isActive ? "translate-x-0" : "-translate-x-1 group-hover:translate-x-0"
                                )}>
                                    {route.label}
                                </span>

                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-8">
                <div className="px-4 mb-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                </div>
                <Link href="/dashboard/settings" onClick={onNavigate} className="block group">
                    <div
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-300 relative overflow-hidden",
                            pathname === "/dashboard/settings"
                                ? "bg-gradient-to-r from-indigo-500/15 to-indigo-500/5 text-white shadow-[0_4px_20px_-4px_rgba(99,102,241,0.2)]"
                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                        )}
                    >
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transition-all duration-300",
                            pathname === "/dashboard/settings" ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                        )} />

                        <Settings className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            pathname === "/dashboard/settings" ? "text-indigo-400 scale-100" : "text-slate-500 group-hover:scale-110 group-hover:text-slate-300"
                        )} />

                        <span className={cn(
                            "text-sm font-semibold tracking-wide transition-all",
                            pathname === "/dashboard/settings" ? "translate-x-0" : "-translate-x-1 group-hover:translate-x-0"
                        )}>
                            Settings
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
