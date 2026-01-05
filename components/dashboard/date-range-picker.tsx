"use client";

import * as React from "react";
import {
    format,
    startOfDay,
    endOfDay,
    subDays,
    startOfMonth,
    endOfMonth,
    subMonths,
    isSameDay,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const presets = [
    {
        label: "Today",
        getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
    },
    {
        label: "Yesterday",
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 1)),
            to: endOfDay(subDays(new Date(), 1)),
        }),
    },
    {
        label: "Last 7 Days",
        getValue: () => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }),
    },
    {
        label: "Last 30 Days",
        getValue: () => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }),
    },
    {
        label: "This Month",
        getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
    },
    {
        label: "Last Month",
        getValue: () => ({
            from: startOfMonth(subMonths(new Date(), 1)),
            to: endOfMonth(subMonths(new Date(), 1)),
        }),
    },
];

export function DateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const from = fromParam ? new Date(fromParam) : subDays(new Date(), 1);
        const to = toParam ? new Date(toParam) : new Date();
        return { from, to };
    });

    const [open, setOpen] = React.useState(false);

    // Sync with URL when params change
    React.useEffect(() => {
        if (fromParam && toParam) {
            setDate({ from: new Date(fromParam), to: new Date(toParam) });
        }
    }, [fromParam, toParam]);

    const updateUrl = (range: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams);
        if (range?.from) {
            params.set("from", range.from.toISOString());
        } else {
            params.delete("from");
        }

        if (range?.to) {
            params.set("to", range.to.toISOString());
        } else {
            params.delete("to");
        }

        router.push(`?${params.toString()}`);
    };

    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);
        // Only update URL if we have a complete range
        if (range?.from && range?.to) {
            updateUrl(range);
            setOpen(false);
        }
    };

    const handlePresetClick = (presetGetValue: () => DateRange) => {
        const range = presetGetValue();
        setDate(range);
        updateUrl(range);
        setOpen(false);
    };

    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-auto p-1 h-auto rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all group",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center gap-1">
                            {/* Start Date Segment */}
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300",
                                open && !date?.to
                                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}>
                                <CalendarIcon className={cn("h-3.5 w-3.5", open && !date?.to ? "text-indigo-500" : "text-slate-400")} />
                                <div className="flex flex-col items-start leading-none text-left">
                                    <span className="text-[9px] font-black uppercase tracking-tight opacity-50 mb-0.5">Start Date</span>
                                    <span className="text-[12px] font-bold">
                                        {date?.from ? format(date.from, "MMM dd") : "Pick Date"}
                                    </span>
                                </div>
                            </div>

                            <div className="w-px h-4 bg-slate-200 dark:border-slate-800" />

                            {/* End Date Segment */}
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300",
                                open && date?.from && !date?.to
                                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}>
                                <div className="flex flex-col items-start leading-none text-left">
                                    <span className="text-[9px] font-black uppercase tracking-tight opacity-50 mb-0.5">End Date</span>
                                    <span className="text-[12px] font-bold">
                                        {date?.to ? format(date.to, "MMM dd") : "Pick Date"}
                                    </span>
                                </div>
                                <ChevronDown className={cn("ml-1 h-3.5 w-3.5 transition-colors", open ? "text-indigo-500" : "text-slate-400")} />
                            </div>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 rounded-xl overflow-hidden shadow-xl border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row"
                    align={isMobile ? "center" : "end"}
                >
                    <div className="border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-900/50 min-w-[140px] flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
                        {presets.map((preset) => {
                            const presetRange = preset.getValue();
                            const isActive = date?.from && date?.to &&
                                isSameDay(date.from, presetRange.from!) &&
                                isSameDay(date.to, presetRange.to!);

                            return (
                                <Button
                                    key={preset.label}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "justify-start font-medium text-xs h-8 px-3 shrink-0 sm:shrink transition-all",
                                        isActive
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                                    )}
                                    onClick={() => handlePresetClick(preset.getValue)}
                                >
                                    {preset.label}
                                </Button>
                            );
                        })}
                    </div>
                    <div className="p-0">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                                [data-slot="calendar"] [data-range-start="true"],
                                [data-slot="calendar"] [data-range-end="true"],
                                [data-slot="calendar"] [data-selected-single="true"] {
                                    background-color: #4f46e5 !important;
                                    color: white !important;
                                    border-radius: 8px !important;
                                }
                                [data-slot="calendar"] [data-range-middle="true"] {
                                    background-color: rgba(79, 70, 229, 0.1) !important;
                                    color: #4f46e5 !important;
                                    border-radius: 8px !important;
                                }
                                .dark [data-slot="calendar"] [data-range-middle="true"] {
                                    background-color: rgba(129, 140, 248, 0.15) !important;
                                    color: #818cf8 !important;
                                    border-radius: 8px !important;
                                }
                            ` }} />
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(range) => {
                                setDate(range);
                                if (range?.from && range?.to) {
                                    updateUrl(range);
                                    setTimeout(() => setOpen(false), 300);
                                }
                            }}
                            numberOfMonths={isMobile ? 1 : 2}
                            className="p-1"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
