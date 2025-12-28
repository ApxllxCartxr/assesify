"use client";

import { Button } from "@/components/Button";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { storeToken } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await api.login(email, password);
            if (data.access_token) {
                storeToken(data.access_token);
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err?.msg || err?.message || "Login failed");
        }
    };
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left (Brand/Art) - Hidden on mobile */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                <div className="relative z-10 text-center space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold font-playfair">Master Your Classes</h1>
                    <p className="text-xl text-slate-300">
                        Join thousands of students and teachers using Asessify to make learning fun and effective.
                    </p>
                </div>
                {/* Animated Graphic Placeholder */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            </div>

            {/* Right (Form) */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-16 bg-white dark:bg-zinc-950">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold font-geist text-slate-900 dark:text-white">Welcome back! 👋</h2>
                        <p className="text-slate-500 mt-2">Log in to continue your streak.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-blue outline-none transition-colors font-bold"
                                    placeholder="joey@friends.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-blue outline-none transition-colors font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                        <div>
                            <Button type="submit" className="w-full" size="lg">
                                Log In <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-zinc-950 text-slate-500 font-bold">OR</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full">Google</Button>
                        <Button variant="outline" className="w-full">Github</Button>
                    </div>

                    <p className="text-center text-sm font-bold text-slate-500">
                        Don't have an account? <Link href="/register" className="text-brand-blue hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
