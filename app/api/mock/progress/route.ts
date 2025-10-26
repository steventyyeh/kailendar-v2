import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockData = {
    weeklyStats: {
      completionRate: 73,
      tasksCompleted: 18,
      tasksScheduled: 25,
      hoursInvested: 14.5,
      currentStreak: 5,
      longestStreak: 12,
    },
    activeGoalsProgress: [
      {
        id: 'goal-1',
        name: 'Learn web development with React and Next.js',
        category: 'learning',
        color: '#3498DB',
        progress: 27,
        tasksCompleted: 12,
        totalTasks: 45,
        nextMilestone: 'Master React Fundamentals',
        daysToMilestone: 23,
      },
      {
        id: 'goal-2',
        name: 'Run a half marathon',
        category: 'health_fitness',
        color: '#E74C3C',
        progress: 45,
        tasksCompleted: 28,
        totalTasks: 62,
        nextMilestone: 'Complete 10K run',
        daysToMilestone: 12,
      },
    ],
    milestoneDelta: [
      {
        goalName: 'Learn web development',
        milestoneName: 'Master React Fundamentals',
        targetDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        expectedProgress: 30,
        actualProgress: 27,
        delta: -3,
        status: 'slightly_behind',
      },
      {
        goalName: 'Run a half marathon',
        milestoneName: 'Complete 10K run',
        targetDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        expectedProgress: 40,
        actualProgress: 45,
        delta: +5,
        status: 'ahead',
      },
    ],
    recentActivity: [
      {
        id: '1',
        type: 'task_completed',
        goalName: 'Learn web development',
        description: 'Completed: Learn JSX syntax',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'milestone_completed',
        goalName: 'Run a half marathon',
        description: 'Milestone reached: Complete 5K run',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'task_completed',
        goalName: 'Learn web development',
        description: 'Completed: Setup React environment',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }

  return NextResponse.json({
    success: true,
    data: mockData,
  })
}
