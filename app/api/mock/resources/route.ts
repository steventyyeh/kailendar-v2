import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserGoals } from '@/lib/firebase/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
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

    // Get all goals for the user
    const goals = await getUserGoals(userId)

    // Extract resources from all goals and flatten them
    const resources = goals.flatMap((goal) =>
      (goal.resources || []).map((resource) => ({
        id: resource.id,
        type: resource.type,
        title: resource.title,
        description: resource.description,
        url: resource.url || '',
        goalId: goal.id,
        goalName: goal.specificity,
        addedBy: resource.addedBy,
        addedAt: resource.unlockedAt?.toISOString() || new Date().toISOString(),
        cost: resource.cost || 'free',
        estimatedHours: 0, // Not currently tracked in Goal resource type
      }))
    )

    // Count resources by goal
    const resourcesByGoal: Record<string, number> = {}
    goals.forEach((goal) => {
      const count = goal.resources?.length || 0
      if (count > 0) {
        resourcesByGoal[goal.id] = count
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        resources,
        resourcesByGoal,
      },
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch resources',
        },
      },
      { status: 500 }
    )
  }
}
