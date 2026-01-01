"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, Play, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import Link from "next/link";
import api, { API_URL } from "@/lib/api";

interface Lesson {
    id: number;
    title: string;
    topic: string;
    file_path: string;
    created_at: string;
}

export default function LearnPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const data = await api.getLessons();
                setLessons(data);
            } catch (err) {
                console.error("Failed to fetch lessons", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.topic.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-black font-geist text-slate-900 dark:text-white mt-10">
                    What do you want to learn today?
                </h1>
                <p className="text-slate-500 text-lg">
                    Select a topic to review the materials or jump straight into a practice quiz.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-purple transition-colors" />
                <input
                    type="text"
                    placeholder="Search by topic, subject or title..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 focus:border-brand-purple outline-none transition-all shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Lessons List */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-geist">Available Topics ({filteredLessons.length})</h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : filteredLessons.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
                        <p className="text-slate-500">No topics found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredLessons.map((lesson) => (
                            <Card key={lesson.id} className="hover:border-brand-purple hover:shadow-xl transition-all group overflow-hidden border-2 border-slate-200 dark:border-slate-800" noPadding>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple px-2 py-0.5 bg-brand-purple/10 rounded-full">
                                                {lesson.topic || "General"}
                                            </span>
                                            <h3 className="text-xl font-bold font-geist text-slate-900 dark:text-white group-hover:text-brand-purple transition-colors">
                                                {lesson.title}
                                            </h3>
                                        </div>
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-400">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15m est.</span>
                                        <span className="flex items-center gap-1">• Added {new Date(lesson.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => window.open(`${API_URL}/lessons/${lesson.id}/file`, '_blank')}
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Review Notes
                                        </Button>
                                        <Link href={`/quiz/${lesson.id}`} className="flex-1">
                                            <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white border-b-4 border-brand-green-dark">
                                                <Play className="w-4 h-4 mr-2 fill-current" />
                                                Start Quiz
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
