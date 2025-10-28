import { adminDb } from './admin'

export interface Task {
  id?: string
  goalId: string
  title: string
  description?: string
  dueDate?: string // ISO string
  completed: boolean
  createdAt: string
  updatedAt?: string
  calendarEventId?: string // Google Calendar event ID
  milestoneId?: string // Reference to parent milestone
}

/**
 * Create a new task for a user
 */
export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const taskDoc = {
    ...taskData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const docRef = await adminDb.collection('users').doc(userId).collection('tasks').add(taskDoc)

  return {
    id: docRef.id,
    ...taskDoc,
  }
}

/**
 * Create multiple tasks in a batch
 */
export const createTasksBatch = async (userId: string, tasks: Omit<Task, 'id' | 'createdAt'>[]): Promise<Task[]> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const batch = adminDb.batch()
  const tasksCollection = adminDb.collection('users').doc(userId).collection('tasks')
  const createdTasks: Task[] = []

  for (const taskData of tasks) {
    const docRef = tasksCollection.doc()
    const taskDoc = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    batch.set(docRef, taskDoc)
    createdTasks.push({
      id: docRef.id,
      ...taskDoc,
    })
  }

  await batch.commit()
  return createdTasks
}

/**
 * Get all tasks for a user
 */
export const getUserTasks = async (userId: string, filters?: {
  goalId?: string
  completed?: boolean
  dueAfter?: string
  dueBefore?: string
}): Promise<Task[]> => {
  if (!adminDb) {
    return []
  }

  let query = adminDb.collection('users').doc(userId).collection('tasks') as any

  // Apply filters
  if (filters?.goalId) {
    query = query.where('goalId', '==', filters.goalId)
  }
  if (filters?.completed !== undefined) {
    query = query.where('completed', '==', filters.completed)
  }
  if (filters?.dueAfter) {
    query = query.where('dueDate', '>=', filters.dueAfter)
  }
  if (filters?.dueBefore) {
    query = query.where('dueDate', '<=', filters.dueBefore)
  }

  const snapshot = await query.orderBy('dueDate', 'asc').get()

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[]
}

/**
 * Get tasks due today
 */
export const getTodaysTasks = async (userId: string): Promise<Task[]> => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return getUserTasks(userId, {
    completed: false,
    dueAfter: today.toISOString(),
    dueBefore: tomorrow.toISOString(),
  })
}

/**
 * Get a single task by ID
 */
export const getTask = async (userId: string, taskId: string): Promise<Task | null> => {
  if (!adminDb) {
    return null
  }

  const doc = await adminDb
    .collection('users')
    .doc(userId)
    .collection('tasks')
    .doc(taskId)
    .get()

  if (!doc.exists) {
    return null
  }

  return {
    id: doc.id,
    ...doc.data(),
  } as Task
}

/**
 * Update a task
 */
export const updateTask = async (
  userId: string,
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<Task> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const taskRef = adminDb.collection('users').doc(userId).collection('tasks').doc(taskId)

  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await taskRef.update(updateData)

  const updatedDoc = await taskRef.get()

  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  } as Task
}

/**
 * Delete a task
 */
export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  await adminDb.collection('users').doc(userId).collection('tasks').doc(taskId).delete()
}

/**
 * Delete all tasks for a goal
 */
export const deleteTasksByGoal = async (userId: string, goalId: string): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const tasksSnapshot = await adminDb
    .collection('users')
    .doc(userId)
    .collection('tasks')
    .where('goalId', '==', goalId)
    .get()

  const batch = adminDb.batch()
  tasksSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
}

/**
 * Mark task as completed
 */
export const completeTask = async (userId: string, taskId: string): Promise<Task> => {
  return updateTask(userId, taskId, { completed: true })
}

/**
 * Mark task as incomplete
 */
export const uncompleteTask = async (userId: string, taskId: string): Promise<Task> => {
  return updateTask(userId, taskId, { completed: false })
}
