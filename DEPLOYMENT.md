# Deployment Guide - Vercel

This guide will help you deploy Dream Calendar to Vercel with automatic redeployment on every git commit.

## Method 1: Deploy via Vercel Dashboard (Recommended)

This method automatically sets up Git integration so every commit triggers a redeployment.

### Steps:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find and select `steventyyeh/kailendar-v2`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add the following:

   ```
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=<your-secret-from-openssl-rand-base64-32>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>

   # Firebase (if configured)
   NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
   FIREBASE_SERVICE_ACCOUNT_KEY=<your-service-account-json>

   # Anthropic (when ready)
   ANTHROPIC_API_KEY=<your-anthropic-key>
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

6. **Update Google OAuth Redirect URIs**
   - Go to Google Cloud Console
   - Add new authorized redirect URI:
     ```
     https://your-project-name.vercel.app/api/auth/callback/google
     ```

### ✅ Automatic Redeployment is Now Active!

Every time you push to the `main` branch, Vercel will automatically:
- Pull the latest code
- Run the build
- Deploy the new version
- Update your production URL

You'll also get:
- Preview deployments for pull requests
- Deployment notifications
- Rollback capabilities

---

## Method 2: Deploy via CLI (Alternative)

If you prefer command-line deployment:

### One-time Setup:

```bash
# Login to Vercel (will open browser)
npx vercel login

# Deploy to production
npx vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (select your account)
- Link to existing project? **N**
- What's your project's name? **kailendar-v2**
- In which directory is your code located? **.**
- Want to override the settings? **N**

### Add Environment Variables via CLI:

```bash
# Add secrets
npx vercel env add NEXTAUTH_SECRET production
npx vercel env add GOOGLE_CLIENT_ID production
npx vercel env add GOOGLE_CLIENT_SECRET production
# ... add others as needed
```

### Future Deployments:

```bash
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

**Note:** CLI deployments won't automatically redeploy on git commits. For that, you need to link the project in the Vercel dashboard.

---

## Connecting Git to CLI-deployed Project

If you deployed via CLI but want automatic redeployments:

1. Go to https://vercel.com/dashboard
2. Find your project
3. Go to Settings → Git
4. Click "Connect Git Repository"
5. Select `steventyyeh/kailendar-v2`
6. Confirm

Now every git push will trigger a deployment!

---

## Post-Deployment Checklist

After your first successful deployment:

### 1. Update OAuth Settings
- [ ] Add Vercel URL to Google OAuth authorized redirect URIs
- [ ] Test Google sign-in on production

### 2. Configure Custom Domain (Optional)
- [ ] Go to Vercel Dashboard → Your Project → Settings → Domains
- [ ] Add your custom domain (e.g., dreamcalendar.app)
- [ ] Update DNS records as instructed
- [ ] Update NEXTAUTH_URL environment variable
- [ ] Update Google OAuth redirect URIs

### 3. Test Core Features
- [ ] Landing page loads
- [ ] Google OAuth sign-in works
- [ ] Dashboard displays
- [ ] API endpoints respond

### 4. Monitor Deployment
- [ ] Check Vercel dashboard for build logs
- [ ] Monitor function execution logs
- [ ] Set up error tracking (Sentry recommended)

---

## Deployment Configuration

The project includes optimized settings for Vercel:

### Automatic Optimizations:
- ✅ Edge Functions for API routes
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Server-side rendering
- ✅ Static generation where possible

### Build Settings:
- **Framework**: Next.js 16
- **Node Version**: 18.x (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Vercel Dashboard
2. Click on the failed deployment
3. View "Building" logs

**Common issues:**
- Missing environment variables
- TypeScript errors
- Dependency installation failures

**Solution:**
```bash
# Test build locally
npm run build

# Fix errors, then commit and push
git add .
git commit -m "Fix build errors"
git push
```

### OAuth Redirect Mismatch

**Error:** "redirect_uri_mismatch"

**Solution:**
1. Check your NEXTAUTH_URL in Vercel environment variables
2. Ensure it matches: `https://your-project-name.vercel.app`
3. Add this URL to Google OAuth authorized redirect URIs:
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```

### Environment Variables Not Working

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify all variables are set for "Production"
3. Redeploy: Deployments → ⋯ → Redeploy

### Functions Timeout

**Issue:** API routes taking too long

**Solution:**
- Free tier: 10s limit
- Pro tier: 60s limit
- Optimize database queries
- Consider upgrading Vercel plan

---

## Monitoring & Analytics

### View Logs:
```bash
npx vercel logs <deployment-url>
```

### Dashboard Features:
- Real-time function logs
- Performance analytics
- Error tracking
- Deployment history

---

## Rolling Back

If a deployment breaks production:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click ⋯ → "Promote to Production"

Or via CLI:
```bash
npx vercel rollback
```

---

## Best Practices

### Environment Variables
- ✅ Never commit `.env` file
- ✅ Use different secrets for production vs preview
- ✅ Rotate secrets regularly
- ✅ Use Vercel's built-in secrets encryption

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes, commit
git add .
git commit -m "Add new feature"

# Push to create preview deployment
git push origin feature/new-feature

# Test preview deployment
# Merge to main when ready
git checkout main
git merge feature/new-feature
git push  # Triggers production deployment
```

### Performance
- Enable Vercel Analytics in dashboard
- Monitor Core Web Vitals
- Use `next/image` for images
- Implement proper caching headers

---

## Cost Estimation

### Vercel Pricing:

**Hobby (Free):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function executions: 100 GB-hrs
- ✅ Perfect for MVP testing

**Pro ($20/month):**
- ✅ 1 TB bandwidth
- ✅ 1000 GB-hrs function executions
- ✅ Team collaboration
- ✅ Recommended for production

**Current MVP should run fine on Free tier during development.**

---

## Next Steps After Deployment

1. **Share your live URL** with testers
2. **Set up monitoring** (Sentry, LogRocket)
3. **Configure custom domain** when ready
4. **Enable Vercel Analytics** for insights
5. **Set up staging environment** (use preview deployments)

---

Your app will be live at: **https://your-project-name.vercel.app**

Happy deploying! 🚀
