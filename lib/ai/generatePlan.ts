import Anthropic from '@anthropic-ai/sdk'
import { CreateGoalRequest, GoalPlan, Milestone, Objective } from '@/types'
import { Task } from '@/lib/firebase/tasks'

/**
 * Enhanced response interface that includes both plan and tasks
 */
interface ClaudeTaskGenerationResponse {
  plan: GoalPlan
  tasks: Omit<Task, 'id' | 'createdAt'>[]
  resources: any[]
}

/**
 * Generate a goal plan using Claude API with structured task generation
 * This can be called directly from server-side code without HTTP requests
 */
export async function generatePlanWithClaude(
  request: CreateGoalRequest,
  userSettings?: { availableHours?: { start: string; end: string }; timezone?: string }
): Promise<ClaudeTaskGenerationResponse> {
  // Check if Anthropic API key is configured
  console.log('[LLM] Checking for ANTHROPIC_API_KEY...')
  console.log('[LLM] API Key exists:', !!process.env.ANTHROPIC_API_KEY)
  console.log('[LLM] API Key length:', process.env.ANTHROPIC_API_KEY?.length || 0)

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[LLM] ❌ ANTHROPIC_API_KEY not configured!')
    console.error('[LLM] Environment variables available:', Object.keys(process.env).filter(k => k.includes('ANTHROPIC') || k.includes('API')))
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  console.log('[LLM] ✅ API Key confirmed, initializing Claude API for goal:', request.specificity)

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

  const deadlineDate = new Date(deadline)
  const now = new Date()
  const totalDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Get user timezone (fallback to UTC if not set)
  const userTimezone = userSettings?.timezone || 'UTC'

  // Build context for Claude
  const availabilityText = userSettings?.availableHours
    ? `User is only available between ${userSettings.availableHours.start} and ${userSettings.availableHours.end} each day.`
    : 'No specific time constraints - can schedule throughout the day.'

  const userContext = `
Goal: ${specificity}
Category: ${category}
Current Experience Level: ${currentState}
Target State: ${targetState}
Start Date: ${now.toLocaleDateString()}
Deadline: ${deadlineDate.toLocaleDateString()}
Duration: ${totalDays} days
Learning Preferences: ${learningStyles?.join(', ') || 'Not specified'}
Budget: ${budget || 'Not specified'}
Equipment Available: ${equipment || 'Not specified'}
Constraints: ${constraints || 'None specified'}
Availability: ${availabilityText}
User Timezone: ${userTimezone}
  `.trim()

  const systemPrompt = `You are an expert life planning assistant that helps users achieve their goals through actionable daily steps and realistic calendar scheduling.

Your task is to generate a comprehensive, structured plan that includes:
1. A motivational plan summary (2-3 sentences)
2. A list of specific, scheduled tasks distributed across the goal duration
3. 3-5 milestones that break down the goal into major phases
4. 2-3 actionable insights
5. 4-8 high-quality, publicly accessible learning resources (videos, courses, articles, tools, books, communities)

CRITICAL: Generate realistic calendar tasks with specific dates and times. Each task should:
- Have a clear title and description
- Include realistic start and end times based on the goal's timeline
- Be properly prioritized (high/medium/low)
- Be scheduled throughout the goal duration (not all on the same day)
- Take into account the user's experience level and constraints
- Optionally include relevant resources (videos, articles, tools) that will help with that specific task
- IMPORTANT: Schedule all tasks ONLY within the user's available hours if specified in the context. For example, if user is available 18:00-22:00, all task times must fall within that window.
- CRITICAL TIMEZONE REQUIREMENT: Generate all timestamps in ISO 8601 format WITH the user's timezone offset. For example, if the user is in America/Los_Angeles (UTC-8 in winter), use "2025-10-28T07:00:00-08:00" NOT "2025-10-28T07:00:00Z". The timezone offset ensures "7 AM" means 7 AM local time, not UTC.

CRITICAL JSON FORMAT REQUIREMENTS:
- Output ONLY valid JSON with NO trailing commas
- Do NOT add comments in the JSON
- Ensure all arrays and objects are properly closed
- Use double quotes for all strings
- Make sure the JSON is syntactically perfect and can be parsed by JSON.parse()

Output ONLY valid JSON in this EXACT format:
{
  "planSummary": "A motivational 2-3 sentence summary of the plan",
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description of what to do",
      "startDateTime": "ISO8601 datetime string",
      "endDateTime": "ISO8601 datetime string",
      "priority": "high|medium|low",
      "milestoneId": "milestone-1"
    }
  ],
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
      "url": "https://example.com or null",
      "cost": "Free|$X|Subscription"
    }
  ]
}

EXAMPLE for "Run a half marathon in 3 months" (user in America/Los_Angeles timezone):
{
  "planSummary": "A 12-week progressive running plan that builds your stamina and speed through consistent training, cross-training, and rest days. You'll gradually increase your mileage from 3 miles to 13.1 miles.",
  "tasks": [
    {
      "title": "Week 1: Easy run - 3 miles",
      "description": "Start with a comfortable pace. Focus on form and breathing. Walk if needed.",
      "startDateTime": "2025-10-28T07:00:00-07:00",
      "endDateTime": "2025-10-28T07:45:00-07:00",
      "priority": "high",
      "milestoneId": "milestone-1",
      "resources": [
        {"title": "Proper Running Form Video", "url": "https://youtube.com/watch?v=example"}
      ]
    },
    {
      "title": "Week 1: Cross training - Cycling",
      "description": "30 minutes of low-impact cardio to build aerobic base without stressing joints",
      "startDateTime": "2025-10-29T18:00:00-07:00",
      "endDateTime": "2025-10-29T18:30:00-07:00",
      "priority": "medium",
      "milestoneId": "milestone-1",
      "resources": []
    }
  ],
  "milestones": [...],
  "insights": [
    "Start slow and focus on consistency over speed",
    "Cross-training prevents injury and builds overall fitness",
    "Rest days are when your body adapts and gets stronger"
  ],
  "resources": [
    {
      "title": "Couch to 5K to Half Marathon Training Plan",
      "type": "website",
      "description": "Comprehensive guide with weekly training schedules specifically for beginners",
      "url": "https://www.halhigdon.com/training-programs/half-marathon-training/novice-1-half-marathon/",
      "cost": "Free"
    },
    {
      "title": "Nike Run Club App",
      "type": "tool",
      "description": "Free app with guided runs, tracking, and community support",
      "url": "https://www.nike.com/nrc-app",
      "cost": "Free"
    },
    {
      "title": "Running Form Basics by The Run Experience",
      "type": "video",
      "description": "Learn proper running technique to prevent injury and improve efficiency",
      "url": "https://www.youtube.com/watch?v=brFHyOtTvjI",
      "cost": "Free"
    },
    {
      "title": "r/running Community",
      "type": "community",
      "description": "Active Reddit community with training advice, motivation, and race reports",
      "url": "https://www.reddit.com/r/running/",
      "cost": "Free"
    },
    {
      "title": "Born to Run by Christopher McDougall",
      "type": "book",
      "description": "Inspiring book about running culture and the science of endurance",
      "url": null,
      "cost": "$15"
    }
  ]
}

NOTE: The timezone offset (-07:00 for Pacific Time in winter) ensures these times are correct in the user's local timezone.

IMPORTANT RESOURCE GUIDELINES:
- Provide 4-8 diverse, high-quality resources that directly support achieving this specific goal
- Include a mix of resource types: videos (YouTube, educational platforms), courses (Coursera, Udemy, free platforms), articles (Medium, official blogs), tools (apps, software), books (with ISBNs if possible), and communities (Reddit, Discord, forums)
- For videos: Include actual YouTube channel names or specific video topics (e.g., "FreeCodeCamp Python Tutorial" or "Nike Training Club App Tutorials")
- For courses: Mention real platforms like Coursera, edX, Udemy, Khan Academy, or free alternatives
- For articles: Reference well-known sites like Medium, Dev.to, official documentation sites
- For tools: Include specific app names, websites, or software (e.g., "Strava for runners", "Notion for planning")
- For books: Include classic or popular titles in the field (e.g., "The Pragmatic Programmer" for coding)
- For communities: Suggest specific subreddits, Discord servers, or forums (e.g., "r/running", "Dev.to community")
- Ensure all resources are publicly accessible (free or freemium when possible)
- Provide realistic, helpful descriptions explaining WHY each resource is valuable for THIS goal
- Use "Free", "Freemium", "$X one-time", or "Subscription" for cost indicators

Make the plan realistic, specific, and tailored to the user's experience level and constraints.`

  console.log('[LLM] Sending request to Claude API...')

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: `${userContext}\n\nPlease generate a comprehensive goal plan with scheduled tasks.`,
      },
    ],
    system: systemPrompt,
  })

  // Extract and parse the response
  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  console.log('[LLM] Raw response received, length:', responseText.length)

  // Try to extract JSON from the response
  let planData
  try {
    // Sometimes Claude wraps JSON in markdown code blocks
    let jsonText = responseText.trim()

    // Remove markdown code blocks if present
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim()
    }

    // Find JSON object if text contains extra content
    const objectMatch = jsonText.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      jsonText = objectMatch[0]
    }

    console.log('[LLM] Attempting to parse JSON, length:', jsonText.length)

    // Clean up common JSON formatting issues that Claude might introduce
    // Remove trailing commas before closing brackets/braces
    jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1')

    // Try to parse the cleaned JSON
    planData = JSON.parse(jsonText)
    console.log('[LLM] Successfully parsed JSON response')
  } catch (parseError) {
    console.error('[LLM] Failed to parse Claude response:', parseError)
    console.error('[LLM] Response text preview (first 1000 chars):', responseText.substring(0, 1000))
    console.error('[LLM] Response text preview (last 1000 chars):', responseText.substring(Math.max(0, responseText.length - 1000)))

    // Log the specific location of the parse error if available
    const errorMessage = (parseError as Error).message
    const positionMatch = errorMessage.match(/position (\d+)/)
    if (positionMatch) {
      const position = parseInt(positionMatch[1])
      const start = Math.max(0, position - 200)
      const end = Math.min(responseText.length, position + 200)
      console.error('[LLM] Context around error position:', responseText.substring(start, end))
    }

    throw new Error('Failed to parse AI response: ' + errorMessage)
  }

  // Validate required fields
  if (!planData.planSummary || !planData.tasks || !planData.milestones) {
    console.error('[LLM] Missing required fields in response:', {
      hasSummary: !!planData.planSummary,
      hasTasks: !!planData.tasks,
      hasMilestones: !!planData.milestones,
    })
    throw new Error('AI response missing required fields (planSummary, tasks, or milestones)')
  }

  console.log('[LLM] Parsed plan data:', {
    summaryLength: planData.planSummary?.length,
    tasksCount: planData.tasks?.length,
    milestonesCount: planData.milestones?.length,
    resourcesCount: planData.resources?.length,
  })

  // Transform the AI response into our GoalPlan format
  const goalPlan: GoalPlan = transformAIPlanToGoalPlan(planData, new Date(deadline))

  // Transform tasks from AI response to Firestore task format
  const tasks = transformAITasks(planData.tasks || [], userTimezone)

  // Transform resources from AI response
  const resources = transformAIResources(planData.resources || [])

  console.log('[LLM] Transformation complete:', {
    planGenerated: true,
    tasksGenerated: tasks.length,
    resourcesGenerated: resources.length,
  })

  return { plan: goalPlan, tasks, resources }
}

