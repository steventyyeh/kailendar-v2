import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ApiResponse } from '@/types'
import { getGoal } from '@/lib/firebase/db'
import { createTasksBatch, Task } from '@/lib/firebase/tasks'
import { syncTasksToCalendar } from '@/lib/calendar-tasks'

/**
 * POST /api/tasks/generate
 * Generate Firestore tasks from a goal's AI-generated plan
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
    const { goalId, syncToCalendar = true } = body

    if (!goalId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'goalId is required',
          },
        },
        { status: 400 }
      )
    }

    // Get the goal
    const goal = await getGoal(goalId)

    if (!goal) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Goal not found',
          },
        },
        { status: 404 }
      )
    }

    if (!goal.plan) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_STATE',
            message: 'Goal does not have an AI-generated plan',
          },
        },
        { status: 400 }
      )
    }

    // Extract tasks from the goal's plan
    const tasksToCreate: Omit<Task, 'id' | 'createdAt'>[] = []

    // Iterate through milestones and objectives
    for (const milestone of goal.plan.milestones || []) {
      for (const objective of milestone.objectives || []) {
        // Each objective's task becomes a Firestore task
        for (const task of objective.tasks || []) {
          // Calculate due date based on milestone target date
          const dueDate = milestone.targetDate
            ? new Date(milestone.targetDate)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days from now

          tasksToCreate.push({
            goalId: goal.id || goalId,
            title: task.description,
            description: `Part of: ${objective.description}`,
            dueDate: dueDate.toISOString(),
            completed: task.status === 'completed',
            milestoneId: milestone.id,
          })
        }
      }
    }

    // Also include any one-time tasks from task template
    if (goal.plan.taskTemplate?.oneTimeTasks) {
      for (const oneTimeTask of goal.plan.taskTemplate.oneTimeTasks) {
        const dueDate = oneTimeTask.targetDate
          ? new Date(oneTimeTask.targetDate)
          : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Default 3 days from now

        tasksToCreate.push({
          goalId: goal.id || goalId,
          title: oneTimeTask.title,
          description: oneTimeTask.description,
          dueDate: dueDate.toISOString(),
          completed: false,
        })
      }
    }

    if (tasksToCreate.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          tasks: [],
          message: 'No tasks found in goal plan',
        },
      })
    }

    // Create tasks in Firestore
    const createdTasks = await createTasksBatch(userId, tasksToCreate)

    // Sync to Google Calendar if requested
    let calendarSyncCount = 0
    if (syncToCalendar) {
      try {
        const goalMap = new Map([[goal.id || goalId, goal]])
        const taskEventMap = await syncTasksToCalendar(userId, createdTasks, goalMap)
        calendarSyncCount = taskEventMap.size

        // Update tasks with calendar event IDs
        const { updateTask } = await import('@/lib/firebase/tasks')
        for (const [taskId, eventId] of taskEventMap.entries()) {
          await updateTask(userId, taskId, { calendarEventId: eventId })
        }
      } catch (calendarError) {
        console.error('Failed to sync some tasks to calendar:', calendarError)
        // Continue even if calendar sync partially fails
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        tasks: createdTasks,
        total: createdTasks.length,
        syncedToCalendar: calendarSyncCount,
      },
    })
  } catch (error) {
    console.error('Error generating tasks from goal:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate tasks',
        },
      },
      { status: 500 }
    )
  }
}
