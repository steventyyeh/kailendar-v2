// User Types
export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  createdAt: Date
  lastLoginAt: Date
  googleAccessToken?: string
  googleRefreshToken?: string
  tokenExpiresAt?: Date
  calendarId?: string
  subscription: Subscription
  settings: UserSettings
}

export interface Subscription {
  status: 'free' | 'active' | 'canceled' | 'past_due'
  plan: 'free' | 'pro_monthly' | 'pro_annual'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
}

export interface UserSettings {
  emailNotifications: boolean
  weekStartsOn: number // 0-6 (Sunday-Saturday)
  defaultReminderMinutes: number
}

// Goal Types
export type GoalCategory =
  | 'creative_skills'
  | 'professional_dev'
  | 'health_fitness'
  | 'learning'
  | 'personal_projects'
  | 'lifestyle_habits'

export type GoalStatus = 'processing' | 'ready' | 'active' | 'paused' | 'completed' | 'archived' | 'deleted'

export type ExperienceLevel = 'no_experience' | 'beginner' | 'intermediate' | 'advanced'

export interface Goal {
  id: string
  userId: string
  status: GoalStatus
  category: GoalCategory
  specificity: string
  currentState: ExperienceLevel
  targetState: string
  deadline: Date
  learningStyles: string[]
  budget: string
  equipment: string
  constraints: string
  plan?: GoalPlan
  calendar: CalendarInfo
  progress: ProgressStats
  resources: Resource[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  pausedAt?: Date
}

export interface GoalPlan {
  generatedAt: Date
  llmModel: string
  milestones: Milestone[]
  objectives: Objective[]
  taskTemplate: TaskTemplate
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: Date
  icon?: string
  status: 'pending' | 'in_progress' | 'completed'
  completedAt?: Date
  calendarEventId?: string
  objectives: Objective[]
}

export interface Objective {
  id: string
  milestoneId?: string
  title?: string
  description: string
  targetDate?: Date
  status: 'pending' | 'in_progress' | 'completed'
  completedAt?: Date
  calendarEventId?: string
  estimatedHours?: number
  tasks: Task[]
}

export interface Task {
  id: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  completedAt?: Date
}

export interface TaskTemplate {
  recurringTasks: RecurringTask[]
  oneTimeTasks: OneTimeTask[]
}

export interface RecurringTask {
  id?: string
  title: string
  description: string
  duration: number // minutes
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'flexible'
  skillFocus?: string
}

export interface OneTimeTask {
  id?: string
  title: string
  description: string
  duration: number // minutes
  linkedObjectiveId?: string
  schedulingPriority: number // 1-10
  targetDate?: Date
}

export interface CalendarInfo {
  color: string
  lastScheduledMonth?: string
  nextScheduleDate?: Date
  eventIds: string[]
}

export interface ProgressStats {
  totalTasksScheduled: number
  tasksCompleted: number
  completionRate: number
  lastCompletedTask?: Date
  currentStreak: number
  longestStreak: number
  totalMinutesInvested: number
}

export interface Resource {
  id: string
  type: 'course' | 'book' | 'video' | 'tool' | 'community' | 'workshop' | 'mentor'
  title: string
  url?: string
  description: string
  unlockedAt?: Date
  linkedMilestoneId?: string
  addedBy: 'system' | 'user'
  cost?: string
}

export interface ProgressLog {
  id: string
  goalId: string
  date: Date
  tasksScheduled: number
  tasksCompleted: number
  minutesInvested: number
  completedTasks: string[]
  createdAt: Date
}

// API Request/Response Types
export interface CreateGoalRequest {
  category: GoalCategory
  specificity: string
  currentState: ExperienceLevel
  targetState: string
  deadline: string // ISO 8601
  learningStyles: string[]
  budget: string
  equipment: string
  constraints: string
}

export interface CreateGoalResponse {
  goalId: string
  status: 'processing' | 'ready' | 'error'
  estimatedTime?: number
  progress?: number
  estimatedTimeRemaining?: number
  plan?: GoalPlan
  resources?: Resource[]
  estimatedWeeklyHours?: number
  difficultyAssessment?: string
}

export interface DashboardData {
  user: User
  activeGoals: Goal[]
  todaysTasks: DailyTask[]
  upcomingMilestones: Milestone[]
  recentResources: Resource[]
  stats: WeeklyStats
}

export interface DailyTask {
  id: string
  goalId: string
  goalTitle: string
  goalColor: string
  title: string
  duration: number
  scheduledTime?: Date
  completed: boolean
  calendarEventId?: string
}

export interface WeeklyStats {
  completionRate: number
  hoursInvested: number
  tasksCompleted: number
  currentStreak: number
}

// API Standard Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    timestamp: string
    requestId: string
  }
}
