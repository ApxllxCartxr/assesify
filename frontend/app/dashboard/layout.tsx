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

            {/* Right Sidebar (Stats) - Hidden on mobile, can be made a component later */}
            <aside className="hidden xl:block w-80 p-6 space-y-6">
                {/* Mock Stats Panel */}
                <div className="sticky top-6 space-y-4">
                    <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <Flame className="w-6 h-6 text-brand-red fill-current" />
                            <span className="font-bold text-slate-700 dark:text-slate-200">12</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Gem className="w-6 h-6 text-brand-blue fill-current" />
                            <span className="font-bold text-brand-blue">450</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-brand-red fill-current" />
                            <span className="font-bold text-brand-red">5</span>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                        <h3 className="font-bold font-geist text-lg">Daily Goals</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>XP Gained</span>
                                <span>20 / 50</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-yellow w-[40%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            <MobileNav />
        </div>
    );
}
