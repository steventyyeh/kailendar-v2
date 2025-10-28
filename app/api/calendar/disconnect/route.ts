import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { revokeCalendarAccess } from '@/lib/google-calendar'
import { getUserTokens, deleteUserTokens } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

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

    // Get user's tokens
    const tokens = await getUserTokens(userId)

    if (!tokens || !tokens.refreshToken) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          message: 'Calendar not connected',
        },
      })
    }

    // Revoke OAuth access
    try {
      await revokeCalendarAccess(tokens.refreshToken)
    } catch (error) {
      console.error('Failed to revoke access (continuing anyway):', error)
      // Continue even if revocation fails - we still want to delete local tokens
    }

    // Delete tokens from Firestore
    await deleteUserTokens(userId)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: 'Calendar disconnected successfully',
      },
    })
  } catch (error) {
    console.error('Calendar disconnect error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to disconnect calendar',
        },
      },
      { status: 500 }
    )
  }
}
