'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
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
    activeGoals: number
    maxGoals: number
  }
  settings: {
    emailNotifications: boolean
    weekStartsOn: number
    defaultReminderMinutes: number
    timezone: string
    theme: string
  }
  stats: {
    totalGoalsCreated: number
    totalGoalsCompleted: number
    currentStreak: number
    longestStreak: number
    totalHoursInvested: number
  }
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mock/user')
        const result = await response.json()

        if (result.success) {
          setData(result.data)
          // Populate form with fetched data
          setEmailNotifications(result.data.settings.emailNotifications)
          setWeekStartsOn(result.data.settings.weekStartsOn)
          setDefaultReminderMinutes(result.data.settings.defaultReminderMinutes)
          setTheme(result.data.settings.theme)
        } else {
          setError('Failed to load user data')
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert('Settings saved successfully! (API integration pending)')
    setSaving(false)
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
              alt={data.displayName}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl text-blue-600">
                {data.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.displayName}</h3>
            <p className="text-sm text-gray-600">{data.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">Subscription</p>
            <p className="font-semibold text-gray-900 capitalize">
              {data.subscription.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Goals</p>
            <p className="font-semibold text-gray-900">
              {data.subscription.activeGoals} / {data.subscription.maxGoals}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Streak</p>
            <p className="font-semibold text-gray-900">
              {data.stats.currentStreak} days 🔥
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {data.stats.totalGoalsCreated}
              </p>
              <p className="text-sm text-gray-600">Goals Created</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {data.stats.totalGoalsCompleted}
              </p>
              <p className="text-sm text-gray-600">Goals Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {data.stats.totalHoursInvested}h
              </p>
              <p className="text-sm text-gray-600">Hours Invested</p>
            </div>
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
              {data.settings.timezone}
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
