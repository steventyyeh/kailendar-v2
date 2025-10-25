# 🔑 How to Get Google OAuth Client ID and Client Secret

## Complete Step-by-Step Guide

Follow these steps to get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for Dream Calendar.

---

## Step 1: Go to Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account (the one you want to manage the project)

---

## Step 2: Create a New Project (or Select Existing)

### If you don't have a project yet:

1. Click the **project dropdown** at the top (says "Select a project")
2. Click **"NEW PROJECT"** button (top right)
3. Fill in:
   - **Project name:** `Dream Calendar` (or any name you like)
   - **Organization:** Leave as default (or select if you have one)
4. Click **"CREATE"**
5. Wait 10-20 seconds for project creation
6. You'll be redirected to the new project dashboard

### If you already have a project:

1. Click the **project dropdown** at the top
2. Select your existing project

---

## Step 3: Enable Google+ API

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Or use the search bar at the top and type "API Library"

2. In the API Library search box, type: **"Google+ API"**

3. Click on **"Google+ API"** in the results

4. Click the **"ENABLE"** button

5. Wait for it to enable (5-10 seconds)

---

## Step 4: Configure OAuth Consent Screen

This is the screen users see when they sign in with Google.

1. In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**

2. **Choose User Type:**
   - Select **"External"** (unless you have a Google Workspace account, then you can choose Internal)
   - Click **"CREATE"**

3. **Fill in OAuth consent screen information:**

   **App information:**
   - App name: `Dream Calendar`
   - User support email: (select your email from dropdown)
   - App logo: (optional - you can skip for now)

   **App domain (optional for now):**
   - You can leave these blank for now

   **Developer contact information:**
   - Email addresses: (enter your email)

4. Click **"SAVE AND CONTINUE"**

5. **Scopes page:**
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
     - `.../auth/calendar` (for calendar access)
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

6. **Test users page:**
   - Click **"+ ADD USERS"**
   - Add your email address (and any other emails you want to test with)
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary page:**
   - Review everything
   - Click **"BACK TO DASHBOARD"**

---

## Step 5: Create OAuth 2.0 Credentials

This is where you get your Client ID and Client Secret!

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**

2. Click the **"+ CREATE CREDENTIALS"** button at the top

3. Select **"OAuth client ID"** from the dropdown

4. **Application type:**
   - Select **"Web application"**

5. **Name:**
   - Enter: `Dream Calendar Web Client` (or any name you like)

6. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000` (for local development)
   - Click **"+ ADD URI"** again
   - Add: `https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app` (your Vercel URL)

7. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000/api/auth/callback/google` (for local development)
   - Click **"+ ADD URI"** again
   - Add: `https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google` (your Vercel URL)

   ⚠️ **Important:** Make sure these URLs are EXACT - no trailing slashes!

8. Click **"CREATE"**

---

## Step 6: Copy Your Credentials

A modal will pop up with your credentials:

### You'll see:

```
Your Client ID
[long string of characters].apps.googleusercontent.com

Your Client Secret
[shorter string of characters]
```

### ✅ Copy these NOW:

1. **Client ID:** Click the copy button or select and copy
   - Should look like: `123456789-abcdefg.apps.googleusercontent.com`
   - This is your `GOOGLE_CLIENT_ID`

2. **Client Secret:** Click the copy button or select and copy
   - Should look like: `GOCSPX-abcd1234efgh5678`
   - This is your `GOOGLE_CLIENT_SECRET`

3. **Save them somewhere safe!** You'll need them in the next step.

---

## Step 7: Set Environment Variables in Vercel

Now that you have your credentials, let's add them to Vercel:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project: `kailendar-v2`

2. **Navigate to Environment Variables:**
   - Click **"Settings"** (top navigation)
   - Click **"Environment Variables"** (left sidebar)

3. **Add GOOGLE_CLIENT_ID:**
   - Click **"Add New"** button
   - Key: `GOOGLE_CLIENT_ID`
   - Value: (paste your Client ID from Step 6)
   - Select: Production, Preview, Development (all three)
   - Click **"Save"**

