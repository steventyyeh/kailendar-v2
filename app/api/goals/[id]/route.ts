import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const { id: goalId } = await params

    // TODO: Fetch goal from Firebase by ID
    // For now, using mock data from dashboard API
    const mockGoal = {
      id: goalId,
      userId: session.user.email,
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
              {
                id: 'o2',
                description: 'Understand component lifecycle',
                status: 'pending' as const,
                tasks: [
                  { id: 't4', description: 'Learn about useEffect hook', status: 'pending' as const },
                  { id: 't5', description: 'Practice state management', status: 'pending' as const },
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
            objectives: [
              {
                id: 'o3',
                description: 'Build a todo app',
                status: 'pending' as const,
                tasks: [
                  { id: 't6', description: 'Design UI mockup', status: 'pending' as const },
                  { id: 't7', description: 'Implement CRUD operations', status: 'pending' as const },
                ],
              },
            ],
          },
          {
            id: 'm3',
            title: 'Master Next.js',
            description: 'Learn Next.js framework and server-side rendering',
            targetDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
            icon: '▲',
            status: 'pending' as const,
            objectives: [
              {
                id: 'o4',
                description: 'Learn Next.js routing',
                status: 'pending' as const,
                tasks: [
                  { id: 't8', description: 'Understand app router', status: 'pending' as const },
                ],
              },
            ],
          },
          {
            id: 'm4',
            title: 'Deploy Full-Stack App',
            description: 'Build and deploy a complete application',
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            icon: '🏆',
            status: 'pending' as const,
            objectives: [
              {
                id: 'o5',
                description: 'Build portfolio project',
                status: 'pending' as const,
                tasks: [
                  { id: 't9', description: 'Plan project architecture', status: 'pending' as const },
                  { id: 't10', description: 'Deploy to Vercel', status: 'pending' as const },
                ],
              },
            ],
          },
        ],
        objectives: [],
        taskTemplate: {
          recurringTasks: [],
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
          cost: 'free',
        },
        {
          id: 'r2',
          type: 'video' as const,
          title: 'Next.js Tutorial Series',
          url: 'https://nextjs.org/learn',
          description: 'Learn Next.js from the official tutorial',
          addedBy: 'system' as const,
          cost: 'free',
        },
        {
          id: 'r3',
          type: 'book' as const,
          title: 'Learning React',
          description: 'A hands-on guide to building web applications',
          addedBy: 'system' as const,
          cost: '$29',
        },
      ],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: mockGoal,
    })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch goal',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}
