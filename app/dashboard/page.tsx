// app/dashboard/page.tsx
import { getFullUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import TodoList from "@/components/TodoList";
import { NavBar } from "@/components/NavBar";

export default async function DashboardPage() {
    const user = await getFullUser();

    // 1. If no user, they aren't logged in
    if (!user) {
        redirect("/login");
    }

    // 2. If OAuth created them but they haven't picked a username yet
    if (!user.username) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
             <NavBar

showUser={true}

user={{

displayUsername: user.name, // Fresh from DB (Google Name)

username: user.username, // Fresh from DB (Custom Handle)

}}

/> 
            <main className="flex-1 p-4">
                <TodoList
                    userId={user.id}
                    username={user.username}
                />
            </main>
        </div>
    );
}