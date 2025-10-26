import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockData = {
    resources: [
      {
        id: 'r1',
        type: 'course',
        title: 'React Fundamentals',
        description: 'Official React documentation and interactive tutorial',
        url: 'https://reactjs.org',
        goalId: 'goal-1',
        goalName: 'Learn web development with React and Next.js',
        addedBy: 'system',
        addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 'free',
        estimatedHours: 8,
      },
      {
        id: 'r2',
        type: 'video',
        title: 'Next.js Tutorial Series',
        description: 'Learn Next.js from the official tutorial with practical examples',
        url: 'https://nextjs.org/learn',
        goalId: 'goal-1',
        goalName: 'Learn web development with React and Next.js',
        addedBy: 'system',
        addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 'free',
        estimatedHours: 12,
      },
      {
        id: 'r3',
        type: 'book',
        title: 'Learning React, 2nd Edition',
        description: 'A hands-on guide to building web applications using React and Redux',
        url: 'https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/',
        goalId: 'goal-1',
        goalName: 'Learn web development with React and Next.js',
        addedBy: 'user',
        addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        cost: '$29',
        estimatedHours: 20,
      },
      {
        id: 'r4',
        type: 'course',
        title: 'Couch to 5K Running Plan',
        description: 'Beginner-friendly running program to build endurance',
        url: 'https://www.c25k.com',
        goalId: 'goal-2',
        goalName: 'Run a half marathon',
        addedBy: 'system',
        addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 'free',
        estimatedHours: 0,
      },
      {
        id: 'r5',
        type: 'app',
        title: 'Strava Running Tracker',
        description: 'Track your runs, analyze performance, and connect with other runners',
        url: 'https://www.strava.com',
        goalId: 'goal-2',
        goalName: 'Run a half marathon',
        addedBy: 'user',
        addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 'free',
        estimatedHours: 0,
      },
      {
        id: 'r6',
        type: 'community',
        title: 'r/running Reddit Community',
        description: 'Connect with runners worldwide, get advice, and share progress',
        url: 'https://reddit.com/r/running',
        goalId: 'goal-2',
        goalName: 'Run a half marathon',
        addedBy: 'user',
        addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 'free',
        estimatedHours: 0,
      },
    ],
    resourcesByGoal: {
      'goal-1': 3,
      'goal-2': 3,
    },
  }

  return NextResponse.json({
    success: true,
    data: mockData,
  })
}
