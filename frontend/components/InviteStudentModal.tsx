"use client";

import { useState } from "react";
import { X, Send, UserPlus } from "lucide-react";
import { Button } from "./Button";
import api, { getToken } from "@/lib/api";

interface InviteStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteStudentModal({ isOpen, onClose }: InviteStudentModalProps) {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const token = getToken();
        if (!token) {
            setError("Authentication token not found. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            await api.inviteStudent(token, { email, full_name: fullName });
            setSuccess(true);
            setEmail("");
            setFullName("");
            // Don't close immediately so they can see success
            setTimeout(onClose, 2000);
        } catch (err: any) {
            setError(err?.message || "Failed to invite student");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-brand-purple" />
                        </div>
                        <h2 className="text-xl font-bold font-geist text-slate-900 dark:text-white">
                            Invite Student
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {success ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green">
                            <Send className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold">Invitation Sent!</h3>
                        <p className="text-slate-500 text-sm">A temporary password has been generated for the student.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Student's Full Name
                            </label>
                            <input
                                autoFocus
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Student Name"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-purple outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Student's Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@example.com"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-brand-purple outline-none transition-colors"
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
                            <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-dark text-white" disabled={!email || !fullName || isLoading}>
                                {isLoading ? "Sending..." : "Send Invite"}
                                <Send className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
