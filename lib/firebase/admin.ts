// Firebase Admin SDK for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (singleton pattern)
const apps = getApps()

let adminApp

if (apps.length === 0) {
  // In production, use service account key
  // In development, you can use application default credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    })
  } else {
    // Fallback for local development - will use emulator or default credentials
    adminApp = initializeApp()
  }
} else {
  adminApp = apps[0]
}

const adminDb = getFirestore(adminApp)

export { adminApp, adminDb }
