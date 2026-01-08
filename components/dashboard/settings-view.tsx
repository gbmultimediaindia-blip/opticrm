"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { updateStore, deleteStore, updateStoreSettings } from "@/actions/store";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Store, Users, Lock, KeyRound, Trash2, AlertTriangle, UserCog, Mail, MapPin, User as UserIcon, Calendar } from "lucide-react";
import { MembersTab } from "./members-tab";

interface SettingsViewProps {
    store: any;
    user: any;
}

export function SettingsView({ store, user }: SettingsViewProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDeleteStore = async () => {
        setLoading(true);
        try {
            await deleteStore(store.id);
            toast.success("Store deleted successfully");
            router.refresh();
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete store");
        } finally {
            setLoading(false);
        }
    };

    // Store Form State
    const handleStoreUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await updateStore({
                id: store.id,
                name: formData.get("name") as string,
                address: formData.get("address") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                gstNumber: formData.get("gstNumber") as string,
            });
            toast.success("Store settings updated successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { error } = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                throw error;
            }

            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const [customerSettings, setCustomerSettings] = useState(store.customerSettings || {
        showEmail: true,
        showAddress: true,
        showGender: true,
        showDob: true,
        showAnniversary: true,
    });

    const handleCustomerSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateStoreSettings(store.id, customerSettings);
            toast.success("Customer field settings updated");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleField = (field: string) => {
        setCustomerSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const [activeTab, setActiveTab] = useState("store");

    return (
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-64">
                <nav className="flex space-x-2 overflow-x-auto pb-2 lg:flex-col lg:space-x-0 lg:space-y-1 lg:pb-0">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("store")}
                        className={`justify-start ${activeTab === "store" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
                    >
                        <Store className="w-4 h-4 mr-2" />
                        Store Settings
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("customers")}
                        className={`justify-start ${activeTab === "customers" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
                    >
                        <UserCog className="w-4 h-4 mr-2" />
                        Customer Fields
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("members")}
                        className={`justify-start ${activeTab === "members" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Members
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("account")}
                        className={`justify-start ${activeTab === "account" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
                    >
                        <Lock className="w-4 h-4 mr-2" />
                        Security
                    </Button>
                </nav>
            </aside>
            <div className="flex-1 lg:max-w-2xl">
                {activeTab === "store" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Store Settings</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage your store details and tax information.
                            </p>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800" />
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <form onSubmit={handleStoreUpdate}>
                                <CardContent className="space-y-4 pt-6 pb-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Store Name</Label>
                                        <Input id="name" name="name" defaultValue={store?.name} required className="max-w-md" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" name="address" defaultValue={store?.address} required className="max-w-xl" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Business Email</Label>
                                            <Input id="email" name="email" type="email" defaultValue={store?.email} required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" name="phone" type="tel" defaultValue={store?.phone} required />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                                        <Input id="gstNumber" name="gstNumber" defaultValue={store?.gstNumber} placeholder="22AAAAA0000A1Z5" className="max-w-md uppercase" />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                    <Button type="submit" disabled={loading} className="show-loader ml-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>

                        <div className="pt-6">
                            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Danger Zone
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 mb-4">
                                Irreversible actions for your store.
                            </p>
                            <Card className="border-red-100 dark:border-red-900/20 shadow-sm bg-red-50/30 dark:bg-red-900/10">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base text-red-700 dark:text-red-400">Delete Store</CardTitle>
                                            <CardDescription className="text-red-600/80 dark:text-red-400/70">
                                                Permanently delete this store and all its data. This action cannot be undone.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardFooter className="border-t border-red-100 dark:border-red-900/20 p-4 bg-red-100/20 dark:bg-red-900/20">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="ml-auto bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Store
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete <strong>{store?.name}</strong> and remove all associated data including products, customers, and invoices.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteStore} className="bg-red-600 hover:bg-red-700 text-white">
                                                    Yes, delete store
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === "customers" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Customer Fields</h3>
                            <p className="text-sm text-muted-foreground">
                                Configure which fields are visible during customer creation.
                            </p>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800" />
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <form onSubmit={handleCustomerSettingsUpdate}>
                                <CardContent className="space-y-0 p-0">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {[
                                            { id: "showEmail", label: "Email Address", icon: Mail, description: "Collect customer email for digital invoices" },
                                            { id: "showAddress", label: "Residential Address", icon: MapPin, description: "Store address details for delivery" },
                                            { id: "showGender", label: "Gender", icon: UserIcon, description: "Used for demographic reporting" },
                                            { id: "showDob", label: "Date of Birth", icon: Calendar, description: "Birthday reminders and age tracking" },
                                            { id: "showAnniversary", label: "Anniversary Date", icon: Calendar, description: "Marriage anniversary for relationship building" }
                                        ].map((field) => (
                                            <div key={field.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className={`mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500`}>
                                                        <field.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label htmlFor={field.id} className="text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                                                            {field.label}
                                                        </label>
                                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                            {field.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Checkbox
                                                    id={field.id}
                                                    checked={customerSettings[field.id]}
                                                    onCheckedChange={() => toggleField(field.id)}
                                                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                    <Button type="submit" disabled={loading} className="show-loader ml-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                        {loading ? "Saving..." : "Save Preferences"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                )}

                {activeTab === "members" && (
                    <MembersTab store={store} currentUser={user} />
                )}

                {activeTab === "account" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Security</h3>
                            <p className="text-sm text-muted-foreground">
                                Update your password and manage account security.
                            </p>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800" />
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <form onSubmit={handlePasswordChange}>
                                <CardContent className="space-y-4 pt-6 pb-6 max-w-md">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current">Current Password</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="current"
                                                type="password"
                                                className="pl-9"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new">New Password</Label>
                                        <Input
                                            id="new"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm">Confirm New Password</Label>
                                        <Input
                                            id="confirm"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                    <Button type="submit" disabled={loading} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
