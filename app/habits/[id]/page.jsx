"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { calculateCurrentStreak } from '@/app/currentStreak'
import { calculateLongestStreak } from '@/app/longestStreak'
import Image from 'next/image'

const habitDetailPage = () => {

  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [habitLog, setHabitLog] = useState([])
  const [habit, setHabit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completedToday, setCompletedToday] = useState(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [completionLoading, setCompletionLoading] = useState(false)

  const avatarUrl = habit?.userId?.avatar ? habit.userId.avatar : "/Profile_avatar_placeholder.png"

  useEffect(() => {
    const fetchHabitsByID = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/habits/${id}`,
          { withCredentials: true }
        );
        setHabit(response.data.data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }

    }
    if (id) {
      fetchHabitsByID();
      fetchHabitLogs();
    }
  }, [id])

  const fetchHabitLogs = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/habits/${id}/logs`,
        { withCredentials: true }
      );
      const logs = response.data.data.logs;
      setHabitLog(logs)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let completed = false;

      for (const log of logs) {
        const logDate = new Date(log.date)
        logDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === today.getTime()) {
          completed = log.completed;
          break;
        }
      }
      setCompletedToday(completed)

      const currStreak = calculateCurrentStreak(logs)
      setCurrentStreak(currStreak)

      const longStreak = calculateLongestStreak(logs)
      setLongestStreak(longStreak)

      // Completion Rate logic
      let totalCompletions = 0

      for (const log of logs) {
        if (log.completed === true) {
          totalCompletions++
        }
      }

      let completeRate = 0;
      let totalLogs = logs.length;

      if (totalLogs === 0) {
        completeRate = 0;
      } else {
        completeRate = totalCompletions / totalLogs;
      }

      setCompletionRate(completeRate)

    } catch (error) {
      setError(error)
    }
  }

  const handleLog = async (e) => {
    e.preventDefault();
    if (completionLoading) return
    try {
      setCompletionLoading(true)
      const response = await axios.post(`${apiUrl}/api/v1/habits/${id}/log`,
        { completed: !completedToday },
        { withCredentials: true })
      setCompletedToday(prev => !prev)
      await fetchHabitLogs()

    } catch (error) {
      setError("Failed to update habit status.")
    } finally {
      setCompletionLoading(false)
    }
  }

  if (loading) {
    return <div className='flex justify-center items-center min-h-screen'><span className="loading loading-bars loading-xl"></span></div>
  }
  if (error) {
    return <div>Something went wrong</div>;
  }

  if (!habit) {
    return <div>Habit not found</div>;
  }

  return (
    <main className="relative min-h-[90vh] bg-base-200 px-4 py-12 overflow-hidden animate-fade-in-up">
      <section className="w-full max-w-3xl mx-auto rounded-2xl bg-base-100
                    border border-base-300 shadow-xl
                    transition-all duration-300">


        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>

        <div className="card-body gap-4">
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-base-100 overflow-hidden">
              <Image
                src={avatarUrl}
                alt="User avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                {habit.title}
              </h1>
              <span className="inline-block rounded-full px-3 py-1 text-xs
                     bg-indigo-500/10 text-indigo-400">
                {habit.category || "General"}
              </span>
            </div>
          </div>


          <p className="text-base-content/70 mt-1">{habit.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

            <div className="rounded-xl bg-base-200 p-4 border border-base-300">
              <p className="text-sm text-base-content/60">Current Streak</p>
              <h3 className="text-3xl font-semibold text-indigo-400">
                {currentStreak} days
              </h3>
            </div>

            <div className="rounded-xl bg-base-200 p-4 border border-base-300">
              <p className="text-sm text-base-content/60">Longest Streak</p>
              <h3 className="text-3xl font-semibold text-purple-400">
                {longestStreak} days
              </h3>
            </div>

            <div className="rounded-xl bg-base-200 p-4 border border-base-300">
              <p className="text-sm text-base-content/60">Completion Rate</p>
              <h3 className="text-3xl font-semibold text-emerald-400">
                {Math.round(completionRate * 100)}%
              </h3>
            </div>

          </div>

          <div className="mt-6">
            <p className="text-sm text-base-content/60 mb-2">
              Overall Progress
            </p>
            <div className="h-3 w-full rounded-full bg-base-300 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${Math.round(completionRate * 100)}%` }}
              />
            </div>
          </div>

          <div className="card-actions justify-center pt-2">
            <button
              onClick={handleLog}
              disabled={completionLoading}
              className={`w-full mt-6 rounded-xl py-4 font-medium text-white transition-all duration-300
                ${completedToday
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-500 to-purple-600 hover:ring-2 hover:ring-indigo-500/40 cursor-pointer shadow-md hover:shadow-lg"
                }`}
            >
              {completionLoading ? (
                <span className="loading loading-bars loading-md"></span>
              ) : completedToday ? (
                "Completed Today"
              ) : (
                "Mark as Done"
              )}
            </button>

          </div>
        </div>

      </section>

    </main>
  )
}

export default habitDetailPage
