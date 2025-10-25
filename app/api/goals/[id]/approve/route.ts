import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

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

    // TODO: Update goal status to 'active' in Firebase
    // For now, using mock data
    const mockGoal = {
      id: goalId,
      userId: session.user.email,
      status: 'active',
      updatedAt: new Date().toISOString(),
    }

    // TODO: Create calendar events for milestones/objectives via Google Calendar API
    // This would:
    // 1. Read the goal plan from Firebase
    // 2. For each milestone, find available time slots
    // 3. Create calendar events with proper titles, descriptions, reminders
    // 4. Store calendar event IDs in the goal document

    return NextResponse.json({
      success: true,
      data: mockGoal,
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
