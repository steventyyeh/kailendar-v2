import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserTasks } from '@/lib/firebase/tasks'
import { getUserGoals } from '@/lib/firebase/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const userId = session.user.email

    // Get current date and 14 days from now
    const now = new Date()
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    // Fetch all tasks for the user within the next 14 days
    const tasks = await getUserTasks(userId, {
      completed: false,
      dueAfter: now.toISOString(),
      dueBefore: twoWeeksFromNow.toISOString(),
    })

    // Get user's goals to map goal IDs to goal titles
    const goals = await getUserGoals(userId)
    const goalMap = new Map(goals.map(g => [g.id, g]))

    // Enrich tasks with goal information
    const enrichedTasks = tasks.slice(0, 10).map(task => ({
      ...task,
      goalTitle: goalMap.get(task.goalId)?.specificity || 'Unknown Goal',
    }))

    return NextResponse.json({
      success: true,
      data: {
        tasks: enrichedTasks,
        count: enrichedTasks.length,
      },
    })
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch upcoming tasks',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}
