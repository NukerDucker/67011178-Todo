"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Fixed Import
import Turnstile from "react-turnstile";
import { Loader2, UserPlus } from "lucide-react";
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

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
});

export default function RegisterPage() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", firstname: "", lastname: "" },
  });

const onSubmit = async (values: z.infer<typeof registerSchema>) => {
  setLoading(true);

  // Logic: 1st letter of firstname + 6 letters of lastname (lowercase)
  const generatedUsername = (
    values.firstname.charAt(0) +
    values.lastname.slice(0, 6)
  ).toLowerCase();

  try {
    await authClient.signUp.username(
      {
        email: values.email,
        username: generatedUsername, // Automatically generated
        password: values.password,
        name: `${values.firstname} ${values.lastname}`,
        firstname: values.firstname,
        lastname: values.lastname,
      },
      {
        fetchOptions: { headers: { "x-captcha-response": captchaToken } },
        onSuccess: () => {
          toast.success("Account created!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
      }
    );
  } catch (err) {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b h-16 flex items-center px-6">
        <span className="font-bold text-slate-700 uppercase">CEI Todo</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="firstname" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input placeholder="John" {...field} className="bg-gray-50 py-6" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastname" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input placeholder="Doe" {...field} className="bg-gray-50 py-6" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="6x01xxxx" {...field} className="bg-gray-50 py-6" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="student@university.ac.th" {...field} className="bg-gray-50 py-6" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} className="bg-gray-50 py-6" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-center py-2">
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

              <Button disabled={loading || !captchaToken} className="w-full py-7 bg-sky-600 hover:bg-sky-500 font-bold rounded-xl">
                {loading ? <Loader2 className="animate-spin" /> : <UserPlus className="mr-2" size={18} />}
                Sign Up
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Have an account? <Link href="/login" className="text-sky-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}