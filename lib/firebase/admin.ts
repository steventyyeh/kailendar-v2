// Firebase Admin SDK for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (singleton pattern)
const apps = getApps()

let adminApp: any = null
let adminDb: any = null

// Only initialize if Firebase credentials are available
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  if (apps.length === 0) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    })
  } else {
    adminApp = apps[0]
  }

  adminDb = getFirestore(adminApp)
}

// Export null if Firebase is not configured - functions will handle this gracefully
export { adminApp, adminDb }
