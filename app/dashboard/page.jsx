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

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiUrl}/api/v1/habits/`, {
        withCredentials: true,
      });
      setHabits(response.data.data)
    } catch (err) {
      setError("Failed to load habits")
    } finally {
      setLoading(false)
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
      <div className="max-w-5xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/70">
            Manage your habits and track consistency
          </p>
        </div>

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
                  className="btn btn-primary w-full md:w-auto"
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
                  className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
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
