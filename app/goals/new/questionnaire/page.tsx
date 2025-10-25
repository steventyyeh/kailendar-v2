'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import QuestionStep from '@/components/goals/QuestionStep'
import { GOAL_CATEGORIES, QUESTIONNAIRE_STEPS } from '@/lib/constants/goals'
import { CreateGoalRequest } from '@/types'

function QuestionnaireContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const category = searchParams.get('category')

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CreateGoalRequest>>({
    category: category as any,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/goals/new')
    }
  }, [status, router])

  // Redirect if no category
  useEffect(() => {
    if (!category) {
      router.push('/goals/new')
    }
  }, [category, router])

  const selectedCategory = GOAL_CATEGORIES.find((c) => c.id === category)
  const currentQuestion = QUESTIONNAIRE_STEPS[currentStep]
  const totalSteps = QUESTIONNAIRE_STEPS.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const validateStep = () => {
    const question = currentQuestion
    const value = formData[question.id as keyof typeof formData]

    // Required field check
    if (question.required && !value) {
      setErrors({ [question.id]: 'This field is required' })
      return false
    }

    // Type-specific validation
    if (question.type === 'text' || question.type === 'textarea') {
      const textValue = value as string
      const validation = question.validation as { min?: number; max?: number } | undefined
      if (validation?.min && textValue.length < validation.min) {
        setErrors({
          [question.id]: `Please enter at least ${validation.min} characters`,
        })
        return false
      }
      if (validation?.max && textValue.length > validation.max) {
        setErrors({
          [question.id]: `Please keep it under ${validation.max} characters`,
        })
        return false
      }
    }

    if (question.type === 'checkbox') {
      const arrayValue = value as string[]
      const validation = question.validation as { min?: number; max?: number } | undefined
      if (validation?.min && arrayValue.length < validation.min) {
        setErrors({
          [question.id]: `Please select at least ${validation.min} option(s)`,
        })
        return false
      }
    }

    setErrors({})
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/goals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to loading/polling page
        router.push(`/goals/${result.data.goalId}/generating`)
      } else {
        alert(result.error?.message || 'Failed to create goal')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Failed to create goal. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleValueChange = (value: any) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value,
    })
    setErrors({})
  }

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

  if (!selectedCategory) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedCategory.icon}</span>
            <div>
              <h2 className="text-sm font-medium text-gray-600">
                {selectedCategory.name}
              </h2>
              <h1 className="text-2xl font-bold text-gray-900">
                Tell us about your goal
              </h1>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestion.title}
            </h2>
            <p className="text-gray-600">{currentQuestion.subtitle}</p>
          </div>

          <QuestionStep
            question={currentQuestion}
            value={formData[currentQuestion.id as keyof typeof formData]}
            onChange={handleValueChange}
            error={errors[currentQuestion.id]}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Generating plan...
              </span>
            ) : currentStep === totalSteps - 1 ? (
              'Generate My Plan →'
            ) : (
              'Next →'
            )}
          </button>
        </div>

        {/* Cancel link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Cancel and return to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuestionnairePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <QuestionnaireContent />
    </Suspense>
  )
}
