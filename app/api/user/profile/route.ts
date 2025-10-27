import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getOrCreateUser, updateUser } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * GET /api/user/profile
 * Returns current user profile and settings
 */
export async function GET() {
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

    // Get or create user in Firestore
    const user = await getOrCreateUser({
      uid: session.user.email,
      email: session.user.email,
      displayName: session.user.name || '',
      photoURL: session.user.image || '',
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        subscription: user.subscription,
        settings: user.settings,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch user profile',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/profile
 * Updates user profile settings
 */
export async function PATCH(request: NextRequest) {
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
    const updates = await request.json()

    // Validate allowed updates
    const allowedFields = ['displayName', 'settings']
    const sanitizedUpdates: any = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field]
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No valid fields to update',
          },
        },
        { status: 400 }
      )
    }

    // Update user in Firestore
    await updateUser(userId, sanitizedUpdates)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: 'Profile updated successfully',
        updated: sanitizedUpdates,
      },
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update profile',
        },
      },
      { status: 500 }
    )
  }
}
