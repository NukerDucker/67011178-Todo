"use client";
import { authClient } from "@/lib/auth-client";
import TodoList from "@/components/TodoList";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={40} />
            </div>
        );
    }
    if (!session) {
        return <div>Not authenticated. Please log in.</div>;
    }



    return (
        <TodoList
            userId={session.user.id}
            username={session.user.username || "user"}
            firstname={session.user.firstname || ""}
            lastname={session.user.lastname || ""}
        />
    );
}