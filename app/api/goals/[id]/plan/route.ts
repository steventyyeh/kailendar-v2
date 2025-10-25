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
    // For now, using mock data that simulates the plan generation states

    // Simulate processing state initially, then ready state
    // In real implementation, this would check the actual status in Firebase
    const mockGoal = {
      id: goalId,
      userId: session.user.email,
      category: 'creative_skills',
      specificity: 'Learn watercolor portrait painting',
      currentState: 'beginner',
      targetState: 'Complete 20 finished watercolor portraits that I\'m proud to display',
      deadline: '2026-06-01',
      learningStyles: ['hands_on_practice', 'video_tutorials'],
      budget: '50-200',
      equipment: 'Basic watercolor set, brushes, paper',
      constraints: '',
      status: 'ready', // In real app, this would start as 'processing' then become 'ready'
      plan: {
        milestones: [
          {
            id: 'milestone-1',
            description: 'Master Basic Techniques & Color Theory',
            targetDate: '2025-12-15',
            icon: '🎨',
            status: 'pending',
            objectives: [
              {
                id: 'obj-1-1',
                description: 'Learn fundamental watercolor techniques',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-1-1-1',
                    description: 'Practice wet-on-wet technique for 30 minutes daily',
                    status: 'pending',
                  },
                  {
                    id: 'task-1-1-2',
                    description: 'Complete 10 practice sheets on wet-on-dry technique',
                    status: 'pending',
                  },
                  {
                    id: 'task-1-1-3',
                    description: 'Master brush control with varying pressure exercises',
                    status: 'pending',
                  },
                ],
              },
              {
                id: 'obj-1-2',
                description: 'Understand color theory and mixing',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-1-2-1',
                    description: 'Create a color wheel with your watercolor set',
                    status: 'pending',
                  },
                  {
                    id: 'task-1-2-2',
                    description: 'Practice mixing skin tones (10 different variations)',
                    status: 'pending',
                  },
                  {
                    id: 'task-1-2-3',
                    description: 'Complete color temperature exercises',
                    status: 'pending',
                  },
                ],
              },
            ],
          },
          {
            id: 'milestone-2',
            description: 'Practice Portrait Fundamentals',
            targetDate: '2026-01-31',
            icon: '👤',
            status: 'pending',
            objectives: [
              {
                id: 'obj-2-1',
                description: 'Study facial proportions and anatomy',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-2-1-1',
                    description: 'Sketch 20 faces to understand proportions',
                    status: 'pending',
                  },
                  {
                    id: 'task-2-1-2',
                    description: 'Practice drawing eyes, nose, and mouth separately',
                    status: 'pending',
                  },
                  {
                    id: 'task-2-1-3',
                    description: 'Complete 5 full face sketches with correct proportions',
                    status: 'pending',
                  },
                ],
              },
              {
                id: 'obj-2-2',
                description: 'Complete simple portrait studies',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-2-2-1',
                    description: 'Paint 5 grayscale portrait studies from photos',
                    status: 'pending',
                  },
                  {
                    id: 'task-2-2-2',
                    description: 'Complete 3 limited color palette portraits',
                    status: 'pending',
                  },
                ],
              },
            ],
          },
          {
            id: 'milestone-3',
            description: 'Develop Your Portrait Style',
            targetDate: '2026-04-15',
            icon: '✨',
            status: 'pending',
            objectives: [
              {
                id: 'obj-3-1',
                description: 'Experiment with different portrait styles',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-3-1-1',
                    description: 'Try realistic, impressionistic, and loose styles (3 portraits each)',
                    status: 'pending',
                  },
                  {
                    id: 'task-3-1-2',
                    description: 'Study 5 watercolor portrait artists for inspiration',
                    status: 'pending',
                  },
                ],
              },
              {
                id: 'obj-3-2',
                description: 'Complete 10 full portraits',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-3-2-1',
                    description: 'Paint portraits of family and friends',
                    status: 'pending',
                  },
                  {
                    id: 'task-3-2-2',
                    description: 'Request feedback from online watercolor communities',
                    status: 'pending',
                  },
                ],
              },
            ],
          },
          {
            id: 'milestone-4',
            description: 'Create Your Portfolio Collection',
            targetDate: '2026-06-01',
            icon: '🏆',
            status: 'pending',
            objectives: [
              {
                id: 'obj-4-1',
                description: 'Create 20 finished portrait pieces',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-4-1-1',
                    description: 'Complete final 10 polished portraits',
                    status: 'pending',
                  },
                  {
                    id: 'task-4-1-2',
                    description: 'Select best 20 portraits for portfolio',
                    status: 'pending',
                  },
                  {
                    id: 'task-4-1-3',
                    description: 'Frame or mount selected pieces for display',
                    status: 'pending',
                  },
                ],
              },
              {
                id: 'obj-4-2',
                description: 'Showcase your work',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-4-2-1',
                    description: 'Create an online portfolio or Instagram gallery',
                    status: 'pending',
                  },
                  {
                    id: 'task-4-2-2',
                    description: 'Share your progress journey on social media',
                    status: 'pending',
                  },
                ],
              },
            ],
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockGoal,
    })
  } catch (error) {
    console.error('Error fetching goal plan:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch goal plan',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}
