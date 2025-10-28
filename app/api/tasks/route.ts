import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ApiResponse } from '@/types'
import {
  getUserTasks,
  getTodaysTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from '@/lib/firebase/tasks'
import { syncTaskToCalendar, removeTaskFromCalendar } from '@/lib/calendar-tasks'
import { getGoal } from '@/lib/firebase/db'

/**
 * GET /api/tasks
 * Get user's tasks with optional filters
 */
export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)

    const goalId = searchParams.get('goalId') || undefined
    const completedParam = searchParams.get('completed')
    const todayOnly = searchParams.get('today') === 'true'

    let tasks: Task[]

    if (todayOnly) {
      tasks = await getTodaysTasks(userId)
    } else {
      const filters: any = {}
      if (goalId) filters.goalId = goalId
      if (completedParam !== null) filters.completed = completedParam === 'true'

      tasks = await getUserTasks(userId, filters)
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        tasks,
        total: tasks.length,
      },
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch tasks',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks
 * Create a new task
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

    const { goalId, title, description, dueDate, syncToCalendar = true } = body

    if (!goalId || !title) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'goalId and title are required',
          },
        },
        { status: 400 }
      )
    }

    // Create task in Firestore
    const task = await createTask(userId, {
      goalId,
      title,
      description,
      dueDate,
      completed: false,
    })

    // Sync to Google Calendar if requested
    if (syncToCalendar && task.id) {
      try {
        const goal = await getGoal(userId, goalId)
        const eventId = await syncTaskToCalendar(userId, task, goal || undefined)

        // Update task with calendar event ID
        const updatedTask = await updateTask(userId, task.id, {
          calendarEventId: eventId,
        })

        return NextResponse.json<ApiResponse>({
          success: true,
          data: { task: updatedTask },
        })
      } catch (calendarError) {
        console.error('Failed to sync to calendar:', calendarError)
        // Return task even if calendar sync fails
        return NextResponse.json<ApiResponse>({
          success: true,
          data: { task },
          warning: 'Task created but calendar sync failed',
        })
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { task },
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create task',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tasks
 * Update a task
 */
export async function PATCH(request: NextRequest) {
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

    const { taskId, updates, syncToCalendar = true } = body

    if (!taskId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'taskId is required',
          },
        },
        { status: 400 }
      )
    }

    // Update task in Firestore
    const task = await updateTask(userId, taskId, updates)

    // Sync to Google Calendar if requested
    if (syncToCalendar && task.goalId) {
      try {
        const goal = await getGoal(userId, task.goalId)
        await syncTaskToCalendar(userId, task, goal || undefined)
      } catch (calendarError) {
        console.error('Failed to sync to calendar:', calendarError)
        // Continue even if calendar sync fails
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { task },
    })
  } catch (error) {
    console.error('Error updating task:', error)
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

/**
 * DELETE /api/tasks
 * Delete a task
 */
export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'taskId is required',
          },
        },
        { status: 400 }
      )
    }

    // Get task to find calendar event ID
    const { getTask } = await import('@/lib/firebase/tasks')
    const task = await getTask(userId, taskId)

    // Delete from Firestore
    await deleteTask(userId, taskId)

    // Delete from Google Calendar if it has an event
    if (task?.calendarEventId) {
      try {
        await removeTaskFromCalendar(userId, task.calendarEventId)
      } catch (calendarError) {
        console.error('Failed to remove from calendar:', calendarError)
        // Continue even if calendar deletion fails
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Task deleted successfully' },
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete task',
        },
      },
      { status: 500 }
    )
  }
}
