"use client";

import * as React from "react";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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

export function DateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: from ? new Date(from) : subDays(new Date(), 1),
        to: to ? new Date(to) : new Date(),
    });

    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);

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

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal rounded-xl border-slate-200 dark:border-slate-800",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
