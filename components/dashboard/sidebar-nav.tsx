"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Box, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

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
    forceFull?: boolean;
}

export function SidebarNav({ onNavigate, forceFull }: SidebarNavProps) {
    const pathname = usePathname();
    const { isCollapsed: contextCollapsed } = useSidebar();
    const isCollapsed = forceFull ? false : contextCollapsed;
    const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-col h-full" onMouseLeave={() => setHoveredRoute(null)}>
                <nav className="flex-1 space-y-1.5 px-2">
                    {routes.map((route) => {
                        const isActive = route.active(pathname);
                        const isHovered = hoveredRoute === route.href;

                        const content = (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={onNavigate}
                                onMouseEnter={() => setHoveredRoute(route.href)}
                                className="block relative h-11 no-underline outline-none group"
                            >
                                <div className="absolute inset-x-0 h-full flex items-center">
                                    {/* Glass Hover Highlight */}
                                    <AnimatePresence>
                                        {isHovered && !isActive && (
                                            <motion.div
                                                layoutId="hover-capsule"
                                                className="absolute inset-x-0 inset-y-[2px] bg-white/[0.03] border border-white/[0.05] rounded-lg z-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Dynamic Active Pill */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-x-0 inset-y-[2px] bg-indigo-500/10 border border-indigo-500/20 rounded-lg z-0 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30
                                            }}
                                        />
                                    )}


                                    <div className={cn(
                                        "relative z-10 flex items-center w-full transition-all duration-300",
                                        isCollapsed ? "justify-center" : "gap-3 px-3",
                                        isActive ? "text-indigo-400" : isHovered ? "text-slate-100" : "text-slate-400"
                                    )}>
                                        <route.icon className={cn(
                                            "w-5 h-5 shrink-0 transition-transform duration-300",
                                            isActive ? "scale-100" : isHovered ? "scale-110" : "scale-100"
                                        )} />

                                        {!isCollapsed && (
                                            <span className="text-sm font-semibold tracking-wide truncate">
                                                {route.label}
                                            </span>
                                        )}

                                        {isActive && !isCollapsed && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip key={route.href}>
                                    <TooltipTrigger asChild>
                                        {content}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white font-semibold">
                                        {route.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return content;
                    })}
                </nav>

                <div className="mt-auto py-4 px-2">
                    {!isCollapsed && (
                        <div className="px-4 mb-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                        </div>
                    )}
                    {(() => {
                        const isActive = pathname === "/dashboard/settings";
                        const isHovered = hoveredRoute === "/dashboard/settings";
                        const settingsContent = (
                            <Link
                                href="/dashboard/settings"
                                onClick={onNavigate}
                                onMouseEnter={() => setHoveredRoute("/dashboard/settings")}
                                className="block relative h-11 no-underline outline-none group"
                            >
                                <div className="absolute inset-x-0 h-full flex items-center">
                                    <AnimatePresence>
                                        {isHovered && !isActive && (
                                            <motion.div
                                                layoutId="hover-capsule"
                                                className="absolute inset-x-0 inset-y-[2px] bg-white/[0.03] border border-white/[0.05] rounded-lg z-0"
                                                transition={{ duration: 0.15 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-x-0 inset-y-[2px] bg-indigo-500/10 border border-indigo-500/20 rounded-lg z-0"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}


                                    <div className={cn(
                                        "relative z-10 flex items-center w-full transition-all duration-300",
                                        isCollapsed ? "justify-center" : "gap-3 px-3",
                                        isActive ? "text-indigo-400" : isHovered ? "text-slate-100" : "text-slate-400"
                                    )}>
                                        <Settings className={cn(
                                            "w-5 h-5 shrink-0 transition-all duration-300",
                                            isActive ? "text-indigo-400 rotate-0" : isHovered ? "text-slate-100 rotate-45" : "text-slate-400 rotate-0"
                                        )} />

                                        {!isCollapsed && (
                                            <span className="text-sm font-semibold tracking-wide truncate">
                                                Settings
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {settingsContent}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white font-semibold">
                                        Settings
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return settingsContent;
                    })()}
                </div>
            </div>
        </TooltipProvider>
    );
}
