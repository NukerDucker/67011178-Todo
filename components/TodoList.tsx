"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Calendar,
    ChevronRight,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 transition-colors duration-300">
            <NavBar
                showUser={true}
                user={{ username, firstname, lastname }}
            />

            <main className="max-w-6xl mx-auto px-4 pt-8">
                {/* Add Task & Sort Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-4 mb-8 transition-colors">
                    <form onSubmit={handleAddTodo} className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            maxLength={50}
                            className="flex-[3] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
                            required
                        />
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="flex-[1] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none text-slate-500 dark:text-slate-300"
                            required
                        />

                        <div className="flex gap-2 shrink-0">
                            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-bold active:scale-95">
                                <Plus size={20} /> Add
                            </button>

                            <button
                                type="button"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-bold active:scale-95"
                                title="Toggle Sort Order"
                            >
                                {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                            </button>
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
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
                                    <h3 className="flex items-center justify-between font-bold text-slate-500 dark:text-slate-400 text-[11px] tracking-widest px-2 uppercase">
                                        {status}
                                        <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                                            {filteredSorted.length}
                                        </span>
                                    </h3>

                                    <div className="space-y-3 min-h-[150px]">
                                        {filteredSorted.map(todo => (
                                            <div
                                                key={todo.id}
                                                className={`group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-800 transition-all ${todo.status === 'DONE' ? 'opacity-70 dark:opacity-50 bg-slate-50/50 dark:bg-slate-900/50' : ''}`}
                                            >
                                                {editingId === todo.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            className="w-full bg-white dark:bg-slate-800 border border-sky-500 rounded px-2 py-1 outline-none text-sm text-slate-900 dark:text-slate-100"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setEditingId(null)} className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">Cancel</button>
                                                            <button onClick={() => handleEditTodo(todo.id)} className="text-sky-600 dark:text-sky-400 text-[10px] font-bold uppercase">Save</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <p className={`text-sm font-semibold text-slate-800 dark:text-slate-100 break-words leading-tight ${todo.status === 'DONE' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                                                                {todo.task}
                                                            </p>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                <button onClick={() => { setEditingId(todo.id); setEditText(todo.task); }} className="text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400">
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeleteTodo(todo.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-600">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold mb-4">
                                                            <Calendar size={12} className="shrink-0 text-slate-400" />
                                                            <span className="flex gap-1 flex-wrap">
                                                                <span className="text-slate-400 dark:text-slate-500">Target: {new Date(todo.target_date).toLocaleDateString()}</span>
                                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                                {(() => {
                                                                    const target = new Date(todo.target_date);
                                                                    const today = new Date();
                                                                    today.setHours(0, 0, 0, 0);
                                                                    target.setHours(0, 0, 0, 0);
                                                                    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                                                    if (todo.status === 'DONE') return <span className="text-green-500 dark:text-green-400">COMPLETED</span>;
                                                                    if (diffDays < 0) return <span className="text-red-500 dark:text-red-400 font-black">OVERDUE ({Math.abs(diffDays)}d)</span>;
                                                                    if (diffDays === 0) return <span className="text-amber-500 dark:text-amber-400">DUE TODAY</span>;
                                                                    return <span className="text-sky-500 dark:text-sky-400">{diffDays} DAYS LEFT</span>;
                                                                })()}
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={() => handleStatusChange(todo)}
                                                            className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1
                                                                ${status === 'TODO' ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-950/50' :
                                                                  status === 'DOING' ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50' :
                                                                  'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                        >
                                                            {status === 'DONE' ? 'Restart' : 'Advance'} <ChevronRight size={12}/>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {filteredSorted.length === 0 && (
                                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-10 text-center">
                                                <p className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-tighter italic">No {status} tasks</p>
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
                <span className="bg-slate-800/90 dark:bg-slate-700/90 backdrop-blur-sm text-white text-[9px] px-4 py-1.5 rounded-full shadow-lg font-bold">
                    6x01xxxx - CEI Web Programming Project
                </span>
            </footer>
        </div>
    );
}