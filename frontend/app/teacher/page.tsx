"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Plus, Upload, Users, BarChart3, Folder, ChevronRight, MoreVertical } from "lucide-react";
import { useState } from "react";
import { TeacherUploadModal } from "@/components/TeacherUploadModal";
import api, { getToken } from "@/lib/api";

export default function TeacherDashboard() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteName, setInviteName] = useState("");
    const [inviteMsg, setInviteMsg] = useState<string | null>(null);

    const classes = [
        {
            id: 1,
            title: "Introduction to Computer Science",
            code: "CS-101",
            sections: [
                { id: "A", students: 24, avgScore: 88 },
                { id: "B", students: 22, avgScore: 82 }
            ],
            color: "bg-brand-blue"
        },
        {
            id: 2,
            title: "Advanced Calculus",
            code: "MATH-202",
            sections: [
                { id: "A", students: 18, avgScore: 72 }
            ],
            color: "bg-brand-red"
        },
        {
            id: 3,
            title: "World History",
            code: "HIST-110",
            sections: [
                { id: "A", students: 30, avgScore: 91 },
                { id: "C", students: 28, avgScore: 89 }
            ],
            color: "bg-brand-yellow"
        },
    ];

    const handleUploadClick = (classCode: string, sectionId: string) => {
        // In a real app we'd track exactly which section
        setSelectedClassId(`${classCode}-${sectionId}`);
        setIsUploadOpen(true);
    };

    const handleInviteSubmit = async (e: React.FormEvent) => {
        e?.preventDefault();
        setInviteMsg(null);
        try {
            const token = getToken();
            if (!token) {
                setInviteMsg("You must be logged in as a teacher to invite students.");
                return;
            }
            const res = await api.inviteStudent(token, { email: inviteEmail, full_name: inviteName });
            setInviteMsg(res?.msg || "Invitation sent successfully");
            setInviteEmail("");
            setInviteName("");
            setIsInviteOpen(false);
        } catch (err: any) {
            setInviteMsg(err?.msg || err?.message || "Invite failed");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <TeacherUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-geist text-slate-900 dark:text-white">
                        Teacher Dashboard
                    </h1>
                    <p className="text-slate-500">Manage {classes.length} active classes.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsInviteOpen((s) => !s)} variant={isInviteOpen ? "secondary" : undefined}>
                        Invite Student
                    </Button>
                    <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Class
                    </Button>
                </div>
            </div>

            {isInviteOpen && (
                <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-lg border border-slate-200 dark:border-zinc-800">
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end" onSubmit={handleInviteSubmit}>
                        <div className="md:col-span-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full name</label>
                            <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-zinc-800" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-zinc-800" />
                        </div>
                        <div className="md:col-span-1 flex items-center gap-2">
                            <Button type="submit">Send Invite</Button>
                            <Button variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                        </div>
                    </form>
                    {inviteMsg && <p className="mt-3 text-sm font-bold">{inviteMsg}</p>}
                </div>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex flex-col gap-1" noPadding>
                    <span className="text-slate-500 text-xs font-bold uppercase">Total Students</span>
                    <span className="text-2xl font-bold font-geist">122</span>
                </Card>
                <Card className="p-4 flex flex-col gap-1" noPadding>
                    <span className="text-slate-500 text-xs font-bold uppercase">Active Quizzes</span>
                    <span className="text-2xl font-bold font-geist">8</span>
                </Card>
                <Card className="p-4 flex flex-col gap-1" noPadding>
                    <span className="text-slate-500 text-xs font-bold uppercase">Avg. Attendance</span>
                    <span className="text-2xl font-bold font-geist">94%</span>
                </Card>
                <Card className="p-4 flex flex-col gap-1" noPadding>
                    <span className="text-slate-500 text-xs font-bold uppercase">Materials Uploaded</span>
                    <span className="text-2xl font-bold font-geist">42</span>
                </Card>
            </div>

            {/* Class Hierarchy */}
            <section className="space-y-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-8 rounded-full ${cls.color}`}></div>
                            <h2 className="text-xl font-bold font-geist">{cls.title} <span className="text-slate-400 text-base font-normal">({cls.code})</span></h2>
                            <Button variant="ghost" size="sm" className="ml-auto"><MoreVertical className="w-4 h-4" /></Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
                            {cls.sections.map((section) => (
                                <Card key={section.id} className="group hover:border-slate-400 transition-colors cursor-pointer p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold font-geist text-lg flex items-center gap-2">
                                                <Folder className="w-5 h-5 text-slate-400 fill-slate-100 dark:fill-slate-800" />
                                                Section {section.id}
                                            </h3>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800`}>
                                            Avg: {section.avgScore}%
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {section.students} Students</span>
                                        <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" /> High Perf.</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => handleUploadClick(cls.code, section.id)}
                                        >
                                            <Upload className="w-4 h-4 mr-1" /> Material
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full">
                                            Analytics
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                            {/* Add Section Button */}
                            <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-400 transition-all min-h-[160px]">
                                + Add Section
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

