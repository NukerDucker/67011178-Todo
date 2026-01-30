"use client";

import React, { useState, useCallback } from 'react';
import { SignIn } from "@/components/auth-components";
import Register from "@/components/Register";
import { loginWithCredentials } from "@/lib/auth-actions";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

function LoginForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = useCallback(async (formData: FormData) => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('login');
        formData.append('captchaToken', token);

        await loginWithCredentials(formData);
    }, [executeRecaptcha]);

    return (
        <form action={handleSubmit} className="space-y-4 mb-4">
             <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input id="username" name="username" type="text" required className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="Enter your username" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input id="password" name="password" type="password" required className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 active:scale-95 transition-all">
                Sign In
            </button>
        </form>
    );
}

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);

    if (isRegistering) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="w-full max-w-md p-8 sm:p-12 rounded-2xl bg-white shadow-2xl transition-all">
                     <div className="flex justify-center mb-8">
                        <img
                            src="/cei-logo.png"
                            alt="CEI Logo"
                            className="h-20 w-auto object-contain drop-shadow-sm"
                        />
                    </div>
                    <Register onRegisterSuccess={() => setIsRegistering(false)} />
                     <div className="mt-4 text-center">
                        <button
                            onClick={() => setIsRegistering(false)}
                            className="text-sm text-sky-600 hover:text-sky-700 font-semibold"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
            <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
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
                        <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
                    </div>

                    <LoginForm />

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SignIn provider="google" />
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsRegistering(true)}
                            className="text-sm text-sky-600 hover:text-sky-700 font-semibold"
                        >
                            Don't have an account? Create one
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                            University Project Todo
                        </p>
                    </div>
                </div>
            </div>
        </GoogleReCaptchaProvider>
    );
}