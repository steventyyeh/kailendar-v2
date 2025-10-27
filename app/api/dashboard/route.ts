import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getOrCreateUser, getUserGoals } from '@/lib/firebase/db'
import { ApiResponse, DashboardData, DailyTask, WeeklyStats } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()

    // If no session, return demo data
    if (!session?.user?.email) {
      const mockDashboard = createMockDashboardData({
        email: 'demo@example.com',
        name: 'Demo User',
        image: null,
      })
      return NextResponse.json<ApiResponse<DashboardData>>(
        {
          success: true,
          data: mockDashboard,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 200 }
      )
    }

    // Get or create user in Firebase
    console.log('[Dashboard] Getting user:', session.user.email)
    const user = await getOrCreateUser({
      uid: session.user.email,
      email: session.user.email,
      displayName: session.user.name || '',
      photoURL: session.user.image || '',
    })
    console.log('[Dashboard] User fetched:', user.uid)

    // Fetch active goals
    console.log('[Dashboard] Fetching active goals for user:', user.uid)
    const activeGoals = await getUserGoals(user.uid, 'active')
    console.log('[Dashboard] Found active goals:', activeGoals.length)

    // Generate today's tasks from active goals
    console.log('[Dashboard] Generating daily tasks')
    const todaysTasks: DailyTask[] = activeGoals.flatMap(goal =>
      generateDailyTasksForGoal(goal)
    )
    console.log('[Dashboard] Generated tasks:', todaysTasks.length)

    // Get upcoming milestones
    console.log('[Dashboard] Processing milestones')
    const upcomingMilestones = activeGoals
      .flatMap(goal => goal.plan?.milestones || [])
      .filter(m => m.status === 'pending')
      .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
      .slice(0, 3)

    // Get recent resources
    console.log('[Dashboard] Processing resources')
    const recentResources = activeGoals
      .flatMap(goal => goal.resources || [])
      .filter(r => r.unlockedAt)
      .sort(
        (a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0)
      )
      .slice(0, 5)

    // Calculate weekly stats
    const stats: WeeklyStats = {
      completionRate: calculateAverageCompletionRate(activeGoals),
      hoursInvested: calculateTotalHoursThisWeek(activeGoals),
      tasksCompleted: calculateTasksCompletedThisWeek(activeGoals),
      currentStreak: activeGoals.length > 0 ? Math.max(...activeGoals.map(g => g.progress?.currentStreak || 0)) : 0,
    }

    const dashboardData: DashboardData = {
      user,
      activeGoals,
      todaysTasks,
      upcomingMilestones,
      recentResources,
      stats,
    }

    return NextResponse.json<ApiResponse<DashboardData>>(
      {
        success: true,
        data: dashboardData,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to load dashboard. Please try again.',
        },
      },
      { status: 500 }
    )
  }
}

function generateDailyTasksForGoal(goal: any): DailyTask[] {
  const tasks: DailyTask[] = []
  const today = new Date()
  const dayOfWeek = today.getDay()

  // Get recurring tasks scheduled for today
  const recurringTasks = goal.plan?.taskTemplate?.recurringTasks

  // Ensure recurringTasks is an array before calling forEach
  if (Array.isArray(recurringTasks)) {
    recurringTasks.forEach((task: any, index: number) => {
      if (
        task.frequency === 'daily' ||
        (task.daysOfWeek && task.daysOfWeek.includes(dayOfWeek))
      ) {
        tasks.push({
          id: `${goal.id}_recurring_${index}`,
          goalId: goal.id,
          goalTitle: goal.specificity,
          goalColor: goal.calendar?.color || '#3498DB',
          title: task.title,
          duration: task.duration,
          completed: false,
        })
      }
    })
  }

  return tasks
}

function calculateAverageCompletionRate(goals: any[]): number {
  if (goals.length === 0) return 0
  const total = goals.reduce((sum, goal) => sum + (goal.progress?.completionRate || 0), 0)
  return Math.round(total / goals.length)
}

function calculateTotalHoursThisWeek(goals: any[]): number {
  // Simplified for MVP - divide total minutes by 60 and estimate weekly
  const totalMinutes = goals.reduce(
    (sum, goal) => sum + (goal.progress?.totalMinutesInvested || 0),
    0
  )
  return Math.round((totalMinutes / 60) * 0.2) // Rough estimate
}

