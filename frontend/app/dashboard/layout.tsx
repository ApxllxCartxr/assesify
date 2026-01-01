import { Sidebar } from "@/components/Sidebar";
import { Flame, Gem, Heart } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-black">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
