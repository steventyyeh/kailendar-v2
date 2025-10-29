import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getGoal, updateGoal } from '@/lib/firebase/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const { id: goalId } = await params

    // Fetch goal from Firebase
    const goal = await getGoal(goalId)

    if (!goal) {
      return NextResponse.json(
        { success: false, error: { message: 'Goal not found' } },
        { status: 404 }
      )
    }

    // Verify the goal belongs to the current user
    if (goal.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: goal,
    })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch goal',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const { id: goalId } = await params

    // Fetch goal from Firebase
    const goal = await getGoal(goalId)

    if (!goal) {
      return NextResponse.json(
        { success: false, error: { message: 'Goal not found' } },
        { status: 404 }
      )
    }

    // Verify the goal belongs to the current user
    if (goal.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 403 }
      )
    }

    // Parse update data
    const updates = await request.json()

    // Update goal in Firestore
    await updateGoal(goalId, updates)

    // Fetch updated goal
    const updatedGoal = await getGoal(goalId)

    return NextResponse.json({
      success: true,
      data: updatedGoal,
    })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to update goal',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const userId = session.user.email
    const { id: goalId } = await params

    console.log(`[Goal Delete] Starting deletion for goal ${goalId}, user: ${userId}`)

    // Fetch goal from Firebase
    const goal = await getGoal(goalId)

    if (!goal) {
      return NextResponse.json(
        { success: false, error: { message: 'Goal not found' } },
        { status: 404 }
      )
    }

    // Verify the goal belongs to the current user
    if (goal.userId !== userId) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized - goal does not belong to this user' } },
        { status: 403 }
      )
    }

    // Import task and calendar utilities
    const { getUserTasks, deleteTasksByGoal } = await import('@/lib/firebase/tasks')
    const { removeTaskFromCalendar } = await import('@/lib/calendar-tasks')
    const { deleteGoal } = await import('@/lib/firebase/db')

    // 1️⃣ Get all tasks associated with this goal
    const tasks = await getUserTasks(userId, { goalId })
    console.log(`[Goal Delete] Found ${tasks.length} tasks to delete for goal ${goalId}`)

    // 2️⃣ Delete Google Calendar events for each task
    let calendarEventsDeleted = 0
    let calendarDeleteErrors = 0

    for (const task of tasks) {
      if (task.calendarEventId) {
        try {
          await removeTaskFromCalendar(userId, task.calendarEventId)
          calendarEventsDeleted++
          console.log(`[Goal Delete] Deleted calendar event ${task.calendarEventId} for task ${task.id}`)
        } catch (error) {
          calendarDeleteErrors++
          console.error(`[Goal Delete] Failed to delete calendar event ${task.calendarEventId}:`, error)
          // Continue even if calendar deletion fails
        }
      }
    }

    console.log(`[Goal Delete] Deleted ${calendarEventsDeleted} calendar events (${calendarDeleteErrors} errors)`)

    // 3️⃣ Delete all tasks from Firestore
    await deleteTasksByGoal(userId, goalId)
    console.log(`[Goal Delete] Deleted ${tasks.length} tasks from Firestore`)

    // 4️⃣ Delete the goal itself
    await deleteGoal(goalId)
    console.log(`[Goal Delete] Deleted goal ${goalId} from Firestore`)

    return NextResponse.json({
      success: true,
      deletedGoalId: goalId,
      deletedTasks: tasks.length,
      deletedCalendarEvents: calendarEventsDeleted,
      calendarDeleteErrors: calendarDeleteErrors > 0 ? calendarDeleteErrors : undefined,
    })
  } catch (error) {
    console.error('[Goal Delete] Error deleting goal:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to delete goal',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}