function calculateTasksCompletedThisWeek(goals: any[]): number {
  // Simplified for MVP
  return goals.reduce((sum, goal) => sum + Math.floor((goal.progress?.tasksCompleted || 0) * 0.2), 0)
}

function createMockDashboardData(user: any): DashboardData {
  const mockGoal = {
    id: 'mock-goal-1',
    userId: user.email,
    status: 'active' as const,
    category: 'learning' as const,
    specificity: 'Learn web development with React and Next.js',
    currentState: 'beginner' as const,
    targetState: 'Build and deploy full-stack applications',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    learningStyles: ['hands-on', 'video'],
    budget: '$100',
    equipment: 'Laptop',
    constraints: 'Available weekday evenings',
    plan: {
      generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      llmModel: 'mock-claude-3.5-sonnet',
      milestones: [
        {
          id: 'm1',
          title: 'Master React Fundamentals',
          description: 'Learn core React concepts and build simple components',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          icon: '⚛️',
          status: 'in_progress' as const,
          objectives: [
            {
              id: 'o1',
              description: 'Complete React tutorial',
              status: 'in_progress' as const,
              tasks: [
                { id: 't1', description: 'Setup React environment', status: 'completed' as const },
                { id: 't2', description: 'Learn JSX syntax', status: 'in_progress' as const },
                { id: 't3', description: 'Build first component', status: 'pending' as const },
              ],
            },
          ],
        },
        {
          id: 'm2',
          title: 'Build Real Projects',
          description: 'Apply knowledge to real-world applications',
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          icon: '🚀',
          status: 'pending' as const,
          objectives: [],
        },
      ],
      objectives: [],
      taskTemplate: {
        recurringTasks: [
          {
            title: 'Daily coding practice',
            description: 'Practice React concepts',
            duration: 60,
            frequency: 'daily' as const,
            daysOfWeek: [1, 2, 3, 4, 5],
            preferredTime: 'evening' as const,
            skillFocus: 'coding',
          },
        ],
        oneTimeTasks: [],
      },
    },
    calendar: {
      color: '#3498DB',
      eventIds: [],
    },
    progress: {
      totalTasksScheduled: 45,
      tasksCompleted: 12,
      completionRate: 27,
      currentStreak: 3,
      longestStreak: 5,
      totalMinutesInvested: 780,
    },
    resources: [
      {
        id: 'r1',
        type: 'course' as const,
        title: 'React Fundamentals',
        url: 'https://reactjs.org',
        description: 'Official React documentation and tutorial',
        addedBy: 'system' as const,
      },
      {
        id: 'r2',
        type: 'video' as const,
        title: 'Next.js Tutorial Series',
        url: 'https://nextjs.org/learn',
        description: 'Learn Next.js from the official tutorial',
        addedBy: 'system' as const,
      },
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }

  const mockTasks: DailyTask[] = [
    {
      id: 'task-1',
      goalId: 'mock-goal-1',
      goalTitle: 'Learn web development',
      goalColor: '#3498DB',
      title: 'Complete React tutorial chapter',
      duration: 60,
      completed: false,
    },
    {
      id: 'task-2',
      goalId: 'mock-goal-1',
      goalTitle: 'Learn web development',
      goalColor: '#3498DB',
      title: 'Practice building components',
      duration: 90,
      completed: false,
    },
  ]

  return {
    user: {
      uid: user.email,
      email: user.email,
      displayName: user.name || 'User',
      photoURL: user.image || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      subscription: {
        status: 'free',
        plan: 'free',
      },
      settings: {
        emailNotifications: true,
        weekStartsOn: 0,
        defaultReminderMinutes: 15,
      },
    },
    activeGoals: [mockGoal],
    todaysTasks: mockTasks,
    upcomingMilestones: mockGoal.plan.milestones.filter(m => m.status === 'pending'),
    recentResources: mockGoal.resources,
    stats: {
      completionRate: 27,
      hoursInvested: 13,
      tasksCompleted: 12,
      currentStreak: 3,
    },
  }
}
