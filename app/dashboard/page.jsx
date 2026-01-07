"use client"
import React, { useEffect, useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import { RingCard } from "../components/RingCard.jsx";
import { StreakBadge } from "../components/StreakBadge.jsx";

const Dashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchHabits();
    fetchAnalytics();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${apiUrl}/api/v1/habits`);
      setHabits(res.data.data);
    } catch {
      setError("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(
        `${apiUrl}/api/v1/analytics/dashboard`);
      setAnalytics(res.data.data);
    } catch {
      console.error("Failed to load analytics");
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(
        `${apiUrl}/api/v1/habits`,
        { title, description, category }
      );

      setTitle("");
      setDescription("");
      setCategory("");
      fetchHabits();
      fetchAnalytics();
    } catch {
      setError("Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-base-200 px-4 py-10 overflow-hidden animate-fade-in-up">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-base-content/60">
            Track your habits and stay consistent
          </p>
        </div>

        {/* DashBoard Analytics */}
        {analytics && (
          <section className="space-y-6">

            <h2 className="text-xl font-semibold tracking-tight">
              Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Avg Completion */}
              <RingCard
                label="Avg Completion"
                value={analytics.AvgCompletionRate}
                color="indigo"
                suffix="%"
              />

              {/* Completed Today */}
              <RingCard
                label="Completed Today"
                value={
                  analytics.TotalHabits === 0
                    ? 0
                    : Math.round(
                      (analytics.CompletedTodayHabits / analytics.TotalHabits) * 100
                    )
                }
                color="emerald"
                suffix="%"
                subText={`${analytics.CompletedTodayHabits} / ${analytics.TotalHabits}`}
              />

              {/* Total Habits (static ring) */}
              <RingCard
                label="Total Habits"
                value={100}
                color="slate"
                displayValue={analytics.TotalHabits}
              />

              {/* Best Streak Badge */}
              <StreakBadge value={analytics.BestStreak} />

            </div>
          </section>
        )}

        {/* Create Habit */}
        <section className="rounded-2xl bg-base-100 border border-base-300 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create a new habit</h2>

          <form
            onSubmit={handleCreateHabit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered rounded-lg px-4 py-2
    bg-base-300/60
    border border-base-300
    focus:outline-none
    focus:ring-2 focus:ring-indigo-500/40
    focus:border-indigo-500/60
    transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Description"
              className="input input-bordered rounded-lg px-4 py-2
    bg-base-300/60
    border border-base-300
    focus:outline-none
    focus:ring-2 focus:ring-indigo-500/40
    focus:border-indigo-500/60
    transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="text"
              placeholder="Category"
              className="input input-bordered rounded-lg px-4 py-2
    bg-base-300/60
    border border-base-300
    focus:outline-none
    focus:ring-2 focus:ring-indigo-500/40
    focus:border-indigo-500/60
    transition"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div className="md:col-span-3 ">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium text-white
                           bg-gradient-to-r from-indigo-500 to-purple-500
    shadow-md shadow-indigo-500/20
    hover:shadow-lg hover:shadow-indigo-500/30
    hover:scale-[1.02]
    active:scale-[0.98]
    transition-all duration-200"
              >
                {loading ? (
                  <span className="loading loading-bars loading-sm"></span>
                ) : (
                  "Create Habit"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Habits List */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>

          {habits.length === 0 ? (
            <div className="rounded-xl bg-base-100 p-6 border border-base-300">
              No habits yet. Create your first habit to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <Link
                  key={habit._id}
                  href={`/habits/${habit._id}`}
                  className="group rounded-xl bg-base-100 p-5 border border-base-300
                             hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold">{habit.title}</h3>
                  <p className="text-sm text-base-content/70 mt-1">
                    {habit.description || "No description"}
                  </p>
                  <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full
                                   bg-indigo-500/10 text-indigo-400">
                    {habit.category || "General"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
