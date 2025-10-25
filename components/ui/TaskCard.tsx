'use client'

import { DailyTask } from '@/types'
import { useState } from 'react'

interface TaskCardProps {
  task: DailyTask
  onToggle?: (taskId: string, completed: boolean) => void
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed)

  const handleToggle = () => {
    const newState = !isCompleted
    setIsCompleted(newState)
    onToggle?.(task.id, newState)
  }

  return (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleToggle}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={`font-medium ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          <span
            className="px-2 py-0.5 text-xs font-medium rounded-full"
            style={{
              backgroundColor: `${task.goalColor}20`,
              color: task.goalColor,
            }}
          >
            {task.goalTitle}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>⏱️ {task.duration} min</span>
          {task.scheduledTime && (
            <span>
              📅 {new Date(task.scheduledTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
