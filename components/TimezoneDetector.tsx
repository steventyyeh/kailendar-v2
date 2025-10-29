'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

/**
 * TimezoneDetector - Automatically detects and updates user timezone
 *
 * This component runs on every page load and ensures the user's timezone
 * is stored in their Firestore profile. This is critical for scheduling
 * tasks at the correct local times.
 */
export default function TimezoneDetector() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) {
      return
    }

    // Get user's timezone from browser
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (!detectedTimezone) {
      console.warn('[Timezone] Could not detect timezone from browser')
      return
    }

    // Update user's timezone if needed
    const updateTimezone = async () => {
      try {
        const response = await fetch('/api/user/timezone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timezone: detectedTimezone,
          }),
        })

        if (!response.ok) {
          console.error('[Timezone] Failed to update timezone')
        } else {
          console.log('[Timezone] User timezone updated to:', detectedTimezone)
        }
      } catch (error) {
        console.error('[Timezone] Error updating timezone:', error)
      }
    }

    updateTimezone()
  }, [session, status])

  // This component doesn't render anything
  return null
}
