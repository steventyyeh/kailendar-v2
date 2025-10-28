'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { signOut } from '@/auth.actions'

interface UserData {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  createdAt: string
  lastLoginAt: string
  subscription: {
    status: string
    plan: string
  }
  settings: {
    emailNotifications: boolean
    weekStartsOn: number
    defaultReminderMinutes: number
  }
}

interface CalendarConnection {
  connected: boolean
  calendars?: Array<{
    id: string
    summary: string
    primary?: boolean
  }>
  connectedAt?: Date
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Local state for form
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weekStartsOn, setWeekStartsOn] = useState(0)
  const [defaultReminderMinutes, setDefaultReminderMinutes] = useState(15)
  const [theme, setTheme] = useState('light')

  // Calendar integration state
  const [calendarConnection, setCalendarConnection] = useState<CalendarConnection>({
    connected: false,
  })
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/user/profile')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('User profile response:', result)

        if (result.success && result.data) {
          setData(result.data)
          const settings = result.data.settings || {}
          setEmailNotifications(settings.emailNotifications ?? true)
          setWeekStartsOn(settings.weekStartsOn ?? 0)
          setDefaultReminderMinutes(settings.defaultReminderMinutes ?? 15)
          setTheme(settings.theme || 'light')
        } else {
          console.error('API returned unsuccessful response:', result)
          setError(result.error?.message || 'Failed to load user data')
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setError(`Failed to load user data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUser()
      checkCalendarConnection()
    } else if (session === null) {
      setLoading(false)
      setError('You must be signed in to view this page')
    }
  }, [session])

  const checkCalendarConnection = async () => {
    try {
      setCalendarLoading(true)
      const response = await fetch('/api/calendar/sync')
      const result = await response.json()

      if (result.success && result.data) {
        setCalendarConnection(result.data)
      }
    } catch (err) {
      console.error('Error checking calendar connection:', err)
    } finally {
      setCalendarLoading(false)
    }
  }

  const handleConnectCalendar = async () => {
    try {
      await signIn('google', {
        callbackUrl: window.location.href,
        redirect: true,
      })
    } catch (err) {
      console.error('Error connecting calendar:', err)
      alert('Failed to connect Google Calendar')
    }
  }

  const handleDisconnectCalendar = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) {
      return
    }

    try {
      setCalendarLoading(true)
      const response = await fetch('/api/calendar/disconnect', {
        method: 'POST',
      })

      const result = await response.json()

      if (result.success) {
        setCalendarConnection({ connected: false })
        alert('Google Calendar disconnected successfully')
      } else {
        alert(result.error?.message || 'Failed to disconnect')
      }
    } catch (err) {
      console.error('Error disconnecting calendar:', err)
      alert('Failed to disconnect Google Calendar')
    } finally {
      setCalendarLoading(false)
    }
  }

  const handleSyncNow = async () => {
    try {
      setSyncing(true)
      // This would open a dialog to select goals to export
      // For now, we'll just show a message
      alert('Sync functionality will open a dialog to select goals to export to Google Calendar')
    } catch (err) {
      console.error('Error syncing:', err)
      alert('Failed to sync with Google Calendar')
    } finally {
      setSyncing(false)
    }
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            emailNotifications,
            weekStartsOn,
            defaultReminderMinutes,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Settings saved successfully!')
        const refreshResponse = await fetch('/api/user/profile')
        const refreshResult = await refreshResponse.json()
        if (refreshResult.success) {
          setData(refreshResult.data)
        }
      } else {
        alert(result.error?.message || 'Failed to save settings')
      }
    } catch (err) {
      console.error('Error saving settings:', err)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'No data available'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
        <div className="flex items-center gap-6 mb-6">
          {data.photoURL ? (
            <img
              src={data.photoURL}
              alt={data.displayName || data.email}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl text-blue-600">
                {(data.displayName || data.email || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.displayName || 'User'}</h3>
            <p className="text-sm text-gray-600">{data.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">Subscription</p>
            <p className="font-semibold text-gray-900 capitalize">
              {data.subscription.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-semibold text-gray-900">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <form onSubmit={handleSaveChanges} className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive email updates about your goals and progress
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Week Starts On */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">
              Week Starts On
            </label>
            <select
              value={weekStartsOn}
              onChange={(e) => setWeekStartsOn(Number(e.target.value))}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              Choose which day starts your week in calendar views
            </p>
          </div>

          {/* Default Reminder Time */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">
              Default Reminder Time
            </label>
            <select
              value={defaultReminderMinutes}
              onChange={(e) => setDefaultReminderMinutes(Number(e.target.value))}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
              <option value={1440}>1 day before</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              Default notification time for calendar events
            </p>
          </div>

          {/* Theme */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">Choose your preferred color scheme</p>
          </div>

          {/* Timezone */}
          <div>
            <label className="block font-medium text-gray-900 mb-2">Timezone</label>
            <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Timezone is automatically detected from your browser
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Calendar Integration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Calendar Integration</h2>

        {calendarLoading ? (
          <div className="h-32 bg-gray-50 rounded-lg animate-pulse" />
        ) : calendarConnection.connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Google Calendar Connected</h3>
                <p className="text-sm text-gray-600">
                  {calendarConnection.calendars?.length || 0} calendar(s) available
                </p>
              </div>
            </div>

            {calendarConnection.calendars && calendarConnection.calendars.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Connected Calendars:</p>
                <ul className="space-y-1">
                  {calendarConnection.calendars.slice(0, 3).map((cal) => (
                    <li key={cal.id} className="text-sm text-gray-600 flex items-center gap-2">
                      {cal.primary && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          Primary
                        </span>
                      )}
                      <span>{cal.summary}</span>
                    </li>
                  ))}
                  {calendarConnection.calendars.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{calendarConnection.calendars.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? 'Syncing...' : 'Export Goals to Calendar'}
              </button>
              <button
                onClick={handleDisconnectCalendar}
                disabled={calendarLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Connect Google Calendar
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sync your Kailendar goals and tasks with Google Calendar to keep everything in one place.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">•</span>
                    Export goals and milestones as calendar events
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">•</span>
                    Import existing calendar events
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">•</span>
                    Keep your schedule synchronized
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleConnectCalendar}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Connect Google Calendar
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Sign Out</h3>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                onClick={() =>
                  alert('Account deletion would be handled here (requires confirmation)')
                }
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
