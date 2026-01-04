import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Box, Banknote, IndianRupee, Truck } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { format, startOfDay, endOfDay, subDays } from "date-fns";

import { getStore } from "@/actions/store";
import { getDashboardStats } from "@/actions/dashboard";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    color: "emerald" | "blue" | "orange" | "purple";
}

function StatsCard({ title, value, description, icon: Icon, color }: StatsCardProps) {
    const variants = {
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
        orange: "text-orange-600 bg-orange-50 dark:bg-orange-500/10",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-3 px-4 space-y-0">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg transition-colors", variants[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardHeader>
            <CardContent className="pb-3 px-4 pt-0">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string }>;
}) {
    const { from, to } = await searchParams;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const startDate = from ? new Date(from) : subDays(new Date(), 1);
    const endDate = to ? new Date(to) : new Date();

    const store = await getStore();
    const stats = await getDashboardStats(startDate, endDate);

    if (!store) {
        redirect("/onboarding");
    }

    return (
        <div className="space-y-6 p-4 lg:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Overview
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Welcome back, <span className="text-slate-900 dark:text-slate-100 font-semibold">{session.user.name}</span>
                    </p>
                </div>
                <DateRangePicker />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${parseFloat(stats.totalRevenue).toLocaleString()}`}
                    description={from || to ? "Earnings for selected period" : "Last 24 Hours"}
                    icon={IndianRupee}
                    color="emerald"
                />
                <StatsCard
                    title="Total Sales"
                    value={stats.totalSales.toString()}
                    description={from || to ? "Sales for selected period" : "Last 24 Hours"}
                    icon={Banknote}
                    color="blue"
                />
                <StatsCard
                    title="To Be Delivered"
                    value={stats.pendingDeliveries.toString()}
                    description="Orders awaiting delivery"
                    icon={Truck}
                    color="orange"
                />
                <StatsCard
                    title="New Customers"
                    value={stats.totalCustomers.toString()}
                    description={from || to ? "Acquired in selected period" : "Last 24 Hours"}
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Inventory Added"
                    value={stats.totalProducts.toString()}
                    description={from || to ? "Added in selected period" : "Last 24 Hours"}
                    icon={Box}
                    color="purple"
                />
            </div>

            <div className="mt-8">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-3 px-6">
                        <CardTitle className="text-lg font-bold">Store Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Name</p>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{store.name}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{store.email}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</p>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{store.phone}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GST Number</p>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{store.gstNumber || "Not Provided"}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{store.address}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
