"use client";

import { useState } from "react";
import { X, Plus, BookOpen } from "lucide-react";
import { Button } from "./Button";
import api from "@/lib/api";

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateClassModal({ isOpen, onClose, onSuccess }: CreateClassModalProps) {
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.createClass(name, section);
            setName("");
            setSection("");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.message || "Failed to create class");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold font-geist text-slate-900 dark:text-white">
                            Create a New Class
                        </h2>
                    </div>
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
                            Class Name
                        </label>
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Advanced Biology"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-blue outline-none transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Section / Year
                        </label>
                        <input
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="e.g. Semester 2, 2024"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-blue outline-none transition-colors"
                            required
                        />
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
                        <Button type="submit" disabled={!name || !section || isLoading}>
                            {isLoading ? "Creating..." : "Create Class"}
                            <Plus className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
