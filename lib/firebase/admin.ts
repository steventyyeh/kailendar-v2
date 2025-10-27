// Firebase Admin SDK for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (singleton pattern)
const apps = getApps()

let adminApp: any = null
let adminDb: any = null

// Check if Firebase credentials are available
const hasFirebaseConfig =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY

if (hasFirebaseConfig) {
  try {
    if (apps.length === 0) {
      // Initialize with individual environment variables
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
      })
    } else {
      adminApp = apps[0]
    }

    adminDb = getFirestore(adminApp)
    console.log('✅ Firebase Admin SDK initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error)
  }
} else {
  console.warn('⚠️  Firebase credentials not found. Firebase features will be disabled.')
}

// Export null if Firebase is not configured - functions will handle this gracefully
export { adminApp, adminDb }
