"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { updateStore } from "@/actions/store";
import { authClient } from "@/lib/auth-client";
import { Store, Lock, KeyRound } from "lucide-react";

interface SettingsViewProps {
    store: any;
    user: any;
}

export function SettingsView({ store, user }: SettingsViewProps) {
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account & Settings</h2>
                <p className="text-slate-500">Manage your store details and account security.</p>
            </div>

            <Tabs defaultValue="store" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="store" className="gap-2">
                        <Store className="w-4 h-4" />
                        Store Profile
                    </TabsTrigger>
                    <TabsTrigger value="account" className="gap-2">
                        <Lock className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="store" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Information</CardTitle>
                            <CardDescription>
                                Public information about your optical store.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleStoreUpdate}>
                            <CardContent className="space-y-4 pb-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Store Name</Label>
                                    <Input id="name" name="name" defaultValue={store?.name} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" defaultValue={store?.address} required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Business Email</Label>
                                        <Input id="email" name="email" type="email" defaultValue={store?.email} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" name="phone" type="tel" defaultValue={store?.phone} required />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                <Button type="submit" disabled={loading} className="ml-auto bg-indigo-600 hover:bg-indigo-700">
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="account" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePasswordChange}>
                            <CardContent className="space-y-4 pb-6">
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
                                <Button type="submit" disabled={loading} className="ml-auto bg-indigo-600 hover:bg-indigo-700">
                                    {loading ? "Updating..." : "Update Password"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
