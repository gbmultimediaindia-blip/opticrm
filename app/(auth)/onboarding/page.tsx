"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createStore } from "@/actions/store";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
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
        };

        try {
            await createStore(data);
            toast.success("Store created successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to create store");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-indigo-50 p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <Card className="w-full max-w-lg border-slate-200 bg-white/80 backdrop-blur-xl text-slate-900 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create Your Store</CardTitle>
                    <CardDescription className="text-slate-500">
                        Let's set up your business workspace
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700">Store Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Quantum Electronics"
                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address" className="text-slate-700">Store Address</Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="123 Tech Lane, Silicon Valley"
                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700">Business Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="contact@store.com"
                                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-slate-700">Business Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg font-semibold shadow-lg shadow-indigo-200" disabled={loading}>
                            {loading ? "Setting up store..." : "Launch Store"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
