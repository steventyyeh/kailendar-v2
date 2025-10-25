'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function GeneratingPlanPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const goalId = params.id as string

  const [pollCount, setpollCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(10)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
    }
  }, [status, router])

  // Poll for plan status
  useEffect(() => {
    if (!goalId || status !== 'authenticated') return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/goals/${goalId}/plan`)
        const result = await response.json()

        if (result.success) {
          const { status: planStatus } = result.data

          if (planStatus === 'ready') {
            // Plan is ready, redirect to review page
            clearInterval(pollInterval)
            router.push(`/goals/${goalId}/review`)
          } else if (planStatus === 'error') {
            // Plan generation failed
            clearInterval(pollInterval)
            setError('Failed to generate plan. Please try again.')
          }
          // If status is still 'processing', continue polling
        } else {
          // API error
          if (response.status === 404) {
            clearInterval(pollInterval)
            setError('Goal not found. Please try creating it again.')
          }
        }

        setpollCount((prev) => prev + 1)
      } catch (err) {
        console.error('Error polling plan status:', err)
        clearInterval(pollInterval)
        setError('Connection error. Please refresh the page.')
      }
    }, 2000) // Poll every 2 seconds

    // Cleanup on unmount
    return () => clearInterval(pollInterval)
  }, [goalId, status, router])

  // Update estimated time countdown
  useEffect(() => {
    if (estimatedTime <= 0) return

    const timer = setTimeout(() => {
      setEstimatedTime((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [estimatedTime])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/goals/new')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-12 text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="inline-block">
            {/* Outer spinning circle */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin"></div>
            {/* Inner pulsing circle */}
            <div className="relative rounded-full bg-blue-600 p-8 animate-pulse">
              <span className="text-6xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Creating Your Personalized Plan
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          Our AI is analyzing your goals and crafting a step-by-step roadmap just for you...
        </p>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Analyzing your input</p>
              <p className="text-sm text-gray-500">Understanding your goals and constraints</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 animate-pulse flex items-center justify-center mt-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Generating milestones</p>
              <p className="text-sm text-gray-500">Breaking down into achievable phases</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 mt-1"></div>
            <div>
              <p className="font-medium text-gray-400">Creating task breakdown</p>
              <p className="text-sm text-gray-400">Detailed action items for each step</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 mt-1"></div>
            <div>
              <p className="font-medium text-gray-400">Finalizing your plan</p>
              <p className="text-sm text-gray-400">Almost ready for review</p>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            {estimatedTime > 0 ? (
              <>
                <span className="font-semibold">Estimated time:</span> {estimatedTime} seconds
              </>
            ) : (
              <>
                <span className="font-semibold">Almost there...</span> Finishing up
              </>
            )}
          </p>
        </div>

        {/* Fun Fact or Tip */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 italic">
            💡 Tip: Breaking big goals into smaller milestones makes them 42% more likely to be achieved!
          </p>
        </div>
      </div>
    </div>
  )
}
