import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { listCalendarEvents } from '@/lib/google-calendar'
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
    const { searchParams } = new URL(request.url)
    const calendarId = searchParams.get('calendarId') || 'primary'
    const days = parseInt(searchParams.get('days') || '30')

    // Get events from the past to future range
    const timeMin = new Date()
    timeMin.setDate(timeMin.getDate() - 7) // Start from 7 days ago
    const timeMax = new Date()
    timeMax.setDate(timeMax.getDate() + days)

    try {
      const events = await listCalendarEvents(userId, calendarId, timeMin, timeMax)

      // Filter and format events
      const importedEvents = events
        .filter((event) => {
          // Only import events that don't look like they're from Kailendar
          const summary = event.summary || ''
          return !summary.startsWith('🎯') && event.start?.dateTime
        })
        .map((event) => ({
          id: event.id,
          title: event.summary,
          description: event.description,
          start: event.start?.dateTime,
          end: event.end?.dateTime,
          location: event.location,
          attendees: event.attendees?.length || 0,
        }))

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          events: importedEvents,
          total: importedEvents.length,
          calendarId,
          dateRange: {
            from: timeMin.toISOString(),
            to: timeMax.toISOString(),
          },
        },
      })
    } catch (error) {
      console.error('Failed to import events:', error)

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'CALENDAR_ERROR',
            message: 'Failed to import events from Google Calendar',
          },
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Calendar import error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to import from calendar',
        },
      },
      { status: 500 }
    )
  }
}
