import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // 1. Not logged in? Go to login
    if (!session) {
        redirect("/login");
    }

    // 2. Logged in but NO username (OAuth path)? Go to onboarding
    if (!session.user.username) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {children}
        </div>
    );
}