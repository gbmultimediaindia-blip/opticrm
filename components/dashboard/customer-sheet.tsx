"use client";

import { useState, useEffect, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer, updateCustomer } from "@/actions/customer";
import { User, X, UserPlus, Edit2, Eye, Info, Calendar as CalendarIcon, Users as UsersIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Prescription {
    rightSphere: string;
    rightCylinder: string;
    rightAxis: string;
    rightAdd: string;
    leftSphere: string;
    leftCylinder: string;
    leftAxis: string;
    leftAdd: string;
    pd: string;
    notes: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    dateOfBirth: Date | undefined;
    prescription: Prescription;
}

interface CustomerSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer?: any;
}

const initialPrescription: Prescription = {
    rightSphere: "",
    rightCylinder: "",
    rightAxis: "",
    rightAdd: "",
    leftSphere: "",
    leftCylinder: "",
    leftAxis: "",
    leftAdd: "",
    pd: "",
    notes: ""
};

const initialFormData: FormData = {
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: undefined,
    prescription: initialPrescription
};

export function CustomerSheet({ open, onOpenChange, customer }: CustomerSheetProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [dobInput, setDobInput] = useState("");

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || "",
                email: customer.email || "",
                phone: customer.phone || "",
                address: customer.address || "",
                gender: customer.gender || "",
                dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : undefined,
                prescription: initialPrescription
            });
        } else {
            setFormData(initialFormData);
        }
    }, [customer, open]);

    // Initial load: sync dobInput if customer has a birth date
    useEffect(() => {
        if (customer?.dateOfBirth) {
            setDobInput(format(new Date(customer.dateOfBirth), "dd/MM/yyyy"));
        } else {
            setDobInput("");
        }
    }, [customer, open]);

    const handleDobInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

        // Add slashes automatically
        if (value.length > 2 && value.length <= 4) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        } else if (value.length > 4) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
        }

        setDobInput(value);

        // Parse date if complete (DD/MM/YYYY)
        if (value.length === 10) {
            const [day, month, year] = value.split("/").map(Number);
            const date = new Date(year, month - 1, day);
            // Validation: correct month/day mapping and reasonable year
            if (!isNaN(date.getTime()) &&
                date.getMonth() === month - 1 &&
                date.getDate() === day &&
                year > 1900 &&
                year <= new Date().getFullYear()) {
                setFormData(prev => ({ ...prev, dateOfBirth: date }));
            }
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        setFormData(prev => ({ ...prev, dateOfBirth: date }));
        if (date) {
            setDobInput(format(date, "dd/MM/yyyy"));
        } else {
            setDobInput("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submissionData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender || undefined,
            };

            if (customer) {
                const { name, email, phone, address, gender, dateOfBirth } = submissionData;
                await updateCustomer(customer.id, { name, email, phone, address, gender, dateOfBirth });
                toast.success("Customer profile updated");
            } else {
                await createCustomer(submissionData);
                toast.success("New customer registered");
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0 relative">
                    <SheetHeader>
                        <div className="flex items-center gap-4 mt-4 text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                {customer ? <Edit2 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
                                    {customer ? "Edit Profile" : "Add Customer"}
                                </SheetTitle>
                                <SheetDescription className="text-slate-500 text-xs mt-1 pr-12">
                                    {customer ? `Updating information for ${customer.name}` : "Create a customer record."}
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                <form id="customer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Full Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Rahul Sharma"
                                    className="h-11 rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="10-digit mobile"
                                    className="h-11 rounded-xl text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase">Email Address (Optional)</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="customer@example.com"
                                className="h-11 rounded-xl text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase">Address (Optional)</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Local area or full address..."
                                className="h-11 rounded-xl text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Gender (Optional)</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(v) => setFormData({ ...formData, gender: v })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase">Date of Birth (Optional)</Label>
                                <div className="relative group">
                                    <Input
                                        value={dobInput}
                                        onChange={handleDobInputChange}
                                        placeholder="DD/MM/YYYY"
                                        className="h-11 rounded-xl text-sm pl-10 pr-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-indigo-500 transition-all"
                                    />
                                    <CalendarIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />

                                    <div className="absolute right-1 top-1">
                                        <Popover modal={false}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <CalendarIcon className="w-4 h-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl" align="end">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.dateOfBirth}
                                                    onSelect={handleCalendarSelect}
                                                    captionLayout="dropdown"
                                                    fromYear={1920}
                                                    toYear={new Date().getFullYear()}
                                                    initialFocus
                                                    className="rounded-2xl border-none"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!customer && (
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-indigo-400" /> Prescription (Optional)
                            </h3>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-6">
                                <div className="grid grid-cols-2 gap-8 relative">
                                    {/* Right Eye */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">OD (Right)</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <MetricInput label="SPH" placeholder="0.00" value={formData.prescription.rightSphere} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightSphere: v } }))} />
                                            <MetricInput label="CYL" placeholder="0.00" value={formData.prescription.rightCylinder} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightCylinder: v } }))} />
                                            <MetricInput label="Axis" placeholder="0" value={formData.prescription.rightAxis} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightAxis: v } }))} />
                                            <MetricInput label="Add" placeholder="0.00" value={formData.prescription.rightAdd} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightAdd: v } }))} />
                                        </div>
                                    </div>

                                    {/* Left Eye */}
                                    <div className="space-y-3 border-l border-slate-100 dark:border-slate-800 pl-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">OS (Left)</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <MetricInput label="SPH" placeholder="0.00" value={formData.prescription.leftSphere} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftSphere: v } }))} />
                                            <MetricInput label="CYL" placeholder="0.00" value={formData.prescription.leftCylinder} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftCylinder: v } }))} />
                                            <MetricInput label="Axis" placeholder="0" value={formData.prescription.leftAxis} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftAxis: v } }))} />
                                            <MetricInput label="Add" placeholder="0.00" value={formData.prescription.leftAdd} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftAdd: v } }))} />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 shrink-0">
                                            <Label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 whitespace-nowrap">
                                                PD (mm) <Info className="w-2.5 h-2.5" />
                                            </Label>
                                            <Input
                                                placeholder="0.00"
                                                value={formData.prescription.pd}
                                                onChange={(e) => setFormData(p => ({ ...p, prescription: { ...p.prescription, pd: e.target.value } }))}
                                                className="h-9 mt-1 font-mono font-bold text-xs"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label className="text-[9px] font-black text-slate-400 uppercase">Prescription Notes</Label>
                                            <Input
                                                placeholder="e.g. Frame preference..."
                                                value={formData.prescription.notes}
                                                onChange={(e) => setFormData(p => ({ ...p, prescription: { ...p.prescription, notes: e.target.value } }))}
                                                className="h-9 mt-1 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <SheetFooter className="gap-3 sm:flex-row flex-col">
                        <SheetClose asChild>
                            <Button type="button" variant="ghost" className="h-11 px-8 font-semibold text-slate-500">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            form="customer-form"
                            className="h-11 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none sm:flex-1 text-sm"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : customer ? "Save Changes" : "Add Customer"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function MetricInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="space-y-1">
            <Label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 transition-all text-center text-xs"
            />
        </div>
    );
}
