import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createResource } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * POST /api/resources/add
 * Adds a custom resource to the user's library
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

    const userId = session.user.email
    const resourceData = await request.json()

    // Validate required fields
    const requiredFields = ['type', 'title', 'description']
    for (const field of requiredFields) {
      if (!resourceData[field]) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: `Missing required field: ${field}`,
            },
          },
          { status: 400 }
        )
      }
    }

    // Create resource in Firestore
    const resourceId = await createResource(userId, {
      ...resourceData,
      addedBy: 'user',
    })

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: resourceId,
          message: 'Resource added successfully',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding resource:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to add resource',
        },
      },
      { status: 500 }
    )
  }
}
