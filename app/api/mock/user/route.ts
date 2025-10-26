import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const session = await auth()

  const mockUser = {
    uid: session?.user?.email || 'demo@example.com',
    email: session?.user?.email || 'demo@example.com',
    displayName: session?.user?.name || 'Demo User',
    photoURL: session?.user?.image || null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    subscription: {
      status: 'free',
      plan: 'free',
      activeGoals: 2,
      maxGoals: 3,
    },
    settings: {
      emailNotifications: true,
      weekStartsOn: 0, // 0 = Sunday, 1 = Monday
      defaultReminderMinutes: 15,
      timezone: 'America/Los_Angeles',
      theme: 'light',
    },
    stats: {
      totalGoalsCreated: 5,
      totalGoalsCompleted: 2,
      currentStreak: 5,
      longestStreak: 12,
      totalHoursInvested: 87,
    },
  }

  return NextResponse.json({
    success: true,
    data: mockUser,
  })
}
