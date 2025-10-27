import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getGoal, getProgressLogs } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * GET /api/progress/[goalId]
 * Returns progress analytics for a specific goal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be signed in',
          },
        },
        { status: 401 }
      )
    }

    const { goalId } = await params

    // Fetch goal to verify ownership
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

    // Verify the goal belongs to the current user
    if (goal.userId !== session.user.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Unauthorized access to this goal',
          },
        },
        { status: 403 }
      )
    }

    // Get progress logs
    const progressLogs = await getProgressLogs(goalId, 30)

    // Calculate analytics
    const analytics = {
      goalId: goal.id,
      goalTitle: goal.specificity,
      progress: goal.progress,
      milestones: goal.plan?.milestones || [],
      recentLogs: progressLogs,
      stats: {
        completionRate: goal.progress.completionRate,
        totalTasksScheduled: goal.progress.totalTasksScheduled,
        tasksCompleted: goal.progress.tasksCompleted,
        currentStreak: goal.progress.currentStreak,
        longestStreak: goal.progress.longestStreak,
        totalMinutesInvested: goal.progress.totalMinutesInvested,
        hoursInvested: Math.round(goal.progress.totalMinutesInvested / 60 * 10) / 10,
      },
      timeline: {
        createdAt: goal.createdAt,
        deadline: goal.deadline,
        daysRemaining: Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        daysElapsed: Math.ceil((Date.now() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
      },
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch progress data',
        },
      },
      { status: 500 }
    )
  }
}