4. **Add GOOGLE_CLIENT_SECRET:**
   - Click **"Add New"** button
   - Key: `GOOGLE_CLIENT_SECRET`
   - Value: (paste your Client Secret from Step 6)
   - Select: Production, Preview, Development (all three)
   - Click **"Save"**

5. **Add AUTH_SECRET:**

   Open your terminal and run:
   ```bash
   openssl rand -base64 32
   ```

   Copy the output, then:
   - Click **"Add New"** button
   - Key: `AUTH_SECRET`
   - Value: (paste the generated secret)
   - Select: Production, Preview, Development (all three)
   - Click **"Save"**

6. **Add AUTH_TRUST_HOST:**
   - Click **"Add New"** button
   - Key: `AUTH_TRUST_HOST`
   - Value: `true`
   - Select: Production, Preview, Development (all three)
   - Click **"Save"**

---

## Step 8: Redeploy Your App

After adding all environment variables:

1. In Vercel, go to the **"Deployments"** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **"Redeploy"**
5. Wait 2-3 minutes for the deployment to complete

---

## Step 9: Test Your OAuth Flow

1. **Visit your deployed app:**
   https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app

2. **Click "Get Started with Google" or "Sign In"**

3. **You should see:**
   - Redirected to Google sign-in page
   - See "Dream Calendar wants to access your Google Account"
   - See your app name and permissions
   - After clicking "Continue", redirected back to your app
   - Logged in successfully with your name showing in the navbar

---

## ✅ Success Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Added localhost URLs to authorized origins and redirects
- [ ] Added Vercel URLs to authorized origins and redirects
- [ ] Copied Client ID and Client Secret
- [ ] Added GOOGLE_CLIENT_ID to Vercel
- [ ] Added GOOGLE_CLIENT_SECRET to Vercel
- [ ] Generated and added AUTH_SECRET to Vercel
- [ ] Added AUTH_TRUST_HOST=true to Vercel
- [ ] Redeployed the app
- [ ] Tested sign-in flow successfully

---

## 🎯 Quick Reference

### Your URLs to add to Google OAuth:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app/api/auth/callback/google
```

### Your Vercel Environment Variables:

```bash
GOOGLE_CLIENT_ID=<paste-from-google-console>
GOOGLE_CLIENT_SECRET=<paste-from-google-console>
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_TRUST_HOST=true
```

---

## 🐛 Troubleshooting

### Can't find "OAuth consent screen"?

- Make sure you're in the correct project (check project dropdown at top)
- Go to: APIs & Services → OAuth consent screen

### "Access blocked: This app's request is invalid"?

- Check that you added the correct redirect URIs
- Make sure there are no trailing slashes
- Wait 2-3 minutes after saving changes in Google Console

### "redirect_uri_mismatch" error?

- Your redirect URI in Google Console doesn't match
- Should be exactly: `https://your-vercel-url.vercel.app/api/auth/callback/google`
- No trailing slash!

### Can't find Client ID/Secret after creating?

- Go to: APIs & Services → Credentials
- Find your OAuth 2.0 Client ID in the list
- Click on it to see details
- Click "Download JSON" or view Client ID and Secret on the page

---

## 📸 Visual Guide

If you get stuck, here's what to look for:

1. **Google Cloud Console** - Top left should say "Google Cloud"
2. **Project dropdown** - Top of page, shows current project name
3. **Hamburger menu (☰)** - Top left, opens sidebar navigation
4. **APIs & Services** - In sidebar under "Quick access" or search
5. **Blue "+ CREATE CREDENTIALS" button** - At top of Credentials page

---

## 🎉 You're Done!

Once you complete all these steps, your Google OAuth integration will be fully functional.

**Test it now:** Visit your Vercel URL and click "Sign In with Google"!

**Next:** Follow VERIFY_OAUTH.md to test the complete authentication flow.
