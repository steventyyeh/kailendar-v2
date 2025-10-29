import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ApiResponse } from '@/types'

/**
 * POST /api/user/timezone
 * Update user's timezone setting
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
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    const userId = session.user.email
    const body = await request.json()
    const { timezone } = body

    if (!timezone || typeof timezone !== 'string') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Valid timezone string required',
          },
        },
        { status: 400 }
      )
    }

    // Validate timezone format (IANA timezone)
    // Basic validation - should be like "America/Los_Angeles"
    if (!timezone.includes('/')) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_TIMEZONE',
            message: 'Invalid timezone format. Expected IANA timezone like "America/Los_Angeles"',
          },
        },
        { status: 400 }
      )
    }

    // Update user settings with timezone
    // Use Firestore's dot notation for nested field updates
    const { adminDb } = await import('@/lib/firebase/admin')
    if (!adminDb) {
      throw new Error('Firebase not configured')
    }

    await adminDb.collection('users').doc(userId).update({
      'settings.timezone': timezone,
      lastLoginAt: new Date(),
    })

    console.log(`[Timezone] Updated timezone for user ${userId} to ${timezone}`)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        timezone,
        message: 'Timezone updated successfully',
      },
    })
  } catch (error) {
    console.error('Error updating timezone:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update timezone',
        },
      },
      { status: 500 }
    )
  }
}
