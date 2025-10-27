import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getOrCreateUser, getUserGoals } from '@/lib/firebase/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
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

    // Get or create user in Firebase
    const user = await getOrCreateUser({
      uid: session.user.email,
      email: session.user.email,
      displayName: session.user.name || '',
      photoURL: session.user.image || '',
    })

    // Get active goals to calculate stats
    const activeGoals = await getUserGoals(user.uid, 'active')
    const allGoals = await getUserGoals(user.uid)
    const completedGoals = allGoals.filter((g) => g.status === 'completed')

    // Calculate stats
    const totalHoursInvested = Math.round(
      allGoals.reduce((sum, goal) => sum + (goal.progress.totalMinutesInvested || 0), 0) / 60
    )

    const currentStreak = Math.max(...allGoals.map((g) => g.progress.currentStreak || 0), 0)
    const longestStreak = Math.max(...allGoals.map((g) => g.progress.longestStreak || 0), 0)

    // Determine max goals based on subscription plan
    const maxGoals = user.subscription.plan === 'free' ? 1 : 999

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt.toISOString(),
      subscription: {
        status: user.subscription.status,
        plan: user.subscription.plan,
        activeGoals: activeGoals.length,
        maxGoals,
      },
      settings: {
        emailNotifications: user.settings.emailNotifications,
        weekStartsOn: user.settings.weekStartsOn,
        defaultReminderMinutes: user.settings.defaultReminderMinutes,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        theme: 'light', // TODO: Add theme to user settings in Firebase
      },
      stats: {
        totalGoalsCreated: allGoals.length,
        totalGoalsCompleted: completedGoals.length,
        currentStreak,
        longestStreak,
        totalHoursInvested,
      },
    }

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch user data',
        },
      },
      { status: 500 }
    )
  }
}
