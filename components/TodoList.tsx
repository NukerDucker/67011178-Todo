"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    LogOut,
    Loader2,
    Calendar,
    ChevronRight,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Todo {
    id: number;
    userId: string;
    task: string;
    status: 'TODO' | 'DOING' | 'DONE';
    target_date: string;
    created_at: string;
    updated_at: string;
}

interface TodoListProps {
    userId: string;
    username: string;
    firstname?: string;
    lastname?: string;
}

export default function TodoList({ userId, username, firstname, lastname }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTask, setNewTask] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    };

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/todos?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (err) {
            console.error('Error fetching todos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchTodos();
    }, [userId]);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !targetDate) return;

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    task: newTask,
                    target_date: targetDate
                }),
            });
            if (response.ok) {
                const newTodo = await response.json();
                setTodos([newTodo, ...todos]);
                setNewTask('');
                setTargetDate('');
            }
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    const handleStatusChange = async (todo: Todo) => {
        const nextStatus: Record<string, 'TODO' | 'DOING' | 'DONE'> = {
            'TODO': 'DOING',
            'DOING': 'DONE',
            'DONE': 'TODO'
        };
        const updatedStatus = nextStatus[todo.status];

        try {
            const response = await fetch(`${API_URL}/todos/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: updatedStatus,
                    userId: userId
                }),
            });
            if (response.ok) {
                setTodos(todos.map(t => t.id === todo.id ? { ...t, status: updatedStatus } : t));
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleEditTodo = async (id: number) => {
        if (!editText.trim()) return;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: editText,
                    userId: userId
                }),
            });
            if (response.ok) {
                setTodos(todos.map(t => t.id === id ? { ...t, task: editText } : t));
                setEditingId(null);
            }
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
            if (response.ok) setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const statuses: ('TODO' | 'DOING' | 'DONE')[] = ['TODO', 'DOING', 'DONE'];

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/cei-logo.png" alt="CEI Logo" className="h-9 w-auto" />
                        <span className="font-bold text-slate-700 border-l pl-3 uppercase tracking-tight">CEI Todo</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Displays: Full Name (username) */}
                        <span className="text-sm text-slate-500 hidden sm:block">
                            Welcome, <b className="text-slate-900">{firstname} {lastname} ({username})</b>
                        </span>
                        <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 pt-8">
                {/* Add Task & Sort Section */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 mb-8">
                    <form onSubmit={handleAddTodo} className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            maxLength={50}
                            className="flex-[3] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none text-slate-700"
                            required
                        />
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="flex-[1] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none text-slate-500"
                            required
                        />

                        <div className="flex gap-2 shrink-0">
                            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-bold active:scale-95">
                                <Plus size={20} /> Add
                            </button>

                            <button
                                type="button"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 font-bold active:scale-95"
                                title="Toggle Sort Order"
                            >
                                {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                            </button>
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <p className="font-medium">Loading Tasks...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statuses.map(status => {
                            const filteredSorted = todos
                                .filter(t => t.status === status)
                                .sort((a, b) => {
                                    const timeA = new Date(a.target_date).getTime();
                                    const timeB = new Date(b.target_date).getTime();
                                    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
                                });

                            return (
                                <div key={status} className="flex flex-col gap-4">
                                    <h3 className="flex items-center justify-between font-bold text-slate-500 text-[11px] tracking-widest px-2 uppercase">
                                        {status}
                                        <span className="bg-slate-200 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-bold">
                                            {filteredSorted.length}
                                        </span>
                                    </h3>

                                    <div className="space-y-3 min-h-[150px]">
                                        {filteredSorted.map(todo => (
                                            <div
                                                key={todo.id}
                                                className={`group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-all ${todo.status === 'DONE' ? 'opacity-70 bg-slate-50/50' : ''}`}
                                            >
                                                {editingId === todo.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            className="w-full border border-sky-500 rounded px-2 py-1 outline-none text-sm"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setEditingId(null)} className="text-slate-400 text-[10px] font-bold">CANCEL</button>
                                                            <button onClick={() => handleEditTodo(todo.id)} className="text-sky-600 text-[10px] font-bold">SAVE</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <p className={`text-sm font-semibold text-slate-800 break-words leading-tight ${todo.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                                                                {todo.task}
                                                            </p>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                <button onClick={() => { setEditingId(todo.id); setEditText(todo.task); }} className="text-slate-400 hover:text-sky-600">
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeleteTodo(todo.id)} className="text-slate-400 hover:text-red-600">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold mb-4">
                                                            <Calendar size={12} className="shrink-0" />
                                                            <span className="flex gap-1">
                                                                <span className="text-slate-400">Target: {new Date(todo.target_date).toLocaleDateString()}</span>
                                                                <span className="text-slate-300">•</span>
                                                                {(() => {
                                                                    const target = new Date(todo.target_date);
                                                                    const today = new Date();
                                                                    today.setHours(0, 0, 0, 0);
                                                                    target.setHours(0, 0, 0, 0);
                                                                    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                                                    if (todo.status === 'DONE') return <span className="text-green-500">COMPLETED</span>;
                                                                    if (diffDays < 0) return <span className="text-red-500 font-black">OVERDUE ({Math.abs(diffDays)}d)</span>;
                                                                    if (diffDays === 0) return <span className="text-amber-500">DUE TODAY</span>;
                                                                    return <span className="text-sky-500">{diffDays} DAYS LEFT</span>;
                                                                })()}
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={() => handleStatusChange(todo)}
                                                            className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1
                                                                ${status === 'TODO' ? 'bg-sky-50 text-sky-600 hover:bg-sky-100' :
                                                                  status === 'DOING' ? 'bg-green-50 text-green-600 hover:bg-green-100' :
                                                                  'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                        >
                                                            {status === 'DONE' ? 'Restart' : 'Advance'} <ChevronRight size={12}/>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {filteredSorted.length === 0 && (
                                            <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center">
                                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter italic">No {status} tasks</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <footer className="fixed bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="bg-slate-800/90 backdrop-blur-sm text-white text-[9px] px-4 py-1.5 rounded-full shadow-lg font-bold">
                    6x01xxxx - CEI Web Programming Project
                </span>
            </footer>
        </div>
    );
}