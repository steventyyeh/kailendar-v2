# Dream Calendar - MVP

AI-powered goal achievement platform that transforms long-term aspirations into actionable daily schedules.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Google OAuth)
- **Database**: Firebase Firestore
- **LLM Integration**: Mock Claude API (ready for Anthropic Claude integration)
- **Deployment**: Vercel (planned)

## 📋 Current Features (MVP Phase 1)

✅ Next.js project scaffolding with TypeScript
✅ Google OAuth authentication with NextAuth
✅ Firestore database integration (client & admin)
✅ Mock Claude API for goal plan generation
✅ `/api/goals/create` - Goal creation endpoint
✅ `/api/dashboard` - Dashboard data endpoint
✅ Reusable UI components (Navbar, Sidebar, Layout)
✅ Dashboard page with:
  - Today's tasks
  - Active goals overview
  - Weekly stats
  - Upcoming milestones
  - Recent resources

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Project (for OAuth)
- Firebase Project
- (Optional) Anthropic API key for real Claude integration

### 1. Clone and Install

```bash
cd kailendar-v2
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the required values:

#### NextAuth Setup

```bash
# Generate a secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-generated-secret>
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app to get configuration
4. Enable Firestore Database
5. Copy config values to `.env`

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

For server-side Firebase Admin (production):
- Download service account key JSON from Firebase Console > Project Settings > Service Accounts
- Stringify the JSON and add to `FIREBASE_SERVICE_ACCOUNT_KEY`

For local development, you can skip this and use Firebase emulators.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. (Optional) Use Firebase Emulators for Local Development

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators

# Run emulators
firebase emulators:start
```

## 📁 Project Structure

```
kailendar-v2/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   ├── goals/create/        # Goal creation API
│   │   └── dashboard/           # Dashboard data API
│   ├── auth/signin/             # Sign-in page
│   ├── dashboard/               # Dashboard page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx  # Dashboard wrapper
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── Sidebar.tsx          # Side navigation
│   └── ui/
│       ├── GoalCard.tsx         # Goal display card
│       └── TaskCard.tsx         # Task display card
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── claude/mock.ts           # Mock Claude API
│   ├── firebase/
│   │   ├── admin.ts             # Firebase Admin SDK
│   │   ├── config.ts            # Firebase client config
│   │   └── db.ts                # Database helpers
│   └── utils/                   # Utility functions
├── types/
│   ├── index.ts                 # TypeScript types
│   └── next-auth.d.ts           # NextAuth type extensions
└── public/                      # Static assets
```

## 🎯 Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Project scaffolding
- [x] Authentication
- [x] Database setup
- [x] Basic API endpoints
- [x] Dashboard UI

### Phase 2: Core Goal Flow (Next)
- [ ] Goal creation questionnaire UI
- [ ] Real Claude API integration
- [ ] Plan review/approval interface
- [ ] Google Calendar API integration
- [ ] Calendar event creation

### Phase 3: Dashboard & Tracking
- [ ] Progress tracking system
- [ ] Monthly regeneration logic
- [ ] Adjustment suggestions
- [ ] Resource recommendations
- [ ] Goal lifecycle management

### Phase 4: Polish & Monetization
- [ ] Stripe payment integration
- [ ] Error handling & validation
- [ ] Performance optimization
- [ ] Testing suite
- [ ] Production deployment

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out

### Goals
- `POST /api/goals/create` - Create a new goal
- `GET /api/goals/:goalId/plan` - Get goal plan (polling for LLM processing)
- `POST /api/goals/:goalId/approve` - Approve and activate goal plan

### Dashboard
- `GET /api/dashboard` - Get dashboard data (tasks, goals, stats)

## 🧪 Testing

```bash
# Run type checking
npm run build

# Lint code
npm run lint
```

## 📝 Notes

- **Mock Claude API**: Currently using mock data for LLM responses. Replace `lib/claude/mock.ts` with real Anthropic Claude API integration.
- **Firebase Admin**: For local development, Firebase Admin can work without service account if using emulators.
- **Google Calendar**: Not yet integrated. Will be added in Phase 2.
- **Payments**: Stripe integration planned for Phase 4.

## 🤝 Contributing

This is an MVP in active development. See `spec.md` for complete product requirements.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js and Claude Code
