"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

const Dashboard = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchHabits()
    fetchAnalytics()
  }, [])

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiUrl}/api/v1/habits/`,
        { withCredentials: true, }
      );
      setHabits(response.data.data)
    } catch (err) {
      setError("Failed to load habits")
    } finally {
      setLoading(false)
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/analytics/dashboard`,
        { withCredentials: true }
      );
      setAnalytics(response.data.data);
    } catch (err) {
      console.error("Failed to load analytics");
    }
  };


  const handleCreateHabit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post(
        `${apiUrl}/api/v1/habits/`,
        { title, description, category },
        { withCredentials: true }
      );

      setTitle("")
      setDescription("")
      setCategory("")
      fetchHabits()
    } catch (err) {
      setError("Failed to create habit")
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/70">
            Manage your habits and track consistency
          </p>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

            <div className="group rounded-xl bg-base-100 p-5 shadow-sm border border-base-300
                    hover:shadow-lg transition-all duration-300">
              <div className="h-1 w-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 mb-4"></div>
              <p className="text-sm text-base-content/60">Total Habits</p>
              <h3 className="text-4xl font-semibold tracking-tight">
                {analytics.TotalHabits}
              </h3>
            </div>

            <div className="group rounded-xl bg-base-100 p-5 shadow-sm border border-base-300
                    hover:shadow-lg transition-all duration-300">
              <div className="h-1 w-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 mb-4"></div>
              <p className="text-sm text-base-content/60">Completed Today</p>
              <h3 className="text-4xl font-semibold text-emerald-500">
                {analytics.CompletedTodayHabits}
              </h3>
            </div>

            <div className="group rounded-xl bg-base-100 p-5 shadow-sm border border-base-300
                    hover:shadow-lg transition-all duration-300">
              <div className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-cyan-500 mb-4"></div>
              <p className="text-sm text-base-content/60">Avg Completion</p>
              <h3 className="text-4xl font-semibold text-blue-500">
                {analytics.AvgCompletionRate}%
              </h3>
            </div>

            <div className="group rounded-xl bg-base-100 p-5 shadow-sm border border-base-300
                    hover:shadow-lg transition-all duration-300">
              <div className="h-1 w-full rounded-full bg-linear-to-r from-pink-500 to-rose-500 mb-4"></div>
              <p className="text-sm text-base-content/60">Best Streak</p>
              <h3 className="text-4xl font-semibold text-rose-500">
                {analytics.BestStreak} days
              </h3>
            </div>

          </div>
        )}


        <div className="card bg-base-100 shadow-md">
          <div className="card-body gap-4">
            <h2 className="card-title">Create New Habit</h2>

            <form
              onSubmit={handleCreateHabit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Description"
                className="input input-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="text"
                placeholder="Category"
                className="input input-bordered w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center
             rounded-xl px-6 py-3 font-medium text-white
             bg-linear-to-r from-indigo-500 to-purple-600
             shadow-md hover:shadow-lg
             hover:from-indigo-600 hover:to-purple-700
             transition-all duration-500"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-bars loading-sm"></span>
                  ) : (
                    "Create Habit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>

          {habits.length === 0 ? (
            <div className="alert alert-info">
              No habits yet. Create your first habit to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit) => (
                <Link
                  key={habit._id}
                  href={`/habits/${habit._id}`}
                  className="group rounded-xl bg-base-100 p-5
             border border-base-300
             hover:shadow-xl hover:-translate-y-1
             transition-all duration-300"
                >
                  <div className="card-body">
                    <h3 className="card-title">{habit.title}</h3>
                    <p className="text-sm text-base-content/70">
                      {habit.description || "No description"}
                    </p>
                    <div className="mt-2">
                      <span className="badge badge-outline">
                        {habit.category || "General"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
