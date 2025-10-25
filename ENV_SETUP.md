# Environment Variables Setup for Google OAuth

## Required Environment Variables

Your app needs these environment variables to function properly with Google OAuth authentication.

### Local Development (.env.local)

Create a `.env.local` file in the root directory:

```bash
# Auth.js / NextAuth Configuration
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_TRUST_HOST=true

# Google OAuth Credentials
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Firebase (Optional for MVP - uses mock data)
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
```

### Production (Vercel)

Set these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```
AUTH_SECRET=<generate-new-secret-for-production>
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

---

## How to Get Google OAuth Credentials

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Name it "Dream Calendar" or similar

### Step 2: Enable Google+ API

1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have Google Workspace)
3. Fill in:
   - App name: Dream Calendar
   - User support email: your email
   - Developer contact: your email
4. Click "Save and Continue"
5. Skip "Scopes" for now
6. Add test users (your email addresses that can test)
7. Click "Save and Continue"

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Name: "Dream Calendar Web Client"
5. **Authorized JavaScript origins:**
   - `http://localhost:3000` (for local development)
   - `https://your-vercel-url.vercel.app` (for production)
6. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-vercel-url.vercel.app/api/auth/callback/google` (production)
7. Click "CREATE"
8. **Copy the Client ID and Client Secret** - you'll need these!

---

## Vercel URL Setup

### Find Your Vercel URL

After deploying to Vercel:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Find the "Domains" section
4. Your URL will be something like: `https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app`

### Update Google OAuth with Vercel URL

1. Go back to Google Cloud Console → Credentials
2. Click your OAuth 2.0 Client ID
3. Add your Vercel URL to:
   - **Authorized JavaScript origins:**
     ```
     https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app
     ```
   - **Authorized redirect URIs:**
     ```
     https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google
     ```
4. Click "SAVE"
5. **Wait 2-3 minutes** for Google to propagate changes

---

## Generate AUTH_SECRET

The `AUTH_SECRET` is a random string used to encrypt session tokens.

**Generate it:**
```bash
openssl rand -base64 32
```

**Important:**
- Use different secrets for local dev and production
- Never commit secrets to git
- Keep them secure

---

## Testing Authentication

### Local Testing (http://localhost:3000)

1. Ensure `.env.local` has all required variables
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Click "Get Started with Google" or "Sign In"
5. Should redirect to Google login
6. After login, should redirect back to `/dashboard`
7. Should see your Google name in navbar

### Production Testing (Vercel)

1. Ensure Vercel has all environment variables set
2. Ensure Google OAuth has Vercel URL in redirect URIs
3. Visit your Vercel URL
4. Click "Sign In"
5. Should redirect to Google
6. After login, should return to dashboard
7. Session should persist across page refreshes

---

## Troubleshooting

### Error: `redirect_uri_mismatch`

**Cause:** Google doesn't recognize your callback URL

**Fix:**
1. Check Google Cloud Console → Credentials
2. Ensure exact URL is in "Authorized redirect URIs":
   ```
   https://your-exact-vercel-url.vercel.app/api/auth/callback/google
   ```
3. No trailing slash
4. Must use `https://`
5. Wait 2 minutes after saving

### Error: `invalid_client`

**Cause:** Wrong Client ID or Secret

**Fix:**
1. Verify `GOOGLE_CLIENT_ID` matches Google Console
2. Verify `GOOGLE_CLIENT_SECRET` matches Google Console
3. Check for extra spaces or typos
4. Redeploy after fixing

### Error: `AUTH_SECRET is not set`

**Cause:** Missing AUTH_SECRET

**Fix:**
1. Generate: `openssl rand -base64 32`
2. Add to `.env.local` (local) or Vercel env vars (production)
3. Restart dev server or redeploy

### Session doesn't persist

**Cause:** `AUTH_TRUST_HOST` not set for Vercel

**Fix:**
1. Add `AUTH_TRUST_HOST=true` to Vercel environment variables
2. Redeploy

### Preview deployments don't work

**Cause:** Preview URLs change with each deployment

**Fix:**
Option 1: Add wildcard domain (requires verification):
```
https://*.vercel.app
```

Option 2: Only test OAuth on production URL

---

## Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Configured OAuth Consent Screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added localhost URLs to Google OAuth
- [ ] Generated AUTH_SECRET
- [ ] Created .env.local with all variables
- [ ] Tested login locally
- [ ] Added Vercel URL to Google OAuth
- [ ] Set environment variables in Vercel
- [ ] Tested login on production
- [ ] Verified session persists

---

## Quick Reference

### Local URLs to add to Google OAuth:

**JavaScript Origins:**
```
http://localhost:3000
```

**Redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
```

### Production URLs (replace with your actual Vercel URL):

**JavaScript Origins:**
```
https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app
```

**Redirect URIs:**
```
https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google
```

---

## Migration Notes

This project now uses **Auth.js v5** (formerly NextAuth.js v5) which:
- ✅ Supports Next.js 16
- ✅ Uses `AUTH_SECRET` instead of `NEXTAUTH_SECRET`
- ✅ Uses `AUTH_TRUST_HOST` instead of `NEXTAUTH_URL`
- ✅ Has improved TypeScript support
- ✅ Better server actions integration

The old NextAuth v4 environment variables are **no longer needed**.
