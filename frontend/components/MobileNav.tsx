"use client";

import { Home, Search, Calendar, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export function MobileNav() {
    const pathname = usePathname();

    const items = [
        { label: "Home", icon: Home, href: "/dashboard" },
        { label: "Classes", icon: BookOpen, href: "/class/1" }, // Mock active class
        { label: "Profile", icon: User, href: "/profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t-2 border-slate-200 dark:border-slate-800 p-2 z-40 pb-safe">
            <div className="flex justify-around items-center">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-20",
                                isActive ? "text-brand-blue bg-brand-blue/10" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            )}
                        >
                            <item.icon className={clsx("w-6 h-6 mb-1", isActive && "fill-current")} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
