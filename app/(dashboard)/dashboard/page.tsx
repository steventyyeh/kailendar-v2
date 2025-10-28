'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TaskCard from '@/components/ui/TaskCard'
import GoalCard from '@/components/ui/GoalCard'
import { DashboardData } from '@/types'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    // Allow both authenticated users and demo mode
    fetchDashboard()
  }, [status])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Dashboard API response:', result)

      if (result.success && result.data) {
        setDashboardData(result.data)
        setError(null)
      } else {
        const errorMsg = result.error?.message || 'Failed to load dashboard data'
        setError(errorMsg)
        console.error('Dashboard error:', result.error)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dashboard. Please try again.'
      setError(errorMsg)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      console.log(`Task ${taskId} ${completed ? 'completed' : 'uncompleted'}`)

      // Update task completion via API
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const result = await response.json()

      if (result.success) {
        // Update local state optimistically
        setDashboardData(prev => {
          if (!prev) return prev
          return {
            ...prev,
            todaysTasks: prev.todaysTasks.map(task =>
              task.id === taskId ? { ...task, completed } : task
            ),
          }
        })
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
      // Optionally show error toast to user
      alert('Failed to update task. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    )
  }

  const { activeGoals, todaysTasks, upcomingMilestones, recentResources, stats } =
    dashboardData

  const isDemoMode = !session

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <h3 className="font-semibold text-blue-900">Demo Mode</h3>
              <p className="text-sm text-blue-700">
                You're viewing a demo dashboard. Sign in to create your own goals and track progress!
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{dashboardData.user.displayName ? `, ${dashboardData.user.displayName}` : ''}!
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => isDemoMode ? router.push('/login') : router.push('/goals/new')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          {isDemoMode ? 'Sign In to Create Goals' : '+ Create New Goal'}
        </button>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-blue-600">{stats.completionRate}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Hours This Week</p>
          <p className="text-3xl font-bold text-green-600">{stats.hoursInvested}h</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Tasks Completed</p>
          <p className="text-3xl font-bold text-purple-600">{stats.tasksCompleted}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-orange-600">{stats.currentStreak} 🔥</p>
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
          <span className="text-sm text-gray-600">
            {todaysTasks.filter(t => t.completed).length} of {todaysTasks.length}{' '}
            completed
          </span>
        </div>
        {todaysTasks.length > 0 ? (
          <div className="space-y-3">
            {todaysTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No tasks scheduled for today.</p>
            <p className="text-sm text-gray-500 mt-2">
              Create a goal to get started with your daily tasks!
            </p>
          </div>
        )}
      </div>

      {/* Active Goals */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Goals</h2>
        {activeGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No active goals yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your journey by creating your first goal!
            </p>
            <button
              onClick={() => isDemoMode ? router.push('/login') : router.push('/goals/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {isDemoMode ? 'Sign In to Create Goals' : 'Create Your First Goal'}
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Milestones */}
      {upcomingMilestones.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Milestones</h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y">
            {upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(milestone.targetDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Resources */}
      {recentResources.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentResources.map(resource => (
              <div
                key={resource.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {resource.type === 'course'
                      ? '📚'
                      : resource.type === 'book'
                      ? '📖'
                      : resource.type === 'video'
                      ? '🎥'
                      : '🔗'}
                  </span>
                  <h3 className="font-medium text-gray-900">{resource.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Resource →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
