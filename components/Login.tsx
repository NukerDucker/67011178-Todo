"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Turnstile from "react-turnstile";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!captchaToken) {
      toast.error("Verification required", { description: "Please complete the captcha." });
      return;
    }

    setLoading(true);
    await authClient.signIn.username(
      { username: values.username, password: values.password },
      {
        fetchOptions: { headers: { "x-captcha-response": captchaToken } },
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error("Login failed", { description: ctx.error.message });
          setLoading(false);
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="bg-white border-b sticky top-0 z-10 shrink-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <img src="/cei-logo.png" alt="CEI Logo" className="h-9 w-auto" />
            <span className="font-bold text-slate-700 border-l pl-3 uppercase tracking-tight">CEI Todo</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">

          {/* Welcome Text Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Please enter your credentials to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-semibold text-gray-700">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 6x01xxxx"
                        className="w-full px-4 py-6 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-sky-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-bold uppercase text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-semibold text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-6 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-sky-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-bold uppercase text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center py-2 scale-90">
                <Turnstile
  sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  onVerify={(token) => {
    setCaptchaToken(token);
    console.log("Captcha Verified:", token); // Debug: see if token is generated
  }}
  onExpire={() => setCaptchaToken("")} // Clear token if it expires
  onError={() => toast.error("Captcha failed to load")}
/>
              </div>

              <Button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full py-7 px-4 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Connecting...</>
                ) : (
                  <>Login to Dashboard</>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-gray-400">Social Access</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full py-6 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98] flex gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          {/* University Project Footer inside card */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
              University Project Todo
            </p>
          </div>
        </div>
      </main>

      {/* External Page Footer */}
      <footer className="p-8 text-center shrink-0">
        <span className="bg-slate-800 text-white text-[9px] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg">
          6x01xxxx - CEI Web Programming Project
        </span>
      </footer>
    </div>
  );
}