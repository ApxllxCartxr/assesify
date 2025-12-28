"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import {
    Flame,
    Zap,
    Trophy,
    Target,
    Globe,
    Calculator,
    Award,
    Medal,
    Star,
    TrendingUp,
    MapPin,
    Calendar,
    BookOpen
} from "lucide-react";

export default function ProfilePage() {
    const classPerformance = [
        { name: "Intro to CS", teacher: "Dr. Geller", score: 92, status: "strong" },
        { name: "Adv. Calculus", teacher: "Prof. Bing", score: 74, status: "average" },
        { name: "World History", teacher: "Mrs. Buffay", score: 88, status: "strong" },
    ];

    const weakTopics = [
        { topic: "Differential Calculus", class: "Adv. Calculus", mastery: 35 },
        { topic: "Integration Rules", class: "Adv. Calculus", mastery: 42 },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
                <div className="w-32 h-32 bg-brand-blue rounded-full border-4 border-white dark:border-zinc-800 shadow-xl flex items-center justify-center text-5xl font-bold text-white relative">
                    J
                    <div className="absolute bottom-0 right-0 bg-brand-green p-2 rounded-full border-4 border-white dark:border-zinc-800">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                </div>
                <div className="text-center md:text-left space-y-3">
                    <div>
                        <h1 className="text-4xl font-bold font-geist text-slate-900 dark:text-white">
                            Joey Tribbiani
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                            <MapPin className="w-4 h-4" /> New York, USA • Joined Dec 2025
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 font-bold text-slate-600 dark:text-slate-300 text-sm">
                            <Globe className="w-4 h-4 text-brand-blue" /> English (Native)
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 font-bold text-slate-600 dark:text-slate-300 text-sm">
                            <Calculator className="w-4 h-4 text-brand-red" /> Math (Major)
                        </span>
                    </div>
                </div>
                <div className="flex-1 flex justify-center md:justify-end gap-3">
                    <Button variant="outline">Edit</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <section>
                <h2 className="text-xl font-bold font-geist mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-blue" />
                    Activity Stats
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                        <Flame className="w-8 h-8 text-brand-red fill-current" />
                        <div className="text-center">
                            <span className="text-2xl font-bold block font-geist">12</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Day Streak</span>
                        </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                        <Zap className="w-8 h-8 text-brand-yellow fill-current" />
                        <div className="text-center">
                            <span className="text-2xl font-bold block font-geist">1450</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total XP</span>
                        </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                        <Trophy className="w-8 h-8 text-brand-yellow" />
                        <div className="text-center">
                            <span className="text-2xl font-bold block font-geist">Gold</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">League</span>
                        </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                        <Target className="w-8 h-8 text-brand-blue" />
                        <div className="text-center">
                            <span className="text-2xl font-bold block font-geist">88%</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Accuracy</span>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Performance & Weakness Analysis */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Class Performance */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold font-geist flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-brand-green" />
                            Class Performance
                        </h2>
                    </div>
                    <Card className="space-y-5">
                        {classPerformance.map((cls) => (
                            <div key={cls.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 block">{cls.name}</span>
                                        <span className="text-xs text-slate-500">{cls.teacher}</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${cls.status === 'strong' ? 'bg-brand-green/10 text-brand-green' :
                                            cls.status === 'average' ? 'bg-brand-yellow/10 text-brand-yellow-dark' :
                                                'bg-brand-red/10 text-brand-red'
                                        }`}>
                                        {cls.score}%
                                    </span>
                                </div>
                                <ProgressBar
                                    value={cls.score}
                                    color={cls.status === 'strong' ? 'green' : cls.status === 'average' ? 'yellow' : 'red'}
                                    className="h-3"
                                />
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Topics for Review (Weaknesses) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold font-geist flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-brand-red transform rotate-180" />
                            Topics to Review
                        </h2>
                    </div>
                    <Card className="p-0 overflow-hidden" noPadding>
                        {weakTopics.map((topic, i) => (
                            <div key={topic.topic} className={`p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${i !== weakTopics.length - 1 ? 'border-b-2 border-slate-100 dark:border-slate-800' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                                        <AlertCircleIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold font-geist text-slate-800 dark:text-slate-200">{topic.topic}</p>
                                        <p className="text-xs text-slate-500 uppercase font-bold">{topic.class}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs">Practice</Button>
                            </div>
                        ))}
                    </Card>
                </div>
            </section>

            {/* Achievements (Icon based) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold font-geist flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-yellow" />
                    Achievements
                </h2>
                <Card className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                        { icon: Medal, label: "Level 5", color: "text-brand-yellow", bg: "bg-brand-yellow" },
                        { icon: Star, label: "Sharpshooter", color: "text-brand-blue", bg: "bg-brand-blue" },
                        { icon: Flame, label: "7 Day Streak", color: "text-brand-red", bg: "bg-brand-red" },
                        { icon: Zap, label: "Speed Demon", color: "text-brand-green", bg: "bg-brand-green" },
                    ].map((achievement, i) => (
                        <div key={i} className="aspect-square flex flex-col items-center justify-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer group">
                            <div className={`w-14 h-14 ${achievement.bg} rounded-2xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/20 group-hover:scale-110 transition-transform`}>
                                <achievement.icon className="w-7 h-7 fill-white/20" />
                            </div>
                            <span className="text-xs font-bold text-center text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200">{achievement.label}</span>
                        </div>
                    ))}
                    {/* Locked slots */}
                    {[1, 2].map((i) => (
                        <div key={`locked-${i}`} className="aspect-square flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-300">
                                <Award className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-bold text-center text-slate-300">Locked</span>
                        </div>
                    ))}
                </Card>
            </section>
        </div>
    );
}

// Helper icon for this file
function AlertCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}
