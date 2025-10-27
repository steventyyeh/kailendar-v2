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
