import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createGoal, getUser, getUserGoals } from '@/lib/firebase/db'
import { CreateGoalRequest, ApiResponse, CreateGoalResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be signed in to create goals',
          },
        },
        { status: 401 }
      )
    }

    // Get user ID from session
    const userId = session.user.email // Using email as userId for now

    // Parse request body
    const body: CreateGoalRequest = await request.json()

    // Validate required fields
    const requiredFields: (keyof CreateGoalRequest)[] = [
      'category',
      'specificity',
      'currentState',
      'targetState',
      'deadline',
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: `Missing required field: ${field}`,
            },
          },
          { status: 400 }
        )
      }
    }

    // Check subscription limits
    const user = await getUser(userId)
    const activeGoals = await getUserGoals(userId, 'active')

    if (user?.subscription.plan === 'free' && activeGoals.length >= 1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'SUBSCRIPTION_LIMIT',
            message: 'Free tier allows only 1 active goal. Please upgrade to Pro for unlimited goals.',
          },
        },
        { status: 403 }
      )
    }

    // Create goal with processing status
    const goalId = await createGoal(userId, {
      status: 'processing',
      category: body.category,
      specificity: body.specificity,
      currentState: body.currentState,
      targetState: body.targetState,
      deadline: new Date(body.deadline),
      learningStyles: body.learningStyles || [],
      budget: body.budget || '',
      equipment: body.equipment || '',
      constraints: body.constraints || '',
      calendar: {
        color: generateRandomColor(),
        eventIds: [],
      },
      progress: {
        totalTasksScheduled: 0,
        tasksCompleted: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalMinutesInvested: 0,
      },
      resources: [],
    })

    // Return immediately with processing status
    const response: ApiResponse<CreateGoalResponse> = {
      success: true,
      data: {
        goalId,
        status: 'processing',
        estimatedTime: 8,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }

    // Start plan generation in background (in production, use a queue)
    generatePlanInBackground(userId, goalId, body).catch(console.error)

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create goal. Please try again.',
        },
      },
      { status: 500 }
    )
  }
}

