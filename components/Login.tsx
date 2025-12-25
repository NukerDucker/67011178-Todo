"use client";

import React, { useState } from 'react';

interface LoginProps {
    onLogin: (user: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Pull API_URL from env, default to relative path for Next.js routes
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedUser = username.trim();

        if (!trimmedUser) {
            setError('Please enter a username.');
            return;
        }

        // Validate length based on your Postgres schema (VarChar(20))
        if (trimmedUser.length > 20) {
            setError('Username must be 20 characters or less.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: trimmedUser }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed.');
                return;
            }

            if (data.success) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('todo_username', trimmedUser);
                }
                onLogin(trimmedUser);
            }
        } catch (err) {
            setError('Network error: Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="w-full max-w-md p-8 sm:p-12 rounded-2xl bg-white shadow-2xl transition-all">
                {/* CEI Logo Requirement */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/cei-logo.png"
                        alt="CEI Logo"
                        className="h-20 w-auto object-contain drop-shadow-sm"
                    />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 mt-2">Please enter your username to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 6x01xxxx"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Connecting...' : 'Login to Dashboard'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-red-600 text-center text-sm font-medium">
                            {error}
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                        University Project Todo
                    </p>
                </div>
            </div>
        </div>
    );
}