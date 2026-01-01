"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
    Users,
    BarChart3,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Search,
    BookOpen
} from "lucide-react";
import api from "@/lib/api";

interface StudentAttempt {
    student_name: string;
    student_email: string;
    score: number;
    completed_at: string;
    details: Array<{
        question_text: string;
        student_answer: string;
        is_correct: boolean;
    }>;
}

interface AnalyticsItem {
    quiz_id: number;
    lesson_title: string;
    lesson_id: number;
    topic: string;
    attempts_count: number;
    students: StudentAttempt[];
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await api.getTeacherAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const filteredAnalytics = analytics.filter(item =>
        item.lesson_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black font-geist text-slate-900 dark:text-white">
                        Performance Analytics
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Track how your students are performing across all quizzes.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by topic or title..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 focus:border-brand-purple outline-none transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredAnalytics.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-slate-600">No analytics data yet</h3>
                        <p className="text-slate-500">Upload materials and let students take quizzes to see results here.</p>
                    </div>
                ) : (
                    filteredAnalytics.map((item) => (
                        <div key={item.quiz_id} className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div
                                className="p-6 cursor-pointer flex items-center justify-between"
                                onClick={() => setExpandedQuiz(expandedQuiz === item.quiz_id ? null : item.quiz_id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-brand-purple" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-purple mb-0.5">{item.topic}</p>
                                        <h3 className="text-xl font-bold font-geist text-slate-900 dark:text-white">{item.lesson_title}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-black">
                                            <Users className="w-4 h-4" /> {item.attempts_count}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Submissions</p>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-brand-green font-black">
                                            {item.students.length > 0
                                                ? Math.round(item.students.reduce((acc, curr) => acc + curr.score, 0) / item.students.length)
                                                : 0}%
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Score</p>
                                    </div>
                                    {expandedQuiz === item.quiz_id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>

                            {expandedQuiz === item.quiz_id && (
                                <div className="p-6 border-t-2 border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-zinc-800/20">
                                    {item.students.length === 0 ? (
                                        <p className="text-center text-slate-500 py-4">No submissions yet for this quiz.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                                        <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Student</th>
                                                        <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Score</th>
                                                        <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Date</th>
                                                        <th className="pb-4"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {item.students.map((student, idx) => (
                                                        <StudentRow key={idx} student={student} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function StudentRow({ student }: { student: StudentAttempt }) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    return (
        <>
            <tr className="group">
                <td className="py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">
                            {student.student_name[0]}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{student.student_name}</p>
                            <p className="text-xs text-slate-400">{student.student_email}</p>
                        </div>
                    </div>
                </td>
                <td className="py-4">
                    <div className={`text-sm font-black ${student.score >= 80 ? 'text-brand-green' : student.score >= 50 ? 'text-brand-orange' : 'text-brand-red'}`}>
                        {Math.round(student.score)}%
                    </div>
                </td>
                <td className="py-4 text-xs font-bold text-slate-500">
                    {new Date(student.completed_at).toLocaleDateString()}
                </td>
                <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
                        {isDetailsOpen ? "Hide Answers" : "View Answers"}
                    </Button>
                </td>
            </tr>
            {isDetailsOpen && (
                <tr>
                    <td colSpan={4} className="pb-6 px-4">
                        <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Answer Key Analysis</h4>
                            <div className="space-y-3">
                                {student.details.map((detail, dIdx) => (
                                    <div key={dIdx} className="flex gap-4 items-start pb-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                        {detail.is_correct ? (
                                            <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{detail.question_text}</p>
                                            <p className="text-xs">
                                                <span className="font-black text-slate-400 uppercase mr-2">Answered:</span>
                                                <span className={detail.is_correct ? 'text-brand-green font-bold' : 'text-brand-red font-bold'}>
                                                    {detail.student_answer}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
