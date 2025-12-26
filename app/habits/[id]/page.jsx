"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { calculateCurrentStreak } from '@/app/currentStreak'
import { calculateLongestStreak } from '@/app/longestStreak'

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
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchHabitLogs()
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
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/habits/${id}/log`,
        { completed: !completedToday },
        { withCredentials: true })
      setCompletedToday(prev => !prev)
      await fetchHabitLogs()

    } catch (error) {
      setError(error)
    }
  }

  if (loading) {
    return <div className='flex justify-center items-center min-h-screen'><span className="loading loading-bars loading-xl "></span></div>
  }
  if (error) {
    return <div>Something went wrong</div>;
  }

  if (!habit) {
    return <div>Habit not found</div>;
  }

  return (
    <>
      <div className='min-h-screen flex justify-center items-start'>
        <div className="card bg-base-200 shadow-xl w-full max-w-2xl transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatarUrl} alt="User avatar" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold">{habit.title}</h1>
              <p className="text-gray-400">{habit.description}</p>
              <div className="badge badge-info">
                <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></circle><path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></path><circle cx="12" cy="7.25" r="1.25" fill="currentColor" strokeWidth="2"></circle></g></svg>
                {habit.category}
              </div>
            </div>
          </div>

          <figure className="px-10 pt-10">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-8 w-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Current Streak</div>
                <div className="stat-value text-primary">{currentStreak} {currentStreak === 1 ? "day" : "days"}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-8 w-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Longest Streak</div>
                <div className="stat-value text-secondary">{longestStreak} {longestStreak === 1 ? "day" : "days"}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <div className="avatar avatar-online">
                    <div className="w-16 rounded-full">
                      <img src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp" />
                    </div>
                  </div>
                </div>
                <div className="stat-value">{Math.round(completionRate * 100)}%</div>
                <div className="stat-title">Tasks done</div>
              </div>
            </div>
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">{habit.title}</h2>
            <p>{habit.description}</p>
            <p>{habit.category}</p>
            <div className="card-actions">
              {completedToday ? <button className="btn btn-success btn-lg transition-transform hover:scale-105" onClick={handleLog}>Completed Today ✓ (Undo)</button> : <button className="btn btn-neutral btn-lg transition-transform hover:scale-105" onClick={handleLog}>Mark as Done</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default habitDetailPage
