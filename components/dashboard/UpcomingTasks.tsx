'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/firebase/tasks'

interface UpcomingTask extends Task {
  goalTitle?: string
}

export default function UpcomingTasks({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<UpcomingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUpcomingTasks()
  }, [userId])

  const fetchUpcomingTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/tasks/upcoming')

      if (!response.ok) {
        throw new Error('Failed to fetch upcoming tasks')
      }

      const result = await response.json()

      if (result.success) {
        setTasks(result.data.tasks || [])
      } else {
        setError(result.error?.message || 'Failed to load upcoming tasks')
      }
    } catch (err) {
      console.error('Error fetching upcoming tasks:', err)
      setError('Failed to load upcoming tasks')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">Upcoming Tasks</h2>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">Upcoming Tasks</h2>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming tasks.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  {task.goalTitle && (
                    <div className="text-xs text-gray-500 mt-1">
                      Goal: {task.goalTitle}
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(task.dueDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
                {task.completed && (
                  <span className="text-green-600 ml-2">✓</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
