# Vercel Deployment Troubleshooting Guide

## How to Get Deployment Logs

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project (`kailendar-v2`)
3. Click on the failed deployment
4. Look at the build logs to find the error

## Common Issues & Solutions

### Issue 1: Build Command Fails

**Error:** `npm run build failed`

**Check:**
- Does the build work locally? `npm run build`
- Are there TypeScript errors?
- Are dependencies installing correctly?

**Solution:**
```bash
# Test locally first
npm run build

# If it works locally but fails on Vercel, check Node version
```

### Issue 2: Environment Variables Missing

**Error:** `NEXTAUTH_SECRET is not defined` or similar

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add required variables:
   ```
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=<generate-new-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   ```
3. Redeploy from Deployments tab

### Issue 3: Dependency Installation Fails

**Error:** `npm install failed` or peer dependency errors

**Solutions:**

**Option A: Verify .npmrc exists**
```bash
cat .npmrc
# Should show: legacy-peer-deps=true
```

**Option B: Override in Vercel Dashboard**
1. Go to Settings → General → Build & Development Settings
2. Override Install Command: `npm install --legacy-peer-deps`
3. Save and redeploy

### Issue 4: Module Not Found

**Error:** `Cannot find module '@/...'` or `Module not found`

**Solution:**
Check `tsconfig.json` has correct path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue 5: Firebase Admin Initialization Error

**Error:** `Failed to initialize Firebase Admin`

**Solution:**
This is expected in Vercel serverless environment without credentials. The app should gracefully handle this:

1. For MVP, Firebase is optional (mock data works)
2. To fix properly, add `FIREBASE_SERVICE_ACCOUNT_KEY` env variable
3. Or comment out Firebase Admin usage temporarily

### Issue 6: Vercel Function Timeout

**Error:** `Task timed out after X seconds`

**Solution:**
- Free tier: 10s limit
- Pro tier: 60s limit
- Optimize slow API routes
- Consider upgrading plan

### Issue 7: Import Errors with React 19

**Error:** `Cannot use import statement outside a module`

**Solution:**
Ensure all React imports are correct:
```typescript
import { useState } from 'react'  // ✅ Correct
import React from 'react'         // ✅ Also correct
```

### Issue 8: Tailwind CSS Build Errors

**Error:** `Cannot apply unknown utility class` or CSS errors

**Solution:**
1. Verify `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

2. Check `app/globals.css` uses correct syntax:
```css
@import "tailwindcss";
```

## Quick Fixes to Try

### 1. Force a Fresh Install

Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npm install --legacy-peer-deps && npm run build"
  }
}
```

Then in Vercel:
- Settings → Build & Development Settings
- Build Command: `npm run vercel-build`

### 2. Specify Node Version

Create `.nvmrc` or `.node-version`:
```
18
```

Or in `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### 3. Disable Type Checking Temporarily

In `next.config.js`:
```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ⚠️ Temporary only!
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Temporary only!
  },
}
```

**Note:** Only use this to identify if TypeScript is the issue, then fix properly.

### 4. Check Vercel Build Logs Location

The error is usually in one of these sections:
1. **Installing dependencies** - npm install issues
2. **Building** - Compilation/TypeScript errors
3. **Running TypeScript** - Type checking errors
4. **Generating static pages** - Runtime errors

## Debugging Steps

1. **Copy the exact error** from Vercel logs
2. **Search the error** in the codebase
3. **Test locally:**
   ```bash
   rm -rf node_modules .next
   npm install --legacy-peer-deps
   npm run build
   ```
4. **Check specific file** mentioned in error
5. **Verify environment variables** are set

## If All Else Fails

### Nuclear Option - Start Fresh:

1. **Delete Vercel project**
2. **Reimport from GitHub**
3. **Set environment variables carefully**
4. **Deploy**

### Temporary Workaround - Deploy Static:

If serverless functions are causing issues, you can export static:

In `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',  // Static export
}
```

**Note:** This disables API routes, so only for testing.

## Get More Help

If none of these work, please share:
1. Full error log from Vercel
2. Which step failed (install, build, type check, etc.)
3. Any environment variables you've set
4. Screenshot of the error if possible

Then I can provide specific guidance!
