'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Goal } from '@/types'

export default function GoalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const goalId = params.id as string

  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
    }
  }, [status, router])

  // Fetch goal details
  useEffect(() => {
    if (!goalId || status !== 'authenticated') return

    const fetchGoal = async () => {
      try {
        const response = await fetch(`/api/goals/${goalId}`)
        const result = await response.json()

        if (result.success) {
          setGoal(result.data)
        } else {
          setError(result.error?.message || 'Failed to load goal')
        }
      } catch (err) {
        console.error('Error fetching goal:', err)
        setError('Failed to load goal')
      } finally {
        setLoading(false)
      }
    }

    fetchGoal()
  }, [goalId, status])

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    // TODO: Implement task toggle API call
    console.log('Toggle task:', taskId, completed)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading goal...</p>
        </div>
      </div>
    )
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Goal Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Could not load your goal'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const progressPercent = goal.progress.completionRate
  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Dashboard
          </button>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: goal.calendar.color }}
                  />
                  <h1 className="text-3xl font-bold text-gray-900">{goal.specificity}</h1>
                </div>
                <p className="text-lg text-gray-600 mb-4">{goal.targetState}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Started:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(goal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Level:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {goal.currentState.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push(`/goals/${goalId}/review`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit Plan
              </button>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-600">{progressPercent}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time Invested</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(goal.progress.totalMinutesInvested / 60)}h
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">
                  {goal.progress.currentStreak} 🔥
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Days Remaining</p>
                <p className="text-2xl font-bold text-purple-600">
                  {daysRemaining > 0 ? daysRemaining : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        {goal.plan?.milestones && goal.plan.milestones.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Milestones</h2>
            {goal.plan.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                  milestone.status === 'in_progress'
                    ? 'ring-2 ring-blue-500'
                    : milestone.status === 'completed'
                    ? 'opacity-75'
                    : ''
                }`}
              >
                {/* Milestone Header */}
                <div
                  className={`p-6 ${
                    milestone.status === 'completed'
                      ? 'bg-green-50'
                      : milestone.status === 'in_progress'
                      ? 'bg-blue-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{milestone.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500">
                              Phase {index + 1}
                            </span>
                            {milestone.status === 'completed' && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                                Completed
                              </span>
                            )}
                            {milestone.status === 'in_progress' && (
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                                In Progress
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mt-1">
                            {milestone.description}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Target:</span>
                        <span className="font-medium">
                          {new Date(milestone.targetDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {milestone.status === 'completed' && milestone.completedAt && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Completed{' '}
                              {new Date(milestone.completedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                {milestone.objectives && milestone.objectives.length > 0 && (
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Objectives</h4>
                    <div className="space-y-6">
                      {milestone.objectives.map((objective) => (
                        <div key={objective.id} className="border-l-4 border-blue-400 pl-4">
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{objective.description}</h5>
                            {objective.status === 'completed' && (
                              <span className="text-green-600 text-sm font-medium">✓ Done</span>
                            )}
                          </div>
                          {objective.tasks && objective.tasks.length > 0 && (
                            <ul className="space-y-2">
                              {objective.tasks.map((task) => (
                                <li key={task.id} className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={task.status === 'completed'}
                                    onChange={(e) =>
                                      handleTaskToggle(task.id, e.target.checked)
                                    }
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span
                                    className={`text-sm flex-1 ${
                                      task.status === 'completed'
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    {task.description}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resources */}
        {goal.resources && goal.resources.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goal.resources.map((resource) => (
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
                  {resource.description && (
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  )}
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
                  {resource.cost && (
                    <p className="text-xs text-gray-500 mt-2">Cost: {resource.cost}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
