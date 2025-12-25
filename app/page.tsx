"use client";

import { useState, useEffect } from 'react';
import Login from '@/components/Login';
import TodoList from '@/components/TodoList';

export default function Home() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Run only on client-side once mounted
    useEffect(() => {
        const storedUser = localStorage.getItem('todo_username');
        if (storedUser) {
            setCurrentUser(storedUser);
        }
        setIsLoaded(true);
    }, []);

    const handleLogin = (username: string) => {
        setCurrentUser(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('todo_username');
        setCurrentUser(null);
    };

    // Prevent "flicker" where Login shows for a split second before TodoList
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <main>
            {currentUser ? (
                <TodoList username={currentUser} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </main>
    );
}