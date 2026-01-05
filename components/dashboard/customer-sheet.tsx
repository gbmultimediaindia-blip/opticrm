"use client";

import { useState, useEffect, FormEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { deletePrescription, createCustomer, updateCustomer } from "@/actions/customer";
import { User, X, UserPlus, Edit2, Calendar as CalendarIcon, ClipboardList, AlertTriangle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Prescription {
    id?: string;
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
    onSuccess?: (customer: any) => void;
}

export function CustomerSheet({ open, onOpenChange, customer, onSuccess }: CustomerSheetProps) {
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dobInput, setDobInput] = useState("");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        dateOfBirth: undefined,
        prescription: {
            rightSphere: "",
            rightCylinder: "",
            rightAxis: "",
            rightAdd: "",
            leftSphere: "",
            leftCylinder: "",
            leftAxis: "",
            leftAdd: "",
            pd: "",
            notes: "",
        },
    });

    const prescriptionExists = !!(
        formData.prescription.rightSphere ||
        formData.prescription.rightCylinder ||
        formData.prescription.leftSphere ||
        formData.prescription.leftCylinder
    );

    useEffect(() => {
        if (open) {
            if (customer) {
                const latestPrescription = customer.prescription || (customer.prescriptions && customer.prescriptions[0]);
                setFormData({
                    name: customer.name || "",
                    email: customer.email || "",
                    phone: customer.phone || "",
                    address: customer.address || "",
                    gender: customer.gender || "",
                    dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : undefined,
                    prescription: {
                        id: latestPrescription?.id,
                        rightSphere: latestPrescription?.rightSphere || "",
                        rightCylinder: latestPrescription?.rightCylinder || "",
                        rightAxis: latestPrescription?.rightAxis || "",
                        rightAdd: latestPrescription?.rightAdd || "",
                        leftSphere: latestPrescription?.leftSphere || "",
                        leftCylinder: latestPrescription?.leftCylinder || "",
                        leftAxis: latestPrescription?.leftAxis || "",
                        leftAdd: latestPrescription?.leftAdd || "",
                        pd: latestPrescription?.pd || "",
                        notes: latestPrescription?.notes || "",
                    },
                });
                setDobInput(customer.dateOfBirth ? format(new Date(customer.dateOfBirth), "dd/MM/yyyy") : "");
            } else {
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    gender: "",
                    dateOfBirth: undefined,
                    prescription: {
                        rightSphere: "",
                        rightCylinder: "",
                        rightAxis: "",
                        rightAdd: "",
                        leftSphere: "",
                        leftCylinder: "",
                        leftAxis: "",
                        leftAdd: "",
                        pd: "",
                        notes: "",
                    },
                });
                setDobInput("");
            }
        }
    }, [open, customer]);

    const handleDobInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDobInput(value);
        if (value.length === 10) {
            const parts = value.split("/");
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime())) {
                    setFormData(prev => ({ ...prev, dateOfBirth: date }));
                }
            }
        } else if (value === "") {
            setFormData(prev => ({ ...prev, dateOfBirth: undefined }));
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        setFormData(prev => ({ ...prev, dateOfBirth: date }));
        setDobInput(date ? format(date, "dd/MM/yyyy") : "");
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
                await updateCustomer(customer.id, submissionData);
                toast.success("Customer profile updated");
                if (onSuccess) onSuccess(customer);
            } else {
                const newCustomer = await createCustomer(submissionData);
                toast.success("New customer registered");
                if (onSuccess) onSuccess(newCustomer);
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    const handleDeletePrescription = () => {
        if (!formData.prescription.id) return;
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!formData.prescription.id) return;

        setLoading(true);
        try {
            await deletePrescription(formData.prescription.id);
            setFormData(prev => ({
                ...prev,
                prescription: {
                    id: undefined,
                    rightSphere: "",
                    rightCylinder: "",
                    rightAxis: "",
                    rightAdd: "",
                    leftSphere: "",
                    leftCylinder: "",
                    leftAxis: "",
                    leftAdd: "",
                    pd: "",
                    notes: "",
                }
            }));
            toast.success("Prescription deleted successfully");
            setShowDeleteConfirm(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete prescription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-xl border-l border-slate-200 dark:border-slate-800 p-0 flex flex-col overflow-hidden [&_[data-slot=sheet-close]]:hidden">
                    <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
                                {customer ? <User className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            </div>
                            <div className="space-y-0.5">
                                <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                                    {customer ? "Edit Customer" : "Add Customer"}
                                </SheetTitle>
                                <SheetDescription className="text-xs text-slate-500 font-medium">
                                    {customer ? `Updating information for ${customer.name}` : "Register a new customer."}
                                </SheetDescription>
                            </div>
                        </div>
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
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500">
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

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ClipboardList className="w-3.5 h-3.5 text-indigo-400" /> Prescription (Optional)
                                </h3>
                                {formData.prescription.id && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 font-bold"
                                        disabled={loading}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span className="text-[10px] uppercase tracking-wider">Delete Record</span>
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    {/* Right Eye */}
                                    <div className="bg-white dark:bg-slate-950 p-5 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Right Eye (OD)</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <MetricInput label="SPH" placeholder="0.00" value={formData.prescription.rightSphere} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightSphere: v } }))} />
                                            <MetricInput label="CYL" placeholder="0.00" value={formData.prescription.rightCylinder} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightCylinder: v } }))} />
                                            <MetricInput label="Axis" placeholder="0" value={formData.prescription.rightAxis} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightAxis: v } }))} />
                                            <MetricInput label="Add" placeholder="0.00" value={formData.prescription.rightAdd} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, rightAdd: v } }))} />
                                        </div>
                                    </div>

                                    {/* Left Eye */}
                                    <div className="bg-white dark:bg-slate-950 p-5 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Left Eye (OS)</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <MetricInput label="SPH" placeholder="0.00" value={formData.prescription.leftSphere} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftSphere: v } }))} />
                                            <MetricInput label="CYL" placeholder="0.00" value={formData.prescription.leftCylinder} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftCylinder: v } }))} />
                                            <MetricInput label="Axis" placeholder="0" value={formData.prescription.leftAxis} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftAxis: v } }))} />
                                            <MetricInput label="Add" placeholder="0.00" value={formData.prescription.leftAdd} onChange={v => setFormData(p => ({ ...p, prescription: { ...p.prescription, leftAdd: v } }))} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PD (mm)</Label>
                                        <Input
                                            placeholder="0.00"
                                            value={formData.prescription.pd}
                                            onChange={(e) => setFormData(p => ({ ...p, prescription: { ...p.prescription, pd: e.target.value } }))}
                                            className="h-11 rounded-xl font-bold tabular-nums"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes</Label>
                                        <Input
                                            placeholder="Clinical remarks..."
                                            value={formData.prescription.notes}
                                            onChange={(e) => setFormData(p => ({ ...p, prescription: { ...p.prescription, notes: e.target.value } }))}
                                            className="h-11 rounded-xl text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="h-16 px-6 flex items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <SheetFooter className="mt-0 flex-row w-full justify-end gap-3 items-center">
                            <SheetClose asChild>
                                <Button type="button" variant="ghost" className="h-11 flex-1 font-semibold text-slate-500">
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button
                                type="submit"
                                form="customer-form"
                                className="h-11 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none text-sm"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : customer ? "Save Changes" : "Create Customer"}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-red-900 dark:text-red-100">Delete Prescription</DialogTitle>
                                <DialogDescription className="text-red-700/70 dark:text-red-400/70">
                                    This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-950">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Are you sure you want to delete the prescription for <span className="font-bold text-slate-900 dark:text-white">{formData.name}</span>?
                            All the clinical data for this specific record will be permanently removed.
                        </p>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={loading}
                            className="flex-1 h-11 font-semibold text-slate-600 dark:text-slate-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={loading}
                            className="flex-1 h-11 font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none gap-2"
                        >
                            {loading ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete Record</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


function MetricInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="space-y-1">
            <Label className="text-[9px] font-bold text-slate-400 uppercase leading-none">{label}</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 rounded-xl font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
        </div>
    );
}
