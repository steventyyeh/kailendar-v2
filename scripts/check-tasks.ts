/**
 * Debug script to check tasks for a goal
 * Usage: npx tsx scripts/check-tasks.ts [userId] [goalId]
 */

import { adminDb } from '../lib/firebase/admin'

async function checkTasks() {
  const userId = process.argv[2]
  const goalId = process.argv[3]

  if (!userId || !goalId) {
    console.error('Usage: npx tsx scripts/check-tasks.ts [userId] [goalId]')
    process.exit(1)
  }

  console.log(`Checking tasks for user: ${userId}, goal: ${goalId}`)
  console.log('='.repeat(60))

  try {
    // Check goal exists
    const goalDoc = await adminDb.collection('goals').doc(goalId).get()
    if (!goalDoc.exists) {
      console.error('❌ Goal not found')
      process.exit(1)
    }

    const goalData = goalDoc.data()
    console.log('\n📊 Goal Data:')
    console.log(`  Title: ${goalData?.specificity}`)
    console.log(`  Status: ${goalData?.status}`)
    console.log(`  Has Plan: ${!!goalData?.plan}`)
    console.log(`  Plan Summary: ${goalData?.plan?.taskTemplate?.summary?.substring(0, 100)}...`)
    console.log(`  Milestones: ${goalData?.plan?.milestones?.length || 0}`)

    // Check tasks
    const tasksSnapshot = await adminDb
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('goalId', '==', goalId)
      .get()

    console.log(`\n📋 Tasks Found: ${tasksSnapshot.size}`)

    if (tasksSnapshot.size === 0) {
      console.log('\n❌ No tasks found for this goal!')
      console.log('\nPossible issues:')
      console.log('  1. Goal was created before task generation was implemented')
      console.log('  2. Task creation failed during goal generation')
      console.log('  3. ANTHROPIC_API_KEY not configured')
      console.log('\nCheck server logs for errors during goal creation.')
    } else {
      console.log('\n✅ Tasks:')
      tasksSnapshot.forEach((doc: any, index: number) => {
        const task = doc.data()
        console.log(`\n  ${index + 1}. ${task.title}`)
        console.log(`     ID: ${doc.id}`)
        console.log(`     Due: ${task.dueDate}`)
        console.log(`     Completed: ${task.completed}`)
        console.log(`     Calendar Event: ${task.calendarEventId || 'Not synced'}`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit(0)
  }
}

checkTasks()
