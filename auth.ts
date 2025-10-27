import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { updateUserTokens } from "./lib/firebase/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist OAuth tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at

        // Store refresh token in Firestore for calendar API access
        if (account.refresh_token && token.email) {
          try {
            await updateUserTokens(token.email as string, {
              refreshToken: account.refresh_token,
              accessToken: account.access_token || '',
              expiryDate: account.expires_at ? new Date(account.expires_at * 1000) : new Date(),
            })
          } catch (error) {
            console.error('Failed to store tokens in Firestore:', error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      // Add custom properties to session
      if (token) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.expiresAt = token.expiresAt as number
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true, // Important for Vercel deployment
})
