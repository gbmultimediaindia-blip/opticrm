"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createStore } from "@/actions/store";
import { useRouter } from "next/navigation";

interface CreateStoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateStoreDialog({ open, onOpenChange }: CreateStoreDialogProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            address: formData.get("address") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            gstNumber: formData.get("gstNumber") as string,
        };

        try {
            await createStore(data);
            toast.success("Store created successfully!");
            onOpenChange(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to create store");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Store</DialogTitle>
                    <DialogDescription>
                        Add a new store to your account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Store Name</Label>
                            <Input id="name" name="name" placeholder="Acme Optics" autoComplete="organization" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" placeholder="123 Main St" autoComplete="street-address" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="store@example.com" autoComplete="email" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="9876543210" autoComplete="tel" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                            <Input id="gstNumber" name="gstNumber" placeholder="22AAAAA0000A1Z5" className="uppercase" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 font-bold">
                            {loading ? "Creating..." : "Create Store"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
