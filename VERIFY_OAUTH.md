# 🔐 OAuth Verification Checklist

## Current Status
✅ Code implemented and deployed
⏳ Waiting for environment variables setup

## Step 1: Generate AUTH_SECRET

Run this command locally:

```bash
openssl rand -base64 32
```

Copy the output - you'll need it for Vercel.

## Step 2: Get Your Google OAuth Credentials

**If you already have them:** Skip to Step 3

**If you need to create them:**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add these URLs:

**Authorized JavaScript origins:**
```
https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

## Step 3: Set Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add these 4 variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `AUTH_SECRET` | (paste from Step 1) | Production, Preview, Development |
| `AUTH_TRUST_HOST` | `true` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | (from Google Console) | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | (from Google Console) | Production, Preview, Development |

5. Click Save

## Step 4: Trigger Redeploy

After saving environment variables:

1. Go to: Deployments tab
2. Click ⋯ on latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes

## Step 5: Test OAuth Flow

Visit: https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app

### Test Sequence:

1. **Landing Page**
   - [ ] Page loads successfully
   - [ ] Click "Get Started with Google"
   - [ ] Redirected to `/login`

2. **Login Page**
   - [ ] See Google sign-in button
   - [ ] Click "Continue with Google"
   - [ ] Redirected to Google's consent screen

3. **Google Consent**
   - [ ] See your Google account
   - [ ] Click "Allow" or "Continue"
   - [ ] Redirected back to your app

4. **Dashboard**
   - [ ] Land on `/dashboard`
   - [ ] See your Google name in navbar
   - [ ] See your Google profile photo
   - [ ] Dashboard shows mock data
   - [ ] No "Demo Mode" banner (you're authenticated)

5. **Session Persistence**
   - [ ] Refresh the page (F5)
   - [ ] Still logged in
   - [ ] Still see your name/photo
   - [ ] Session persists

6. **Sign Out**
   - [ ] Click "Sign Out" in navbar
   - [ ] Redirected to home page
   - [ ] No longer authenticated

7. **Protected Routes**
   - [ ] Try to visit `/dashboard` directly
   - [ ] Redirected to `/login`
   - [ ] After signing in, redirected back to `/dashboard`

## Troubleshooting

### ❌ Error: "redirect_uri_mismatch"

**Cause:** Google OAuth doesn't have your Vercel URL

**Fix:**
1. Go to Google Console → Credentials
2. Verify exact URL in redirect URIs:
   ```
   https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google
   ```
3. Save and wait 2 minutes

### ❌ Error: "Configuration"

**Cause:** Missing environment variables

**Fix:**
1. Check all 4 variables are set in Vercel
2. Redeploy after setting them
3. Wait 2-3 minutes

### ❌ Session doesn't persist

**Cause:** `AUTH_TRUST_HOST` not set or `AUTH_SECRET` missing

**Fix:**
1. Verify both are set in Vercel
2. Redeploy

### ❌ "Invalid client" error

**Cause:** Wrong Client ID or Secret

**Fix:**
1. Copy exact values from Google Console
2. Update in Vercel
3. Redeploy

## Success Criteria

✅ All checkboxes above are checked
✅ Can sign in with Google
✅ Session persists after refresh
✅ Can sign out
✅ Protected routes work correctly

## Next Steps

Once OAuth is working:

1. **Verify on production** - Test the full flow
2. **Test locally** - Set up `.env.local` for development
3. **Move to Phase 2** - Start building goal creation UI

---

## Quick Test Script

Copy this and paste in browser console on your deployed site:

```javascript
// Check if session exists
fetch('/api/auth/session')
  .then(r => r.json())
  .then(session => {
    if (session.user) {
      console.log('✅ Authenticated as:', session.user.email)
      console.log('User:', session.user)
    } else {
      console.log('❌ Not authenticated')
    }
  })
```

---

**Once everything works, you're ready to start Phase 2: Goal Creation! 🚀**
