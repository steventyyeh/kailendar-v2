'use client'

import { Goal } from '@/types'
import Link from 'next/link'

interface GoalCardProps {
  goal: Goal
}

export default function GoalCard({ goal }: GoalCardProps) {
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

  return (
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
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
            {status.text}
          </span>
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
            <p className="text-sm font-medium text-gray-700">Next Milestone:</p>
            <p className="text-sm text-gray-600 mt-1">
              {goal.plan.milestones.find(m => m.status === 'pending')?.title ||
                goal.plan.milestones[0].title}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
