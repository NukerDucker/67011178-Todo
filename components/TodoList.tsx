"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, LogOut, Loader2 } from 'lucide-react';

interface Todo {
    id: number;
    username: string;
    task: string;
    done: boolean;
    created_at: string;
    updated_at: string;
}

export default function TodoList({ username, onLogout }: { username: string, onLogout: () => void }) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

    // 1. Fetch Todos
    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/todos?username=${username}`);
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
        fetchTodos();
    }, [username]);

    // 2. Add Todo
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, task: newTask }),
            });
            if (response.ok) {
                const newTodo = await response.json();
                setTodos([newTodo, ...todos]);
                setNewTask('');
            }
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    // 3. Toggle Status (Checkbox)
    const handleToggleDone = async (todo: Todo) => {
        try {
            const response = await fetch(`${API_URL}/todos/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: !todo.done }),
            });
            if (response.ok) {
                setTodos(todos.map(t => t.id === todo.id ? { ...t, done: !todo.done } : t));
            }
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    // 4. Edit Task Text
    const handleEditTodo = async (id: number) => {
        if (!editText.trim()) return;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: editText }),
            });
            if (response.ok) {
                setTodos(todos.map(t => t.id === id ? { ...t, task: editText } : t));
                setEditingId(null);
            }
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    // 5. Delete Todo
    const handleDeleteTodo = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header / Logo Section */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/cei-logo.png" alt="CEI Logo" className="h-8 w-auto" />
                        <span className="hidden sm:block font-bold text-slate-700 border-l pl-3">Todo System</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">User: <b className="text-slate-900">{username}</b></span>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 pt-8">
                {/* Add Task Input */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
                    <form onSubmit={handleAddTodo} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            maxLength={50}
                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none text-slate-700"
                        />
                        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-xl transition-all shadow-md">
                            <Plus size={24} />
                        </button>
                    </form>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Loader2 className="animate-spin mb-2" />
                            <p>Loading your tasks...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-400">No tasks found. Add one above!</p>
                        </div>
                    ) : (
                        todos.map(todo => (
                            <div
                                key={todo.id}
                                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                    todo.done ? 'bg-slate-50/50 border-slate-200' : 'bg-white border-white shadow-sm'
                                }`}
                            >
                                <button
                                    onClick={() => handleToggleDone(todo)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        todo.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-sky-500'
                                    }`}
                                >
                                    {todo.done && <Check size={14} strokeWidth={3} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    {editingId === todo.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full bg-white border border-sky-500 rounded px-2 py-1 text-slate-800"
                                                autoFocus
                                                maxLength={50}
                                            />
                                            <button onClick={() => handleEditTodo(todo.id)} className="text-green-600"><Check size={20}/></button>
                                            <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={20}/></button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className={`text-base font-medium truncate ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                                {todo.task}
                                            </p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tight">
                                                Last updated: {new Date(todo.updated_at).toLocaleString()}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {!editingId && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingId(todo.id); setEditText(todo.task); }}
                                            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTodo(todo.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Student ID Footer */}
            <footer className="fixed bottom-4 left-0 right-0 text-center">
                <span className="bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full opacity-50">
                    6x01xxxx - Web Programming Project
                </span>
            </footer>
        </div>
    );
}