import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { store as storeTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Box, Receipt } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
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
            {/* Sidebar Placeholder */}
            <div className="flex">
                <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">OptiCRM</div>
                    <nav className="flex flex-col gap-2">
                        <Button variant="secondary" className="justify-start gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2 text-slate-600 dark:text-slate-400">
                            <Receipt className="w-4 h-4" /> Billing
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2 text-slate-600 dark:text-slate-400">
                            <Box className="w-4 h-4" /> Inventory
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2 text-slate-600 dark:text-slate-400">
                            <Users className="w-4 h-4" /> Customers
                        </Button>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                            <p className="text-slate-500">{store.name} — {store.address}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard title="Total Revenue" value="$45,231.89" change="+20.1% from last month" />
                        <StatsCard title="Sales" value="+2,350" change="+180.1% from last month" />
                        <StatsCard title="Customers" value="+12,234" change="+19% from last month" />
                        <StatsCard title="Active Items" value="573" change="+201 since last hour" />
                    </div>

                    <div className="mt-8">
                        <Card className="border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle>Store Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-900 dark:text-slate-200">Email:</span> {store.email}</p>
                                <p className="text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-900 dark:text-slate-200">Phone:</span> {store.phone}</p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}

function StatsCard({ title, value, change }: { title: string; value: string; change: string }) {
    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                <p className="text-xs text-green-600 mt-1 font-medium">{change}</p>
            </CardContent>
        </Card>
    );
}
