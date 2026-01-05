"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "../auth/sign-out-button";

interface MobileNavProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function MobileNav({ user }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-slate-950 border-slate-900 p-0 flex flex-col">
                <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-900/50">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <span className="font-black text-lg leading-none">O</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-white">OptiCRM</h1>
                </div>

                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <SidebarNav onNavigate={() => setOpen(false)} />
                </div>

                <div className="p-4 border-t border-slate-900 bg-slate-950/50 mt-auto">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar className="h-9 w-9 border border-slate-800">
                            {user.image && <AvatarImage src={user.image} alt={user.name} />}
                            <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                                {user.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
