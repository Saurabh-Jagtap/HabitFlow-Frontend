"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/app/utils/axios.utils.js";
import Image from "next/image";
import { calculateCurrentStreak } from "@/app/utils/currentStreak.utils";
import { calculateLongestStreak } from "@/app/utils/longestStreak.utils";
import { generateCalendarDays } from "@/app/utils/generateCalendar.utils";
import { SquareCheckBig } from "lucide-react";
import toast from "react-hot-toast";

const HabitDetailPage = () => {
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  const avatarUrl = habit?.userId?.avatar || "/Profile_avatar_placeholder.png";

  // Fetch

  useEffect(() => {
    if (!id) return;

    const fetchHabit = async () => {
      try {
        const habitRes = await api.get(`${apiUrl}/api/v1/habits/${id}`);
        setHabit(habitRes.data.data);

        const logsRes = await api.get(
          `${apiUrl}/api/v1/habits/${id}/logs`,
          { withCredentials: true }
        );

        const logs = logsRes.data.data.logs;
        setHabitLogs(logs);

        // completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayLog = logs.find(log => {
          const d = new Date(log.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });

        setCompletedToday(Boolean(todayLog?.completed));

        // streaks
        setCurrentStreak(calculateCurrentStreak(logs));
        setLongestStreak(calculateLongestStreak(logs));

        // completion rate
        const total = logs.length;
        const completed = logs.filter(l => l.completed).length;
        setCompletionRate(total ? completed / total : 0);

        // completed days set
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
        setError("Failed to load habit");
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

  // Log Toggle

  const handleLog = async () => {

    const toastId = toast.loading("Loading...")

    if (completionLoading) return;
    try {
      setCompletionLoading(true);
      await api.post(
        `${apiUrl}/api/v1/habits/${id}/log`,
        { completed: !completedToday },
        { withCredentials: true }
      );
      setCompletedToday(prev => !prev);
      // re-fetch logs
      setLoading(true);
      await new Promise(r => setTimeout(r, 300));
      window.location.reload();
    } catch {
      toast.error("Failed to update habit", {id:toastId})
    } finally {
      setCompletionLoading(false);
    }
  };

  // States

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  if (error || !habit) {
    return <div className="text-center mt-20">Something went wrong</div>;
  }

  // UI

  return (
    <main className="relative min-h-[90vh] bg-base-200 px-4 py-2 sm:py-14 overflow-hidden animate-fade-in-up">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-72 w-72 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute top-1/4 right-1/4 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      <section className="max-w-6xl mt-7 mx-auto rounded-2xl bg-base-100 border border-base-300 shadow-xl p-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Header */}
            <div className="rounded-2xl bg-base-200/60 p-5 sm:p-0 sm:bg-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4
                items-center text-center sm:text-left">

                <div className="relative h-16 w-16 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-base-100 overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold">{habit.title}</h1>
                  <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                    {habit.category || "General"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-base-content/70">
              {habit.description || "No description provided."}
            </p>

            {/* CTA */}
            <button
              onClick={handleLog}
              disabled={completionLoading || completedToday}
              className={`w-full py-4 rounded-xl font-medium transition-all duration-300 sm:py-3
                ${completedToday
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:ring-2 hover:ring-indigo-500/40"
                }`}
            >
              {completionLoading ? (
                <span className="loading loading-bars loading-md"></span>
              ) : completedToday ? (
                <span className="flex items-center justify-center gap-2">
                  Completed Today <SquareCheckBig size={18} />
                </span>
              ) : (
                "Mark as Done"
              )}
            </button>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat label="Current Streak" value={`${currentStreak} days`} color="text-indigo-400" />
              <Stat label="Longest Streak" value={`${longestStreak} days`} color="text-purple-400" />
              <Stat label="Completion Rate" value={`${Math.round(completionRate * 100)}%`} color="text-emerald-400" />
            </div>

            {/* Progress */}
            <div>
              <p className="text-sm text-base-content/60 mb-2">Overall Progress</p>
              <div className="h-3 w-full rounded-full bg-base-300 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.round(completionRate * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-xl bg-base-200 p-4 border border-base-300
                order-2 lg:order-0">

            <div className="rounded-xl bg-base-200 p-4 border border-base-300
                max-h-130 overflow-y-auto
                sm:max-h-none sm:overflow-visible">

              {/* Month Nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-base-300 hover:bg-base-100 transition"
                >
                  ←
                </button>

                <h3 className="font-medium">
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-base-300 hover:bg-base-100 transition"
                >
                  →
                </button>
              </div>

              {/* Calendar */}
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-base-content/60">{day}</div>
                ))}

                {generateCalendarDays(currentMonth).map((date, idx) => {
                  if (!date) return <div key={`empty-${idx}`} />;

                  const time = date.getTime();
                  const isCompleted = completedDays.has(time);
                  const isToday = time === new Date().setHours(0, 0, 0, 0);

                  return (
                    <div key={time} className="relative group">
                      <div
                        className={`h-10 sm:h-11 flex items-center justify-center rounded-lg
                        ${isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-base-300 text-base-content/40"}
                        ${isToday ? "ring-2 ring-indigo-500" : ""}
                      `}
                      >
                        {date.getDate()}
                      </div>

                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md
                                    bg-base-100 border border-base-300 opacity-0 group-hover:opacity-100 transition">
                        {isCompleted ? "Completed" : "Not completed"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="rounded-xl bg-base-200 p-4 border border-base-300">
    <p className="text-sm text-base-content/60">{label}</p>
    <h3 className={`text-2xl font-semibold ${color}`}>{value}</h3>
  </div>
);

export default HabitDetailPage;
