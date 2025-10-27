#!/usr/bin/env tsx
/**
 * Test Firebase connection
 * Run with: npx tsx scripts/test-firebase.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { adminDb } from '../lib/firebase/admin'

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase connection...\n')

  try {
    if (!adminDb) {
      console.error('❌ Firebase not configured')
      console.log('Please set the following environment variables:')
      console.log('  - FIREBASE_PROJECT_ID')
      console.log('  - FIREBASE_CLIENT_EMAIL')
      console.log('  - FIREBASE_PRIVATE_KEY')
      process.exit(1)
    }

    console.log('✅ Firebase Admin SDK initialized')

    // Try to list collections
    const collections = await adminDb.listCollections()
    console.log(`✅ Connected to Firestore`)
    console.log(`📚 Found ${collections.length} collection(s):`, collections.map(c => c.id).join(', ') || 'none')

    // Try to create a test document
    const testRef = adminDb.collection('_test').doc('connection-test')
    await testRef.set({
      timestamp: new Date(),
      message: 'Firebase connection successful!',
    })
    console.log('✅ Write operation successful')

    // Read it back
    const testDoc = await testRef.get()
    if (testDoc.exists) {
      console.log('✅ Read operation successful')
      console.log('📄 Test document data:', testDoc.data())
    }

    // Clean up
    await testRef.delete()
    console.log('✅ Delete operation successful')

    console.log('\n🎉 All Firebase operations working correctly!')
  } catch (error) {
    console.error('\n❌ Firebase test failed:')
    console.error(error)
    process.exit(1)
  }
}

testFirebaseConnection()
