"use client";

import Link from "next/link";
import { Home, BookOpen, GraduationCap, Settings, User, BarChart3, LogOut } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { getUser, API_URL } from "@/lib/api";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Sidebar({ className }: { className?: string }) {
    const [isTeacher, setIsTeacher] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const u = getUser();
        setUser(u);
        if (u && u.is_teacher) {
            setIsTeacher(true);
        }
    }, []);

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: Home, color: "text-brand-blue" },
        { label: "Learn", href: "/learn", icon: BookOpen, color: "text-brand-green" },
        ...(isTeacher ? [
            { label: "Teacher", href: "/teacher", icon: GraduationCap, color: "text-brand-red" },
            { label: "Analytics", href: "/analytics", icon: BarChart3, color: "text-brand-purple" }
        ] : []),
        { label: "Profile", href: "/profile", icon: User, color: "text-brand-yellow" },
        { label: "Settings", href: "/settings", icon: Settings, color: "text-slate-400" },
    ];

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col w-64 border-r-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 h-screen fixed left-0 top-0 p-4",
                className
            )}
        >
            <div className="mb-8 px-4">
                <h1 className="text-3xl font-bold text-brand-green tracking-wide font-geist">
                    Assesify
                </h1>
            </div>

            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <item.icon
                            className={cn("w-7 h-7 stroke-[2.5px]", item.color)}
                        />
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto px-2 pb-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-slate-500">
                        {user?.profile_pic ? (
                            <img
                                src={`${API_URL}/auth/avatars/${user.profile_pic.split('/').pop()}`}
                                alt="U"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.full_name?.charAt(0) || "U"
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {user?.full_name?.split(' ')[0] || "User"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {isTeacher ? "Teacher Account" : "Student"}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
