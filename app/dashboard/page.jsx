"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {

  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/habits/',
          { withCredentials: true }
        );
        setHabits(response.data.data)
        console.log(response);

      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchHabits()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (habits.length === 0) {
    return <div>No Habits yet</div>
  }

  return (
    <>
      <ul>
        {habits.map(habit => (
          <li key={habit._id}>
            {habit.title} | {habit.description} | {habit.category}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Dashboard
