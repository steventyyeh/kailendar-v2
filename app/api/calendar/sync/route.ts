import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { listCalendars } from '@/lib/google-calendar'
import { getUserTokens } from '@/lib/firebase/db'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
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

    // Check if user has connected Google Calendar
    const tokens = await getUserTokens(userId)

    if (!tokens || !tokens.refreshToken) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          connected: false,
          message: 'Google Calendar not connected',
        },
      })
    }

    // Get list of calendars to verify connection
    try {
      const calendars = await listCalendars(userId)

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          connected: true,
          calendars: calendars.map((cal) => ({
            id: cal.id,
            summary: cal.summary,
            description: cal.description,
            primary: cal.primary,
            accessRole: cal.accessRole,
            backgroundColor: cal.backgroundColor,
          })),
          connectedAt: tokens.expiryDate,
        },
      })
    } catch (error) {
      console.error('Failed to fetch calendars:', error)
      
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'CALENDAR_ERROR',
          message: 'Failed to connect to Google Calendar. Please try reconnecting.',
        },
      })
    }
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check calendar connection',
        },
      },
      { status: 500 }
    )
  }
}
