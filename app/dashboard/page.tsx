import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Box, Banknote, IndianRupee, Truck, Mail, Phone } from "lucide-react";
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
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
        orange: "text-orange-600 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20",
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group overflow-hidden relative">
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] dark:opacity-[0.05] transition-transform group-hover:scale-110", variants[color].split(' ')[1])} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 space-y-0">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {title}
                </CardTitle>
                <div className={cn("p-1.5 rounded-lg border transition-all group-hover:rotate-12 group-hover:scale-110", variants[color])}>
                    <Icon className="w-4 h-4" />
                </div>
            </CardHeader>
            <CardContent className="pb-4 px-4 pt-1">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {value}
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight opacity-70">
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
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        Dashboard Overview
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Hello, {session.user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Here's what's happening with your store today.
                    </p>
                </div>
                <div className="w-full sm:w-auto">
                    <DateRangePicker />
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${parseFloat(stats.totalRevenue).toLocaleString()}`}
                    description={from || to ? "Period Earnings" : "Last 24 Hours"}
                    icon={IndianRupee}
                    color="emerald"
                />
                <StatsCard
                    title="Total Sales"
                    value={stats.totalSales.toString()}
                    description={from || to ? "Period Sales" : "Last 24 Hours"}
                    icon={Banknote}
                    color="blue"
                />
                <StatsCard
                    title="Deliveries"
                    value={stats.pendingDeliveries.toString()}
                    description="Pending Orders"
                    icon={Truck}
                    color="orange"
                />
                <StatsCard
                    title="New Customers"
                    value={stats.totalCustomers.toString()}
                    description={from || to ? "New Leads" : "Last 24 Hours"}
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Inventory"
                    value={stats.totalProducts.toString()}
                    description="Items Added"
                    icon={Box}
                    color="purple"
                />
            </div>

            <div className="mt-8">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden rounded-lg">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-4 px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-black tracking-tight">Store Profile</CardTitle>
                            <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active</div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-6 p-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Box className="w-3 h-3" /> Business Name
                            </p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{store.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Mail className="w-3 h-3" /> Email Address
                            </p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{store.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Phone className="w-3 h-3" /> Contact Number
                            </p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{store.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <IndianRupee className="w-3 h-3" /> GST Number
                            </p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{store.gstNumber || "Not Provided"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Truck className="w-3 h-3" /> Location
                            </p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">{store.address}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
