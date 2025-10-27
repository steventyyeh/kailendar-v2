import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getGoal, updateGoal } from '@/lib/firebase/db'

export async function POST(
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

    // Update goal status to 'active' in Firebase
    await updateGoal(goalId, {
      status: 'active',
    })

    // TODO: Create calendar events for milestones/objectives via Google Calendar API
    // This would:
    // 1. Read the goal plan from Firebase
    // 2. For each milestone, find available time slots
    // 3. Create calendar events with proper titles, descriptions, reminders
    // 4. Store calendar event IDs in the goal document

    const updatedGoal = await getGoal(goalId)

    return NextResponse.json({
      success: true,
      data: updatedGoal,
    })
  } catch (error) {
    console.error('Error approving goal:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to approve goal',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}
