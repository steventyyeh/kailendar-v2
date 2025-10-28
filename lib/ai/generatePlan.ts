import Anthropic from '@anthropic-ai/sdk'
import { CreateGoalRequest, GoalPlan, Milestone, Objective } from '@/types'

/**
 * Generate a goal plan using Claude API
 * This can be called directly from server-side code without HTTP requests
 */
export async function generatePlanWithClaude(
  request: CreateGoalRequest
): Promise<{ plan: GoalPlan; resources: any[] }> {
  // Check if Anthropic API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not configured, returning minimal plan')
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const {
    specificity,
    category,
    currentState,
    targetState,
    deadline,
    learningStyles,
    budget,
    equipment,
    constraints,
  } = request

  // Build context for Claude
  const userContext = `
Goal: ${specificity}
Category: ${category}
Current Experience Level: ${currentState}
Target State: ${targetState}
Deadline: ${new Date(deadline).toLocaleDateString()}
Learning Preferences: ${learningStyles?.join(', ') || 'Not specified'}
Budget: ${budget || 'Not specified'}
Equipment Available: ${equipment || 'Not specified'}
Constraints: ${constraints || 'None specified'}
  `.trim()

  const systemPrompt = `You are an expert productivity coach and goal planning assistant. Your role is to help users achieve their goals by creating detailed, actionable plans.

Given a user's goal and context, generate a structured plan with:
1. A motivational summary (2-3 sentences)
2. 3-5 milestones that break down the goal into major phases
3. For each milestone: specific objectives with tasks
4. Realistic timelines based on the user's deadline
5. 2-3 actionable insights/recommendations
6. 3-5 recommended resources (books, courses, tools, websites)

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Motivational text here",
  "milestones": [
    {
      "title": "Milestone title",
      "description": "What this milestone achieves",
      "objectives": [
        {
          "description": "Specific objective",
          "estimatedHours": 5,
          "tasks": [
            "Specific task 1",
            "Specific task 2"
          ]
        }
      ]
    }
  ],
  "insights": [
    "Actionable insight 1",
    "Actionable insight 2"
  ],
  "resources": [
    {
      "title": "Resource name",
      "type": "book|course|tool|website|video",
      "description": "Why this resource is helpful",
      "url": "https://example.com (if available, otherwise null)",
      "cost": "Free|$X|Subscription"
    }
  ]
}

Make the plan realistic, specific, and tailored to the user's experience level and constraints. Include only high-quality, well-known resources that are actually helpful for this goal.`

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${userContext}\n\nPlease generate a comprehensive goal plan.`,
      },
    ],
    system: systemPrompt,
  })

  // Extract and parse the response
  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  // Try to extract JSON from the response
  let planData
  try {
    // Sometimes Claude wraps JSON in markdown code blocks
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || responseText.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText
    planData = JSON.parse(jsonText)
  } catch (parseError) {
    console.error('Failed to parse Claude response:', responseText)
    throw new Error('Failed to parse AI response')
  }

  // Transform the AI response into our GoalPlan format
  const goalPlan: GoalPlan = transformAIPlanToGoalPlan(planData, new Date(deadline))

  // Transform resources from AI response
  const resources = transformAIResources(planData.resources || [])

  return { plan: goalPlan, resources }
}

/**
 * Transform AI-generated plan into GoalPlan format
 */
function transformAIPlanToGoalPlan(aiPlan: any, deadline: Date): GoalPlan {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const totalDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const milestones: Milestone[] = aiPlan.milestones?.map((m: any, index: number) => {
    // Distribute milestones evenly across the timeline
    const daysPerMilestone = Math.floor(totalDays / aiPlan.milestones.length)
    const milestoneDate = new Date(now.getTime() + (daysPerMilestone * (index + 1) * 24 * 60 * 60 * 1000))

    const objectives: Objective[] = m.objectives?.map((obj: any, objIndex: number) => ({
      id: `obj-${index}-${objIndex}`,
      milestoneId: `milestone-${index}`,
      description: obj.description || '',
      estimatedHours: obj.estimatedHours || 5,
      status: 'pending' as const,
      tasks: obj.tasks?.map((task: string, taskIndex: number) => ({
        id: `task-${index}-${objIndex}-${taskIndex}`,
        description: task,
        status: 'pending' as const,
      })) || [],
    })) || []

    return {
      id: `milestone-${index}`,
      title: m.title || `Milestone ${index + 1}`,
      description: m.description || '',
      targetDate: milestoneDate,
      status: 'pending' as const,
      objectives,
    }
  }) || []

  const allObjectives: Objective[] = milestones.flatMap(m => m.objectives)

  return {
    generatedAt: new Date(),
    llmModel: 'claude-3-5-sonnet-20240620',
    milestones,
    objectives: allObjectives,
    taskTemplate: {
      summary: aiPlan.summary || 'Your personalized goal plan is ready!',
      insights: aiPlan.insights || [],
      recommendedSchedule: {
        frequency: 'weekly',
        duration: 30,
        suggestedDays: ['Monday', 'Wednesday', 'Friday'],
      },
    },
  }
}

/**
 * Transform AI-generated resources into Resource format
 */
function transformAIResources(aiResources: any[]): any[] {
  return aiResources.map((resource: any, index: number) => ({
    id: `ai-resource-${index}`,
    title: resource.title || 'Untitled Resource',
    type: resource.type || 'website',
    description: resource.description || '',
    url: resource.url || null,
    metadata: {
      cost: resource.cost || 'Unknown',
      difficulty: 'beginner',
      format: resource.type || 'online',
    },
    addedAt: new Date(),
  }))
}
