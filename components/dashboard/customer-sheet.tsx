"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCustomer, updateCustomer } from "@/actions/customer";

interface CustomerSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer?: any;
}

export function CustomerSheet({ open, onOpenChange, customer }: CustomerSheetProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        prescription: {
            rightSphere: "",
            rightCylinder: "",
            rightAxis: "",
            rightAdd: "",
            leftSphere: "",
            leftCylinder: "",
            leftAxis: "",
            leftAdd: "",
            pd: ""
        }
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                prescription: {
                    rightSphere: "",
                    rightCylinder: "",
                    rightAxis: "",
                    rightAdd: "",
                    leftSphere: "",
                    leftCylinder: "",
                    leftAxis: "",
                    leftAdd: "",
                    pd: ""
                }
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                prescription: {
                    rightSphere: "",
                    rightCylinder: "",
                    rightAxis: "",
                    rightAdd: "",
                    leftSphere: "",
                    leftCylinder: "",
                    leftAxis: "",
                    leftAdd: "",
                    pd: ""
                }
            });
        }
    }, [customer, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (customer) {
                const { name, email, phone, address } = formData;
                await updateCustomer(customer.id, { name, email, phone, address });
                toast.success("Customer updated successfully");
            } else {
                await createCustomer(formData);
                toast.success("Customer created successfully");
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
            <SheetContent className="sm:max-w-md border-l border-slate-200 dark:border-slate-800">
                <SheetHeader>
                    <SheetTitle>{customer ? "Edit Customer" : "Create Customer"}</SheetTitle>
                    <SheetDescription>
                        {customer ? "Update your customer's information here." : "Add a new customer to your store."}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-4">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="h-11 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com (Optional)"
                                    className="h-11 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="h-11 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 Main St, City, Country (Optional)"
                                    className="h-11 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {!customer && (
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Initial Prescription</h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Right Eye (OD)</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="0.00" value={formData.prescription.rightSphere} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, rightSphere: e.target.value } }))} />
                                                <Input placeholder="0.00" value={formData.prescription.rightCylinder} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, rightCylinder: e.target.value } }))} />
                                                <Input placeholder="0" value={formData.prescription.rightAxis} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, rightAxis: e.target.value } }))} />
                                                <Input placeholder="0.00" value={formData.prescription.rightAdd} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, rightAdd: e.target.value } }))} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Left Eye (OS)</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="0.00" value={formData.prescription.leftSphere} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, leftSphere: e.target.value } }))} />
                                                <Input placeholder="0.00" value={formData.prescription.leftCylinder} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, leftCylinder: e.target.value } }))} />
                                                <Input placeholder="0" value={formData.prescription.leftAxis} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, leftAxis: e.target.value } }))} />
                                                <Input placeholder="0.00" value={formData.prescription.leftAdd} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, leftAdd: e.target.value } }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-500">PD (Pupillary Distance)</Label>
                                            <Input placeholder="e.g. 64" value={formData.prescription.pd} onChange={(e) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, pd: e.target.value } }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <SheetFooter className="pt-6">
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 font-semibold text-white shadow-lg shadow-indigo-200 dark:shadow-none" disabled={loading}>
                            {loading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
