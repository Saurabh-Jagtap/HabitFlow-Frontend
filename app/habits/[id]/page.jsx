"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/utils/axios.utils.js";
import { calculateCurrentStreak } from "@/app/utils/currentStreak.utils";
import { calculateLongestStreak } from "@/app/utils/longestStreak.utils";
import { generateCalendarDays } from "@/app/utils/generateCalendar.utils";
import {
    ArrowLeft,
    CheckCircle2,
    Trophy,
    Flame,
    CalendarDays,
    Target,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner.jsx";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const HabitDetailPage = () => {
    const { id } = useParams();

    const [habit, setHabit] = useState(null);
    const [habitLogs, setHabitLogs] = useState([]);
    const [completedToday, setCompletedToday] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [completionRate, setCompletionRate] = useState(0);
    const [completedDays, setCompletedDays] = useState(new Set());
    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completionLoading, setCompletionLoading] = useState(false);

    const fetchHabitData = useCallback(async () => {
        try {
            const [habitRes, logsRes] = await Promise.all([
                api.get(`/api/v1/habits/${id}`),
                api.get(`/api/v1/habits/${id}/logs`)
            ]);

            setHabit(habitRes.data.data);
            const logs = logsRes.data.data.logs;
            setHabitLogs(logs);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayLog = logs.find(log => {
                const d = new Date(log.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === today.getTime();
            });

            setCompletedToday(Boolean(todayLog?.completed));

            setCurrentStreak(calculateCurrentStreak(logs));
            setLongestStreak(calculateLongestStreak(logs));

            const total = logs.length;
            const completedCount = logs.filter(l => l.completed).length;

            setCompletionRate(total ? completedCount / total : 0);

            const completedSet = new Set(
                logs
                    .filter(l => l.completed)
                    .map(l => {
                        const d = new Date(l.date);
                        d.setHours(0, 0, 0, 0);
                        return d.getTime();
                    })
            );
            setCompletedDays(completedSet);

        } catch (err) {
            console.error(err);
            setError("Failed to load habit details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchHabitData();
    }, [id, fetchHabitData]);


    const handleLog = async () => {
        if (completionLoading) return;

        const previousState = completedToday;
        setCompletedToday(!previousState);

        try {
            setCompletionLoading(true);
            await api.post(`/api/v1/habits/${id}/log`, { completed: !completedToday });

            toast.success(completedToday ? "Progress undone" : "Great job! Keep it up!");

            await fetchHabitData();

        } catch {
            setCompletedToday(previousState);
            toast.error("Failed to update habit");
        } finally {
            setCompletionLoading(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen={true} />;

    if (error || !habit) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Habit not found</h2>
                <Link href="/dashboard" className="btn btn-primary btn-sm">Return Home</Link>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden selection:bg-indigo-500/30">

                {/* Ambient Background Effects */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                </div>

                {/* Navigation Bar */}
                <nav className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                        <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                </nav>

                <main className="relative z-10 px-4 pb-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Hero & Stats */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Hero Card */}
                        <section className="relative overflow-hidden rounded-3xl bg-slate-800/40 backdrop-blur-xl border border-white/5 p-8 sm:p-10">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4 max-w-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                            {habit.category || "General"}
                                        </span>
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                        {habit.title}
                                    </h1>

                                    <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                                        {habit.description || "Building consistency, one day at a time."}
                                    </p>
                                </div>

                                {/* Completion Button */}
                                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                                    <button
                                        onClick={handleLog}
                                        disabled={completionLoading}
                                        className={`group relative flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                            ${completedToday
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                            }`}
                                    >
                                        {completionLoading ? (
                                            <span className="loading loading-spinner loading-md"></span>
                                        ) : completedToday ? (
                                            <>
                                                <CheckCircle2 className="mr-2" size={24} />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                Mark as Done
                                            </>
                                        )}
                                    </button>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {completedToday ? "Great job today!" : "You haven't logged this today"}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-10">
                                <div className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                    <span>Consistency Score</span>
                                    <span>{Math.round(completionRate * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-700/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] animate-shimmer rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${Math.round(completionRate * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Stats Grid */}
                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard
                                icon={Flame}
                                label="Current Streak"
                                value={currentStreak}
                                suffix="Days"
                                color="text-orange-400"
                                bg="bg-orange-500/5"
                            />
                            <StatCard
                                icon={Trophy}
                                label="Best Streak"
                                value={longestStreak}
                                suffix="Days"
                                color="text-yellow-400"
                                bg="bg-yellow-500/5"
                            />
                            <StatCard
                                icon={Target}
                                label="Total Entries"
                                value={habitLogs.length}
                                suffix="Logs"
                                color="text-emerald-400"
                                bg="bg-emerald-500/5"
                            />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Calendar */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <CalendarDays size={20} className="text-indigo-400" />
                                    History
                                </h3>

                                {/* Month Controls */}
                                <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1">
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
                                    >
                                        ←
                                    </button>
                                    <span className="text-xs font-medium px-2 min-w-[80px] text-center">
                                        {currentMonth.toLocaleString("default", { month: "short", year: "numeric" })}
                                    </span>
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                    <div key={d} className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        {d}
                                    </div>
                                ))}

                                {generateCalendarDays(currentMonth).map((date, idx) => {
                                    if (!date) return <div key={`empty-${idx}`} />;

                                    const time = date.getTime();
                                    const isCompleted = completedDays.has(time);
                                    const isToday = time === new Date().setHours(0, 0, 0, 0);

                                    return (
                                        <div key={time} className="aspect-square flex flex-col items-center justify-center relative group cursor-default">
                                            <div className={`
                                    w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300
                                    ${isCompleted
                                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                                                    : "bg-slate-800/50 text-slate-500"
                                                }
                                    ${isToday && !isCompleted ? "ring-2 ring-indigo-500/50 text-indigo-300" : ""}
                                `}>
                                                {date.getDate()}
                                            </div>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                                                <div className="bg-slate-900 text-xs py-1 px-2 rounded border border-white/10 whitespace-nowrap">
                                                    {isCompleted ? "Completed" : "Missed"}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 text-center">
                                <p className="text-xs text-slate-500">
                                    Total logged days in {currentMonth.toLocaleString("default", { month: "long" })}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

const StatCard = ({ icon: Icon, label, value, suffix, color, bg }) => (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors duration-300">
        <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${bg} ${color}`}>
                <Icon size={20} />
            </div>
        </div>
        <div>
            <div className="text-3xl font-bold text-white mb-1">
                {value} <span className="text-sm font-medium text-slate-500">{suffix}</span>
            </div>
            <div className="text-sm font-medium text-slate-400">
                {label}
            </div>
        </div>
    </div>

);

export default HabitDetailPage;