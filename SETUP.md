# Kailendar V2 - Setup Guide

This guide will help you set up and configure the Kailendar V2 application for local development and production deployment.

## Prerequisites

- Node.js 18+ installed
- Firebase project created
- Google Cloud Console access for OAuth setup
- Vercel account (for deployment)

## Environment Variables Setup

### 1. Firebase Configuration

The Firebase Admin SDK credentials are already configured in `.env.local`:

```env
FIREBASE_PROJECT_ID="kailendar-4f4bc"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@kailendar-4f4bc.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="[ALREADY CONFIGURED]"
```

### 2. Authentication Configuration

The AUTH_SECRET has been generated and configured:

```env
AUTH_SECRET="[ALREADY CONFIGURED]"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Google OAuth Setup (REQUIRED FOR AUTHENTICATION)

**⚠️ CRITICAL**: Google OAuth is currently NOT configured. You must set this up for authentication to work.

#### Steps to Configure Google OAuth:

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project: `kailendar-4f4bc`

2. **Create OAuth 2.0 Client ID** (if not already created):
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Kailendar V2"

3. **Configure Authorized Redirect URIs**:

   For **local development**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   For **production** (Vercel), add:
   ```
   https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google
   https://[your-custom-domain]/api/auth/callback/google
   ```

4. **Copy Client ID and Client Secret**:
   - After creating, you'll see `Client ID` and `Client Secret`
   - Copy these values

5. **Add to `.env.local`**:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id-here.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
   ```

6. **Add to Vercel Environment Variables**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add the same variables:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `AUTH_SECRET` (use the same value from `.env.local`)
     - `NEXTAUTH_URL` (set to your production URL)

## Firebase Firestore Indexes

The application requires composite indexes for efficient queries. These are defined in `firestore.indexes.json`.

**To deploy indexes to Firebase:**

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy indexes
firebase deploy --only firestore:indexes
```

Alternatively, when you encounter an index error in development, Firebase will provide a direct link to create the index in the console.

## Installation & Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Current Application Status

### ✅ Working Features:
- Dashboard (with demo mode)
- Goal creation flow
- Goals questionnaire
- Active goals list
- API routes for dashboard data

### ⚠️ Partially Working:
- Authentication (Google OAuth NOT configured - see above)
- Firebase integration (Admin SDK configured, client-side needs testing)

### ❌ Not Implemented Yet:
- `/progress` page
- `/resources` page
- `/settings` page
- Google Calendar integration
- LLM plan generation
- Stripe payment integration

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**:
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables** in Vercel:
   ```
   FIREBASE_PROJECT_ID=kailendar-4f4bc
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kailendar-4f4bc.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=[your-firebase-private-key]
   AUTH_SECRET=[your-auth-secret]
   NEXTAUTH_URL=[your-production-url]
   GOOGLE_CLIENT_ID=[your-google-client-id]
   GOOGLE_CLIENT_SECRET=[your-google-client-secret]
   ```

4. **Deploy**:
   - Vercel will automatically deploy on every push to main branch

## Troubleshooting

### "client_id is required" Error

This error means Google OAuth is not configured. Follow the Google OAuth Setup section above.

### Authentication Not Working

1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
2. Verify redirect URIs match exactly (including http/https)
3. Check browser console for errors
4. Verify NextAuth configuration in `auth.ts`

### Firebase Connection Issues

1. Verify FIREBASE_PRIVATE_KEY is properly escaped (with \n for newlines)
2. Check Firebase Console for API enablement
3. Verify service account has necessary permissions

## Next Steps

1. **Configure Google OAuth** (highest priority)
2. Test authentication flow
3. Implement missing pages (/progress, /resources, /settings)
4. Implement Google Calendar API integration
5. Implement LLM plan generation
6. Add Stripe payment processing

## Resources

- [Next-Auth Documentation](https://next-auth.js.org/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [Vercel Deployment](https://vercel.com/docs)

---

**Last Updated**: October 27, 2025
**Project**: Kailendar V2
**Status**: Development
