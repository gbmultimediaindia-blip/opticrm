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
            <SheetContent side="left" className="w-[300px] bg-slate-950 border-slate-900 p-0">
                <div className="flex flex-col h-full">
                    <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-900/50 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <span className="font-black text-lg leading-none">O</span>
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-white">OptiCRM</h1>
                    </div>

                    <div className="flex-1 px-4 overflow-y-auto">
                        <SidebarNav onNavigate={() => setOpen(false)} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
