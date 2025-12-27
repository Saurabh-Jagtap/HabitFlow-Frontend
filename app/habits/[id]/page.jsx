"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { calculateCurrentStreak } from '@/app/currentStreak'
import { calculateLongestStreak } from '@/app/longestStreak'
import Image from 'next/image'

const habitDetailPage = () => {

  const { id } = useParams();

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/habits/${id}`,
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/habits/${id}/logs`,
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/habits/${id}/log`,
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
    <main className="flex min-h-screen justify-center px-4 py-10">
      <section className="card w-full max-w-3xl bg-base-200 shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="card-body gap-4">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="relative h-16 w-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold">{habit.title}</h1>
              <span className="badge badge-info mt-1">
                {habit.category || "category"}
              </span>
            </div>
          </div>

          <p className="text-base-content/70 mt-1">{habit.description}</p>

          {/* Stats */}
            <div className="stats stats-vertical md:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Current Streak</div>
                <div className="stat-value text-primary">
                  {currentStreak}d
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Longest Streak</div>
                <div className="stat-value text-secondary">
                  {longestStreak}d
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Completion Rate</div>
                <div className="stat-value">{Math.round(completionRate * 100)}%</div>
              </div>
            </div>

          {/* CTA */}
          <div className="card-actions justify-center pt-2">
            <button
              onClick={handleLog}
              className={`btn btn-lg ${completedToday ? "btn-success" : "btn-neutral"}`}
            >
              {completionLoading ? (
                <span className="loading loading-bars loading-md"></span>
              ) : completedToday ? (
                "Completed"
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
