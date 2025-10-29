'use client'

import { Goal } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast from './Toast'

interface GoalCardProps {
  goal: Goal
  onDelete?: () => void
}

export default function GoalCard({ goal, onDelete }: GoalCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const progressPercent = goal.progress.completionRate
  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const getDeltaStatus = () => {
    if (progressPercent > 105) return { text: 'Ahead', color: 'text-green-600', bg: 'bg-green-50' }
    if (progressPercent < 80) return { text: 'Behind', color: 'text-red-600', bg: 'bg-red-50' }
    return { text: 'On Track', color: 'text-yellow-600', bg: 'bg-yellow-50' }
  }

  const status = getDeltaStatus()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Delete goal "${goal.specificity}"?\n\nThis will also remove all associated tasks from your calendar.\n\nThis action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          message: `Goal deleted successfully! ${data.deletedTasks} tasks and ${data.deletedCalendarEvents} calendar events removed.`,
          type: 'success'
        })

        // Wait a moment before refreshing to show toast
        setTimeout(() => {
          // Call parent callback to refresh dashboard
          if (onDelete) {
            onDelete()
          } else {
            // Fallback: reload page
            router.refresh()
          }
        }, 1000)
      } else {
        throw new Error(data.error?.message || 'Failed to delete goal')
      }
    } catch (error) {
      console.error('Failed to delete goal:', error)
      setToast({
        message: error instanceof Error ? error.message : 'Failed to delete goal. Please try again.',
        type: 'error'
      })
      setIsDeleting(false)
    }
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  return (
    <div className="relative">
      <Link href={`/goals/${goal.id}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: goal.calendar.color }}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {goal.specificity}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Target: {goal.targetState}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              {status.text}
            </span>
            <button
              onClick={handleMenuClick}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              disabled={isDeleting}
              title="Goal options"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
                backgroundColor: goal.calendar.color,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              🔥 {goal.progress.currentStreak} day streak
            </span>
            <span className="text-gray-600">
              ⏱️ {Math.round(goal.progress.totalMinutesInvested / 60)}h invested
            </span>
          </div>
          <span className="text-gray-500">
            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
          </span>
        </div>

        {goal.plan?.milestones && goal.plan.milestones.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Milestones</p>
              <p className="text-xs text-gray-500">
                {goal.plan.milestones.filter(m => m.status === 'completed').length} /{' '}
                {goal.plan.milestones.length} complete
              </p>
            </div>
            <div className="flex gap-1">
              {goal.plan.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex-1 h-2 rounded-full ${
                    milestone.status === 'completed'
                      ? 'bg-green-500'
                      : milestone.status === 'in_progress'
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                  title={`${milestone.icon} ${milestone.title} - ${milestone.status}`}
                />
              ))}
            </div>
            {(() => {
              const nextMilestone = goal.plan.milestones.find(
                (m) => m.status === 'pending' || m.status === 'in_progress'
              )
              return (
                nextMilestone && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Next:</span> {nextMilestone.icon}{' '}
                    {nextMilestone.description}
                  </p>
                )
              )
            })()}
          </div>
        )}

        {/* AI Insights */}
        {goal.plan?.taskTemplate?.insights && goal.plan.taskTemplate.insights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <p className="text-sm font-medium text-gray-700">AI Insights</p>
            </div>
            <div className="space-y-2">
              {goal.plan.taskTemplate.insights.slice(0, 2).map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <p className="text-sm text-gray-600 flex-1">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </Link>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-6 top-16 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            <Link
              href={`/goals/${goal.id}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              View Details
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete Goal'}
            </button>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
