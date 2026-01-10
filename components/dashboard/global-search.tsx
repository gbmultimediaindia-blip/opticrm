"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, User, Box, FileText, Command } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { globalSearch, SearchResult } from "@/actions/search";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isMac, setIsMac] = useState(true);

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    // Toggle search with Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSearch = useCallback(async (val: string) => {
        setQuery(val);
        if (val.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const data = await globalSearch(val);
            setResults(data);
            setSelectedIndex(0);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) handleSearch(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    const onSelect = (result: SearchResult) => {
        router.push(result.href);
        setOpen(false);
        setQuery("");
        setResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter" && results[selectedIndex]) {
            onSelect(results[selectedIndex]);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all text-slate-500 hover:text-indigo-600 group lg:w-64"
            >
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold hidden lg:inline-block">Search store...</span>
                </div>
                <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100 ml-2">
                    <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={(v) => {
                setOpen(v);
                if (!v) {
                    setQuery("");
                    setResults([]);
                }
            }}>
                <DialogContent showCloseButton={false} className="max-w-3xl p-0 gap-0 border-none bg-transparent shadow-none top-[15%] translate-y-0">
                    <DialogTitle className="sr-only">Quick Search</DialogTitle>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4">
                            <Search className="w-5 h-5 text-slate-400 shrink-0" />
                            <Input
                                autoFocus
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search customers, products, or invoices..."
                                className="h-12 border-none bg-transparent focus-visible:ring-0 text-base font-medium placeholder:text-slate-400"
                            />
                            {loading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin mr-2" />}
                            <div className="flex items-center gap-2">
                                <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">ESC</kbd>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                            {query.length < 2 ? (
                                <div className="p-8 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto">
                                        <Command className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Quick Access</p>
                                        <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                                            Search for customers, products, and invoices across your entire store instantly.
                                        </p>
                                    </div>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result, index) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => onSelect(result)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-150",
                                                selectedIndex === index
                                                    ? "bg-indigo-50 dark:bg-indigo-900/20 shadow-sm"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300",
                                                selectedIndex === index ? "scale-105" : "",
                                                result.type === "customer" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                                                    result.type === "product" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                                                        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                                            )}>
                                                {result.type === "customer" && <User className="w-5 h-5" />}
                                                {result.type === "product" && <Box className="w-5 h-5" />}
                                                {result.type === "invoice" && <FileText className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={cn(
                                                        "text-sm font-bold truncate transition-colors",
                                                        selectedIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"
                                                    )}>
                                                        {result.title}
                                                    </p>
                                                    {selectedIndex === index && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">Select ↵</span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{result.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : !loading && query.length >= 2 ? (
                                <div className="p-12 text-center">
                                    <p className="text-sm font-bold text-slate-500">No results found for "{query}"</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">Try searching for something else</p>
                                </div>
                            ) : null}
                        </div>

                        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                    <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-[10px]">↑↓</kbd>
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                    <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-[10px]">↵</kbd>
                                    Select
                                </span>
                            </div>
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Global Store Search</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
