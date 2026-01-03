import { getStore } from "@/actions/store";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/dashboard/settings-view";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const store = await getStore();

    if (!store) {
        redirect("/onboarding");
    }

    return (
        <div className="max-w-[1600px] mx-auto py-6">
            <SettingsView store={store} user={session.user} />
        </div>
    );
}
