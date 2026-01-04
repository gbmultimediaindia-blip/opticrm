"use client";

import { format } from "date-fns";
import { invoice, customer, store } from "@/db/schema";
import { IndianRupee } from "lucide-react";

interface InvoicePrintProps {
    invoice: any; // Using any for composite type from query
    store: any;
}

export function InvoicePrint({ invoice, store }: InvoicePrintProps) {
    if (!invoice || !store) return null;

    return (
        <div className="bg-white p-8 max-w-[800px] mx-auto min-h-screen font-sans text-slate-900 print:p-0 print:max-w-full">
            {/* Header / Brand */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">{store.name}</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 max-w-[300px]">{store.address}</p>
                    <div className="mt-4 flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            PHONE: <span className="font-medium text-slate-600 font-mono tracking-tight">{store.phone}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            EMAIL: <span className="font-medium text-slate-600">{store.email}</span>
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-5xl font-black text-slate-200 uppercase tracking-widest -mt-2">INVOICE</h2>
                    <div className="mt-6 flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-900">
                            INVOICE NO: <span className="font-mono font-bold text-slate-600 tracking-tight ml-2">#{invoice.id.substring(0, 8).toUpperCase()}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                            DATE: <span className="font-medium text-slate-600 ml-2">{format(new Date(invoice.createdAt), "dd MMM yyyy, h:mm a")}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Invoice To */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">INVOICE TO</h4>
                    <div className="space-y-1">
                        <div className="text-lg font-bold text-slate-900 uppercase tracking-tight">{invoice.customer.name}</div>
                        <div className="text-sm font-medium text-slate-600">{invoice.customer.phone}</div>
                        {invoice.customer.address && (
                            <div className="text-xs text-slate-500 max-w-[250px] leading-relaxed mt-2">{invoice.customer.address}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-y border-slate-200">
                            <th className="py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 w-12">#</th>
                            <th className="py-4 font-black text-[10px] uppercase tracking-widest text-slate-400">DESCRIPTION</th>
                            <th className="py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-100">
                            <td className="py-6 font-mono text-xs text-slate-400 align-top">01.</td>
                            <td className="py-6">
                                <div className="font-bold text-slate-900 text-sm">Optical Services & Products</div>
                                {invoice.notes && (
                                    <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        Notes: {invoice.notes}
                                    </p>
                                )}
                            </td>
                            <td className="py-6 text-right align-top font-mono font-bold text-slate-900">
                                ₹{invoice.totalAmount}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end pt-8">
                <div className="w-72 space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-2">
                        <span>Subtotal</span>
                        <span className="font-mono text-slate-900 font-bold tracking-tight">₹{invoice.subtotal || invoice.totalAmount}</span>
                    </div>

                    {invoice.taxType && invoice.taxType !== "none" && (
                        <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-2">
                            <span>Tax ({invoice.taxRate}% {invoice.taxType === "included" ? "Incl." : "Excl."})</span>
                            <span className="font-mono text-slate-900 font-bold tracking-tight">₹{invoice.taxAmount}</span>
                        </div>
                    )}

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                    <div className="flex justify-between items-center text-sm font-medium text-slate-900 px-2">
                        <span className="font-black uppercase text-[10px] tracking-widest">Total Amount</span>
                        <span className="font-mono text-slate-900 font-black tracking-tight text-lg">₹{invoice.totalAmount}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium text-emerald-600 px-2">
                        <span className="font-black uppercase text-[10px] tracking-widest">Paid Amount</span>
                        <span className="font-mono font-bold tracking-tight">₹{invoice.advanceAmount}</span>
                    </div>

                    <div className="h-px bg-slate-200 my-4" />
                    <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl shadow-lg shadow-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Balance Due</span>
                        <span className="text-xl font-mono font-black tracking-tight underline underline-offset-4">₹{invoice.dueAmount}</span>
                    </div>
                </div>
            </div>

            {/* Terms / Signature */}
            <div className="mt-24 pt-12 border-t border-slate-100 grid grid-cols-2 gap-8 items-end">
                <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Digital Auth Code</h5>
                    <div className="h-10 w-48 bg-slate-50 rounded border border-slate-100 font-mono text-[10px] text-slate-300 flex items-center justify-center tracking-[0.3em]">
                        {invoice.id.toUpperCase()}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[250px]">
                        This is a computer generated invoice. No physical signature required. Standard warranty applies to all frames and lenses.
                    </p>
                </div>
                <div className="text-right">
                    <div className="inline-block text-center border-t-2 border-slate-900 pt-3 w-48">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Authorized Signatory</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">FOR {store.name}</p>
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <div className="mt-12 text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-40">
                Generated via OptiCRM — Premium Practice Management
            </div>
        </div>
    );
}
