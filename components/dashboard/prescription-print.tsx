"use client";

import { format } from "date-fns";
import { Eye, Ruler, Info, Phone, Mail } from "lucide-react";

interface PrescriptionPrintProps {
    prescription: any;
    store: any;
}

export function PrescriptionPrint({ prescription, store }: PrescriptionPrintProps) {
    if (!prescription || !store) return null;

    const customer = prescription.customer;

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
                    <h2 className="text-5xl font-black text-slate-200 uppercase tracking-widest -mt-2">Rx</h2>
                    <div className="mt-6 flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-900">
                            RX ID: <span className="font-mono font-bold text-slate-600 tracking-tight ml-2">#{prescription.id.substring(0, 8).toUpperCase()}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                            DATE: <span className="font-medium text-slate-600 ml-2">{format(new Date(prescription.createdAt), "dd MMM yyyy, h:mm a")}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">PRESCRIBED FOR</h4>
                    <div className="space-y-1">
                        <div className="text-lg font-bold text-slate-900 uppercase tracking-tight">{customer.name}</div>
                        <div className="text-sm font-medium text-slate-600">{customer.phone}</div>
                        {customer.email && (
                            <div className="text-xs font-medium text-slate-500">{customer.email}</div>
                        )}
                        {customer.address && (
                            <div className="text-xs text-slate-500 max-w-[250px] leading-relaxed mt-2">{customer.address}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Prescription Details Table */}
            <div className="mb-12 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-center">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 text-left border-r border-slate-200 w-32">Eye</th>
                            <th className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-200">Sphere (SPH)</th>
                            <th className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-200">Cylinder (CYL)</th>
                            <th className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-200">Axis</th>
                            <th className="py-4 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Add</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="py-6 px-4 text-left font-bold text-slate-900 border-r border-slate-100 bg-slate-50/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                    RIGHT (OD)
                                </div>
                            </td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900 border-r border-slate-100">{prescription.rightSphere}</td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900 border-r border-slate-100">{prescription.rightCylinder}</td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900 border-r border-slate-100">{prescription.rightAxis}</td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900">{prescription.rightAdd}</td>
                        </tr>
                        <tr>
                            <td className="py-6 px-4 text-left font-bold text-slate-900 border-r border-slate-100 bg-slate-50/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                    LEFT (OS)
                                </div>
                            </td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900 border-r border-slate-100">{prescription.leftSphere}</td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900 border-r border-slate-100">{prescription.leftCylinder}</td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900 border-r border-slate-100">{prescription.leftAxis}</td>
                            <td className="py-6 px-4 font-mono font-bold text-lg text-slate-900">{prescription.leftAdd}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Ruler className="w-4 h-4 text-slate-400" />
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pupillary Distance (PD)</h5>
                    </div>
                    <p className="text-2xl font-mono font-black text-slate-900 tracking-tight">{prescription.pd} <span className="text-sm font-bold text-slate-400">mm</span></p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-slate-400" />
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Notes</h5>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                        {prescription.notes || "No additional notes."}
                    </p>
                </div>
            </div>

            {/* Terms / Signature */}
            <div className="mt-auto pt-12 border-t border-slate-100 grid grid-cols-2 gap-8 items-end">
                <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Digital Auth Code</h5>
                    <div className="h-10 w-48 bg-slate-50 rounded border border-slate-100 font-mono text-[10px] text-slate-300 flex items-center justify-center tracking-[0.3em]">
                        {prescription.id.toUpperCase().substring(0, 16)}...
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[250px]">
                        This is a valid optical prescription generated digitally. Please verify details before dispensing.
                    </p>
                </div>
                <div className="text-right">
                    <div className="inline-block text-center border-t-2 border-slate-900 pt-3 w-48">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Optometrist / Signatory</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">FOR {store.name}</p>
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <div className="mt-12 text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-40">
                Prescription Generated via OptiCRM
            </div>
        </div>
    );
}
