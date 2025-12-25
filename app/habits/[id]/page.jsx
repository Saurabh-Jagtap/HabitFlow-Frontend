"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

const habits = () => {

  const { id } = useParams();

  const [habit, setHabit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completedToday, setcompletedToday] = useState(false)

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

  const handleLog = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/habits/${id}/log`,
        { completed: !completedToday },
        { withCredentials: true })
      console.log(response)
      setcompletedToday(prev => !prev)
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

  if (!habits) {
    return <div>Habit not found</div>;
  }

  return (
    <>
      <h1>{habit.title}</h1>
      <p>{habit.description}</p>
      <p>{habit.category}</p>

      {completedToday && <button
        className="btn btn-success mx-52"
        onClick={handleLog}
      >
        Undo
      </button>}

      {!completedToday && <button className="btn btn-neutral" onClick={handleLog}>Mark as Done</button>}
    </>
  )
}

export default habits
