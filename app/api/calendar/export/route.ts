import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createCalendarEvent } from '@/lib/google-calendar'
import { getUserGoals } from '@/lib/firebase/db'
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
    const body = await request.json()
    const { goalIds, calendarId } = body

    if (!goalIds || !Array.isArray(goalIds)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'goalIds array is required',
          },
        },
        { status: 400 }
      )
    }

    // Get user's active goals
    const goals = await getUserGoals(userId, 'active')
    const selectedGoals = goals.filter((g) => goalIds.includes(g.id))

    if (selectedGoals.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NO_GOALS',
            message: 'No goals found to export',
          },
        },
        { status: 404 }
      )
    }

    const exportedEvents: any[] = []
    const errors: any[] = []

    // Export each goal's tasks and milestones as calendar events
    for (const goal of selectedGoals) {
      try {
        // Export milestones as timed events
        if (goal.plan?.milestones) {
          for (const milestone of goal.plan.milestones) {
            try {
              const milestoneTitle = milestone.title || milestone.description
              const event = await createCalendarEvent(userId, calendarId || 'primary', {
                summary: `🎯 ${milestoneTitle}`,
                description: `Milestone for: ${goal.specificity}\n\n${milestone.description}`,
                start: {
                  dateTime: new Date(milestone.targetDate).toISOString(),
                },
                end: {
                  dateTime: new Date(
                    new Date(milestone.targetDate).getTime() + 60 * 60 * 1000
                  ).toISOString(),
                },
                colorId: goal.calendar?.color ? getColorId(goal.calendar.color) : undefined,
                reminders: {
                  useDefault: false,
                  overrides: [{ method: 'popup', minutes: 1440 }],
                },
              })

              exportedEvents.push({
                goalId: goal.id,
                eventId: event.id,
                type: 'milestone',
                title: milestoneTitle,
              })
            } catch (error) {
              console.error(`Failed to export milestone ${milestone.id}:`, error)
              errors.push({
                goalId: goal.id,
                milestoneId: milestone.id,
                error: 'Failed to create calendar event',
              })
            }
          }
        }

        // Export recurring tasks for the next 30 days
        if (goal.plan?.taskTemplate?.recurringTasks) {
          for (const task of goal.plan.taskTemplate.recurringTasks) {
            try {
              const today = new Date()
              const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

              let currentDate = new Date(today)
              while (currentDate < endDate) {
                if (task.daysOfWeek && task.daysOfWeek.includes(currentDate.getDay())) {
                  const startTime = new Date(currentDate)

                  if (task.preferredTime === 'morning') {
                    startTime.setHours(9, 0, 0, 0)
                  } else if (task.preferredTime === 'afternoon') {
                    startTime.setHours(14, 0, 0, 0)
                  } else if (task.preferredTime === 'evening') {
                    startTime.setHours(18, 0, 0, 0)
                  } else {
                    startTime.setHours(12, 0, 0, 0)
                  }

                  const endTime = new Date(startTime.getTime() + task.duration * 60 * 1000)

                  const event = await createCalendarEvent(userId, calendarId || 'primary', {
                    summary: task.title,
                    description: `${task.description}\n\nGoal: ${goal.specificity}`,
                    start: {
                      dateTime: startTime.toISOString(),
                    },
                    end: {
                      dateTime: endTime.toISOString(),
                    },
                    colorId: goal.calendar?.color ? getColorId(goal.calendar.color) : undefined,
                  })

                  exportedEvents.push({
                    goalId: goal.id,
                    eventId: event.id,
                    type: 'task',
                    title: task.title,
                    date: startTime,
                  })
                }

                currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
              }
            } catch (error) {
              console.error(`Failed to export task ${task.title}:`, error)
              errors.push({
                goalId: goal.id,
                taskTitle: task.title,
                error: 'Failed to create calendar events',
              })
            }
          }
        }
      } catch (error) {
        console.error(`Failed to export goal ${goal.id}:`, error)
        errors.push({
          goalId: goal.id,
          error: 'Failed to process goal',
        })
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        exported: exportedEvents.length,
        events: exportedEvents,
        errors: errors.length > 0 ? errors : undefined,
      },
    })
  } catch (error) {
    console.error('Calendar export error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to export to calendar',
        },
      },
      { status: 500 }
    )
  }
}

function getColorId(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#3498DB': '9',
    '#E74C3C': '11',
    '#2ECC71': '10',
    '#F39C12': '6',
    '#9B59B6': '3',
    '#1ABC9C': '7',
  }
  return colorMap[hexColor] || '1'
}
