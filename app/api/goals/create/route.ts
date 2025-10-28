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
    // Call AI endpoint to generate plan
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/ai/goal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`)
    }

    const result = await response.json()

    if (!result.success || !result.data) {
      throw new Error('AI API returned unsuccessful response')
    }

    // Extract plan and resources from AI response
    const { plan, resources } = result.data

    // Update goal with generated plan and resources
    const { updateGoal } = await import('@/lib/firebase/db')
    await updateGoal(goalId, {
      status: 'ready',
      plan,
      resources: resources || [],
    })

    console.log(`AI plan generated for goal ${goalId} with ${resources?.length || 0} resources`)

    // Automatically generate tasks and sync to Google Calendar
    try {
      const { createTasksBatch } = await import('@/lib/firebase/tasks')
      const { syncTasksToCalendar } = await import('@/lib/calendar-tasks')
      const { getGoal } = await import('@/lib/firebase/db')

      // Get the updated goal with plan
      const goal = await getGoal(goalId)

      if (!goal || !goal.plan) {
        console.error(`Goal ${goalId} not found or has no plan after generation`)
        return
      }

      // Extract tasks from the goal's plan
      const tasksToCreate: any[] = []

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
        console.log(`No tasks to create for goal ${goalId}`)
        return
      }

      console.log(`Creating ${tasksToCreate.length} tasks for goal ${goalId}`)

      // Create tasks in Firestore
      const createdTasks = await createTasksBatch(userId, tasksToCreate)

      console.log(`Created ${createdTasks.length} tasks in Firestore for goal ${goalId}`)

      // Sync to Google Calendar
      try {
        const goalMap = new Map([[goal.id || goalId, goal]])
        const taskEventMap = await syncTasksToCalendar(userId, createdTasks, goalMap)

        console.log(`Synced ${taskEventMap.size} tasks to Google Calendar for goal ${goalId}`)

        // Update tasks with calendar event IDs
        const { updateTask } = await import('@/lib/firebase/tasks')
        for (const [taskId, eventId] of taskEventMap.entries()) {
          await updateTask(userId, taskId, { calendarEventId: eventId })
        }

        console.log(`Updated task records with calendar event IDs for goal ${goalId}`)
      } catch (calendarError) {
        console.error('Failed to sync tasks to Google Calendar:', calendarError)
        // Continue even if calendar sync fails - tasks are still created in Firestore
      }
    } catch (taskError) {
      console.error(`Failed to generate tasks for goal ${goalId}:`, taskError)
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
