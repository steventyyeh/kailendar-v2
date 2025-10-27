// Database helper functions
import { adminDb } from './admin'
import { Goal, User, ProgressLog } from '@/types'
import { Timestamp } from 'firebase-admin/firestore'

// Helper to convert Firestore Timestamps to Date objects
const convertTimestamps = (data: any): any => {
  if (!data) return data
  const converted = { ...data }
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate()
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertTimestamps(converted[key])
    }
  })
  return converted
}

// User operations
export const createUser = async (userData: Partial<User>): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const userDoc = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName || '',
    photoURL: userData.photoURL || '',
    subscription: {
      status: 'free',
      plan: 'free',
    },
    settings: {
      emailNotifications: true,
      weekStartsOn: 0,
      defaultReminderMinutes: 15,
    },
    createdAt: new Date(),
    lastLoginAt: new Date(),
  }

  await adminDb.collection('users').doc(userData.uid!).set(userDoc)
}

export const getUser = async (userId: string): Promise<User | null> => {
  if (!adminDb) {
    return null // Return null when Firebase is not configured
  }
  const doc = await adminDb.collection('users').doc(userId).get()
  if (!doc.exists) return null

  const data = convertTimestamps(doc.data())
  return { uid: doc.id, ...data } as User
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

export const getOrCreateUser = async (userData: Partial<User>): Promise<User> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const userId = userData.uid || userData.email!
  let user = await getUser(userId)

  if (!user) {
    await createUser({ ...userData, uid: userId })
    user = await getUser(userId)
  } else {
    // Update last login
    await updateUser(userId, { lastLoginAt: new Date() })
    user.lastLoginAt = new Date()
  }

  return user!
}

// Goal operations
export const createGoal = async (userId: string, goalData: Partial<Goal>): Promise<string> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  // Use goals collection at root level (not subcollection)
  const goalRef = adminDb.collection('goals').doc()

  const goalDoc = {
    ...goalData,
    id: goalRef.id,
    userId,
    status: goalData.status || 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await goalRef.set(goalDoc)
  return goalRef.id
}

export const getGoal = async (goalId: string): Promise<Goal | null> => {
  if (!adminDb) {
    return null
  }

  const doc = await adminDb.collection('goals').doc(goalId).get()
  if (!doc.exists) return null

  const data = convertTimestamps(doc.data())
  return { id: doc.id, ...data } as Goal
}

export const getUserGoals = async (userId: string, status?: string): Promise<Goal[]> => {
  if (!adminDb) {
    return []
  }

  let query: any = adminDb.collection('goals').where('userId', '==', userId)

  if (status) {
    query = query.where('status', '==', status)
  }

  query = query.orderBy('createdAt', 'desc')

  const snapshot = await query.get()
  return snapshot.docs.map((doc: any) => {
    const data = convertTimestamps(doc.data())
    return { id: doc.id, ...data } as Goal
  })
}

export const updateGoal = async (goalId: string, updates: Partial<Goal>): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  await adminDb.collection('goals').doc(goalId).update({
    ...updates,
    updatedAt: new Date(),
  })
}

export const deleteGoal = async (goalId: string): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  await adminDb.collection('goals').doc(goalId).delete()
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

  const logRef = adminDb.collection('progressLogs').doc()

  const logDoc = {
    ...logData,
    id: logRef.id,
    userId,
    goalId,
    createdAt: new Date(),
  }

  await logRef.set(logDoc)
  return logRef.id
}

export const getProgressLogs = async (
  goalId: string,
  limit: number = 30
): Promise<ProgressLog[]> => {
  if (!adminDb) {
    return []
  }

  const snapshot = await adminDb
    .collection('progressLogs')
    .where('goalId', '==', goalId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map((doc: any) => {
    const data = convertTimestamps(doc.data())
    return { id: doc.id, ...data } as ProgressLog
  })
}

// Resource operations
export const createResource = async (userId: string, resourceData: any): Promise<string> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  const resourceRef = adminDb.collection('resources').doc()

  const resourceDoc = {
    ...resourceData,
    id: resourceRef.id,
    userId,
    addedAt: new Date(),
  }

  await resourceRef.set(resourceDoc)
  return resourceRef.id
}

export const getResource = async (resourceId: string): Promise<any | null> => {
  if (!adminDb) {
    return null
  }

  const doc = await adminDb.collection('resources').doc(resourceId).get()
  if (!doc.exists) return null

  const data = convertTimestamps(doc.data())
  return { id: doc.id, ...data }
}

export const getUserResources = async (userId: string, goalId?: string): Promise<any[]> => {
  if (!adminDb) {
    return []
  }

  let query: any = adminDb.collection('resources').where('userId', '==', userId)

  if (goalId) {
    query = query.where('goalId', '==', goalId)
  }

  query = query.orderBy('addedAt', 'desc')

  const snapshot = await query.get()
  return snapshot.docs.map((doc: any) => {
    const data = convertTimestamps(doc.data())
    return { id: doc.id, ...data }
  })
}

export const updateResource = async (resourceId: string, updates: any): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  await adminDb.collection('resources').doc(resourceId).update({
    ...updates,
    updatedAt: new Date(),
  })
}

export const deleteResource = async (resourceId: string): Promise<void> => {
  if (!adminDb) {
    throw new Error('Firebase not configured')
  }

  await adminDb.collection('resources').doc(resourceId).delete()
}
