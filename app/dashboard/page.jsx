"use client"
import React, { useEffect, useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation.js";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { SemiCircleGauge } from "../components/Speedometer.jsx";
import {
  MoveRight,
  Sparkles,
  Plus,
  LayoutDashboard,
  Trash2,
  MoreVertical,
  Activity,
  Calendar,
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const router = useRouter();

  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  
  const [highlightHabitId, setHighlightHabitId] = useState(null);

  // Date info
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const lastId = sessionStorage.getItem("lastCreatedHabitId");
    if (lastId) {
      setHighlightHabitId(lastId);
      sessionStorage.removeItem("lastCreatedHabitId");
    }
  }, []);

  useEffect(() => {
    fetchHabits();
    fetchAnalytics();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/habits`);
      setHabits(res.data.data);
    } catch {
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`/api/v1/analytics/dashboard`);
      setAnalytics(res.data.data);
    } catch {
      console.error("Failed to load analytics");
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating habit...");

    try {
      setLoading(true);
      const res = await api.post(`/api/v1/habits`, { title, description, category });
      const habit = res.data.data._id;
      
      // Clear form
      setTitle("");
      setDescription("");
      setCategory("");

      sessionStorage.setItem("lastCreatedHabitId", habit);
      router.push(`/habits/${habit}`);
    } catch {
      toast.error("Failed to create habit", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const confirm = window.confirm("Are you sure you want to delete this habit?");
    if (!confirm) return;

    try {
      await api.delete(`/api/v1/habits/${habitId}`);
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
      toast.success("Habit deleted");
      fetchAnalytics();
    } catch {
      toast.error("Failed to delete habit");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-md">{error}</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-base-200 overflow-x-hidden pb-20 selection:bg-indigo-500/30">
      
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-medium text-sm uppercase tracking-wider mb-1">
              <Calendar size={14} />
              <span>{today}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">
              Dashboard
            </h1>
          </div>
        </header>

        {/* ANALYTICS */}
        {analytics && (
          <section className="animate-fade-in-up delay-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Main Progress (The Speedometer) */}
              <div className="md:col-span-1 bg-base-100/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col items-center justify-between min-h-[220px]">
                 <div className="w-full flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                       <Activity size={18} className="text-indigo-500"/> Daily Goal
                    </h3>
                 </div>
                 
                 <SemiCircleGauge 
                    value={analytics.CompletedTodayHabits} 
                    total={analytics.TotalHabits} 
                 />

                 <div className="text-center mt-[-10px]">
                    <p className="text-sm text-base-content/60">
                       You've completed <span className="text-base-content font-bold">{analytics.CompletedTodayHabits}</span> out of <span className="text-base-content font-bold">{analytics.TotalHabits}</span> habits
                    </p>
                 </div>
              </div>

              {/* Middle Column */}
              <div className="md:col-span-1 flex flex-col gap-4">
                 
                 {/* Card 2: Streak (Fire) */}
                 <div className="flex-1 bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 p-5 rounded-3xl flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 text-orange-500/10 group-hover:text-orange-500/20 transition-all duration-500">
                       <Flame size={120} />
                    </div>
                    <div>
                       <p className="text-base-content/60 text-sm font-medium mb-1 flex items-center gap-1">
                          <Flame size={14} className="text-orange-500" /> Best Streak
                       </p>
                       <h4 className="text-4xl font-bold text-base-content">
                          {analytics.BestStreak} <span className="text-lg font-normal text-base-content/50">days</span>
                       </h4>
                    </div>
                 </div>

                 {/* Card 3: Total Habits */}
                 <div className="flex-1 bg-base-100/60 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex items-center justify-between">
                    <div>
                       <p className="text-base-content/60 text-sm font-medium mb-1 flex items-center gap-1">
                          <Target size={14} className="text-blue-500" /> Total Active
                       </p>
                       <h4 className="text-3xl font-bold text-base-content">
                          {analytics.TotalHabits}
                       </h4>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                       <LayoutDashboard size={24} />
                    </div>
                 </div>
              </div>

              {/* Right Column: Detailed Metrics */}
              <div className="md:col-span-1 bg-base-100/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center gap-6">
                 <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                    <BarChart3 size={18} className="text-purple-500"/> Efficiency
                 </h3>
                 
                 <div className="space-y-6">
                    <ProgressBar 
                       label="Avg. Completion" 
                       value={analytics.AvgCompletionRate} 
                       colorClass="bg-gradient-to-r from-indigo-500 to-purple-500"
                       icon={Trophy}
                    />
                    
                    <ProgressBar 
                       label="Weekly Goal" 
                       value={Math.round(analytics.AvgCompletionRate * 0.9)} 
                       colorClass="bg-gradient-to-r from-emerald-500 to-teal-500"
                       icon={CheckCircle2}
                    />
                 </div>

                 <div className="pt-4 border-t border-base-200 text-xs text-base-content/50 text-center">
                    Consistency is key. Keep it up!
                 </div>
              </div>

            </div>
          </section>
        )}

        {/* Create Habit Section */}
        <section className="animate-fade-in-up delay-200">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200/50 border border-white/10 shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
               <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <Plus size={20} />
               </div>
               <h2 className="text-xl font-semibold">Create a new habit</h2>
            </div>

            <form onSubmit={handleCreateHabit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                <input
                  type="text"
                  placeholder="Habit Title (e.g., Read 30 mins)"
                  className="input input-md w-full bg-base-100/50 border-base-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Category (e.g., Health)"
                  className="input input-md w-full md:w-1/3 bg-base-100/50 border-base-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-md bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl shadow-lg shadow-indigo-500/30 w-full md:w-auto min-w-[140px]"
              >
                {loading ? <span className="loading loading-dots loading-sm"></span> : "Add Habit"}
              </button>
            </form>
            
            {/* Optional Description Field */}
            <div className="mt-4">
               <input
                  type="text"
                  placeholder="Description (Optional motivation...)"
                  className="input input-sm w-full bg-transparent border-b border-base-300 focus:border-indigo-500 border-t-0 border-x-0 rounded-none px-1 focus:outline-none transition-all placeholder:text-base-content/40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               />
            </div>
          </div>
        </section>

        {/* Habits List Section */}
        <section className="animate-fade-in-up delay-300">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-base-content/80">
                <LayoutDashboard className="text-indigo-500" size={20} />
                <h2>Your Habits</h2>
              </div>
              <span className="text-sm text-base-content/50">{habits.length} Active</span>
           </div>

          {habits.length === 0 ? (
            <div className="rounded-2xl bg-base-100/50 border border-dashed border-base-300 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/40">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-medium">No habits yet</h3>
              <p className="text-base-content/60">Start your journey by creating your first habit above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {habits.map((habit) => {
                const isNew = habit._id === highlightHabitId;

                return (
                  <div
                    key={habit._id}
                    className={`group relative rounded-2xl bg-base-100 p-5 border transition-all duration-300 ease-out hover:-translate-y-1
                    ${isNew 
                      ? "border-indigo-500 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500/50" 
                      : "border-base-200 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10"
                    }`}
                  >
                    {/* Action Menu - Positioned relatively to be clickable without triggering Link */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="dropdown dropdown-end dropdown-bottom dropdown-hover">
                        <div 
                          tabIndex={0} 
                          role="button" 
                          onClick={(e) => e.preventDefault()} // Prevent navigation when clicking menu
                          className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content hover:bg-base-200"
                        >
                          <MoreVertical size={16} />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl w-40 border border-base-200">
                          <li>
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // Stop Link propagation
                                handleDeleteHabit(habit._id);
                              }}
                              className="text-error hover:bg-error/10 flex items-center gap-2"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <Link href={`/habits/${habit._id}`} className="block h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-base-content group-hover:text-indigo-600 transition-colors pr-8">
                            {habit.title}
                          </h3>
                          
                          <p className="text-sm text-base-content/60 mt-1 line-clamp-2 min-h-[2.5rem]">
                            {habit.description || "Build consistency with this habit."}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-base-200 flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {habit.category || "General"}
                          </span>

                          <div className="flex items-center gap-2">
                             {isNew && (
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                  <Sparkles size={12} /> New
                                </span>
                             )}
                             <MoveRight size={16} className="text-base-content/30 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Dashboard