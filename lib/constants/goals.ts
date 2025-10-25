// Goal Categories
export const GOAL_CATEGORIES = [
  {
    id: 'creative_skills',
    name: 'Creative Skills',
    description: 'Art, music, writing, design, and creative pursuits',
    icon: '🎨',
    examples: ['Learn watercolor painting', 'Master guitar', 'Write a novel'],
  },
  {
    id: 'professional_dev',
    name: 'Professional Development',
    description: 'Career growth, new skills, certifications',
    icon: '💼',
    examples: ['Get promoted', 'Learn data science', 'Start a side business'],
  },
  {
    id: 'health_fitness',
    name: 'Health & Fitness',
    description: 'Physical health, exercise, nutrition',
    icon: '💪',
    examples: ['Run a marathon', 'Lose 20 pounds', 'Build muscle'],
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Education, languages, knowledge acquisition',
    icon: '📚',
    examples: ['Learn Spanish', 'Study philosophy', 'Master calculus'],
  },
  {
    id: 'personal_projects',
    name: 'Personal Projects',
    description: 'Build something, create, DIY projects',
    icon: '🔨',
    examples: ['Build a website', 'Renovate kitchen', 'Launch a podcast'],
  },
  {
    id: 'lifestyle_habits',
    name: 'Lifestyle & Habits',
    description: 'Daily routines, mindfulness, life organization',
    icon: '🌱',
    examples: ['Meditate daily', 'Wake up at 5am', 'Read 50 books'],
  },
] as const

export type GoalCategoryId = typeof GOAL_CATEGORIES[number]['id']

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: 'no_experience', label: 'No Experience', description: 'Complete beginner' },
  { value: 'beginner', label: 'Beginner', description: 'Some basic knowledge' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate experience' },
  { value: 'advanced', label: 'Advanced', description: 'Significant expertise' },
] as const

// Learning Styles
export const LEARNING_STYLES = [
  { value: 'hands_on_practice', label: 'Hands-on Practice', icon: '🛠️' },
  { value: 'video_tutorials', label: 'Video Tutorials', icon: '🎥' },
  { value: 'reading_books', label: 'Reading Books', icon: '📖' },
  { value: 'online_courses', label: 'Online Courses', icon: '💻' },
  { value: 'in_person_classes', label: 'In-Person Classes', icon: '👥' },
  { value: 'self_guided', label: 'Self-Guided Learning', icon: '🧭' },
] as const

// Budget Options
export const BUDGET_OPTIONS = [
  { value: '0', label: '$0 (Free resources only)' },
  { value: '1-50', label: '$1-50/month' },
  { value: '50-200', label: '$50-200/month' },
  { value: '200-500', label: '$200-500/month' },
  { value: '500+', label: '$500+/month' },
  { value: 'flexible', label: 'Flexible budget' },
] as const

// Questionnaire Questions
export const QUESTIONNAIRE_STEPS = [
  {
    id: 'specificity',
    title: 'What exactly do you want to achieve?',
    subtitle: 'Be as specific as possible',
    type: 'text',
    placeholder: 'e.g., Learn watercolor portrait painting',
    validation: { min: 10, max: 500 },
    required: true,
  },
  {
    id: 'currentState',
    title: "What's your current experience level?",
    subtitle: 'This helps us calibrate the starting point',
    type: 'select',
    options: EXPERIENCE_LEVELS,
    required: true,
  },
  {
    id: 'targetState',
    title: 'What does success look like?',
    subtitle: 'Describe your ideal outcome in detail',
    type: 'textarea',
    placeholder: 'e.g., Complete 20 finished watercolor portraits that I\'m proud to display',
    validation: { min: 10, max: 500 },
    required: true,
  },
  {
    id: 'deadline',
    title: 'When do you want to achieve this by?',
    subtitle: 'Set a realistic deadline',
    type: 'date',
    required: true,
  },
  {
    id: 'learningStyles',
    title: 'How do you prefer to learn?',
    subtitle: 'Select all that apply (minimum 1)',
    type: 'checkbox',
    options: LEARNING_STYLES,
    validation: { min: 1, max: 6 },
    required: true,
  },
  {
    id: 'budget',
    title: 'What budget can you allocate?',
    subtitle: 'Per month',
    type: 'select',
    options: BUDGET_OPTIONS,
    required: true,
  },
  {
    id: 'equipment',
    title: 'What equipment or tools do you already have?',
    subtitle: 'This helps us recommend what you need',
    type: 'textarea',
    placeholder: 'e.g., Basic watercolor set, brushes, paper',
    validation: { max: 1000 },
    required: false,
  },
  {
    id: 'constraints',
    title: 'Any limitations we should know about?',
    subtitle: 'Time, physical, or other constraints',
    type: 'textarea',
    placeholder: 'e.g., Can only work on weekends, have a shoulder injury',
    validation: { max: 1000 },
    required: false,
  },
] as const
