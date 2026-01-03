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

    const store = await db.query.store.findFirst({
        where: eq(storeTable.ownerId, session.user.id),
    });

    if (!store) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex">
                <DashboardSidebar />

                <div className="flex-1 ml-64">
                    <header className="h-16 flex justify-between items-center px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                        <div>
                            <h2 className="text-sm font-medium text-slate-500">{store.name}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{session.user.name}</p>
                                <p className="text-xs text-slate-500">{session.user.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                {session.user.name?.[0]}
                            </div>
                            <SignOutButton />
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
