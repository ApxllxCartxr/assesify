"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ArrowRight, BookOpen, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { JoinClassModal } from "@/components/JoinClassModal";
import api from "@/lib/api";

export default function DashboardPage() {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const data = await api.getClasses();
            setClasses(data);
        } catch (err) {
            console.error("Failed to fetch classes", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const pendingQuizzes = [
        { id: 101, class: "Advanced Calculus", title: "Derivatives Quiz", due: "Tomorrow", duration: "15 min", priority: "high" },
        { id: 102, class: "Intro to CS", title: "Data Structures Basics", due: "3 days", duration: "20 min", priority: "medium" },
    ];

    return (
        <div className="space-y-10 pb-20">
            <JoinClassModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onSuccess={fetchClasses}
            />

            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-geist text-slate-900 dark:text-white">
                        Welcome back! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">You have {pendingQuizzes.length} quizzes pending this week.</p>
                </div>
                <Button onClick={() => setIsJoinModalOpen(true)}>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Join New Class
                </Button>
            </div>

            {/* Pending Quizzes (Urgent) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold font-geist flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-red" />
                    Pending Quizzes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white dark:bg-zinc-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-brand-blue transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs font-bold uppercase text-slate-400 mb-1 block">{quiz.class}</span>
                                    <h3 className="text-lg font-bold font-geist group-hover:text-brand-blue transition-colors">{quiz.title}</h3>
                                </div>
                                {quiz.priority === 'high' && <span className="text-xs font-bold bg-brand-red/10 text-brand-red px-2 py-1 rounded">Urgent</span>}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quiz.duration}</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Due {quiz.due}</span>
                            </div>
                            <Link href="/learn">
                                <Button size="sm" className="w-full">Start Quiz</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Enrolled Classes */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold font-geist flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-green" />
                    My Classes
                </h2>
                {isLoading ? (
                    <div className="text-slate-500">Loading classes...</div>
                ) : classes.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-500 mb-4">You haven't joined any classes yet.</p>
                        <Button variant="outline" onClick={() => setIsJoinModalOpen(true)}>Join your first class</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <Card key={cls.id} className="group hover:-translate-y-1 transition-transform duration-300" noPadding>
                                <div className={`h-24 ${cls.color || 'bg-brand-blue'} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-xs font-bold uppercase opacity-90">{cls.section}</p>
                                        <h3 className="text-lg font-bold font-geist leading-tight">{cls.name}</h3>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>{cls.teacher}</span>
                                        {/* Placeholder progress */}
                                        <span className="font-bold text-brand-blue">0% Avg.</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Course Progress</span>
                                            <span>0%</span>
                                        </div>
                                        <ProgressBar value={0} className="h-2" />
                                    </div>

                                    <Link href={`/class/${cls.id}`}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            View Class
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
