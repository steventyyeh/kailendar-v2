import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './google-calendar'
import { Task } from './firebase/tasks'
import { Goal } from '@/types'

/**
 * Sync a task to Google Calendar
 * Creates or updates a calendar event for the task
 */
export const syncTaskToCalendar = async (
  userId: string,
  task: Task,
  goal?: Goal
): Promise<string> => {
  // Use timezone-aware timestamps if available (preferred)
  let startDateTime: string
  let endDateTime: string
  const timezone = task.timezone || 'UTC'

  if (task.startDateTime && task.endDateTime) {
    // Use the timezone-aware timestamps from the task
    // These are already in ISO 8601 format with timezone offset
    startDateTime = task.startDateTime
    endDateTime = task.endDateTime
  } else {
    // Fallback for old tasks without timezone-aware timestamps
    const taskDate = task.dueDate ? new Date(task.dueDate) : new Date()

    // Set default time to 9 AM if no time specified
    if (!task.dueDate || taskDate.getHours() === 0) {
      taskDate.setHours(9, 0, 0, 0)
    }

    // End time is 1 hour after start by default
    const endDate = new Date(taskDate.getTime() + 60 * 60 * 1000)

    startDateTime = taskDate.toISOString()
    endDateTime = endDate.toISOString()
  }

  const eventTitle = task.completed ? `✅ ${task.title}` : task.title

  // Build event description with resources if available
  const descriptionParts: string[] = [
    task.description || '',
  ]

  // Add task-specific resources if available
  if (task.resources && task.resources.length > 0) {
    descriptionParts.push('')
    descriptionParts.push('📚 Task Resources:')
    task.resources.forEach(resource => {
      descriptionParts.push(`• ${resource.title}: ${resource.url}`)
    })
  }

  // Add goal-level resources if available (first 3 to keep description reasonable)
  if (goal?.resources && goal.resources.length > 0) {
    descriptionParts.push('')
    descriptionParts.push('🎯 Goal Resources:')
    goal.resources.slice(0, 3).forEach((resource: any) => {
      if (resource.url) {
        descriptionParts.push(`• ${resource.title}: ${resource.url}`)
      } else {
        descriptionParts.push(`• ${resource.title}`)
      }
    })
    if (goal.resources.length > 3) {
      descriptionParts.push(`  ... and ${goal.resources.length - 3} more resources`)
    }
  }

  descriptionParts.push('')
  descriptionParts.push(`From Kailendar Goal: ${goal?.specificity || 'Your Goal'}`)
  descriptionParts.push('')
  descriptionParts.push('Managed by Kailendar - https://kailendar.app')

  const eventDescription = descriptionParts.filter(Boolean).join('\n')

  const eventData = {
    summary: eventTitle,
    description: eventDescription,
    start: {
      dateTime: startDateTime,
      timeZone: timezone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: timezone,
    },
    colorId: goal?.calendar?.color ? getGoogleCalendarColorId(goal.calendar.color) : '1',
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup' as const, minutes: 30 },
        { method: 'email' as const, minutes: 1440 }, // 1 day before
      ],
    },
  }

  // If task already has a calendar event, update it
  if (task.calendarEventId) {
    try {
      await updateCalendarEvent(userId, 'primary', task.calendarEventId, eventData)
      return task.calendarEventId
    } catch (error) {
      console.error('Failed to update calendar event, creating new one:', error)
      // Fall through to create new event if update fails
    }
  }

  // Create new calendar event
  const event = await createCalendarEvent(userId, 'primary', eventData)
  return event.id || ''
}

/**
 * Remove a task from Google Calendar
 */
export const removeTaskFromCalendar = async (
  userId: string,
  calendarEventId: string
): Promise<void> => {
  try {
    await deleteCalendarEvent(userId, 'primary', calendarEventId)
  } catch (error) {
    console.error('Failed to remove task from calendar:', error)
    // Don't throw - it's okay if calendar deletion fails
  }
}

/**
 * Sync multiple tasks to Google Calendar in batch
 */
export const syncTasksToCalendar = async (
  userId: string,
  tasks: Task[],
  goals?: Map<string, Goal>
): Promise<Map<string, string>> => {
  const taskEventMap = new Map<string, string>()

  for (const task of tasks) {
    try {
      const goal = goals?.get(task.goalId)
      const eventId = await syncTaskToCalendar(userId, task, goal)
      if (task.id) {
        taskEventMap.set(task.id, eventId)
      }
    } catch (error) {
      console.error(`Failed to sync task ${task.id} to calendar:`, error)
      // Continue with other tasks even if one fails
    }
  }

  return taskEventMap
}

/**
 * Update calendar event when task is completed
 */
export const markTaskCompletedInCalendar = async (
  userId: string,
  task: Task
): Promise<void> => {
  if (!task.calendarEventId) {
    return
  }

  try {
    await updateCalendarEvent(userId, 'primary', task.calendarEventId, {
      summary: `✅ ${task.title}`,
      colorId: '10', // Green color for completed tasks
    })
  } catch (error) {
    console.error('Failed to mark task as completed in calendar:', error)
    // Don't throw - it's okay if calendar update fails
  }
}

/**
 * Update calendar event when task is marked incomplete
 */
export const markTaskIncompleteInCalendar = async (
  userId: string,
  task: Task,
  goal?: Goal
): Promise<void> => {
  if (!task.calendarEventId) {
    return
  }

  try {
    await updateCalendarEvent(userId, 'primary', task.calendarEventId, {
      summary: task.title,
      colorId: goal?.calendar?.color ? getGoogleCalendarColorId(goal.calendar.color) : '1',
    })
  } catch (error) {
    console.error('Failed to mark task as incomplete in calendar:', error)
    // Don't throw - it's okay if calendar update fails
  }
}

/**
 * Map hex color codes to Google Calendar color IDs
 */
function getGoogleCalendarColorId(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#3498DB': '9',  // Blue
    '#E74C3C': '11', // Red
    '#2ECC71': '10', // Green
    '#F39C12': '6',  // Orange
    '#9B59B6': '3',  // Purple
    '#1ABC9C': '7',  // Turquoise
    '#34495E': '8',  // Gray
    '#E67E22': '6',  // Dark Orange
    '#95A5A6': '8',  // Light Gray
  }
  return colorMap[hexColor] || '1' // Default to blue
}
