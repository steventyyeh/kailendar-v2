// Simple Firebase connection test using plain JavaScript
// This ensures dotenv loads BEFORE any imports

// Load .env.local first
require('dotenv').config({ path: '.env.local' })

console.log('🔥 Testing Firebase connection...\n')

// Verify environment variables loaded
console.log('Environment variables check:')
console.log('  FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅' : '❌')
console.log('  FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅' : '❌')
console.log('  FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅' : '❌')
console.log('')

// Now import Firebase admin (after env vars are set)
const admin = require('firebase-admin/app')
const firestore = require('firebase-admin/firestore')

async function testConnection() {
  try {
    // Check if already initialized
    const apps = admin.getApps()
    let app
    
    if (apps.length === 0) {
      app = admin.initializeApp({
        credential: admin.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
      })
      console.log('✅ Firebase Admin SDK initialized')
    } else {
      app = apps[0]
      console.log('✅ Using existing Firebase app')
    }

    const db = firestore.getFirestore(app)
    console.log('✅ Connected to Firestore')

    // Try to list collections
    const collections = await db.listCollections()
    console.log(`📚 Found ${collections.length} collection(s):`, collections.map(c => c.id).join(', ') || 'none')

    // Try to create a test document
    const testRef = db.collection('_test').doc('connection-test')
    await testRef.set({
      timestamp: new Date(),
      message: 'Firebase connection successful!',
    })
    console.log('✅ Write operation successful')

    // Read it back
    const testDoc = await testRef.get()
    if (testDoc.exists) {
      console.log('✅ Read operation successful')
    }

    // Clean up
    await testRef.delete()
    console.log('✅ Delete operation successful')

    console.log('\n🎉 All Firebase operations working correctly!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Firebase test failed:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

testConnection()
