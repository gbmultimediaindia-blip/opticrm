import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { store as storeTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Box, Receipt } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

import { getAllStores, getStore } from "@/actions/store";

import { StoreSwitcher } from "@/components/dashboard/store-switcher";

import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const store = await getStore();
    const allStores = await getAllStores();

    if (!store) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex">
                <DashboardSidebar user={session.user} />

                <div className="flex-1 md:ml-64">
                    <header className="h-16 flex justify-between items-center px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <MobileNav user={session.user} />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                                    <span className="font-bold text-lg">O</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">OptiCRM</span>
                            </div>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                            <StoreSwitcher
                                stores={JSON.parse(JSON.stringify(allStores))}
                                activeStore={JSON.parse(JSON.stringify(store))}
                                // Anyone who can access the dashboard can create a store for themselves
                                isAdmin={true}
                            />
                        </div>
                    </header>
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
