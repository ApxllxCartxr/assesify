"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import Link from "next/link";
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
    LogOut,
    BookOpen
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { getUser, storeUser, removeToken, API_URL } from "@/lib/api";
import { TopicsToReview } from "@/components/TopicsToReview";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editMajor, setEditMajor] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSwitchUser = () => {
        removeToken();
        router.push("/login");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = getUser();
            if (storedUser) {
                setUser(storedUser);
                setEditName(storedUser.full_name);
                setEditMajor(storedUser.major || "");
                setEditLocation(storedUser.location || "");
            }

            try {
                const freshUser = await api.getProfile();
                setUser(freshUser);
                setEditName(freshUser.full_name);
                setEditMajor(freshUser.major || "");
                setEditLocation(freshUser.location || "");
                storeUser(freshUser);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };

        fetchUserData();
    }, []);

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const res = await api.updateProfile({
                full_name: editName,
                major: editMajor,
                location: editLocation
            });
            const updatedUser = res.user || { ...user, full_name: editName, major: editMajor, location: editLocation };
            storeUser(updatedUser);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const classPerformance = [
        { name: "Intro to CS", teacher: "Dr. Geller", score: 92, status: "strong" },
        { name: "Adv. Calculus", teacher: "Prof. Bing", score: 74, status: "average" },
        { name: "World History", teacher: "Mrs. Buffay", score: 88, status: "strong" },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b-2 border-slate-200 dark:border-slate-800">
                <div className="relative group">
                    <input
                        type="file"
                        id="avatarInput"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                    setIsLoading(true);
                                    const res = await api.uploadAvatar(formData);
                                    const updatedUser = { ...user, profile_pic: res.profile_pic };
                                    setUser(updatedUser);
                                    storeUser(updatedUser);
                                } catch (err) {
                                    console.error("Upload failed", err);
                                    alert("Failed to upload avatar");
                                } finally {
                                    setIsLoading(false);
                                }
                            }
                        }}
                    />
                    <div
                        onClick={() => document.getElementById('avatarInput')?.click()}
                        className="w-32 h-32 bg-brand-blue rounded-full border-4 border-white dark:border-zinc-800 shadow-xl flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        {user?.profile_pic ? (
                            <img
                                src={`${API_URL}/auth/avatars/${user.profile_pic.split('/').pop()}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.full_name?.charAt(0) || "U"
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrendingUp className="w-8 h-8 text-white rotate-45" /> {/* Camera-like swap */}
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-brand-green p-2 rounded-full border-4 border-white dark:border-zinc-800">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                </div>
                <div className="text-center md:text-left space-y-3 flex-1">
                    <div>
                        {isEditing ? (
                            <div className="flex flex-col gap-3 justify-center md:justify-start max-w-md">
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Full Name"
                                    className="text-4xl font-bold font-geist text-slate-900 dark:text-white bg-transparent border-b-2 border-brand-blue focus:outline-none w-full"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <input
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        placeholder="Location (e.g. New York, USA)"
                                        className="text-sm font-bold text-slate-500 bg-transparent border-b border-brand-blue focus:outline-none flex-1"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold font-geist text-slate-900 dark:text-white">
                                    {user?.full_name || "User"}
                                </h1>
                                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <MapPin className="w-4 h-4" /> {user?.location || "Location not set"} • Joined Dec 2025
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 font-bold text-slate-600 dark:text-slate-300 text-sm">
                            <Globe className="w-4 h-4 text-brand-blue" /> English (Native)
                        </span>
                        {isEditing ? (
                            <input
                                value={editMajor}
                                onChange={(e) => setEditMajor(e.target.value)}
                                placeholder="Major / Profession"
                                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border-2 border-brand-blue/30 focus:border-brand-blue outline-none font-bold text-slate-600 dark:text-slate-300 text-sm"
                            />
                        ) : (
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 font-bold text-slate-600 dark:text-slate-300 text-sm">
                                <Calculator className="w-4 h-4 text-brand-red" /> {user?.major || "Major not set"}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex justify-center md:justify-end gap-3">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSaveProfile} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                            <Button variant="ghost" className="text-brand-red hover:bg-brand-red/10" onClick={handleSwitchUser}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Switch User
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            {!user?.is_teacher && (
                <section>
                    <h2 className="text-xl font-bold font-geist mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-blue" />
                        Activity Stats
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                            <Flame className="w-8 h-8 text-brand-red fill-current" />
                            <div className="text-center">
                                <span className="text-2xl font-bold block font-geist">{user?.streak || 0}</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Day Streak</span>
                            </div>
                        </Card>
                        <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                            <Zap className="w-8 h-8 text-brand-blue fill-current" />
                            <div className="text-center">
                                <span className="text-2xl font-bold block font-geist">{user?.diamonds || 0}</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Diamonds</span>
                            </div>
                        </Card>
                        <Card className="flex flex-col items-center justify-center gap-3 p-6" noPadding>
                            <Trophy className="w-8 h-8 text-brand-yellow" />
                            <div className="text-center">
                                <span className="text-2xl font-bold block font-geist">❤️ {user?.health || 5}</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Health</span>
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
            )}

            {/* Performance & Topics */}
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

                {/* Topics for Review */}
                <div className="space-y-4">
                    <TopicsToReview limit={5} />
                </div>
            </section>

            {/* Achievements */}
            {!user?.is_teacher && (
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
                    </Card>
                </section>
            )}
        </div>
    );
}
