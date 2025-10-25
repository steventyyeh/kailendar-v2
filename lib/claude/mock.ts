// Mock Claude API for MVP development
// Replace with real Anthropic Claude API integration later

import { GoalPlan, CreateGoalRequest, Resource } from '@/types'

export async function generateGoalPlan(
  request: CreateGoalRequest
): Promise<{ plan: GoalPlan; resources: Resource[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Generate mock plan based on goal category
  const plan: GoalPlan = {
    generatedAt: new Date(),
    llmModel: 'mock-claude-3.5-sonnet',
    milestones: generateMockMilestones(request),
    objectives: generateMockObjectives(request),
    taskTemplate: generateMockTaskTemplate(request),
  }

  const resources = generateMockResources(request)

  return { plan, resources }
}

function generateMockMilestones(request: CreateGoalRequest) {
  const deadline = new Date(request.deadline)
  const startDate = new Date()
  const totalDays = Math.floor(
    (deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const milestones = []
  const numMilestones = 4

  for (let i = 0; i < numMilestones; i++) {
    const daysToMilestone = Math.floor((totalDays / numMilestones) * (i + 1))
    const targetDate = new Date(startDate.getTime() + daysToMilestone * 24 * 60 * 60 * 1000)

    milestones.push({
      id: `m${i + 1}`,
      title: getMilestoneTitle(request.category, i),
      description: `Complete ${getMilestoneTitle(request.category, i).toLowerCase()} by ${targetDate.toLocaleDateString()}`,
      targetDate,
      status: 'pending' as const,
    })
  }

  return milestones
}

function generateMockObjectives(request: CreateGoalRequest) {
  const objectives: any[] = []
  const milestones = generateMockMilestones(request)

  milestones.forEach((milestone, mIndex) => {
    const numObjectives = 3
    for (let i = 0; i < numObjectives; i++) {
      const targetDate = new Date(
        milestone.targetDate.getTime() - (numObjectives - i) * 7 * 24 * 60 * 60 * 1000
      )

      objectives.push({
        id: `o${mIndex + 1}_${i + 1}`,
        milestoneId: milestone.id,
        title: `${getObjectiveTitle(request.category, i)}`,
        description: `Work towards ${getObjectiveTitle(request.category, i).toLowerCase()}`,
        targetDate,
        status: 'pending' as const,
        estimatedHours: 10 + i * 5,
      })
    }
  })

  return objectives
}

function generateMockTaskTemplate(request: CreateGoalRequest) {
  return {
    recurringTasks: [
      {
        title: 'Daily Practice Session',
        description: `Practice fundamental skills related to ${request.specificity}`,
        duration: 60,
        frequency: 'daily' as const,
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        preferredTime: 'morning' as const,
        skillFocus: 'fundamentals',
      },
      {
        title: 'Review and Reflection',
        description: 'Review progress and adjust approach as needed',
        duration: 30,
        frequency: 'weekly' as const,
        daysOfWeek: [0], // Sunday
        preferredTime: 'evening' as const,
        skillFocus: 'reflection',
      },
    ],
    oneTimeTasks: [
      {
        title: 'Research Resources',
        description: 'Find and organize learning materials',
        duration: 120,
        schedulingPriority: 9,
      },
      {
        title: 'Create Practice Schedule',
        description: 'Develop a structured practice routine',
        duration: 60,
        schedulingPriority: 8,
      },
      {
        title: 'Set Up Workspace',
        description: 'Organize physical or digital workspace',
        duration: 90,
        schedulingPriority: 7,
      },
    ],
  }
}

function generateMockResources(request: CreateGoalRequest): Resource[] {
  return [
    {
      id: 'r1',
      type: 'course',
      title: `Beginner's Guide to ${request.specificity}`,
      url: 'https://example.com/course',
      description: 'Comprehensive online course covering fundamentals',
      addedBy: 'system',
      cost: 'free',
    },
    {
      id: 'r2',
      type: 'book',
      title: `Mastering ${request.specificity}`,
      description: 'Essential reading for skill development',
      addedBy: 'system',
      cost: '$29',
    },
    {
      id: 'r3',
      type: 'community',
      title: `${request.category} Community Forum`,
      url: 'https://example.com/community',
      description: 'Connect with others on similar journeys',
      addedBy: 'system',
      cost: 'free',
    },
  ]
}

function getMilestoneTitle(category: string, index: number): string {
  const titles = {
    creative_skills: [
      'Master Basic Techniques',
      'Develop Personal Style',
      'Create Portfolio Pieces',
      'Achieve Professional Quality',
    ],
    professional_dev: [
      'Build Foundation Skills',
      'Gain Practical Experience',
      'Demonstrate Competency',
      'Achieve Career Goals',
    ],
    health_fitness: [
      'Establish Routine',
      'Build Endurance',
      'Reach Intermediate Level',
      'Achieve Target Goals',
    ],
    learning: [
      'Cover Fundamentals',
      'Apply Knowledge',
      'Deepen Understanding',
      'Master Subject',
    ],
    personal_projects: [
      'Complete Planning',
      'Build Core Components',
      'Refine and Iterate',
      'Launch and Share',
    ],
    lifestyle_habits: [
      'Form Basic Habits',
      'Strengthen Consistency',
      'Overcome Challenges',
      'Make It Lifestyle',
    ],
  }

  return titles[category as keyof typeof titles]?.[index] || `Milestone ${index + 1}`
}

function getObjectiveTitle(category: string, index: number): string {
  const titles = [
    'Learn Core Concepts',
    'Practice Fundamentals',
    'Build Real Projects',
    'Refine Skills',
    'Get Feedback',
    'Iterate and Improve',
  ]

  return titles[index] || `Objective ${index + 1}`
}
