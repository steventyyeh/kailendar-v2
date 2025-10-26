'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface ProgressData {
  weeklyStats: {
    completionRate: number
    tasksCompleted: number
    tasksScheduled: number
    hoursInvested: number
    currentStreak: number
    longestStreak: number
  }
  activeGoalsProgress: Array<{
    id: string
    name: string
    category: string
    color: string
    progress: number
    tasksCompleted: number
    totalTasks: number
    nextMilestone: string
    daysToMilestone: number
  }>
  milestoneDelta: Array<{
    goalName: string
    milestoneName: string
    targetDate: string
    expectedProgress: number
    actualProgress: number
    delta: number
    status: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    goalName: string
    description: string
    timestamp: string
  }>
}

export default function ProgressPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mock/progress')
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError('Failed to load progress data')
        }
      } catch (err) {
        console.error('Error fetching progress:', err)
        setError('Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'No data available'}
        </div>
      </div>
    )
  }

  const { weeklyStats, activeGoalsProgress, milestoneDelta, recentActivity } = data

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progress Overview</h1>
        <p className="text-gray-600 mt-1">Track your weekly performance and goal progress</p>
      </div>

      {/* Weekly Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-4xl font-bold text-blue-600">{weeklyStats.completionRate}%</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${weeklyStats.completionRate}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {weeklyStats.tasksCompleted} of {weeklyStats.tasksScheduled} tasks completed
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Hours Invested</p>
            <span className="text-2xl">⏱️</span>
          </div>
          <p className="text-4xl font-bold text-green-600">{weeklyStats.hoursInvested}h</p>
          <p className="text-sm text-gray-500 mt-2">This week</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${Math.min((weeklyStats.hoursInvested / 20) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">of 20h goal</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Current Streak</p>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-4xl font-bold text-orange-600">{weeklyStats.currentStreak}</p>
          <p className="text-sm text-gray-500 mt-2">days in a row</p>
          <p className="text-xs text-gray-400 mt-1">
            Longest: {weeklyStats.longestStreak} days
          </p>
        </div>
      </div>

      {/* Active Goals Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Goals Progress</h2>
        <div className="space-y-6">
          {activeGoalsProgress.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Next milestone: {goal.nextMilestone} ({goal.daysToMilestone} days)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: goal.color }}>
                    {goal.progress}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {goal.tasksCompleted}/{goal.totalTasks} tasks
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${goal.progress}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Delta Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Milestone Progress</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Goal
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Next Milestone
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Target Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Expected
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actual
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              {milestoneDelta.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">{item.goalName}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{item.milestoneName}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(item.targetDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.expectedProgress}%
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {item.actualProgress}%
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.delta > 0
                          ? 'bg-green-100 text-green-800'
                          : item.delta < 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.delta > 0 ? '+' : ''}
                      {item.delta}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg">
                  {activity.type === 'milestone_completed' ? '🏆' : '✅'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.goalName} • {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
