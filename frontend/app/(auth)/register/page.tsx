"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [isTeacher, setIsTeacher] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await api.register({ email, full_name: fullName, password, is_teacher: isTeacher });
            router.push("/login");
        } catch (err: any) {
            setError(err?.msg || err?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white p-12 relative overflow-hidden">
                <div className="relative z-10 text-center space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold font-playfair">Create your account</h1>
                    <p className="text-xl text-slate-300">Join Asessify as a student or teacher.</p>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center p-8 lg:p-16 bg-white dark:bg-zinc-950">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold font-geist text-slate-900 dark:text-white">Sign up</h2>
                        <p className="text-slate-500 mt-2">Create an account to get started.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full name</label>
                            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input id="isTeacher" type="checkbox" checked={isTeacher} onChange={(e) => setIsTeacher(e.target.checked)} />
                            <label htmlFor="isTeacher" className="text-sm">Register as teacher</label>
                        </div>

                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                        <Button type="submit" className="w-full">Sign up</Button>
                    </form>

                    <p className="text-center text-sm font-bold text-slate-500">
                        Already have an account? <Link href="/login" className="text-brand-blue hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
