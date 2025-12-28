"use client";

import { use, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import {
    BookOpen,
    FileText,
    PlayCircle,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    ChevronRight,
    TrendingUp,
    Filter
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // In a real app, we would await params
    const { id } = use(params);

    const [activeTab, setActiveTab] = useState<"all" | "quizzes" | "materials">("all");

    const classInfo = {
        id: id,
        name: "Introduction to Computer Science",
        code: "CS-101",
        section: "A",
        teacher: "Dr. Geller",
        progress: 85,
        masteryColor: "bg-brand-blue",
        stats: {
            avgScore: 92,
            quizzesTaken: 12,
            materialsRead: 24
        }
    };

    const feed = [
        { type: "quiz", id: 101, title: "Data Structures Basics", date: "Due Tomorrow", status: "pending", score: null },
        { type: "material", id: 201, title: "Week 5 Slides: Trees & Graphs", date: "Posted Yesterday", size: "2.4 MB" },
        { type: "quiz", id: 100, title: "Memory Management Quiz", date: "Completed Oct 24", status: "completed", score: 88 },
        { type: "material", id: 200, title: "Reading: The history of C++", date: "Posted Oct 20", size: "1.1 MB" },
        { type: "quiz", id: 99, title: "Mid-Term Assessment", date: "Completed Oct 15", status: "completed", score: 95 },
    ];

    const filteredFeed = activeTab === "all" ? feed : feed.filter(item => item.type === activeTab.slice(0, -1)); // simple filter logic "quizzes" -> "quiz"

    return (
        <div className="space-y-8 pb-20">
            {/* Header Banner */}
            <div className={`rounded-3xl p-8 text-white ${classInfo.masteryColor} relative overflow-hidden shadow-lg`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 opacity-90">
                            <span className="font-bold uppercase tracking-wider text-xs bg-white/20 px-2 py-1 rounded-lg">
                                {classInfo.code} • Section {classInfo.section}
                            </span>
                            <span className="flex items-center gap-1 text-sm font-bold">
                                <BookOpen className="w-4 h-4" /> {classInfo.teacher}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold font-geist">{classInfo.name}</h1>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 w-full md:w-auto min-w-[200px]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold">Your Mastery</span>
                            <span className="text-xl font-bold">{classInfo.progress}%</span>
                        </div>
                        <ProgressBar value={classInfo.progress} className="h-2 bg-black/20" color="green" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {["all", "quizzes", "materials"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={clsx(
                                    "px-4 py-2 rounded-full font-bold text-sm capitalize border-2 transition-all",
                                    activeTab === tab
                                        ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-zinc-900 dark:border-slate-800"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Feed Items */}
                    <div className="space-y-4">
                        {filteredFeed.map((item) => (
                            <div key={item.id} className="group bg-white dark:bg-zinc-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-brand-blue hover:translate-x-1 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-xl flex items-center justify-center border-b-4",
                                        item.type === 'quiz' ? "bg-brand-blue text-white border-brand-blue-dark" : "bg-brand-yellow text-white border-brand-yellow-dark"
                                    )}>
                                        {item.type === 'quiz' ? <PlayCircle className="w-6 h-6 fill-white/20" /> : <FileText className="w-6 h-6 fill-white/20" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold font-geist text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-blue transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                                            {item.type === 'quiz' && item.status === 'pending' && <span className="text-brand-red flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {item.date}</span>}
                                            {item.type === 'quiz' && item.status === 'completed' && <span className="text-brand-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {item.date}</span>}
                                            {item.type === 'material' && <span>{item.date} • {item.size}</span>}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    {item.type === 'quiz' && item.status === 'pending' && (
                                        <Link href="/learn">
                                            <Button size="sm">Start</Button>
                                        </Link>
                                    )}
                                    {item.type === 'quiz' && item.status === 'completed' && (
                                        <div className="text-right">
                                            <span className="block text-xl font-bold font-geist text-brand-green">{item.score}%</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
                                        </div>
                                    )}
                                    {item.type === 'material' && (
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-brand-blue">
                                            <Download className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Stats (Specific to this class) */}
                <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="font-bold font-geist text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-brand-blue" />
                            Performance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500 font-bold text-sm">Avg. Quiz Score</span>
                                <span className="font-bold text-brand-green">{classInfo.stats.avgScore}%</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500 font-bold text-sm">Quizzes Taken</span>
                                <span className="font-bold text-slate-800 dark:text-white">{classInfo.stats.quizzesTaken}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-bold text-sm">Materials Read</span>
                                <span className="font-bold text-slate-800 dark:text-white">{classInfo.stats.materialsRead}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-bold font-geist text-lg flex items-center gap-2 text-brand-red">
                            <AlertCircle className="w-5 h-5" />
                            Weak Topics
                        </h3>
                        <p className="text-sm text-slate-500">Based on your recent quiz performance in this class.</p>

                        <div className="space-y-3">
                            {["Recursion", "Big O Notation"].map(topic => (
                                <div key={topic} className="bg-brand-red/5 p-3 rounded-xl border border-brand-red/20 flex justify-between items-center">
                                    <span className="font-bold text-brand-red text-sm">{topic}</span>
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-brand-red/30 text-brand-red hover:bg-brand-red hover:text-white">
                                        Review
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
