import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ApiResponse, GoalPlan, Milestone, Objective } from '@/types'

/**
 * POST /api/ai/goal
 * Generates an AI-powered goal plan using Claude
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
            message: 'You must be signed in',
          },
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not configured, returning mock plan')
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          plan: getMockPlan(body.specificity, body.deadline),
          resources: [],
        },
      })
    }

    // Use shared AI generation function
    const { generatePlanWithClaude } = await import('@/lib/ai/generatePlan')
    const { plan, resources } = await generatePlanWithClaude(body)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        plan,
        resources,
      },
    })
  } catch (error) {
    console.error('Error generating AI goal plan:', error)

    // Fallback to minimal plan on error
    const body = await request.json().catch(() => ({}))
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        plan: getMockPlan(
          body.specificity || 'Your Goal',
          body.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        ),
        resources: [],
      },
      warning: 'AI generation unavailable, using fallback plan',
    })
  }
}

/**
 * Fallback mock plan when AI is unavailable
 */
function getMockPlan(goalTitle: string, deadline: Date): GoalPlan {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const milestone1Date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const milestone2Date = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

  const objectives: Objective[] = [
    {
      id: 'obj-1',
      milestoneId: 'milestone-1',
      description: 'Set up learning environment and gather resources',
      estimatedHours: 5,
      status: 'pending',
      tasks: [
        { id: 'task-1-1', description: 'Research and bookmark top learning resources', status: 'pending' },
        { id: 'task-1-2', description: 'Set up dedicated practice time in calendar', status: 'pending' },
      ],
    },
    {
      id: 'obj-2',
      milestoneId: 'milestone-2',
      description: 'Complete foundational learning phase',
      estimatedHours: 20,
      status: 'pending',
      tasks: [
        { id: 'task-2-1', description: 'Work through beginner tutorials', status: 'pending' },
        { id: 'task-2-2', description: 'Practice daily exercises', status: 'pending' },
        { id: 'task-2-3', description: 'Build first mini-project', status: 'pending' },
      ],
    },
  ]

  return {
    generatedAt: new Date(),
    llmModel: 'mock-v1',
    milestones: [
      {
        id: 'milestone-1',
        title: 'Getting Started',
        description: 'Set up foundations and begin learning',
        targetDate: milestone1Date,
        status: 'pending',
        objectives: [objectives[0]],
      },
      {
        id: 'milestone-2',
        title: 'Build Core Skills',
        description: 'Develop fundamental knowledge and practice regularly',
        targetDate: milestone2Date,
        status: 'pending',
        objectives: [objectives[1]],
      },
    ],
    objectives,
    taskTemplate: {
      summary: `Great choice starting your journey with "${goalTitle}"! This plan will guide you step-by-step toward mastery.`,
      insights: [
        'Start with 30-minute daily practice sessions to build consistent habits',
        'Track your progress weekly and adjust your pace as needed',
      ],
      recommendedSchedule: {
        frequency: 'weekly',
        duration: 30,
        suggestedDays: ['Monday', 'Wednesday', 'Friday'],
      },
    },
  }
}
