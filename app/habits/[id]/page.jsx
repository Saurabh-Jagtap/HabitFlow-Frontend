"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { calculateCurrentStreak } from '@/app/currentStreak'
import { calculateLongestStreak } from '@/app/longestStreak'

const habits = () => {

  const { id } = useParams();

  const [habitLog, setHabitLog] = useState([])
  const [habit, setHabit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completedToday, setCompletedToday] = useState(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)

  useEffect(() => {
    const fetchHabitsByID = async (request) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/habits/${id}`,
          { withCredentials: true }
        );
        setHabit(response.data.data)
        console.log(response);
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
      const response = await axios.get(`http://localhost:5000/api/v1/habits/${id}/logs`,
        { withCredentials: true }
      );
      const logs = response.data.data.logs;
      setHabitLog(logs)
      console.log(response)

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
      const response = await axios.post(`http://localhost:5000/api/v1/habits/${id}/log`,
        { completed: !completedToday },
        { withCredentials: true })
      console.log(response)
      setCompletedToday(prev => !prev)
      await fetchHabitLogs()

    } catch (error) {
      setError(error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Something went wrong</div>;
  }

  if (!habit) {
    return <div>Habit not found</div>;
  }

  return (
    <>
      <h1>{habit.title}</h1>
      <p>{habit.description}</p>
      <p>{habit.category}</p>

      <h1>Current Streak: {currentStreak} {currentStreak === 1 ? "day" : "days"} </h1>
      <h1>Longest Streak: {longestStreak} {longestStreak === 1 ? "day" : "days"} </h1>
      <h1>Completion Rate: {completionRate}</h1>

      {completedToday && <button
        className="btn btn-success mx-52"
        onClick={handleLog}
      >
        Undo
      </button>}

      {!completedToday && <button className="btn btn-neutral" onClick={handleLog}>Mark as Done</button>}

      <ul>
        {habitLog.map(habit => (
          <li key={habit._id}>
            {habit.date} | {habit.completed}
          </li>
        ))}
      </ul>
    </>
  )
}

export default habits
