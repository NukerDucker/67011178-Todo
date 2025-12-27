"use client";

import { useState } from "react";
import { completeOnboarding } from "./action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        setError(null);
        const result = await completeOnboarding(formData);
        if (result?.error) {
            setError(result.error);
            setPending(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Create Username</h1>
                    <p className="text-slate-400 mt-2">Almost there! Choose a unique handle.</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            name="username"
                            placeholder="e.g. jdoe_24"
                            required
                            className="bg-slate-800 border-slate-700 text-white h-12"
                        />
                        {error && <p className="text-red-500 text-xs mt-2 font-bold uppercase">{error}</p>}
                    </div>

                    <Button
                        disabled={pending}
                        className="w-full h-12 bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all"
                    >
                        {pending ? <Loader2 className="animate-spin" /> : "Complete Profile"}
                    </Button>
                </form>
            </div>
        </div>
    );
}