/**
 * Transform AI-generated tasks into Firestore task format
 */
function transformAITasks(
  aiTasks: any[],
  userTimezone?: string
): Omit<Task, 'id' | 'createdAt'>[] {
  console.log('[LLM] Transforming', aiTasks.length, 'AI tasks to Firestore format')

  return aiTasks.map((aiTask: any, index: number) => {
    // Parse dates from AI response - preserve timezone information
    let dueDate: string
    let startDateTime: string | undefined
    let endDateTime: string | undefined

    try {
      // The AI should return ISO 8601 strings with timezone offsets
      // e.g., "2025-10-28T07:00:00-07:00"
      // We preserve these exactly as-is to maintain timezone information
      startDateTime = aiTask.startDateTime
      endDateTime = aiTask.endDateTime

      // For backwards compatibility, also set dueDate
      const startDate = new Date(aiTask.startDateTime)
      dueDate = aiTask.startDateTime // Preserve original timezone-aware string
    } catch (error) {
      console.warn(`[LLM] Invalid date format for task ${index}, using default`)
      // Default to current time + index hours to spread them out
      const fallbackDate = new Date(Date.now() + index * 60 * 60 * 1000)
      dueDate = fallbackDate.toISOString()
      startDateTime = dueDate
    }

    const task: Omit<Task, 'id' | 'createdAt'> = {
      goalId: '', // Will be set by the caller
      title: aiTask.title || `Task ${index + 1}`,
      description: aiTask.description || '',
      dueDate,
      startDateTime,
      endDateTime,
      completed: false,
      milestoneId: aiTask.milestoneId || undefined,
      resources: aiTask.resources || [], // Include resources from AI response
      timezone: userTimezone, // Store user's timezone for reference
    }

    return task
  })
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
    llmModel: 'claude-sonnet-4-5-20250929',
    milestones,
    objectives: allObjectives,
    taskTemplate: {
      summary: aiPlan.planSummary || aiPlan.summary || 'Your personalized goal plan is ready!',
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
