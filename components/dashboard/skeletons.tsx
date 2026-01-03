import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TableSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center h-10">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-10 w-[120px]" />
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex gap-4">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[150px] mb-2" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-6 w-[200px]" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function SettingsSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[350px]" />
            </div>

            <div className="w-full space-y-6">
                <div className="grid w-full grid-cols-2 lg:w-[400px] gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-6">
                    <div className="border rounded-xl p-6 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-[150px]" />
                            <Skeleton className="h-4 w-[300px]" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="pt-4 border-t flex justify-end">
                            <Skeleton className="h-10 w-[120px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
