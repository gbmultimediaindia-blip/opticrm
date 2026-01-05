import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAllStores, getStore } from "@/actions/store";

import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { DashboardLayoutContent } from "@/components/dashboard/dashboard-layout-content";

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
        <SidebarProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <DashboardLayoutContent
                    user={session.user}
                    store={JSON.parse(JSON.stringify(store))}
                    allStores={JSON.parse(JSON.stringify(allStores))}
                >
                    {children}
                </DashboardLayoutContent>
            </div>
        </SidebarProvider>
    );
}
