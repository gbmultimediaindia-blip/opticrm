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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        toast.success("Welcome back!");
        router.push("/dashboard");
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
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 text-center">Welcome back</CardTitle>
          <CardDescription className="text-slate-500 text-center">
            Enter your credentials to access your store
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 shadow-lg shadow-indigo-200" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-sm text-slate-500 text-center w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
