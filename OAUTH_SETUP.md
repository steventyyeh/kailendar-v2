# Google OAuth Setup Guide

## Issue: OAuth Login Not Working on Vercel

When you click "Sign in with Google" on your deployed app, you likely see one of these errors:
- `redirect_uri_mismatch`
- `Error 400: redirect_uri_mismatch`
- OAuth consent screen error

This is because Google OAuth needs to know your Vercel URL.

---

## Fix: Add Vercel URL to Google OAuth

### Step 1: Get Your Vercel URL

Your app is deployed at one of these:
- `https://kailendar-v2.vercel.app` (default)
- `https://your-custom-name.vercel.app` (if you renamed it)
- Your custom domain (if configured)

**Find it:** Go to your Vercel dashboard → Your project → Domains

### Step 2: Update Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project (the one where you created OAuth credentials)

2. **Navigate to Credentials:**
   - Click hamburger menu (☰) → APIs & Services → Credentials
   - Find your OAuth 2.0 Client ID (Web application)
   - Click the ✏️ (edit) icon

3. **Add Authorized JavaScript Origins:**
   - Click "+ ADD URI" under "Authorized JavaScript origins"
   - Add: `https://your-vercel-url.vercel.app`
   - Example: `https://kailendar-v2.vercel.app`

4. **Add Authorized Redirect URIs:**
   - Click "+ ADD URI" under "Authorized redirect URIs"
   - Add: `https://your-vercel-url.vercel.app/api/auth/callback/google`
   - Example: `https://kailendar-v2.vercel.app/api/auth/callback/google`

5. **Save Changes:**
   - Click "SAVE" at the bottom
   - Wait 1-2 minutes for Google to propagate changes

### Step 3: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your `kailendar-v2` project
   - Go to Settings → Environment Variables

2. **Update NEXTAUTH_URL:**
   - Find `NEXTAUTH_URL` (or add it if missing)
   - Set value to: `https://your-vercel-url.vercel.app`
   - Select environments: Production, Preview, Development
   - Save

3. **Verify Other Variables Exist:**
   ```
   NEXTAUTH_SECRET=<your-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   ```

4. **Redeploy:**
   - Go to Deployments tab
   - Click ⋯ on the latest deployment
   - Click "Redeploy"
   - Or just push a new commit (will auto-deploy)

---

## Complete Configuration Checklist

### Google Cloud Console ✅

**Authorized JavaScript origins:**
- ✅ `http://localhost:3000` (for local development)
- ✅ `https://your-vercel-url.vercel.app` (for production)

**Authorized redirect URIs:**
- ✅ `http://localhost:3000/api/auth/callback/google` (local)
- ✅ `https://your-vercel-url.vercel.app/api/auth/callback/google` (production)

### Vercel Environment Variables ✅

**Required variables:**
- ✅ `NEXTAUTH_URL` = `https://your-vercel-url.vercel.app`
- ✅ `NEXTAUTH_SECRET` = (32+ character random string)
- ✅ `GOOGLE_CLIENT_ID` = (from Google Cloud Console)
- ✅ `GOOGLE_CLIENT_SECRET` = (from Google Cloud Console)

---

## Testing OAuth Flow

### Test on Production:

1. Visit your Vercel URL: `https://your-vercel-url.vercel.app`
2. Click "Get Started with Google" or "Sign In"
3. You should see Google's consent screen
4. After approving, you should be redirected back to `/dashboard`
5. You should see your Google profile name and image in the navbar

### If It Still Doesn't Work:

**Check browser console for errors:**
1. Right-click → Inspect → Console tab
2. Look for any error messages
3. Common issues:
   - CORS errors → Check origins in Google Console
   - 400 error → Check redirect URI exactly matches
   - Session error → Check NEXTAUTH_SECRET is set

**Check Vercel Function Logs:**
1. Vercel Dashboard → Your project
2. Click on latest deployment
3. Go to "Functions" tab
4. Look for `/api/auth/[...nextauth]` errors

---

## Common Errors & Solutions

### Error: `redirect_uri_mismatch`

**Cause:** Google doesn't recognize your Vercel URL

**Fix:**
1. Double-check the redirect URI in Google Console exactly matches:
   ```
   https://your-exact-vercel-url.vercel.app/api/auth/callback/google
   ```
2. No trailing slashes
3. Must use `https://` (not `http://`)
4. Wait 2 minutes after saving for Google to update

### Error: `invalid_client`

**Cause:** Client ID or Secret is wrong

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Copy the Client ID and Client Secret
3. Update in Vercel → Settings → Environment Variables
4. Redeploy

### Error: `access_denied`

**Cause:** OAuth consent screen not configured or user denied

**Fix:**
1. Google Cloud Console → OAuth consent screen
2. Ensure it's configured and published
3. Add test users if in "Testing" mode
4. Try signing in again

### Error: Session callback error

**Cause:** NEXTAUTH_SECRET missing or wrong

**Fix:**
1. Generate new secret: `openssl rand -base64 32`
2. Add to Vercel environment variables
3. Redeploy

### Error: `getaddrinfo ENOTFOUND`

**Cause:** NEXTAUTH_URL is wrong or missing

**Fix:**
1. Verify NEXTAUTH_URL in Vercel matches your deployment URL
2. No typos, must include `https://`
3. Redeploy after fixing

---

## Quick Reference: URLs You Need

Replace `your-vercel-url` with your actual Vercel deployment URL.

### For Google Cloud Console:

**JavaScript Origins:**
```
https://your-vercel-url.vercel.app
```

**Redirect URIs:**
```
https://your-vercel-url.vercel.app/api/auth/callback/google
```

### For Vercel Environment Variables:

**NEXTAUTH_URL:**
```
https://your-vercel-url.vercel.app
```

---

## Multiple Environments Setup (Advanced)

If you want different configs for preview vs production:

### Production:
- NEXTAUTH_URL = `https://kailendar-v2.vercel.app`
- Add to Google OAuth redirect URIs

### Preview Deployments:
- NEXTAUTH_URL = `https://kailendar-v2-*.vercel.app`
- Can't predict preview URLs, so either:
  - Add wildcard domain (requires domain verification)
  - Or test OAuth only on production

---

## Still Having Issues?

If OAuth still doesn't work after following these steps:

1. **Share the exact error message** you see (screenshot helps)
2. **Verify in Google Console:**
   - Screenshot of Authorized redirect URIs
   - Confirm the exact URL
3. **Verify in Vercel:**
   - Screenshot of environment variables (hide secrets)
   - Confirm NEXTAUTH_URL value
4. **Check your Vercel URL:**
   - What's the exact URL where your app is deployed?

Then I can provide specific guidance!

---

## Success Checklist ✅

- [ ] Google Cloud Console has Vercel URL in authorized origins
- [ ] Google Cloud Console has callback URL in redirect URIs
- [ ] Waited 2 minutes after saving Google changes
- [ ] NEXTAUTH_URL set in Vercel to match deployment URL
- [ ] NEXTAUTH_SECRET is set in Vercel
- [ ] GOOGLE_CLIENT_ID is set in Vercel
- [ ] GOOGLE_CLIENT_SECRET is set in Vercel
- [ ] Redeployed after setting environment variables
- [ ] Tested sign-in flow on production URL
- [ ] Successfully redirected to dashboard after Google login

Once all checked, OAuth should work! 🎉
