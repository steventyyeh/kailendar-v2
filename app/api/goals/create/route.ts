import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createGoal, getUser, getUserGoals } from '@/lib/firebase/db'
import { generateGoalPlan } from '@/lib/claude/mock'
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
    // Generate plan using mock Claude API
    const { plan, resources } = await generateGoalPlan(request)

    // Update goal with generated plan
    const { updateGoal } = await import('@/lib/firebase/db')
    await updateGoal(userId, goalId, {
      status: 'ready',
      plan,
      resources,
    })

    console.log(`Plan generated for goal ${goalId}`)
  } catch (error) {
    console.error(`Failed to generate plan for goal ${goalId}:`, error)

    // Update goal status to error
    const { updateGoal } = await import('@/lib/firebase/db')
    await updateGoal(userId, goalId, {
      status: 'deleted', // Mark as error/deleted
    })
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
