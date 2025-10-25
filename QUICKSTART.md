# Quick Start Guide

## Immediate Next Steps

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your credentials:

**Required for MVP to run:**
```bash
# Generate a NextAuth secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-generated-secret>

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Firebase Setup (Optional for MVP - mock data will work without it):**
- Create a Firebase project at https://console.firebase.google.com/
- Add config values to `.env` (see `.env.example`)

### 3. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000

## What You'll See

### Landing Page (/)
- Hero section with "Get Started with Google" button
- Links to demo dashboard
- Feature highlights

### Sign In Page (/auth/signin)
- Google OAuth sign-in button
- Clean, minimal interface

### Dashboard (/dashboard)
- Weekly stats overview
- Today's tasks list
- Active goals cards
- Upcoming milestones
- Recent resources

**Note:** Currently shows mock data. Real data will appear once you:
1. Sign in with Google
2. Create your first goal
3. Integrate with Firebase Firestore

## Testing the Flow

### Without Database (Mock Data)
1. Navigate to `/dashboard` directly
2. You'll see mock data for a sample "Learn web development" goal
3. Interact with task checkboxes
4. Explore the UI components

### With Authentication
1. Set up Google OAuth credentials
2. Click "Get Started with Google"
3. Sign in with your Google account
4. You'll be redirected to the dashboard

### Creating a Goal (API Endpoint Ready)
```bash
# Test the API endpoint with curl
curl -X POST http://localhost:3000/api/goals/create \
  -H "Content-Type: application/json" \
  -d '{
    "category": "learning",
    "specificity": "Learn React and Next.js",
    "currentState": "beginner",
    "targetState": "Build full-stack applications",
    "deadline": "2025-03-01T00:00:00Z",
    "learningStyles": ["hands-on", "video"],
    "budget": "$100",
    "equipment": "Laptop",
    "constraints": "Evenings only"
  }'
```

## Next Development Tasks

### Immediate (Can Start Now)
- [ ] Create goal creation form UI at `/goals/new`
- [ ] Add goal details page at `/goals/[id]`
- [ ] Implement real-time polling for plan generation status
- [ ] Add toast notifications for user feedback

### Phase 2
- [ ] Replace mock Claude API with real Anthropic Claude API
- [ ] Integrate Google Calendar API for event creation
- [ ] Add plan review/approval interface
- [ ] Implement calendar event scheduling logic

### Database Integration
- [ ] Complete Firebase setup
- [ ] Test Firestore read/write operations
- [ ] Add user creation on first sign-in
- [ ] Implement goal persistence

## Folder Structure Quick Reference

```
app/
├── api/          # API routes
├── auth/         # Auth pages
├── dashboard/    # Dashboard page
└── page.tsx      # Landing page

components/
├── layout/       # Layout components
└── ui/           # Reusable UI components

lib/
├── auth.ts       # NextAuth config
├── claude/       # Mock LLM service
└── firebase/     # Database utilities

types/
└── index.ts      # TypeScript types
```

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run build

# Linting
npm run lint
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### NextAuth callback URL mismatch
- Go to Google Cloud Console
- Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### Firebase permission denied
- Check Firestore security rules
- For local dev, you can start with test mode rules
- For production, implement proper user-based rules (see spec.md)

## Current Limitations (MVP)

- ❌ No Google Calendar integration yet
- ❌ No real Claude API (using mocks)
- ❌ No Stripe payments
- ❌ Limited error handling
- ❌ No comprehensive testing

These will be addressed in Phases 2-4!

---

**You're all set! Start the dev server and begin building. 🚀**
