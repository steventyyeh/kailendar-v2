'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Goal } from '@/types'
import GoalCard from '@/components/ui/GoalCard'

export default function GoalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('active')

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    fetchGoals()
  }, [status, filter])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const allGoals = result.data.activeGoals || []

        // Filter goals based on selected filter
        const filteredGoals = allGoals.filter((goal: Goal) => {
          if (filter === 'all') return true
          return goal.status === filter
        })

        setGoals(filteredGoals)
      } else {
        setError(result.error?.message || 'Failed to load goals')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load goals. Please try again.'
      setError(errorMsg)
      console.error('Goals fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const isDemoMode = !session

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading your goals...</p>
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
            onClick={fetchGoals}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
                You're viewing demo goals. Sign in to create your own!
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Goals</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your active goals
          </p>
        </div>
        <button
          onClick={() => isDemoMode ? router.push('/auth/signin') : router.push('/goals/new')}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg"
        >
          {isDemoMode ? 'Sign In to Create Goals' : '+ Create New Goal'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'active', label: 'Active' },
          { key: 'all', label: 'All' },
          { key: 'completed', label: 'Completed' },
          { key: 'paused', label: 'Paused' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === tab.key
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'active' ? 'No active goals yet' : `No ${filter} goals`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'active'
              ? 'Start your journey by creating your first goal!'
              : `You don't have any ${filter} goals at the moment.`}
          </p>
          {filter === 'active' && (
            <button
              onClick={() => isDemoMode ? router.push('/auth/signin') : router.push('/goals/new')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              {isDemoMode ? 'Sign In to Create Goals' : 'Create Your First Goal'}
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Goals</p>
            <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Average Progress</p>
            <p className="text-3xl font-bold text-primary-600">
              {Math.round(
                goals.reduce((sum, g) => sum + g.progress.completionRate, 0) / goals.length
              )}%
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Hours Invested</p>
            <p className="text-3xl font-bold text-accent-600">
              {Math.round(
                goals.reduce((sum, g) => sum + g.progress.totalMinutesInvested, 0) / 60
              )}h
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
