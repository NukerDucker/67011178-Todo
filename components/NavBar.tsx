"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NavBarProps {
  user?: {
    username: string;
    displayUsername: string;
  };
  showUser?: boolean;
}

export function NavBar({ user, showUser = false }: NavBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="bg-white dark:bg-slate-950 border-b dark:border-slate-800 sticky top-0 z-10 shrink-0 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img src="/cei-logo.png" alt="CEI Logo" className="h-9 w-auto" />
          <span className="font-bold text-slate-700 dark:text-slate-200 border-l dark:border-slate-700 pl-3 uppercase tracking-tight">
            CEI Todo
          </span>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4">

          {showUser && user && (
            <>
              <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                Welcome, <b className="text-slate-900 dark:text-slate-100">{user.displayUsername} ({user.username})</b>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <LogOut size={16} /> <span className="hidden xs:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}