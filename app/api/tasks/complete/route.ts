import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ApiResponse } from '@/types'
import { getTask, updateTask } from '@/lib/firebase/tasks'
import {
  markTaskCompletedInCalendar,
  markTaskIncompleteInCalendar,
} from '@/lib/calendar-tasks'
import { getGoal } from '@/lib/firebase/db'

/**
 * POST /api/tasks/complete
 * Toggle task completion status and sync with Google Calendar
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const userId = session.user.email
    const body = await request.json()
    const { taskId, completed } = body

    if (!taskId || typeof completed !== 'boolean') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'taskId and completed (boolean) are required',
          },
        },
        { status: 400 }
      )
    }

    // Get current task
    const task = await getTask(userId, taskId)

    if (!task) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Task not found',
          },
        },
        { status: 404 }
      )
    }

    // Update task in Firestore
    const updatedTask = await updateTask(userId, taskId, { completed })

    // Update Google Calendar if task has a calendar event
    if (updatedTask.calendarEventId) {
      try {
        if (completed) {
          await markTaskCompletedInCalendar(userId, updatedTask)
        } else {
          const goal = await getGoal(userId, updatedTask.goalId)
          await markTaskIncompleteInCalendar(userId, updatedTask, goal || undefined)
        }
      } catch (calendarError) {
        console.error('Failed to update calendar:', calendarError)
        // Continue even if calendar update fails - task is already updated in Firestore
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { task: updatedTask },
    })
  } catch (error) {
    console.error('Error toggling task completion:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update task',
        },
      },
      { status: 500 }
    )
  }
}
