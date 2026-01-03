"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/onboarding",
        }, {
            onSuccess: () => {
                toast.success("Account created successfully!");
                router.push("/onboarding");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <Card className="w-full max-w-md border-slate-200 bg-white/80 backdrop-blur-xl text-slate-900 shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 text-center">Create an account</CardTitle>
                    <CardDescription className="text-slate-500 text-center">
                        Enter your information to get started with OptiCRM
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp} className="flex flex-col gap-6">
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 shadow-lg shadow-indigo-200 flex gap-2" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                        <div className="text-sm text-slate-500 text-center w-full">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                                Sign In
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
