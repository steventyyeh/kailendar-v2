import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getResource, updateResource, deleteResource } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

/**
 * PATCH /api/resources/[id]
 * Update a resource
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: resourceId } = await params
    const userId = session.user.email

    // Fetch the resource to verify ownership
    const resource = await getResource(resourceId)

    if (!resource) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
          },
        },
        { status: 404 }
      )
    }

    // Verify ownership
    if (resource.userId !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to edit this resource',
          },
        },
        { status: 403 }
      )
    }

    // Parse update data
    const updates = await request.json()

    // Only allow certain fields to be updated
    const allowedFields = ['title', 'type', 'description', 'url', 'cost', 'estimatedHours', 'goalId']
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

    // Update the resource
    await updateResource(resourceId, sanitizedUpdates)

    // Fetch updated resource
    const updatedResource = await getResource(resourceId)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedResource,
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update resource',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/resources/[id]
 * Delete a resource
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: resourceId } = await params
    const userId = session.user.email

    // Fetch the resource to verify ownership
    const resource = await getResource(resourceId)

    if (!resource) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
          },
        },
        { status: 404 }
      )
    }

    // Verify ownership
    if (resource.userId !== userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this resource',
          },
        },
        { status: 403 }
      )
    }

    // Delete the resource
    await deleteResource(resourceId)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: 'Resource deleted successfully',
      },
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete resource',
        },
      },
      { status: 500 }
    )
  }
}
