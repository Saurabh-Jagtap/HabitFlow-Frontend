"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

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
          <Link key={habit._id} href={`/habits/${habit._id}`}>
            <li>
              <strong>{habit.title}</strong> | {habit.description} | {habit.category}
            </li>
          </Link>
        ))}
      </ul>
    </>
  )
}

export default Dashboard
