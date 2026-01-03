"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully");
                    router.push("/login");
                },
            },
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-slate-500 hover:text-red-500 hover:bg-red-50/10 transition-colors"
        >
            <LogOut className="w-5 h-5" />
        </Button>
    );
}
