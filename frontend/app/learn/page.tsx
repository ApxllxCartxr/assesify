"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Heart, Flag } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/Button";
import { clsx } from "clsx";

export default function LearnPage() {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "complete">("idle");
    const [progress, setProgress] = useState(20);
    const [stats, setStats] = useState({ xp: 0, accuracy: 100 });

    const question = {
        text: "Which of the following describes the slope of a line?",
        options: [
            { id: 1, text: "Rise over Run", image: "📈" },
            { id: 2, text: "Run over Rise", image: "📉" },
            { id: 3, text: "Y-intercept", image: "📍" },
            { id: 4, text: "The origin point", image: "⭕" },
        ],
        correctId: 1,
    };

    const handleCheck = () => {
        if (selectedOption === null) return;

        if (selectedOption === question.correctId) {
            setStatus("correct");
            setProgress((p) => Math.min(p + 20, 100));
            setStats(s => ({ ...s, xp: s.xp + 10 }));
        } else {
            setStatus("incorrect");
            setStats(s => ({ ...s, accuracy: 0 })); // Mock logic for demo
        }
    };

    const handleNext = () => {
        if (progress >= 100) {
            setStatus("complete");
        } else {
            // Reset for next question mock
            setStatus("idle");
            setSelectedOption(null);
        }
    };

    if (status === "complete") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-8 text-center animate-in zoom-in duration-500">
                <div className="space-y-8 max-w-md w-full">
                    <div className="space-y-4">
                        <div className="w-32 h-32 bg-brand-yellow rounded-full mx-auto flex items-center justify-center text-6xl shadow-xl shadow-brand-yellow/20 animate-bounce">
                            🏆
                        </div>
                        <h1 className="text-4xl font-bold font-geist text-slate-900 dark:text-white">
                            Lesson Complete!
                        </h1>
                        <p className="text-slate-500 text-lg">You're making great progress.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-brand-blue p-6 rounded-2xl text-white shadow-lg border-b-4 border-brand-blue-dark">
                            <div className="mb-2 opacity-80 font-bold uppercase text-xs tracking-wider">Total XP</div>
                            <div className="text-4xl font-bold font-geist">+ {stats.xp}</div>
                        </div>
                        <div className="bg-brand-green p-6 rounded-2xl text-white shadow-lg border-b-4 border-brand-green-dark">
                            <div className="mb-2 opacity-80 font-bold uppercase text-xs tracking-wider">Accuracy</div>
                            <div className="text-4xl font-bold font-geist">{stats.accuracy}%</div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link href="/dashboard">
                            <Button size="lg" className="w-full">
                                Continue
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900">
            {/* Header */}
            <header className="p-6 max-w-5xl mx-auto w-full flex items-center justify-between gap-6">
                <Link href="/dashboard">
                    <X className="w-6 h-6 text-slate-400 hover:text-slate-600 cursor-pointer" />
                </Link>
                <ProgressBar value={progress} className="flex-1" />
                <div className="flex items-center gap-2 text-brand-red font-bold animate-pulse">
                    <Heart className="w-6 h-6 fill-current" />
                    <span>5</span>
                </div>
            </header>

            {/* Question Content */}
            <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col justify-center gap-12">
                <h1 className="text-3xl md:text-4xl font-bold font-geist text-center text-slate-800 dark:text-slate-100">
                    {question.text}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => status === "idle" && setSelectedOption(opt.id)}
                            disabled={status !== "idle"}
                            className={clsx(
                                "p-6 rounded-2xl border-2 border-b-4 text-left transition-all active:border-b-2 active:translate-y-[2px]",
                                selectedOption === opt.id
                                    ? "border-brand-blue-dark bg-brand-blue/10 ring-2 ring-brand-blue"
                                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-zinc-800",
                                status === 'correct' && opt.id === question.correctId && "bg-brand-green/20 border-brand-green text-brand-green ring-0",
                                status === 'incorrect' && selectedOption === opt.id && opt.id === opt.id && "bg-brand-red/20 border-brand-red text-brand-red ring-0"
                            )}
                        >
                            <span className="block text-4xl mb-4">{opt.image}</span>
                            <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{opt.text}</span>
                        </button>
                    ))}
                </div>
            </main>

            {/* Footer Interface */}
            <footer
                className={clsx(
                    "p-6 border-t-2 border-slate-200 dark:border-slate-800 sticky bottom-0 transition-colors duration-300",
                    status === "correct" ? "bg-brand-green/10 border-brand-green/20" : "",
                    status === "incorrect" ? "bg-brand-red/10 border-brand-red/20" : "bg-white dark:bg-zinc-900"
                )}
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="hidden md:block">
                        {status === "correct" && (
                            <div className="flex items-center gap-3 text-brand-green font-bold text-xl animate-bounce">
                                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white">
                                    <span className="text-2xl">✓</span>
                                </div>
                                <span>Nicely done!</span>
                            </div>
                        )}
                        {status === "incorrect" && (
                            <div className="flex items-center gap-3 text-brand-red font-bold text-xl animate-shake">
                                <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white">
                                    <span className="text-2xl">✕</span>
                                </div>
                                <span>Correct answer: Rise over Run</span>
                            </div>
                        )}
                        {status === "idle" && (
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-transparent">
                                <Flag className="w-4 h-4 mr-2" /> Report
                            </Button>
                        )}
                    </div>

                    <div className="w-full md:w-auto">
                        {status === "idle" ? (
                            <Button
                                className="w-full md:w-40"
                                size="lg"
                                onClick={handleCheck}
                                disabled={selectedOption === null}
                            >
                                Check
                            </Button>
                        ) : (
                            <Button
                                variant={status === "correct" ? "primary" : "danger"}
                                className="w-full md:w-40"
                                size="lg"
                                onClick={handleNext}
                            >
                                Continue
                            </Button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
