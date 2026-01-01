"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/Button";
import Link from "next/link";
import api, { getUser, API_URL } from "@/lib/api";

interface Lesson {
    id: number;
    title: string;
    topic: string;
    file_path: string;
}

export function TopicsToReview({ limit = 5 }: { limit?: number }) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setUser(getUser());
        const fetchLessons = async () => {
            try {
                const data = await api.getLessons();
                setLessons(data.slice(0, limit));
            } catch (err) {
                console.error("Failed to fetch lessons", err);
            }
        };
        fetchLessons();
    }, [limit]);

    return (
        <div className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/50">
                <h3 className="font-bold font-geist text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-purple" />
                    Topics to Review
                </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {lessons.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                        No topics assigned yet.
                    </div>
                ) : (
                    lessons.map((lesson) => (
                        <div key={lesson.id} className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                            <div className="flex justify-between items-start gap-3">
                                <div
                                    className="min-w-0 cursor-pointer flex-1"
                                    onClick={() => window.open(`${API_URL}/lessons/${lesson.id}/file`, '_blank')}
                                >
                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-purple transition-colors">
                                        {lesson.title}
                                    </p>
                                    <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">
                                        {lesson.topic || "General"}
                                    </p>
                                </div>
                                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => window.open(`${API_URL}/lessons/${lesson.id}/file`, '_blank')}
                                        className="p-1.5 hover:bg-brand-purple/10 text-slate-400 hover:text-brand-purple rounded-lg transition-colors"
                                        title="View PDF"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                    <Link href={`/quiz/${lesson.id}`}>
                                        <button
                                            className="p-1.5 hover:bg-brand-green/10 text-slate-400 hover:text-brand-green rounded-lg transition-colors"
                                            title="Practice Quiz"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {lessons.length > 0 && (
                <Link href="/learn" className="block p-3 text-center border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                    <span className="text-xs font-bold text-brand-purple">View All Topics</span>
                </Link>
            )}
        </div>
    );
}
