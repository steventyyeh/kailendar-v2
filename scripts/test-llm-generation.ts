/**
 * Test script to verify LLM task generation
 * Run with: npx tsx scripts/test-llm-generation.ts
 */

import { generatePlanWithClaude } from '../lib/ai/generatePlan'
import { CreateGoalRequest } from '../types'

async function testLLMGeneration() {
  console.log('🧪 Testing LLM Task Generation\n')

  const testGoal: CreateGoalRequest = {
    category: 'learning',
    specificity: 'Learn conversational Spanish in 2 months',
    currentState: 'no_experience',
    targetState: 'Have basic conversations with native speakers',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    learningStyles: ['visual', 'interactive'],
    budget: '$50',
    equipment: 'Phone, laptop',
    constraints: 'Can only study 30 minutes per day on weekdays',
  }

  console.log('📝 Test Goal:', testGoal.specificity)
  console.log('⏰ Deadline:', new Date(testGoal.deadline).toLocaleDateString())
  console.log('\n⏳ Calling Claude API...\n')

  try {
    const { plan, tasks, resources } = await generatePlanWithClaude(testGoal)

    console.log('✅ LLM Generation Successful!\n')
    console.log('📊 Results:')
    console.log(`  - Plan Summary: ${plan.taskTemplate.summary?.substring(0, 100)}...`)
    console.log(`  - Milestones: ${plan.milestones.length}`)
    console.log(`  - Tasks Generated: ${tasks.length}`)
    console.log(`  - Resources: ${resources.length}`)

    if (tasks.length > 0) {
      console.log('\n📋 Sample Tasks:')
      tasks.slice(0, 3).forEach((task, i) => {
        console.log(`\n  Task ${i + 1}:`)
        console.log(`    Title: ${task.title}`)
        console.log(`    Description: ${task.description?.substring(0, 60)}...`)
        console.log(`    Due Date: ${task.dueDate}`)
        console.log(`    Goal ID: ${task.goalId || '(will be set)'}`)
      })
    }

    console.log('\n📍 Milestones:')
    plan.milestones.forEach((milestone, i) => {
      console.log(`  ${i + 1}. ${milestone.title}`)
      console.log(`     Target: ${new Date(milestone.targetDate).toLocaleDateString()}`)
      console.log(`     Objectives: ${milestone.objectives.length}`)
    })

    console.log('\n💡 Insights:')
    plan.taskTemplate.insights?.forEach((insight, i) => {
      console.log(`  ${i + 1}. ${insight}`)
    })

    console.log('\n📚 Resources:')
    resources.slice(0, 3).forEach((resource, i) => {
      console.log(`  ${i + 1}. ${resource.title} (${resource.type})`)
    })

    console.log('\n✅ Test Complete!')
    return { plan, tasks, resources }
  } catch (error) {
    console.error('❌ Test Failed:', error)
    throw error
  }
}

// Run the test
testLLMGeneration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })
