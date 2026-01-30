import { auth } from '@/lib/auth'
import Login from '@/components/Login'
import TodoList from '@/components/TodoList'

export default async function Home() {
    const session = await auth()

    return (
        <main>
            {session ? (
                <TodoList user={session.user} />
            ) : (
                <Login />
            )}
        </main>
    )
}