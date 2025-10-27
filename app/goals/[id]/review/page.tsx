'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Goal, Milestone } from '@/types'

export default function ReviewPlanPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const goalId = params.id as string

  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null)
  const [editedDescription, setEditedDescription] = useState('')
  const [editedDate, setEditedDate] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
    }
  }, [status, router])

  // Fetch goal plan
  useEffect(() => {
    if (!goalId || status !== 'authenticated') return

    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/goals/${goalId}/plan`)
        const result = await response.json()

        if (result.success) {
          setGoal(result.data)
        } else {
          setError(result.error?.message || 'Failed to load plan')
        }
      } catch (err) {
        console.error('Error fetching plan:', err)
        setError('Failed to load plan')
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [goalId, status])

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone.id)
    setEditedDescription(milestone.description)
    // Convert Date to YYYY-MM-DD string for date input
    const dateStr = milestone.targetDate instanceof Date
      ? milestone.targetDate.toISOString().split('T')[0]
      : new Date(milestone.targetDate).toISOString().split('T')[0]
    setEditedDate(dateStr)
  }

  const handleSaveMilestone = async (milestoneId: string) => {
    // In a real app, this would update the milestone via API
    // For now, we'll update local state and trigger regeneration
    setEditingMilestone(null)

    // TODO: Implement API call to update milestone
    // This should trigger plan regeneration with the updated milestone
  }

  const handleCancelEdit = () => {
    setEditingMilestone(null)
    setEditedDescription('')
    setEditedDate('')
  }

  const handleApprovePlan = async () => {
    setIsApproving(true)

    try {
      const response = await fetch(`/api/goals/${goalId}/approve`, {
        method: 'POST',
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to dashboard on success
        router.push('/dashboard')
      } else {
        alert(result.error?.message || 'Failed to approve plan')
        setIsApproving(false)
      }
    } catch (error) {
      console.error('Error approving plan:', error)
      alert('Failed to approve plan. Please try again.')
      setIsApproving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your plan...</p>
        </div>
      </div>
    )
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Plan Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Could not load your plan'}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎯</span>
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Personalized Plan
                </h1>
              </div>
              <p className="text-lg text-gray-600">{goal.specificity}</p>
            </div>
          </div>

          {/* Goal Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Target Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(goal.deadline).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Milestones</p>
              <p className="font-semibold text-gray-900">
                {goal.plan?.milestones?.length || 0} phases
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Your Level</p>
              <p className="font-semibold text-gray-900 capitalize">
                {goal.currentState.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Success Vision */}
        {goal.targetState && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>🌟</span>
              Your Success Vision
            </h3>
            <p className="text-gray-700">{goal.targetState}</p>
          </div>
        )}

        {/* Milestones */}
        <div className="space-y-6 mb-8">
          {goal.plan?.milestones?.map((milestone, index) => (
            <div
              key={milestone.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Milestone Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold">
                        Phase {index + 1}
                      </span>
                      <span className="text-2xl">{milestone.icon}</span>
                    </div>
                    {editingMilestone === milestone.id ? (
                      <input
                        type="text"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold">
                        {milestone.description}
                      </h3>
                    )}
                  </div>
                  {editingMilestone === milestone.id ? (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleSaveMilestone(milestone.id)}
                        className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditMilestone(milestone)}
                      className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm">Target:</span>
                  {editingMilestone === milestone.id ? (
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="px-3 py-1 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  ) : (
                    <span className="font-semibold">
                      {(milestone.targetDate instanceof Date
                        ? milestone.targetDate
                        : new Date(milestone.targetDate)
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Objectives */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Objectives:</h4>
                <div className="space-y-4">
                  {milestone.objectives.map((objective) => (
                    <div key={objective.id} className="border-l-4 border-blue-400 pl-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        {objective.description}
                      </h5>
                      <ul className="space-y-2">
                        {objective.tasks.map((task) => (
                          <li key={task.id} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{task.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-gray-600 mb-1">
                Ready to start your journey?
              </p>
              <p className="text-sm text-gray-500">
                You can always edit milestones later from your dashboard
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/goals/new')}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleApprovePlan}
                disabled={isApproving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Activating...
                  </span>
                ) : (
                  'Approve & Activate Goal'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
