import { google } from 'googleapis'
import { getUserTokens } from './firebase/db'

export interface GoogleCalendarEvent {
  id?: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  colorId?: string
  reminders?: {
    useDefault: boolean
    overrides?: Array<{
      method: string
      minutes: number
    }>
  }
}

/**
 * Get authenticated Google Calendar client for a user
 */
export const getGoogleCalendarClient = async (userId: string) => {
  const tokens = await getUserTokens(userId)
  
  if (!tokens || !tokens.refreshToken) {
    throw new Error('User has not connected Google Calendar')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  )

  oauth2Client.setCredentials({
    refresh_token: tokens.refreshToken,
    access_token: tokens.accessToken,
  })

  // Set up automatic token refresh
  oauth2Client.on('tokens', (newTokens) => {
    console.log('New tokens received:', newTokens)
    // TODO: Update tokens in Firestore if refresh token is provided
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

/**
 * List user's calendars
 */
export const listCalendars = async (userId: string) => {
  const calendar = await getGoogleCalendarClient(userId)
  
  const response = await calendar.calendarList.list({
    maxResults: 50,
  })

  return response.data.items || []
}

/**
 * Create a calendar event
 */
export const createCalendarEvent = async (
  userId: string,
  calendarId: string,
  event: GoogleCalendarEvent
) => {
  const calendar = await getGoogleCalendarClient(userId)
  
  const response = await calendar.events.insert({
    calendarId: calendarId || 'primary',
    requestBody: event,
  })

  return response.data
}

/**
 * Update a calendar event
 */
export const updateCalendarEvent = async (
  userId: string,
  calendarId: string,
  eventId: string,
  event: Partial<GoogleCalendarEvent>
) => {
  const calendar = await getGoogleCalendarClient(userId)
  
  const response = await calendar.events.patch({
    calendarId: calendarId || 'primary',
    eventId,
    requestBody: event,
  })

  return response.data
}

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = async (
  userId: string,
  calendarId: string,
  eventId: string
) => {
  const calendar = await getGoogleCalendarClient(userId)
  
  await calendar.events.delete({
    calendarId: calendarId || 'primary',
    eventId,
  })
}

/**
 * List calendar events within a date range
 */
export const listCalendarEvents = async (
  userId: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date
) => {
  const calendar = await getGoogleCalendarClient(userId)
  
  const response = await calendar.events.list({
    calendarId: calendarId || 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  })

  return response.data.items || []
}

/**
 * Find free time slots in a calendar
 */
export const findFreeBusy = async (
  userId: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date
) => {
  const calendar = await getGoogleCalendarClient(userId)
  
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calendarId || 'primary' }],
    },
  })

  return response.data.calendars?.[calendarId || 'primary']
}

/**
 * Revoke calendar access
 */
export const revokeCalendarAccess = async (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({ refresh_token: refreshToken })
  
  try {
    await oauth2Client.revokeCredentials()
    return true
  } catch (error) {
    console.error('Failed to revoke credentials:', error)
    return false
  }
}
