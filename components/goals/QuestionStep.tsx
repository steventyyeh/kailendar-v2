'use client'

import { useState } from 'react'

interface QuestionStepProps {
  question: {
    id: string
    title: string
    subtitle: string
    type: string
    placeholder?: string
    options?: readonly any[]
    validation?: { min?: number; max?: number }
    required?: boolean
  }
  value: any
  onChange: (value: any) => void
  error?: string
}

export default function QuestionStep({
  question,
  value,
  onChange,
  error,
}: QuestionStepProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
            maxLength={question.validation?.max}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg resize-none"
            maxLength={question.validation?.max}
          />
        )

      case 'date':
        const minDate = new Date()
        minDate.setDate(minDate.getDate() + 1) // Tomorrow
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() + 5) // 5 years from now

        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={minDate.toISOString().split('T')[0]}
            max={maxDate.toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-lg"
          />
        )

      case 'select':
        return (
          <div className="space-y-3">
            {question.options?.map((option: any) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`w-full text-left px-6 py-4 border-2 rounded-lg transition-all ${
                  value === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="font-semibold text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )

      case 'checkbox':
        const selectedValues = value || []
        return (
          <div className="space-y-3">
            {question.options?.map((option: any) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (isSelected) {
                      onChange(selectedValues.filter((v: string) => v !== option.value))
                    } else {
                      onChange([...selectedValues, option.value])
                    }
                  }}
                  className={`w-full text-left px-6 py-4 border-2 rounded-lg transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                  }">
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {option.icon && <span className="text-xl">{option.icon}</span>}
                      <span className="font-semibold text-gray-900">{option.label}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {renderInput()}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      {question.validation?.max && (question.type === 'text' || question.type === 'textarea') && (
        <p className="text-sm text-gray-500 text-right">
          {(value || '').length} / {question.validation.max}
        </p>
      )}
      {question.type === 'checkbox' && question.validation && (
        <p className="text-sm text-gray-500">
          Select {question.validation.min} to {question.validation.max} options
        </p>
      )}
    </div>
  )
}
