'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GOAL_CATEGORIES } from '@/lib/constants/goals'

export default function NewGoalPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Navigate to questionnaire with category
    router.push(`/goals/new/questionnaire?category=${categoryId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your First Goal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a category that best fits what you want to achieve.
            We'll help you break it down into actionable steps.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOAL_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`group relative bg-white rounded-xl p-6 border-2 transition-all hover:shadow-lg hover:scale-105 ${
                selectedCategory === category.id
                  ? 'border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{category.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>

              {/* Examples */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-2">Examples:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {category.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
