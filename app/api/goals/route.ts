import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserGoals } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * GET /api/goals
 * Returns all goals for the current user
 * Optional query params: ?status=active|paused|completed
 */
export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Fetch goals from Firestore
    const goals = await getUserGoals(userId, status || undefined)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        goals,
        total: goals.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch goals',
        },
      },
      { status: 500 }
    )
  }
}
