"use client";

import { useState } from "react";
import { ChevronsUpDown, Check, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateStoreDialog } from "./create-store-dialog";
import { switchStore } from "@/actions/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StoreSwitcherProps {
    stores: any[];
    activeStore: any;
    isAdmin?: boolean;
}

export function StoreSwitcher({ stores, activeStore, isAdmin }: StoreSwitcherProps) {
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const onStoreSelect = async (store: any) => {
        if (store.id === activeStore.id) return;
        setOpen(false);
        try {
            await switchStore(store.id);
            toast.success(`Switched to ${store.name}`);
            // router.refresh(); // switchStore already revalidates, but a refresh ensures client state sync
        } catch (error) {
            toast.error("Failed to switch store");
        }
    };

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center justify-between w-[200px] px-3 py-2 text-sm transition-colors bg-transparent border rounded-md outline-none border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <StoreIcon className="w-4 h-4 text-slate-500" />
                            <span className="font-medium truncate text-slate-700 dark:text-slate-200">{activeStore?.name || "Select Store"}</span>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 text-slate-500 opacity-50 shrink-0" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[220px] p-1" side="right" align="start">
                    <DropdownMenuLabel className="text-xs font-medium text-slate-500 px-2 py-1.5">Stores</DropdownMenuLabel>
                    {stores.map((store) => (
                        <DropdownMenuItem
                            key={store.id}
                            onClick={() => onStoreSelect(store)}
                            className="gap-2 px-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900"
                        >
                            <StoreIcon className={cn("w-4 h-4", activeStore?.id === store.id ? "text-indigo-600" : "text-slate-400")} />
                            <span className={cn("truncate flex-1 text-sm", activeStore?.id === store.id ? "font-semibold text-indigo-600 dark:text-indigo-400" : "font-medium text-slate-700 dark:text-slate-300")}>
                                {store.name}
                            </span>
                            {activeStore?.id === store.id && <Check className="ml-auto w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </DropdownMenuItem>
                    ))}
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
                            <DropdownMenuItem
                                className="gap-2 px-2 py-2 cursor-pointer text-indigo-600 dark:text-indigo-400 focus:bg-indigo-50 dark:focus:bg-indigo-900/10"
                                onClick={() => setDialogOpen(true)}
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span className="font-medium text-sm">Create Store</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateStoreDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    );
}
