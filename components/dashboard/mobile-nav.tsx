"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { useState } from "react";

export function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-slate-900 border-slate-800 p-6">
                <div className="flex flex-col h-full">
                    {/* Header in mobile menu if needed, or just nav */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center border border-slate-700">
                            <span className="font-bold text-lg">O</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">OptiCRM</span>
                    </div>

                    <SidebarNav onNavigate={() => setOpen(false)} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
