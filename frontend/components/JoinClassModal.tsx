"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import api from "@/lib/api";

interface JoinClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function JoinClassModal({ isOpen, onClose, onSuccess }: JoinClassModalProps) {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.joinClass(code);
            setCode("");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.message || "Failed to join class");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-geist text-slate-900 dark:text-white">
                        Join a Class
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Class Code
                        </label>
                        <input
                            autoFocus
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="e.g. XY12Z3"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-blue outline-none transition-colors font-mono uppercase text-lg"
                            maxLength={6}
                        />
                        <p className="text-xs text-slate-500">
                            Ask your teacher for the 6-character class code.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!code || isLoading}>
                            {isLoading ? "Joining..." : "Join Class"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
