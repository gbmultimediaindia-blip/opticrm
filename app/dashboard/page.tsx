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
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
                <p className="text-slate-500">Welcome back, {session.user.name}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Revenue" value="$45,231.89" change="+20.1% from last month" />
                <StatsCard title="Sales" value="+2,350" change="+180.1% from last month" />
                <StatsCard title="Customers" value="+12,234" change="+19% from last month" />
                <StatsCard title="Active Items" value="573" change="+201 since last hour" />
            </div>

            <div className="mt-8">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Store Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Business Name</p>
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{store.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Email Address</p>
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{store.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Contact Number</p>
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{store.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Location</p>
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{store.address}</p>
                        </div>
                    </CardContent>
                </Card>
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