// Background task to generate plan (simplified for MVP)
async function generatePlanInBackground(
  userId: string,
  goalId: string,
  request: CreateGoalRequest
) {
  try {
    console.log(`[Background] Starting plan generation for goal ${goalId}`)

    // Call AI generation function directly (no HTTP request needed)
    const { generatePlanWithClaude } = await import('@/lib/ai/generatePlan')
    const { plan, tasks, resources } = await generatePlanWithClaude(request)

    console.log(`[Background] AI plan generated for goal ${goalId}:`, {
      tasksGenerated: tasks.length,
      resourcesGenerated: resources.length,
      milestonesGenerated: plan.milestones.length,
    })

    // Update goal with generated plan and resources
    const { updateGoal } = await import('@/lib/firebase/db')
    await updateGoal(goalId, {
      status: 'ready',
      plan,
      resources: resources || [],
    })

    console.log(`[Background] Goal ${goalId} updated with plan and resources`)

    // Automatically create tasks and sync to Google Calendar
    try {
      const { createTasksBatch } = await import('@/lib/firebase/tasks')
      const { syncTasksToCalendar } = await import('@/lib/calendar-tasks')
      const { getGoal } = await import('@/lib/firebase/db')

      // Get the updated goal with plan
      const goal = await getGoal(goalId)

      if (!goal) {
        console.error(`[Background] Goal ${goalId} not found after generation`)
        return
      }

      if (tasks.length === 0) {
        console.log(`[Background] No tasks to create for goal ${goalId}`)
        return
      }

      // Set the goalId for all tasks
      const tasksWithGoalId = tasks.map(task => ({
        ...task,
        goalId: goal.id || goalId,
      }))

      console.log(`[Background] Creating ${tasksWithGoalId.length} tasks for goal ${goalId}`)

      // Create tasks in Firestore
      const createdTasks = await createTasksBatch(userId, tasksWithGoalId)

      console.log(`[Background] Created ${createdTasks.length} tasks in Firestore for goal ${goalId}`)

      // Sync to Google Calendar
      try {
        const goalMap = new Map([[goal.id || goalId, goal]])
        const taskEventMap = await syncTasksToCalendar(userId, createdTasks, goalMap)

        console.log(`[Background] Synced ${taskEventMap.size} tasks to Google Calendar for goal ${goalId}`)

        // Update tasks with calendar event IDs
        const { updateTask } = await import('@/lib/firebase/tasks')
        for (const [taskId, eventId] of taskEventMap.entries()) {
          await updateTask(userId, taskId, { calendarEventId: eventId })
        }

        console.log(`[Background] Updated task records with calendar event IDs for goal ${goalId}`)
      } catch (calendarError) {
        console.error('[Background] Failed to sync tasks to Google Calendar:', calendarError)
        // Continue even if calendar sync fails - tasks are still created in Firestore
      }
    } catch (taskError) {
      console.error(`[Background] Failed to create tasks for goal ${goalId}:`, taskError)
      // Continue - goal plan is still created even if task generation fails
    }
  } catch (error) {
    console.error(`Failed to generate plan for goal ${goalId}:`, error)

    // Create minimal fallback plan
    try {
      const { updateGoal } = await import('@/lib/firebase/db')
      const deadline = new Date(request.deadline)
      const now = new Date()

      // Create a simple 2-milestone plan
      const milestones = [
          {
            id: 'milestone-1',
            title: 'Get Started',
            description: `Begin working on: ${request.specificity}`,
            targetDate: new Date(now.getTime() + (deadline.getTime() - now.getTime()) / 2),
            status: 'pending' as const,
            objectives: [
              {
                id: 'obj-1',
                milestoneId: 'milestone-1',
                description: 'Research and plan your approach',
                estimatedHours: 5,
                status: 'pending' as const,
                tasks: [
                  { id: 'task-1-1', description: 'Set up your workspace and gather materials', status: 'pending' as const },
                  { id: 'task-1-2', description: 'Create a detailed action plan', status: 'pending' as const },
                ],
              },
            ],
          },
          {
            id: 'milestone-2',
            title: 'Make Progress',
            description: 'Work consistently toward your goal',
            targetDate: deadline,
            status: 'pending' as const,
            objectives: [
              {
                id: 'obj-2',
                milestoneId: 'milestone-2',
                description: 'Execute your plan and track progress',
                estimatedHours: 20,
                status: 'pending' as const,
                tasks: [
                  { id: 'task-2-1', description: 'Practice or work on your goal daily', status: 'pending' as const },
                  { id: 'task-2-2', description: 'Review and adjust your approach weekly', status: 'pending' as const },
                ],
              },
            ],
          },
        ]

      const allObjectives = milestones.flatMap(m => m.objectives)

      const minimalPlan = {
        generatedAt: now,
        llmModel: 'fallback-v1',
        milestones,
        objectives: allObjectives,
        taskTemplate: {
          summary: `Starting your journey with ${request.specificity}. This basic plan will help you get organized.`,
          insights: [
            'Break down your goal into smaller daily actions',
            'Track your progress consistently and adjust as needed',
          ],
          recommendedSchedule: {
            frequency: 'daily',
            duration: 30,
            suggestedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
        },
      }

      await updateGoal(goalId, {
        status: 'ready',
        plan: minimalPlan,
        resources: [],
      })

      console.log(`Minimal fallback plan generated for goal ${goalId}`)
    } catch (fallbackError) {
      console.error(`Fallback also failed for goal ${goalId}:`, fallbackError)
      // Update goal status to error
      const { updateGoal } = await import('@/lib/firebase/db')
      await updateGoal(goalId, {
        status: 'deleted', // Mark as error/deleted
      })
    }
  }
}

function generateRandomColor(): string {
  const colors = [
    '#FF5733',
    '#33C1FF',
    '#8E44AD',
    '#27AE60',
    '#F39C12',
    '#E74C3C',
    '#3498DB',
    '#2ECC71',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
