import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserResources } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * GET /api/resources
 * Returns all resources for the current user
 */
export async function GET(request: NextRequest) {
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

    // Fetch all resources for the user
    const resources = await getUserResources(userId)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        resources,
        total: resources.length,
      },
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json<ApiResponse>(
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
