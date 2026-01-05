"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarToggle() {
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={toggleSidebar}
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="w-5 h-5" />
                        ) : (
                            <PanelLeftClose className="w-5 h-5" />
                        )}
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 border-slate-800 text-white font-semibold">
                    {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
