import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserGoals } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * GET /api/progress
 * Returns aggregated progress analytics for all user goals
 */
export async function GET() {
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

    const userId = session.user.email

    // Get active goals
    const activeGoals = await getUserGoals(userId, 'active')

    // Calculate weekly stats (simplified for MVP)
    const totalTasksScheduled = activeGoals.reduce(
      (sum, goal) => sum + (goal.progress?.totalTasksScheduled || 0),
      0
    )
    const totalTasksCompleted = activeGoals.reduce(
      (sum, goal) => sum + (goal.progress?.tasksCompleted || 0),
      0
    )
    const completionRate =
      totalTasksScheduled > 0 ? Math.round((totalTasksCompleted / totalTasksScheduled) * 100) : 0

    const totalMinutes = activeGoals.reduce(
      (sum, goal) => sum + (goal.progress?.totalMinutesInvested || 0),
      0
    )
    const hoursInvested = Math.round((totalMinutes / 60) * 10) / 10 // Round to 1 decimal

    const currentStreak = Math.max(...activeGoals.map((g) => g.progress?.currentStreak || 0), 0)
    const longestStreak = Math.max(...activeGoals.map((g) => g.progress?.longestStreak || 0), 0)

    // Build active goals progress
    const activeGoalsProgress = activeGoals.map((goal) => {
      const milestones = Array.isArray(goal.plan?.milestones) ? goal.plan.milestones : []
      const nextMilestone = milestones.find((m) => m.status !== 'completed')
      const daysToMilestone = nextMilestone
        ? Math.ceil((nextMilestone.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

      return {
        id: goal.id,
        name: goal.specificity,
        category: goal.category,
        color: goal.calendar?.color || '#3498DB',
        progress: goal.progress?.completionRate || 0,
        tasksCompleted: goal.progress?.tasksCompleted || 0,
        totalTasks: goal.progress?.totalTasksScheduled || 0,
        nextMilestone: nextMilestone?.title || 'No upcoming milestone',
        daysToMilestone,
      }
    })

    // Calculate milestone deltas (simplified)
    const milestoneDelta = activeGoals
      .flatMap((goal) => {
        const milestones = Array.isArray(goal.plan?.milestones) ? goal.plan.milestones : []
        return milestones
          .filter((m) => m.status !== 'completed')
          .map((milestone) => {
            const actualProgress = goal.progress?.completionRate || 0
            // Simple heuristic: expected progress based on time elapsed
            const now = Date.now()
            const start = goal.createdAt.getTime()
            const end = goal.deadline.getTime()
            const totalDuration = end - start
            const elapsed = now - start
            const expectedProgress =
              totalDuration > 0 ? Math.round((elapsed / totalDuration) * 100) : 0

            const delta = actualProgress - expectedProgress

            return {
              goalName: goal.specificity,
              milestoneName: milestone.title,
              targetDate: milestone.targetDate.toISOString(),
              expectedProgress,
              actualProgress,
              delta,
              status:
                delta > 5 ? 'ahead' : delta < -5 ? 'slightly_behind' : ('on_track' as const),
            }
          })
      })
      .slice(0, 5) // Limit to 5 most recent

    // Build recent activity from completed tasks/milestones (simplified)
    const recentActivity = activeGoals
      .flatMap((goal) => {
        const milestones = Array.isArray(goal.plan?.milestones) ? goal.plan.milestones : []
        const completedMilestones = milestones
          .filter((m) => m.status === 'completed' && m.completedAt)
          .map((m) => ({
            id: `${goal.id}_${m.id}`,
            type: 'milestone_completed' as const,
            goalName: goal.specificity,
            description: `Milestone reached: ${m.title}`,
            timestamp: m.completedAt!.toISOString(),
          }))

        // For tasks, we'd need to track individual task completions
        // For now, use progress.lastCompletedTask if available
        const taskActivity = goal.progress?.lastCompletedTask
          ? [
              {
                id: `${goal.id}_last_task`,
                type: 'task_completed' as const,
                goalName: goal.specificity,
                description: 'Completed a task',
                timestamp: goal.progress.lastCompletedTask.toISOString(),
              },
            ]
          : []

        return [...completedMilestones, ...taskActivity]
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10) // Latest 10 activities

    const progressData = {
      weeklyStats: {
        completionRate,
        tasksCompleted: totalTasksCompleted,
        tasksScheduled: totalTasksScheduled,
        hoursInvested,
        currentStreak,
        longestStreak,
      },
      activeGoalsProgress,
      milestoneDelta,
      recentActivity,
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: progressData,
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
