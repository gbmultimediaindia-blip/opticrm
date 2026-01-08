"use client";

import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { StoreSwitcher } from "./store-switcher";
import { SidebarToggle } from "./sidebar-toggle";
import { GlobalSearch } from "./global-search";

interface DashboardLayoutContentProps {
    children: React.ReactNode;
    user: any;
    store: any;
    allStores: any[];
}

export function DashboardLayoutContent({
    children,
    user,
    store,
    allStores,
}: DashboardLayoutContentProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex">
            <DashboardSidebar user={user} store={store} />

            <div
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:ml-20" : "md:ml-64"
                )}
            >
                <header className="h-16 flex justify-between items-center px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <MobileNav user={user} />
                        <SidebarToggle />
                        <div className="flex items-center gap-2 ml-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <span className="font-black text-lg leading-none">O</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">OptiCRM</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                        <StoreSwitcher
                            stores={allStores}
                            activeStore={store}
                            isAdmin={true}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <GlobalSearch />
                    </div>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
