import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserTasks } from '@/lib/firebase/tasks'
import { adminDb } from '@/lib/firebase/admin'

/**
 * GET /api/debug/tasks
 * Debug endpoint to check task storage
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: 'Not authenticated',
          hint: 'Sign in first',
        },
        { status: 401 }
      )
    }

    const userId = session.user.email
    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('goalId')

    // Get all tasks for user
    const filters = goalId ? { goalId } : {}
    const tasks = await getUserTasks(userId, filters)

    // Get raw Firestore data for debugging
    let firestoreData: any = null
    if (adminDb) {
      const snapshot = await adminDb
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .limit(10)
        .get()

      firestoreData = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
    }

    return NextResponse.json({
      success: true,
      userId,
      goalIdFilter: goalId || null,
      tasksFromQuery: tasks,
      tasksCount: tasks.length,
      rawFirestoreData: firestoreData,
      firestorePath: `/users/${userId}/tasks/`,
      timestamp: new Date().toISOString(),
      debug: {
        adminDbInitialized: !!adminDb,
        sessionValid: !!session,
        userEmail: session.user.email,
      },
    })
  } catch (error) {
    console.error('[DEBUG] Error fetching tasks:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
