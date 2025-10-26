// Database helper functions
import { adminDb } from './admin'
import { Goal, User, ProgressLog } from '@/types'

// User operations
export const createUser = async (userData: Partial<User>): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }
  await adminDb.collection('users').doc(userData.uid!).set({
    ...userData,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  })
}

export const getUser = async (userId: string): Promise<User | null> => {
  if (!adminDb) {
    return null // Return null when Firebase is not configured
  }
  const doc = await adminDb.collection('users').doc(userId).get()
  return doc.exists ? (doc.data() as User) : null
}

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }
  await adminDb.collection('users').doc(userId).update({
    ...updates,
    lastLoginAt: new Date(),
  })
}

// Goal operations
export const createGoal = async (userId: string, goalData: Partial<Goal>): Promise<string> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }
  const goalRef = adminDb.collection('users').doc(userId).collection('goals').doc()

  await goalRef.set({
    ...goalData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return goalRef.id
}

export const getGoal = async (userId: string, goalId: string): Promise<Goal | null> => {
  if (!adminDb) {
    return null // Return null when Firebase is not configured
  }
  const doc = await adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .get()

  return doc.exists ? ({ id: doc.id, ...doc.data() } as Goal) : null
}

export const getUserGoals = async (userId: string, status?: string): Promise<Goal[]> => {
  if (!adminDb) {
    return [] // Return empty array when Firebase is not configured
  }
  let query = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')

  if (status) {
    query = query.where('status', '==', status) as any
  }

  const snapshot = await query.get()
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Goal))
}

export const updateGoal = async (
  userId: string,
  goalId: string,
  updates: Partial<Goal>
): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }
  await adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .update({
      ...updates,
      updatedAt: new Date(),
    })
}

// Progress log operations
export const createProgressLog = async (
  userId: string,
  goalId: string,
  logData: Partial<ProgressLog>
): Promise<string> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }
  const logRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('progressLogs')
    .doc()

  await logRef.set({
    ...logData,
    goalId,
    createdAt: new Date(),
  })

  return logRef.id
}

export const getProgressLogs = async (
  userId: string,
  goalId: string,
  limit: number = 30
): Promise<ProgressLog[]> => {
  if (!adminDb) {
    return [] // Return empty array when Firebase is not configured
  }
  const snapshot = await adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('progressLogs')
    .orderBy('date', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as ProgressLog))
}
