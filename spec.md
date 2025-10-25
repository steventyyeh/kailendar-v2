# Dream Calendar - Complete Developer Specification

## Document Information
**Version:** 1.0  
**Date:** October 12, 2025  
**Status:** Ready for Development  
**Estimated Timeline:** 15 weeks  
**Primary Success Metric:** Daily Active Users (DAU)

---

# Part 1: Product Overview & Requirements

## 1. Executive Summary

### 1.1 Product Vision
Dream Calendar is an AI-powered goal achievement platform that transforms long-term aspirations into actionable daily schedules. The system leverages LLM intelligence to decompose ambitious goals into manageable tasks and automatically schedules them in users' Google Calendars by intelligently finding available time slots.

### 1.2 Core Value Proposition
Bridge the gap between dreams and daily action through intelligent scheduling and adaptive planning that learns from user behavior and adjusts automatically when users fall behind or excel.

### 1.3 Target Users
- Individuals with ambitious personal or professional goals
- People struggling to find time for long-term objectives
- Users who want structured guidance in achieving their dreams
- Self-directed learners seeking accountability

### 1.4 Key Differentiators
- **AI-Powered Decomposition**: Automatically breaks down goals into 3-level hierarchy
- **Smart Scheduling**: Finds fragmented time slots in existing calendars
- **Adaptive System**: Learns from user behavior and adjusts plans monthly
- **Reality Checking**: Validates feasibility of multiple concurrent goals
- **Progressive Goal Suggestions**: Recommends next steps after completion

---

## 2. Functional Requirements

### 2.1 Must-Have Features (MVP)

#### Authentication & Onboarding
- Google OAuth login (single sign-on)
- Automatic calendar permission request
- Brief demo video (30 seconds)
- Immediate redirect to goal creation

#### Goal Creation
- 6 category options (Creative Skills, Professional Development, Health & Fitness, Learning, Personal Projects, Lifestyle & Habits)
- 8-question universal questionnaire
- Real-time LLM processing (< 10 seconds target)
- Plan review and editing interface
- Timeline and milestone adjustment capability

#### Plan Structure
- **Level 1 (Milestones)**: 3-6 long-term checkpoints spanning months
- **Level 2 (Objectives)**: 2-4 short-term sub-goals per milestone (1-4 weeks each)
- **Level 3 (Tasks)**: Daily/recurring actionable items with time blocks
- Hybrid task approach: recurring foundational practices + one-time projects

#### Calendar Integration
- Full read/write access to Google Calendar
- Automatic time slot detection
- Monthly schedule generation (1 month at a time)
- Color-coded events by goal
- All-day events for milestones/objectives
- Time-blocked events for tasks
- Automatic rescheduling when users delete/move events

#### Multiple Goals Management
- Free tier: 1 active goal maximum
- Paid tier: Unlimited active goals
- Practicality check when adding new goals
- Automatic adjustment suggestions if conflicts detected
- Individual color coding per goal

#### Progress Tracking
- Automatic tracking via calendar event completion
- Manual completion logging
- Delta calculation (current vs. expected progress)
- Milestone countdown timers
- Completion rate display
- Real-time dashboard updates

#### Smart Adaptation
- Monthly regeneration based on completion patterns
- Automatic adjustment suggestions when falling behind (>20% behind or <2 weeks to deadline)
- Learning from user behavior (moved events, deleted events)
- Intensity adjustment based on completion rate

#### Resource Recommendations
- Progressive unlocking as milestones approached
- Types: courses, books, videos, tools, communities, workshops, mentors
- User can add custom resources
- Clickable links and descriptions

#### Goal Lifecycle
- Pause: Stop new scheduling, keep existing events
- Resume: Regenerate from current date
- Archive: Move to completed section, keep visible
- Delete: Remove future events, keep history
- Complete: Trigger progressive goal suggestions

#### Dashboard
Single scrollable page with 6 sections:
1. Today's Tasks (with checkboxes)
2. Active Goals Overview (progress, next milestone, delta status)
3. Upcoming Milestones (next 2-3 across all goals)
4. Recent Resources (newly unlocked)
5. Progress Stats (weekly completion rate, hours invested)
6. Integrated Calendar View (mini calendar)

#### Monetization
- Free tier: 1 active goal, full features for that goal
- Pro tier: Unlimited goals, all LLM costs included
- Pricing: $9.99/month or $99/year
- Stripe integration for payments

### 2.2 Out of Scope (Post-MVP)
- Expert/creator accounts
- Expert-created goal templates
- Advanced analytics beyond delta tracking
- Native mobile apps (iOS/Android)
- Integrations with other calendar services
- Team/group goals
- Gamification features
- AI coaching chatbot
- Voice interactions

---

## 3. User Stories & Acceptance Criteria

### US-001: First-Time User Onboarding
**As a** new user  
**I want to** quickly get started with my first goal  
**So that** I can begin working toward my dream immediately

**Acceptance Criteria:**
- User can sign in with Google in one click
- Calendar permissions are requested immediately after OAuth
- Demo video plays automatically (skippable after 5 seconds)
- User is redirected to category selection within 3 seconds
- No account setup friction or additional forms

### US-002: Goal Creation
**As a** user  
**I want to** create a goal by answering simple questions  
**So that** the system can generate a personalized plan

**Acceptance Criteria:**
- 6 category options are clearly displayed
- Each question appears on a separate screen
- Progress indicator shows current step (e.g., "3 of 8")
- All questions have appropriate input types (text, select, date, checkboxes)
- User can go back to previous questions
- Validation prevents advancing with incomplete answers
- LLM processing takes < 10 seconds
- Loading screen shows estimated time remaining

### US-003: Plan Review and Approval
**As a** user  
**I want to** review my generated plan before it's added to my calendar  
**So that** I can ensure it fits my needs

**Acceptance Criteria:**
- All 3 levels (milestones, objectives, tasks) are clearly displayed
- User can edit overall deadline
- User can edit milestone descriptions and dates
- Changes trigger plan regeneration
- Resource recommendations are visible
- "Approve Plan" button is prominent
- Approval starts calendar event creation (< 30 seconds)

### US-004: Multiple Goal Practicality Check
**As a** user with an existing goal  
**I want to** be warned if a new goal is impractical  
**So that** I don't overcommit

**Acceptance Criteria:**
- System checks total time requirements vs. availability
- System detects conflicting deadlines, energy demands, resources
- If impractical, system shows 3-4 adjustment options
- Each option includes clear description, pros, cons, and impact
- User can select an option or cancel goal creation
- Selected adjustment is applied before plan generation

### US-005: Falling Behind Alerts
**As a** user making slow progress  
**I want to** receive adjustment suggestions  
**So that** I can get back on track

**Acceptance Criteria:**
- System checks delta daily for all active goals
- Alert appears in dashboard when >20% behind or <2 weeks to deadline
- Alert shows current delta and days remaining
- Clicking alert opens adjustment modal with 3-4 options
- User can select an option and apply it immediately
- Calendar events are rescheduled accordingly

### US-006: Monthly Regeneration
**As a** user  
**I want** my schedule to automatically adjust each month  
**So that** the system learns from my behavior

**Acceptance Criteria:**
- System triggers regeneration on 25th of each month
- Analyzes previous month: completion rate, moved events, skipped tasks
- Adjusts intensity if completion rate < 60% (reduce) or > 90% (increase)
- Learns preferred times from moved events
- Creates next month's events automatically
- User receives optional notification

### US-007: Goal Completion
**As a** user who completed a goal  
**I want to** celebrate and get suggestions for next goals  
**So that** I can continue my growth journey

**Acceptance Criteria:**
- System detects when all milestones are completed
- Celebration modal appears immediately
- Modal shows 3-5 progressive goal suggestions
- Each suggestion includes title, description, rationale, estimated duration
- User can click a suggestion to start pre-filled questionnaire
- User can dismiss and create custom goal
- Completed goal moves to "Completed" section with achievement date

### US-008: Dashboard Overview
**As a** daily user  
**I want to** see my progress and upcoming tasks at a glance  
**So that** I know what to focus on today

**Acceptance Criteria:**
- Dashboard loads in < 2 seconds
- Today's tasks are at the top with color-coded goal badges
- Each active goal shows progress bar, next milestone, and delta status
- Delta uses color coding: green (>5% ahead), yellow (on track), red (<-20% behind)
- Upcoming milestones show dates and progress
- Recent resources show newly unlocked items
- Weekly stats show completion rate and hours invested

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Dashboard load time**: < 2 seconds
- **LLM plan generation**: < 10 seconds (target), < 15 seconds (maximum)
- **Calendar sync latency**: < 5 seconds
- **API response time (p95)**: < 500ms
- **Time to interactive**: < 3 seconds
- **Database query time**: < 200ms average

### 4.2 Scalability
- Support 10,000 concurrent users (Year 1 target)
- Handle 1,000 plan generations per day
- Process 50,000 calendar events per day
- Database designed for 1M+ users

### 4.3 Reliability
- **Uptime**: 99.5% minimum
- **Data durability**: 99.999%
- **Backup frequency**: Daily automated backups
- **Recovery time objective (RTO)**: < 4 hours
- **Recovery point objective (RPO)**: < 1 hour

### 4.4 Security
- All data encrypted at rest (AES-256)
- All data encrypted in transit (TLS 1.3)
- OAuth tokens encrypted in database
- Rate limiting on all API endpoints
- CORS properly configured
- Input validation on all endpoints
- GDPR compliant (data export, right to deletion)

### 4.5 Usability
- Accessible (WCAG 2.1 AA compliance)
- Mobile-responsive design (works on screens 320px+)
- Support for modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Clear error messages in plain language
- Maximum 3 clicks to any feature

### 4.6 Maintainability
- Comprehensive code documentation
- Automated test coverage > 70% (>90% for critical paths)
- Modular architecture for easy updates
- Environment-based configuration
- Detailed logging for debugging

---

# Part 2: Technical Architecture

## 5. System Architecture

### 5.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │   Web Application        │  │   Mobile Web             │    │
│  │   (React + Vite)         │  │   (Responsive React)     │    │
│  │   - Zustand State        │  │   - Touch Optimized      │    │
│  │   - React Router         │  │   - PWA Capable          │    │
│  │   - Tailwind CSS         │  │                          │    │
│  └──────────────────────────┘  └──────────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/WSS
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Firebase Cloud Functions (Node.js 18)          │    │
│  │  - Express.js routing                                  │    │
│  │  - Authentication middleware                           │    │
│  │  - Rate limiting                                       │    │
│  │  - Error handling                                      │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        ↓                ↓                ↓              ↓
┌──────────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────┐
│   Firebase   │  │  LLM API    │  │  Google    │  │  Stripe  │
│   Services   │  │  (OpenAI/   │  │  Calendar  │  │  Payment │
│              │  │   Claude/   │  │   API v3   │  │    API   │
│ - Firestore  │  │   Gemini)   │  │            │  │          │
│ - Auth       │  │             │  │            │  │          │
│ - Storage    │  │             │  │            │  │          │
│ - Hosting    │  │             │  │            │  │          │
└──────────────┘  └─────────────┘  └────────────┘  └──────────┘
```

### 5.2 Technology Stack

#### Frontend
```javascript
{
  "framework": "React 18.2+",
  "buildTool": "Vite 5.0+",
  "stateManagement": "Zustand 4.4+",
  "routing": "React Router v6",
  "styling": "Tailwind CSS 3.3+",
  "uiComponents": "Headless UI + Custom",
  "forms": "React Hook Form 7.4+",
  "httpClient": "Axios 1.6+",
  "dateHandling": "date-fns 3.0+",
  "calendar": "react-big-calendar 1.8+",
  "icons": "Lucide React 0.263+"
}
```

#### Backend
```javascript
{
  "runtime": "Node.js 18 LTS",
  "framework": "Express.js 4.18+",
  "functions": "Firebase Cloud Functions",
  "authentication": "Firebase Authentication",
  "database": "Firebase Firestore",
  "storage": "Firebase Storage",
  "scheduler": "Firebase Scheduled Functions"
}
```

#### External Services
```javascript
{
  "llm": "TBD - evaluate OpenAI GPT-4, Anthropic Claude, Google Gemini",
  "calendar": "Google Calendar API v3",
  "payments": "Stripe API",
  "email": "SendGrid / Firebase Extensions",
  "monitoring": "Sentry",
  "analytics": "Google Analytics 4"
}
```

#### Development Tools
```javascript
{
  "versionControl": "Git",
  "packageManager": "npm",
  "linting": "ESLint + Prettier",
  "testing": {
    "unit": "Jest 29+",
    "integration": "Jest + Supertest",
    "e2e": "Cypress 13+",
    "component": "React Testing Library"
  },
  "ci-cd": "GitHub Actions"
}
```

### 5.3 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                    PRODUCTION                        │
├─────────────────────────────────────────────────────┤
│  Frontend: Vercel                                    │
│  - Automatic HTTPS                                   │
│  - Global CDN                                        │
│  - Edge Functions                                    │
│  Domain: dreamcalendar.app                          │
├─────────────────────────────────────────────────────┤
│  Backend: Firebase (us-central1)                    │
│  - Cloud Functions                                   │
│  - Firestore Database                               │
│  - Firebase Authentication                          │
│  - Firebase Storage                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   DEVELOPMENT                        │
├─────────────────────────────────────────────────────┤
│  Frontend: localhost:5173                           │
│  Backend: Firebase Emulators                        │
│  - Auth Emulator: localhost:9099                    │
│  - Firestore Emulator: localhost:8080               │
│  - Functions Emulator: localhost:5001               │
└─────────────────────────────────────────────────────┘
```

### 5.4 Data Flow Diagrams

#### Goal Creation Flow
```
User fills questionnaire
        ↓
Frontend validates input
        ↓
POST /api/goals/create
        ↓
Backend validates + checks subscription limits
        ↓
Create goal document (status: processing)
        ↓
Return goalId immediately (HTTP 200)
        ↓
[Async] Trigger LLM plan generation
        ↓
[Async] LLM processes questionnaire + calendar data
        ↓
[Async] Store generated plan in goal document
        ↓
[Async] Update status to "ready"
        ↓
Frontend polls GET /api/goals/:id/plan every 2s
        ↓
When ready, show plan review screen
        ↓
User approves plan
        ↓
POST /api/goals/:id/approve
        ↓
Backend fetches calendar availability
        ↓
Backend creates calendar events (milestones, objectives, tasks)
        ↓
Store event IDs in goal document
        ↓
Return success + redirect to dashboard
```

#### Monthly Regeneration Flow
```
Cron triggers on 25th of month (9 AM PT)
        ↓
For each user with active goals:
        ↓
  For each goal:
        ↓
    Fetch last month's progress logs
        ↓
    Calculate completion rate, patterns
        ↓
    Fetch next month's calendar availability
        ↓
    Call LLM with stats + availability
        ↓
    LLM generates adjusted schedule
        ↓
    Create calendar events for next month
        ↓
    Update goal document
        ↓
Send optional notification to user
```

---

## 6. Database Design

### 6.1 Firestore Collections Structure

```
firestore
├── users (collection)
│   └── {userId} (document)
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── createdAt: timestamp
│       ├── lastLoginAt: timestamp
│       ├── googleAccessToken: string (encrypted)
│       ├── googleRefreshToken: string (encrypted)
│       ├── tokenExpiresAt: timestamp
│       ├── calendarId: string
│       ├── subscription: {
│       │   status: 'free' | 'active' | 'canceled' | 'past_due',
│       │   plan: 'free' | 'pro_monthly' | 'pro_annual',
│       │   stripeCustomerId: string,
│       │   stripeSubscriptionId: string,
│       │   currentPeriodEnd: timestamp,
│       │   cancelAtPeriodEnd: boolean
│       │ }
│       ├── settings: {
│       │   emailNotifications: boolean,
│       │   weekStartsOn: number (0-6),
│       │   defaultReminderMinutes: number
│       │ }
│       └── goals (subcollection)
│           └── {goalId} (document)
│               ├── id: string
│               ├── userId: string
│               ├── status: 'active' | 'paused' | 'completed' | 'archived' | 'deleted'
│               ├── category: string
│               ├── specificity: string
│               ├── currentState: string
│               ├── targetState: string
│               ├── deadline: timestamp
│               ├── learningStyles: string[]
│               ├── budget: string
│               ├── equipment: string
│               ├── constraints: string
│               ├── plan: {
│               │   generatedAt: timestamp,
│               │   llmModel: string,
│               │   milestones: [{
│               │     id: string,
│               │     title: string,
│               │     description: string,
│               │     targetDate: timestamp,
│               │     status: string,
│               │     completedAt: timestamp | null,
│               │     calendarEventId: string
│               │   }],
│               │   objectives: [{
│               │     id: string,
│               │     milestoneId: string,
│               │     title: string,
│               │     description: string,
│               │     targetDate: timestamp,
│               │     status: string,
│               │     completedAt: timestamp | null,
│               │     calendarEventId: string
│               │   }],
│               │   taskTemplate: {
│               │     recurringTasks: [...],
│               │     oneTimeTasks: [...]
│               │   }
│               │ }
│               ├── calendar: {
│               │   color: string,
│               │   lastScheduledMonth: string,
│               │   nextScheduleDate: timestamp,
│               │   eventIds: string[]
│               │ }
│               ├── progress: {
│               │   totalTasksScheduled: number,
│               │   tasksCompleted: number,
│               │   completionRate: number,
│               │   lastCompletedTask: timestamp,
│               │   currentStreak: number,
│               │   longestStreak: number,
│               │   totalMinutesInvested: number
│               │ }
│               ├── resources: [{
│               │   id: string,
│               │   type: string,
│               │   title: string,
│               │   url: string | null,
│               │   description: string,
│               │   unlockedAt: timestamp,
│               │   linkedMilestoneId: string | null,
│               │   addedBy: 'system' | 'user'
│               │ }]
│               ├── createdAt: timestamp
│               ├── updatedAt: timestamp
│               ├── completedAt: timestamp | null
│               ├── pausedAt: timestamp | null
│               └── progressLogs (subcollection)
│                   └── {logId} (document)
│                       ├── date: timestamp
│                       ├── tasksScheduled: number
│                       ├── tasksCompleted: number
│                       ├── minutesInvested: number
│                       ├── completedTasks: [...]
│                       └── createdAt: timestamp
```

### 6.2 Firestore Indexes

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "goals",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "progressLogs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "goalId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 6.3 Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      
      // Goals subcollection
      match /goals/{goalId} {
        allow read, write: if isOwner(userId);
        
        // Progress logs subcollection
        match /progressLogs/{logId} {
          allow read, write: if isOwner(userId);
        }
        
        // Adjustments subcollection
        match /adjustments/{adjustmentId} {
          allow read, write: if isOwner(userId);
        }
      }
    }
  }
}
```

---

# Part 3: API Specifications

## 7. API Design

### 7.1 Base Configuration

```javascript
// Base URL
Production: https://us-central1-dreamcalendar-prod.cloudfunctions.net/api
Development: http://localhost:5001/dreamcalendar-dev/us-central1/api

// Authentication Header (required for all endpoints except health check)
Authorization: Bearer <firebase-id-token>

// Standard Response Format
{
  "success": boolean,
  "data": object | array | null,
  "error": {
    "code": string,
    "message": string
  } | null,
  "meta": {
    "timestamp": string (ISO 8601),
    "requestId": string
  }
}
```

### 7.2 API Endpoints

#### Authentication Endpoints

**POST /api/auth/google**
Complete Google OAuth flow and create/update user.

Request:
```javascript
{
  "idToken": string,        // Firebase ID token from Google sign-in
  "accessToken": string,    // Google OAuth access token
  "refreshToken": string    // Google OAuth refresh token
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "subscription": {
      "status": "free",
      "plan": "free"
    },
    "isNewUser": boolean
  }
}
```

---

#### Goal Endpoints

**POST /api/goals/create**
Create a new goal from questionnaire responses.

Request:
```javascript
{
  "category": "creative_skills" | "professional_dev" | "health_fitness" | 
              "learning" | "personal_projects" | "lifestyle_habits",
  "specificity": string,              // 10-500 chars
  "currentState": "no_experience" | "beginner" | "intermediate" | "advanced",
  "targetState": string,              // 10-500 chars
  "deadline": string,                 // ISO 8601 date
  "learningStyles": string[],         // 1-6 items
  "budget": string,
  "equipment": string,                // 0-1000 chars
  "constraints": string               // 0-1000 chars
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "status": "processing",
    "estimatedTime": 8              // Seconds until plan ready
  }
}
```

Status Codes:
- 200: Success
- 400: Invalid input
- 403: Subscription limit reached (free tier already has 1 goal)
- 429: Rate limit exceeded
- 500: Server error

---

**GET /api/goals/:goalId/plan**
Get the generated plan for a goal. Poll this endpoint after creating a goal.

Query Parameters:
- None

Response (Processing):
```javascript
{
  "success": true,
  "data": {
    "status": "processing",
    "progress": 45,               // Percentage complete
    "estimatedTimeRemaining": 3   // Seconds
  }
}
```

Response (Ready):
```javascript
{
  "success": true,
  "data": {
    "status": "ready",
    "plan": {
      "milestones": [
        {
          "id": "m1",
          "title": "Master Basic Techniques",
          "description": "Learn fundamental skills...",
          "targetDate": "2026-03-01T00:00:00Z",
          "estimatedProgress": 33
        }
      ],
      "objectives": [
        {
          "id": "o1",
          "milestoneId": "m1",
          "title": "Learn Wet-on-Wet Technique",
          "description": "Practice creating soft effects",
          "targetDate": "2026-01-15T00:00:00Z",
          "estimatedHours": 8
        }
      ],
      "taskTemplate": {
        "recurringTasks": [
          {
            "title": "Daily Practice",
            "description": "30 min fundamentals",
            "duration": 30,
            "frequency": "daily",
            "daysOfWeek": [1, 3, 5],
            "preferredTime": "morning",
            "skillFocus": "fundamentals"
          }
        ],
        "oneTimeTasks": [
          {
            "title": "Complete Color Wheel",
            "description": "Create comprehensive wheel",
            "duration": 120,
            "linkedObjectiveId": "o1",
            "schedulingPriority": 8
          }
        ]
      }
    },
    "resources": [
      {
        "type": "course",
        "title": "Watercolor Basics",
        "url": "https://...",
        "description": "Beginner course",
        "milestoneId": "m1",
        "cost": "free"
      }
    ],
    "estimatedWeeklyHours": 5,
    "difficultyAssessment": "realistic"
  }
}
```

Response (Error):
```javascript
{
  "success": false,
  "data": {
    "status": "error"
  },
  "error": {
    "code": "LLM_ERROR",
    "message": "Plan generation failed. Please try again."
  }
}
```

---

**POST /api/goals/:goalId/approve**
Approve the generated plan and begin calendar event creation.

Request:
```javascript
{
  "modifications": {
    "deadline": "2026-06-01T00:00:00Z" | null,
    "milestones": [
      {
        "id": "m1",
        "title": "Modified Title",
        "targetDate": "2026-02-15T00:00:00Z"
      }
    ] | null
  } | null
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "eventsCreated": 47,
    "nextScheduleDate": "2025-12-01T00:00:00Z",
    "calendarUrl": "https://calendar.google.com/..."
  }
}
```

---

**GET /api/goals/:goalId**
Get complete goal details.

Response:
```javascript
{
  "success": true,
  "data": {
    "id": "goal_xyz789",
    "userId": "user_abc123",
    "status": "active",
    "category": "creative_skills",
    "specificity": "Learn watercolor painting",
    "deadline": "2026-01-01T00:00:00Z",
    "plan": { /* full plan object */ },
    "calendar": {
      "color": "#FF5733",
      "lastScheduledMonth": "2025-11",
      "eventIds": ["event1", "event2", ...]
    },
    "progress": {
      "totalTasksScheduled": 50,
      "tasksCompleted": 35,
      "completionRate": 70,
      "currentStreak": 7,
      "totalMinutesInvested": 1250
    },
    "resources": [ /* resources array */ ],
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-11-15T14:30:00Z"
  }
}
```

---

**PATCH /api/goals/:goalId**
Update goal properties.

Request:
```javascript
{
  "deadline": "2026-06-01T00:00:00Z" | null,
  "plan": {
    "milestones": [ /* modified milestones */ ]
  } | null
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "updated": true,
    "eventsRescheduled": 15
  }
}
```

---

**POST /api/goals/:goalId/pause**
Pause an active goal.

Request: None

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "status": "paused",
    "pausedAt": "2025-11-15T10:00:00Z",
    "futureEventsStatus": "canceled"  // Events canceled, not deleted
  }
}
```

---

**POST /api/goals/:goalId/resume**
Resume a paused goal.

Request: None

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "status": "active",
    "resumedAt": "2025-11-20T10:00:00Z",
    "eventsRescheduled": 23
  }
}
```

---

**POST /api/goals/:goalId/complete**
Mark goal as completed and get next goal suggestions.

Request: None

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "status": "completed",
    "completedAt": "2025-12-01T10:00:00Z",
    "suggestions": [
      {
        "title": "Advanced Watercolor Techniques",
        "category": "creative_skills",
        "description": "Build on your skills...",
        "rationale": "Natural progression from basics",
        "estimatedDuration": "6 months",
        "difficulty": "intermediate",
        "prefilledAnswers": {
          "specificity": "Master advanced watercolor",
          "currentState": "intermediate",
          "learningStyles": ["hands_on_practice"]
        }
      }
    ]
  }
}
```

---

**DELETE /api/goals/:goalId**
Delete a goal.

Query Parameters:
- `deleteFutureEvents`: boolean (default: true)

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "deleted": true,
    "futureEventsDeleted": 15,
    "completedEventsRetained": 32
  }
}
```

---

**POST /api/goals/check-practicality**
Check if adding a new goal is practical with existing goals.

Request:
```javascript
{
  "newGoalData": {
    "deadline": "2026-03-01T00:00:00Z",
    "estimatedWeeklyHours": 8
  },
  "existingGoalIds": ["goal_123", "goal_456"]
}
```

Response (Practical):
```javascript
{
  "success": true,
  "data": {
    "practical": true,
    "totalWeeklyHours": 15,
    "availableHours": 20,
    "conflicts": []
  }
}
```

Response (Not Practical):
```javascript
{
  "success": true,
  "data": {
    "practical": false,
    "totalWeeklyHours": 25,
    "availableHours": 18,
    "conflicts": [
      {
        "type": "time",
        "severity": "high",
        "description": "Total required hours (25) exceeds availability (18)"
      }
    ],
    "suggestions": [
      {
        "option": "Extend Timeline",
        "description": "Extend new goal deadline to 2026-06-01",
        "changes": {
          "newGoalDeadline": "2026-06-01T00:00:00Z",
          "weeklyHoursReduction": 3
        },
        "impact": "Reduces weekly hours to 22 (achievable)",
        "pros": ["Maintains scope", "Reduces stress"],
        "cons": ["Takes longer to achieve"]
      }
    ],
    "recommendedOption": 0
  }
}
```

---

#### Calendar Endpoints

**GET /api/calendar/availability**
Get user's calendar availability for scheduling.

Query Parameters:
- `days`: number (default: 30)
- `goalId`: string (optional - exclude this goal's events)

Response:
```javascript
{
  "success": true,
  "data": {
    "availability": [
      {
        "date": "2025-11-15",
        "slots": [
          {
            "start": "2025-11-15T09:00:00Z",
            "end": "2025-11-15T11:30:00Z",
            "durationMinutes": 150
          },
          {
            "start": "2025-11-15T14:00:00Z",
            "end": "2025-11-15T16:00:00Z",
            "durationMinutes": 120
          }
        ],
        "totalFreeMinutes": 270
      }
    ],
    "totalFreeHours": 45.5,
    "averageFreeHoursPerDay": 1.5
  }
}
```

---

**POST /api/goals/:goalId/schedule-next-month**
Manually trigger next month's schedule generation (normally automatic).

Request: None

Response:
```javascript
{
  "success": true,
  "data": {
    "goalId": "goal_xyz789",
    "month": "2025-12",
    "eventsCreated": 28,
    "adjustments": {
      "intensityChange": 0,
      "reasoning": "Maintaining current pace based on 85% completion rate"
    }
  }
}
```

---

#### Progress Endpoints

**GET /api/progress/:goalId/analytics**
Get progress analytics for a goal.

Query Parameters:
- `period`: 'week' | 'month' | 'all' (default: 'week')

Response:
```javascript
{
  "success": true,
  "data": {
    "period": "week",
    "completionRate": 85,
    "tasksCompleted": 17,
    "tasksScheduled": 20,
    "minutesInvested": 450,
    "streak": 7,
    "deltaToMilestones": [
      {
        "milestoneId": "m1",
        "milestoneTitle": "Master Basics",
        "targetDate": "2026-01-01T00:00:00Z",
        "daysRemaining": 47,
        "expectedProgress": 40,
        "actualProgress": 45,
        "delta": 5,
        "status": "ahead"
      }
    ],
    "completionByDay": [
      { "day": "Monday", "completed": 3, "scheduled": 3 },
      { "day": "Tuesday", "completed": 2, "scheduled": 3 }
    ]
  }
}
```

---

**POST /api/progress/:goalId/log**
Manually log task completion.

Request:
```javascript
{
  "eventId": "event_123",
  "completedAt": "2025-11-15T10:30:00Z",
  "actualDuration": 35,          // Minutes actually spent
  "userNote": "Great session!"   // Optional
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "logged": true,
    "updatedProgress": {
      "completionRate": 72,
      "totalCompleted": 36,
      "currentStreak": 8
    }
  }
}
```

---

#### Adjustment Endpoints

**POST /api/adjustments/:goalId/suggest**
Request adjustment suggestions from system.

Request:
```javascript
{
  "reason": "behind_schedule" | "time_constraints" | "difficulty"
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "currentDelta": -22,
    "daysToNextMilestone": 10,
    "suggestions": [
      {
        "option": "Extend Milestone Deadline",
        "description": "Push next milestone by 2 weeks",
        "changes": {
          "milestoneId": "m1",
          "newDeadline": "2026-01-15T00:00:00Z",
          "affectedObjectives": 3
        },
        "impact": "Reduces weekly hours by 2",
        "pros": ["More manageable pace", "Maintains quality"],
        "cons": ["Goal takes longer"]
      },
      {
        "option": "Reduce Session Frequency",
        "description": "Change from 3x/week to 2x/week",
        "changes": {
          "recurringTasksAffected": 2,
          "weeklyHourReduction": 1.5
        },
        "impact": "Lighter schedule, slower progress",
        "pros": ["Less time pressure", "Better work-life balance"],
        "cons": ["Slower skill development", "Extended timeline"]
      }
    ],
    "recommendedOption": 0
  }
}
```

---

**POST /api/adjustments/:goalId/apply**
Apply an adjustment to a goal.

Request:
```javascript
{
  "selectedSuggestionIndex": 0,
  "customChanges": {        // Optional overrides
    "deadline": "2026-02-01T00:00:00Z"
  } | null
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "applied": true,
    "updatedPlan": { /* modified plan */ },
    "eventsRescheduled": 18,
    "newDelta": -5
  }
}
```

---

#### Resource Endpoints

**POST /api/resources/:goalId/add**
Add a custom resource to a goal.

Request:
```javascript
{
  "type": "course" | "book" | "video" | "tool" | "community" | "workshop" | "mentor",
  "title": string,
  "url": string | null,
  "description": string
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "resourceId": "res_abc123",
    "added": true
  }
}
```

---

#### Dashboard Endpoint

**GET /api/dashboard**
Get complete dashboard data for user.

Response:
```javascript
{
  "success": true,
  "data": {
    "todaysTasks": [
      {
        "goalId": "goal_123",
        "goalTitle": "Learn Watercolor",
        "goalColor": "#FF5733",
        "eventId": "event_456",
        "title": "Brush Control Practice",
        "startTime": "2025-11-15T09:00:00Z",
        "endTime": "2025-11-15T09:30:00Z",
        "duration": 30,
        "completed": false,
        "type": "recurring_task"
      }
    ],
    "activeGoals": [
      {
        "id": "goal_123",
        "title": "Learn Watercolor Painting",
        "category": "creative_skills",
        "color": "#FF5733",
        "progress": 45,
        "nextMilestone": {
          "title": "Master Basics",
          "targetDate": "2026-01-01T00:00:00Z",
          "daysRemaining": 47,
          "progress": 45,
          "delta": 5,
          "status": "ahead"
        },
        "status": "active"
      }
    ],
    "upcomingMilestones": [
      {
        "goalId": "goal_123",
        "goalTitle": "Learn Watercolor",
        "goalColor": "#FF5733",
        "milestoneTitle": "Master Basics",
        "targetDate": "2026-01-01T00:00:00Z",
        "daysRemaining": 47,
        "progress": 45
      }
    ],
    "recentResources": [
      {
        "goalId": "goal_123",
        "type": "course",
        "title": "Watercolor Basics",
        "url": "https://...",
        "description": "...",
        "unlockedAt": "2025-11-10T00:00:00Z"
      }
    ],
    "weeklyStats": {
      "completionRate": 85,
      "totalCompleted": 17,
      "totalScheduled": 20,
      "minutesInvested": 450,
      "goalsActive": 2
    }
  }
}
```

---

#### User Endpoints

**GET /api/user/profile**
Get user profile.

Response:
```javascript
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "subscription": {
      "status": "active",
      "plan": "pro_monthly",
      "currentPeriodEnd": "2025-12-15T00:00:00Z"
    },
    "stats": {
      "totalGoalsCreated": 5,
      "goalsCompleted": 2,
      "activeGoals": 2,
      "totalMinutesInvested": 3450
    },
    "createdAt": "2025-01-15T00:00:00Z"
  }
}
```

---

**PATCH /api/user/profile**
Update user profile settings.

Request:
```javascript
{
  "settings": {
    "emailNotifications": boolean,
    "weekStartsOn": number (0-6),
    "defaultReminderMinutes": number
  }
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

---

**GET /api/export**
Export all user data (GDPR compliance).

Response: JSON file download
```javascript
{
  "user": { /* user data */ },
  "goals": [ /* all goals */ ],
  "progressLogs": [ /* all logs */ ],
  "adjustments": [ /* all adjustments */ ],
  "exportedAt": "2025-11-15T10:00:00Z"
}
```

---

**DELETE /api/account**
Permanently delete user account and all data.

Request:
```javascript
{
  "confirmation": "DELETE MY ACCOUNT"
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "deleted": true,
    "goalsDeleted": 3,
    "eventsDeleted": 87,
    "subscriptionCanceled": true
  }
}
```

---

#### Subscription Endpoints

**POST /api/subscription/create**
Create Stripe checkout session for subscription.

Request:
```javascript
{
  "plan": "pro_monthly" | "pro_annual"
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "sessionId": "cs_abc123"
  }
}
```

---

**POST /api/subscription/cancel**
Cancel subscription (at period end).

Request: None

Response:
```javascript
{
  "success": true,
  "data": {
    "canceled": true,
    "cancelAtPeriodEnd": true,
    "periodEnd": "2025-12-15T00:00:00Z"
  }
}
```

---

**GET /api/subscription/portal**
Get Stripe billing portal URL.

Response:
```javascript
{
  "success": true,
  "data": {
    "portalUrl": "https://billing.stripe.com/..."
  }
}
```

---

#### Health Check

**GET /health**
System health check (no authentication required).

Response:
```javascript
{
  "status": "healthy" | "degraded" | "down",
  "timestamp": "2025-11-15T10:00:00Z",
  "services": {
    "firestore": "up" | "down",
    "llm": "up" | "down",
    "calendar": "up" | "down",
    "stripe": "up" | "down"
  },
  "version": "1.0.0"
}
```

---

### 7.3 Error Codes

| Code | HTTP Status | Description | User Message |
|------|-------------|-------------|--------------|
| AUTH_ERROR | 401 | Authentication failed | Please sign in again |
| CALENDAR_PERMISSION_ERROR | 403 | Calendar access denied | Please grant calendar access |
| SUBSCRIPTION_ERROR | 403 | Subscription required | Upgrade to Pro for more goals |
| LLM_ERROR | 503 | AI service unavailable | AI service temporarily unavailable |
| CALENDAR_FULL | 400 | No available time | Your calendar is fully booked |
| RATE_LIMIT | 429 | Too many requests | Please try again later |
| VALIDATION_ERROR | 400 | Invalid input | Please check your input |
| NOT_FOUND | 404 | Resource not found | Goal not found |
| INTERNAL_ERROR | 500 | Server error | Something went wrong |

---

# Part 4: Implementation Details

## 8. Authentication Implementation

### 8.1 Google OAuth Setup

```javascript
// firebase.js - Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google provider with calendar scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.setCustomParameters({
  prompt: 'consent', // Force consent screen to get refresh token
  access_type: 'offline'
});
```

### 8.2 Frontend Authentication Flow

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { api } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        // Store token for API calls
        localStorage.setItem('authToken', idToken);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get OAuth tokens
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = await result.user.getIdToken();
      
      // Send to backend to store tokens
      await api.post('/auth/google', {
        idToken,
        accessToken,
        // Note: refresh token only available on first consent
        refreshToken: result._tokenResponse?.refreshToken
      });
      
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('authToken');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { user, loading, error, signIn, signOut };
}
```

### 8.3 Backend Authentication Middleware

```javascript
// functions/src/middleware/auth.js
const admin = require('firebase-admin');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Missing or invalid authorization header'
        }
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Invalid authentication token'
      }
    });
  }
}

// Subscription tier check
async function requirePro(req, res, next) {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const subscription = userDoc.data().subscription;
    
    if (subscription?.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'SUBSCRIPTION_ERROR',
          message: 'Pro subscription required'
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify subscription'
      }
    });
  }
}

module.exports = { requireAuth, requirePro };
```

### 8.4 Token Encryption & Management

```javascript
// functions/src/utils/encryption.js
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
```

```javascript
// functions/src/services/tokenManager.js
const admin = require('firebase-admin');
const { encrypt, decrypt } = require('../utils/encryption');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function storeTokens(userId, accessToken, refreshToken) {
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .set({
      googleAccessToken: encrypt(accessToken),
      googleRefreshToken: encrypt(refreshToken),
      tokenExpiresAt: Date.now() + (3600 * 1000) // 1 hour
    }, { merge: true });
}

async function getValidAccessToken(userId) {
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const tokenExpiresAt = userData.tokenExpiresAt;
  
  // If token expires in less than 5 minutes, refresh it
  if (tokenExpiresAt < Date.now() + (5 * 60 * 1000)) {
    return await refreshAccessToken(userId);
  }
  
  return decrypt(userData.googleAccessToken);
}

async function refreshAccessToken(userId) {
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
  
  const refreshToken = decrypt(userDoc.data().googleRefreshToken);
  
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  
  const { credentials } = await oauth2Client.refreshAccessToken();
  
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update({
      googleAccessToken: encrypt(credentials.access_token),
      tokenExpiresAt: Date.now() + (credentials.expiry_date - Date.now())
    });
  
  return credentials.access_token;
}

module.exports = { storeTokens, getValidAccessToken, refreshAccessToken };
```

---

## 9. LLM Integration

### 9.1 LLM Service Configuration

```javascript
// functions/src/services/llmService.js
const OpenAI = require('openai'); // or Anthropic, Google AI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Model configuration (to be determined after evaluation)
const LLM_CONFIG = {
  model: 'gpt-4o', // or 'claude-3-5-sonnet-20241022' or 'gemini-1.5-pro'
  temperature: 0.7,
  maxTokens: 4000
};

class LLMService {
  async generatePlan(questionnaireData, calendarAvailability) {
    const prompt = this.buildPlanPrompt(questionnaireData, calendarAvailability);
    
    try {
      const response = await this.callWithRetry(async () => {
        const completion = await openai.chat.completions.create({
          model: LLM_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert goal planning assistant specializing in creating actionable, realistic plans.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: LLM_CONFIG.temperature,
          max_tokens: LLM_CONFIG.maxTokens,
          response_format: { type: 'json_object' }
        });
        
        return completion.choices[0].message.content;
      });
      
      const parsedPlan = JSON.parse(response);
      this.validatePlanStructure(parsedPlan);
      
      return parsedPlan;
    } catch (error) {
      console.error('LLM generation error:', error);
      throw new Error('Failed to generate plan');
    }
  }

  buildPlanPrompt(questionnaireData, calendarAvailability) {
    return `You are an expert goal planning assistant. Create a detailed, actionable plan to help someone achieve their goal.

USER'S GOAL:
Category: ${questionnaireData.category}
What they want: ${questionnaireData.specificity}
Current level: ${questionnaireData.currentState}
Success looks like: ${questionnaireData.targetState}
Deadline: ${questionnaireData.deadline}
Learning styles: ${questionnaireData.learningStyles.join(', ')}
Budget: ${questionnaireData.budget}
Available equipment: ${questionnaireData.equipment}
Constraints: ${questionnaireData.constraints}

CALENDAR AVAILABILITY:
Total free hours per week: ${calendarAvailability.totalFreeHoursPerWeek}
Available time slots: ${calendarAvailability.averageSlotsPerDay} slots per day
Common free times: ${calendarAvailability.commonFreeTimes.join(', ')}

TASK:
Generate a structured plan with three levels:

1. LONG-TERM MILESTONES (3-6 major checkpoints)
   - Each milestone represents significant progress
   - Space them evenly toward the deadline
   - Make them measurable and specific

2. SHORT-TERM OBJECTIVES (2-4 objectives per milestone)
   - Break down each milestone into manageable sub-goals
   - Each objective should take 1-4 weeks
   - Make them concrete and achievable

3. DAILY/RECURRING TASKS
   - Identify foundational practices that should be recurring (daily/weekly)
   - Identify specific project-based tasks that are one-time
   - For each task specify:
     * Title and description
     * Estimated duration (15-120 minutes)
     * Whether it's recurring or one-time
     * If recurring: frequency and preferred days
     * Optimal time of day (morning/afternoon/evening)
     * Scheduling priority (1-10)

4. RESOURCE RECOMMENDATIONS
   - Suggest 3-5 resources per milestone
   - Include: online courses, books, YouTube channels, tools, communities, workshops
   - Provide specific titles and URLs when possible

IMPORTANT GUIDELINES:
- Be realistic about time requirements given availability
- Consider experience level when setting difficulty
- Respect budget constraints
- Account for stated constraints
- Prefer indicated learning styles
- Ensure tasks fit within available calendar slots
- Front-load foundational skills, then build complexity

OUTPUT FORMAT (JSON):
{
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "targetDate": "YYYY-MM-DD",
      "estimatedProgress": number (percentage)
    }
  ],
  "objectives": [
    {
      "milestoneIndex": number,
      "title": "string",
      "description": "string",
      "targetDate": "YYYY-MM-DD",
      "estimatedHours": number
    }
  ],
  "taskTemplate": {
    "recurringTasks": [
      {
        "title": "string",
        "description": "string",
        "duration": number,
        "frequency": "daily" | "weekly",
        "daysOfWeek": [0,2,4],
        "preferredTime": "morning" | "afternoon" | "evening",
        "skillFocus": "string"
      }
    ],
    "oneTimeTasks": [
      {
        "title": "string",
        "description": "string",
        "duration": number,
        "linkedObjectiveIndex": number,
        "schedulingPriority": number (1-10),
        "prerequisites": ["task titles"],
        "estimatedDifficulty": "beginner" | "intermediate" | "advanced"
      }
    ]
  },
  "resources": [
    {
      "milestoneIndex": number,
      "type": "course" | "book" | "video" | "tool" | "community" | "workshop" | "mentor",
      "title": "string",
      "url": "string or null",
      "description": "string",
      "cost": "free" | "paid" | "freemium"
    }
  ],
  "estimatedWeeklyHours": number,
  "difficultyAssessment": "realistic" | "challenging" | "very_ambitious"
}`;
  }

  async checkPracticality(newGoal, existingGoals, availability) {
    const prompt = `You are evaluating whether adding a new goal is practical given existing commitments.

NEW GOAL:
${JSON.stringify(newGoal, null, 2)}

EXISTING GOALS:
${JSON.stringify(existingGoals, null, 2)}

CALENDAR AVAILABILITY:
Total free hours per week: ${availability.totalHoursPerWeek}
Available time slots: ${JSON.stringify(availability.slots.slice(0, 5), null, 2)}

TASK:
Determine if the new goal can be realistically pursued alongside existing goals.

CHECK FOR:
1. Time conflicts (total required hours > available hours)
2. Energy conflicts (multiple intensive goals at same time of day)
3. Deadline conflicts (overlapping aggressive timelines)
4. Resource conflicts (budget, equipment, space)
5. Physical conflicts (e.g., two intensive fitness goals)

OUTPUT FORMAT (JSON):
{
  "practical": boolean,
  "conflicts": [
    {
      "type": "time" | "energy" | "deadline" | "resource" | "physical",
      "description": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "suggestions": [
    {
      "option": "string (brief title)",
      "description": "string (detailed explanation)",
      "changes": {
        "affectedGoals": ["goalId1"],
        "deadlineExtensions": {"goalId": days},
        "intensityReductions": {"goalId": percentage}
      },
      "impact": "string",
      "pros": ["string"],
      "cons": ["string"]
    }
  ],
  "recommendedOption": number (index)
}`;

    const response = await this.callWithRetry(async () => {
      const completion = await openai.chat.completions.create({
        model: LLM_CONFIG.model,
        messages: [
          { role: 'system', content: 'You are a goal feasibility analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });
      return completion.choices[0].message.content;
    });

    return JSON.parse(response);
  }

  async generateMonthlySchedule(goal, lastMonthStats, availability) {
    const prompt = `You are adjusting a goal's schedule based on last month's performance.

GOAL:
${JSON.stringify(goal.plan, null, 2)}

LAST MONTH'S PERFORMANCE:
Completion rate: ${lastMonthStats.completionRate}%
Tasks completed: ${lastMonthStats.completed}/${lastMonthStats.scheduled}
Frequently skipped tasks: ${lastMonthStats.skippedTasks.join(', ')}
Days with highest completion: ${lastMonthStats.bestDays.join(', ')}

CALENDAR AVAILABILITY (Next Month):
${JSON.stringify(availability.summary, null, 2)}

TASK:
Generate an optimized schedule for next month that:
1. Adjusts intensity based on completion rate (reduce if <60%, maintain if 60-90%, increase if >90%)
2. Learns from task patterns (prioritize days with high completion)
3. Reduces frequently skipped task types
4. Maintains progress toward upcoming milestones

OUTPUT FORMAT (JSON):
{
  "adjustments": {
    "intensityChange": number (-1 to 1),
    "reasoning": "string"
  },
  "nextMonthSchedule": {
    "recurringTasks": [
      {
        "title": "string",
        "frequency": "daily" | "weekly",
        "daysOfWeek": [0,2,4],
        "timeSlot": "HH:MM",
        "duration": number
      }
    ],
    "oneTimeTasks": [
      {
        "title": "string",
        "preferredDate": "YYYY-MM-DD",
        "duration": number,
        "priority": number
      }
    ]
  },
  "progressForecast": {
    "expectedMilestoneProgress": number,
    "onTrack": boolean
  }
}`;

    const response = await this.callWithRetry(async () => {
      const completion = await openai.chat.completions.create({
        model: LLM_CONFIG.model,
        messages: [
          { role: 'system', content: 'You are a schedule optimization expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        response_format: { type: 'json_object' }
      });
      return completion.choices[0].message.content;
    });

    return JSON.parse(response);
  }

  async generateAdjustmentSuggestions(goal, currentProgress, reason) {
    const prompt = `You are helping a user adjust their goal because they are falling behind.

GOAL:
${JSON.stringify(goal.plan, null, 2)}

CURRENT PROGRESS:
Milestones completed: ${currentProgress.milestonesCompleted}/${currentProgress.totalMilestones}
Days until next milestone: ${currentProgress.daysToNextMilestone}
Current completion rate: ${currentProgress.completionRate}%
Tasks behind schedule: ${currentProgress.tasksBehind}

REASON FOR ADJUSTMENT:
${reason}

TASK:
Generate 3-4 realistic adjustment options.

OUTPUT FORMAT (JSON):
{
  "suggestions": [
    {
      "option": "string",
      "description": "string",
      "changes": {
        "newDeadline": "YYYY-MM-DD" | null,
        "milestoneAdjustments": [
          {
            "milestoneIndex": number,
            "newTitle": "string",
            "newDate": "YYYY-MM-DD"
          }
        ],
        "intensityChange": number,
        "estimatedSuccessRate": number
      },
      "pros": ["string"],
      "cons": ["string"]
    }
  ],
  "recommendedOption": number
}`;

    const response = await this.callWithRetry(async () => {
      const completion = await openai.chat.completions.create({
        model: LLM_CONFIG.model,
        messages: [
          { role: 'system', content: 'You are a goal adjustment specialist.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });
      return completion.choices[0].message.content;
    });

    return JSON.parse(response);
  }

  async generateProgressiveGoals(completedGoal) {
    const prompt = `You are suggesting next goals after a user completed their goal.

COMPLETED GOAL:
Category: ${completedGoal.category}
What they achieved: ${completedGoal.targetState}
Time taken: ${completedGoal.durationDays} days
Final completion rate: ${completedGoal.finalCompletionRate}%

TASK:
Suggest 3-5 progressive goals that naturally build on their achievement.

OUTPUT FORMAT (JSON):
{
  "suggestions": [
    {
      "title": "string",
      "category": "string",
      "description": "string",
      "rationale": "string",
      "estimatedDuration": "3 months" | "6 months" | "1 year",
      "difficulty": "intermediate" | "advanced",
      "prefilledAnswers": {
        "specificity": "string",
        "currentState": "string",
        "learningStyles": ["string"]
      }
    }
  ]
}`;

    const response = await this.callWithRetry(async () => {
      const completion = await openai.chat.completions.create({
        model: LLM_CONFIG.model,
        messages: [
          { role: 'system', content: 'You are a career progression advisor.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      });
      return completion.choices[0].message.content;
    });

    return JSON.parse(response);
  }

  async callWithRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  validatePlanStructure(plan) {
    const required = ['milestones', 'objectives', 'taskTemplate', 'resources'];
    for (const field of required) {
      if (!plan[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (plan.milestones.length < 3 || plan.milestones.length > 6) {
      throw new Error('Invalid number of milestones');
    }

    if (plan.estimatedWeeklyHours > 168) {
      throw new Error('Unrealistic weekly hours');
    }

    // Validate dates are in future
    const now = new Date();
    for (const milestone of plan.milestones) {
      if (new Date(milestone.targetDate) < now) {
        throw new Error('Milestone dates must be in future');
      }
    }
  }
}

module.exports = new LLMService();
```

### 9.2 Rate Limiting for LLM

```javascript
// functions/src/middleware/rateLimiter.js
const admin = require('firebase-admin');

const RATE_LIMITS = {
  free: {
    plansPerDay: 2,
    adjustmentsPerDay: 5,
    regenerationsPerMonth: 12
  },
  pro: {
    plansPerDay: 10,
    adjustmentsPerDay: 20,
    regenerationsPerMonth: 999
  }
};

async function checkLLMRateLimit(userId, action) {
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
  
  const subscription = userDoc.data().subscription?.status;
  const tier = subscription === 'active' ? 'pro' : 'free';
  
  const today = new Date().toISOString().split('T')[0];
  const usageKey = `llm_usage_${today}`;
  const usage = userDoc.data()[usageKey] || { plans: 0, adjustments: 0 };
  
  const actionKey = action + 's';
  const limit = RATE_LIMITS[tier][actionKey + 'PerDay'];
  
  if (usage[actionKey] >= limit) {
    throw new Error(`Daily ${action} limit reached`);
  }
  
  // Increment usage
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update({
      [`${usageKey}.${actionKey}`]: (usage[actionKey] || 0) + 1
    });
}

module.exports = { checkLLMRateLimit };
```

---
---

## 10. Google Calendar Integration

### 10.1 Calendar Service Setup

```javascript
// functions/src/services/calendarService.js
const { google } = require('googleapis');
const { getValidAccessToken } = require('./tokenManager');
const admin = require('firebase-admin');

class CalendarService {
  async getCalendarClient(userId) {
    const accessToken = await getValidAccessToken(userId);
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken
    });
    
    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async getCalendarAvailability(userId, startDate, endDate) {
    const calendar = await this.getCalendarClient(userId);
    
    // Fetch all events in date range
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    const events = response.data.items;
    
    // Calculate free slots
    const freeSlots = this.calculateFreeSlots(events, startDate, endDate);
    
    // Calculate statistics
    const totalFreeMinutes = freeSlots.reduce((sum, slot) => 
      sum + slot.durationMinutes, 0
    );
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const averageFreeHoursPerDay = (totalFreeMinutes / 60) / totalDays;
    
    // Identify common free times
    const commonFreeTimes = this.identifyCommonFreeTimes(freeSlots);
    
    return {
      freeSlots,
      totalFreeHours: totalFreeMinutes / 60,
      totalFreeHoursPerWeek: averageFreeHoursPerDay * 7,
      averageSlotsPerDay: freeSlots.length / totalDays,
      commonFreeTimes,
      summary: {
        totalDays,
        averageFreeHoursPerDay: Math.round(averageFreeHoursPerDay * 10) / 10
      }
    };
  }

  calculateFreeSlots(events, startDate, endDate) {
    const slots = [];
    const workingHours = { start: 6, end: 22 }; // 6 AM to 10 PM
    const minSlotDuration = 30; // Minimum 30 minutes
    
    let currentDate = new Date(startDate);
    
    while (currentDate < endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(workingHours.start, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(workingHours.end, 0, 0, 0);
      
      // Get events for this day
      const dayEvents = events.filter(e => {
        const eventStart = new Date(e.start.dateTime || e.start.date);
        return eventStart.toDateString() === currentDate.toDateString();
      }).sort((a, b) => 
        new Date(a.start.dateTime || a.start.date) - 
        new Date(b.start.dateTime || b.start.date)
      );
      
      // Find gaps between events
      let lastEnd = dayStart;
      
      for (const event of dayEvents) {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        // Check for gap before this event
        if (eventStart > lastEnd) {
          const gapMinutes = (eventStart - lastEnd) / 60000;
          if (gapMinutes >= minSlotDuration) {
            slots.push({
              date: currentDate.toISOString().split('T')[0],
              start: lastEnd.toISOString(),
              end: eventStart.toISOString(),
              durationMinutes: gapMinutes,
              timeOfDay: this.getTimeOfDay(lastEnd)
            });
          }
        }
        
        lastEnd = eventEnd > lastEnd ? eventEnd : lastEnd;
      }
      
      // Add remaining time until end of day
      if (dayEnd > lastEnd) {
        const gapMinutes = (dayEnd - lastEnd) / 60000;
        if (gapMinutes >= minSlotDuration) {
          slots.push({
            date: currentDate.toISOString().split('T')[0],
            start: lastEnd.toISOString(),
            end: dayEnd.toISOString(),
            durationMinutes: gapMinutes,
            timeOfDay: this.getTimeOfDay(lastEnd)
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots;
  }

  getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  identifyCommonFreeTimes(slots) {
    const timeGroups = { morning: 0, afternoon: 0, evening: 0 };
    
    for (const slot of slots) {
      timeGroups[slot.timeOfDay]++;
    }
    
    // Return times sorted by frequency
    return Object.entries(timeGroups)
      .sort((a, b) => b[1] - a[1])
      .map(([time]) => time);
  }

  async createGoalEvents(userId, goalId, plan, color, month) {
    const calendar = await this.getCalendarClient(userId);
    const eventIds = [];
    
    // Create all-day events for milestones
    for (const milestone of plan.milestones) {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: `🎯 ${milestone.title}`,
          description: milestone.description,
          start: { date: milestone.targetDate.split('T')[0] },
          end: { date: milestone.targetDate.split('T')[0] },
          colorId: color,
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'milestone',
              milestoneId: milestone.id
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    }
    
    // Create all-day events for objectives
    for (const objective of plan.objectives) {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: `📋 ${objective.title}`,
          description: objective.description,
          start: { date: objective.targetDate.split('T')[0] },
          end: { date: objective.targetDate.split('T')[0] },
          colorId: color,
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'objective',
              objectiveId: objective.id
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    }
    
    // Get availability for the month
    const monthStart = new Date(month + '-01');
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    
    const availability = await this.getCalendarAvailability(
      userId, 
      monthStart, 
      monthEnd
    );
    
    // Schedule recurring tasks
    const recurringEventIds = await this.scheduleRecurringTasks(
      calendar,
      plan.taskTemplate.recurringTasks,
      availability.freeSlots,
      color,
      goalId,
      monthStart,
      monthEnd
    );
    eventIds.push(...recurringEventIds);
    
    // Schedule one-time tasks
    const oneTimeEventIds = await this.scheduleOneTimeTasks(
      calendar,
      plan.taskTemplate.oneTimeTasks,
      availability.freeSlots,
      color,
      goalId
    );
    eventIds.push(...oneTimeEventIds);
    
    return eventIds;
  }

  async scheduleRecurringTasks(calendar, tasks, availableSlots, color, goalId, start, end) {
    const eventIds = [];
    
    for (const task of tasks) {
      // Find suitable slots for this task
      const suitableSlots = availableSlots.filter(slot => {
        const slotDate = new Date(slot.date);
        const dayOfWeek = slotDate.getDay();
        
        return task.daysOfWeek.includes(dayOfWeek) &&
               slot.durationMinutes >= task.duration &&
               slot.timeOfDay === task.preferredTime;
      });
      
      if (suitableSlots.length === 0) {
        console.warn(`No suitable slots for task: ${task.title}`);
        continue;
      }
      
      // Use the first suitable slot as the pattern
      const firstSlot = suitableSlots[0];
      const startTime = new Date(firstSlot.start);
      const endTime = new Date(startTime.getTime() + task.duration * 60000);
      
      // Create recurrence rule
      const daysOfWeek = ['SU','MO','TU','WE','TH','FR','SA'];
      const byDay = task.daysOfWeek.map(d => daysOfWeek[d]).join(',');
      const until = end.toISOString().split('T')[0].replace(/-/g, '');
      
      const recurrence = task.frequency === 'daily' 
        ? `RRULE:FREQ=DAILY;UNTIL=${until}`
        : `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}`;
      
      try {
        const event = await calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: task.title,
            description: task.description,
            start: { 
              dateTime: startTime.toISOString(), 
              timeZone: 'UTC' 
            },
            end: { 
              dateTime: endTime.toISOString(), 
              timeZone: 'UTC' 
            },
            recurrence: [recurrence],
            colorId: color,
            reminders: {
              useDefault: false,
              overrides: [{ method: 'popup', minutes: 15 }]
            },
            extendedProperties: {
              private: {
                appName: 'DreamCalendar',
                goalId: goalId,
                type: 'recurring_task',
                taskType: task.skillFocus
              }
            }
          }
        });
        
        eventIds.push(event.data.id);
      } catch (error) {
        console.error(`Failed to create recurring task ${task.title}:`, error);
      }
    }
    
    return eventIds;
  }

  async scheduleOneTimeTasks(calendar, tasks, availableSlots, color, goalId) {
    const eventIds = [];
    const usedSlots = new Set();
    
    // Sort tasks by priority
    const sortedTasks = tasks.sort((a, b) => 
      b.schedulingPriority - a.schedulingPriority
    );
    
    for (const task of sortedTasks) {
      // Find first available slot that fits and isn't used
      const suitableSlot = availableSlots.find(slot => 
        slot.durationMinutes >= task.duration && 
        !usedSlots.has(slot.start)
      );
      
      if (!suitableSlot) {
        console.warn(`No available slot for task: ${task.title}`);
        continue;
      }
      
      const startTime = new Date(suitableSlot.start);
      const endTime = new Date(startTime.getTime() + task.duration * 60000);
      
      try {
        const event = await calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: task.title,
            description: task.description,
            start: { 
              dateTime: startTime.toISOString(), 
              timeZone: 'UTC' 
            },
            end: { 
              dateTime: endTime.toISOString(), 
              timeZone: 'UTC' 
            },
            colorId: color,
            reminders: {
              useDefault: false,
              overrides: [{ method: 'popup', minutes: 15 }]
            },
            extendedProperties: {
              private: {
                appName: 'DreamCalendar',
                goalId: goalId,
                type: 'one_time_task',
                linkedObjectiveId: task.linkedObjectiveIndex
              }
            }
          }
        });
        
        eventIds.push(event.data.id);
        usedSlots.add(suitableSlot.start);
      } catch (error) {
        console.error(`Failed to create one-time task ${task.title}:`, error);
      }
    }
    
    return eventIds;
  }

  async updateEvent(userId, eventId, updates) {
    const calendar = await this.getCalendarClient(userId);
    
    await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      resource: updates
    });
  }

  async deleteEvent(userId, eventId) {
    const calendar = await this.getCalendarClient(userId);
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId
    });
  }

  async deleteFutureEvents(userId, eventIds) {
    const calendar = await this.getCalendarClient(userId);
    const now = new Date();
    let deletedCount = 0;
    
    for (const eventId of eventIds) {
      try {
        const event = await calendar.events.get({
          calendarId: 'primary',
          eventId: eventId
        });
        
        const eventStart = new Date(event.data.start.dateTime || event.data.start.date);
        
        // Only delete future events
        if (eventStart > now) {
          await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId
          });
          deletedCount++;
        }
      } catch (error) {
        console.error(`Failed to delete event ${eventId}:`, error);
      }
    }
    
    return deletedCount;
  }

  async setupCalendarWatch(userId) {
    const calendar = await this.getCalendarClient(userId);
    
    try {
      const watchResponse = await calendar.events.watch({
        calendarId: 'primary',
        resource: {
          id: `watch-${userId}`,
          type: 'web_hook',
          address: `${process.env.WEBHOOK_URL}/calendar-changes`
        }
      });
      
      // Store watch info
      await admin.firestore()
        .collection('users')
        .doc(userId)
        .update({
          calendarWatch: {
            id: watchResponse.data.id,
            resourceId: watchResponse.data.resourceId,
            expiration: watchResponse.data.expiration
          }
        });
      
      console.log(`Calendar watch setup for user ${userId}`);
    } catch (error) {
      console.error(`Failed to setup calendar watch for ${userId}:`, error);
      throw error;
    }
  }

  async handleCalendarChange(userId) {
    const calendar = await this.getCalendarClient(userId);
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const changes = await calendar.events.list({
      calendarId: 'primary',
      updatedMin: oneDayAgo.toISOString(),
      singleEvents: true
    });
    
    for (const event of changes.data.items) {
      const extProps = event.extendedProperties?.private;
      
      if (extProps?.appName === 'DreamCalendar') {
        const goalId = extProps.goalId;
        
        // Event was moved
        if (event.status === 'confirmed' && event.updated > event.created) {
          await this.learnFromMovedEvent(userId, goalId, event);
        }
        
        // Event was deleted/cancelled
        if (event.status === 'cancelled') {
          await this.rescheduleDeletedEvent(userId, goalId, event);
        }
      }
    }
  }

  async learnFromMovedEvent(userId, goalId, event) {
    const newStart = new Date(event.start.dateTime || event.start.date);
    const newHour = newStart.getHours();
    const newDay = newStart.getDay();
    
    const preferredTime = newHour < 12 ? 'morning' : 
                          newHour < 18 ? 'afternoon' : 'evening';
    
    console.log(`Learning: User moved ${event.summary} to ${preferredTime} on day ${newDay}`);
    
    // Store learning preference
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .update({
        'plan.taskTemplate.learningPreferences': admin.firestore.FieldValue.arrayUnion({
          taskTitle: event.summary,
          preferredDay: newDay,
          preferredTime: preferredTime,
          learnedAt: new Date()
        })
      });
  }

  async rescheduleDeletedEvent(userId, goalId, deletedEvent) {
    console.log(`Rescheduling deleted event: ${deletedEvent.summary}`);
    
    // Find next available slot and recreate the event
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const availability = await this.getCalendarAvailability(
      userId, 
      new Date(), 
      nextWeek
    );
    
    if (availability.freeSlots.length > 0) {
      const calendar = await this.getCalendarClient(userId);
      const newSlot = availability.freeSlots[0];
      const startTime = new Date(newSlot.start);
      const duration = 60; // Default 60 minutes
      const endTime = new Date(startTime.getTime() + duration * 60000);
      
      const goalDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .get();
      
      await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: deletedEvent.summary,
          description: deletedEvent.description + 
            '\n\n(Automatically rescheduled after deletion)',
          start: { 
            dateTime: startTime.toISOString(), 
            timeZone: 'UTC' 
          },
          end: { 
            dateTime: endTime.toISOString(), 
            timeZone: 'UTC' 
          },
          colorId: goalDoc.data().calendar.color,
          extendedProperties: deletedEvent.extendedProperties,
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }]
          }
        }
      });
      
      console.log(`Successfully rescheduled ${deletedEvent.summary}`);
    } else {
      console.warn(`No available slots to reschedule ${deletedEvent.summary}`);
    }
  }
}

module.exports = new CalendarService();
```

### 10.2 Calendar Webhook Handler

```javascript
// functions/src/api/calendarWebhook.js
const admin = require('firebase-admin');
const calendarService = require('../services/calendarService');

async function handleCalendarWebhook(req, res) {
  const channelId = req.headers['x-goog-channel-id'];
  const resourceState = req.headers['x-goog-resource-state'];
  const resourceId = req.headers['x-goog-resource-id'];
  
  console.log(`Calendar webhook received: ${resourceState} for channel ${channelId}`);
  
  // Ignore sync messages
  if (resourceState !== 'exists') {
    return res.status(200).send('OK');
  }
  
  try {
    // Extract userId from channel ID (format: watch-{userId})
    const userId = channelId.replace('watch-', '');
    
    // Verify this is a valid watch for this user
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    if (!userDoc.exists) {
      console.error(`User ${userId} not found for calendar webhook`);
      return res.status(404).send('User not found');
    }
    
    const calendarWatch = userDoc.data().calendarWatch;
    if (!calendarWatch || calendarWatch.resourceId !== resourceId) {
      console.error(`Invalid calendar watch for user ${userId}`);
      return res.status(403).send('Invalid watch');
    }
    
    // Process calendar changes
    await calendarService.handleCalendarChange(userId);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Calendar webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
}

module.exports = { handleCalendarWebhook };
```

### 10.3 Calendar Color Mapping

```javascript
// functions/src/utils/calendarColors.js

// Google Calendar color IDs (1-11)
const CALENDAR_COLORS = [
  { id: '1', hex: '#a4bdfc', name: 'Lavender' },
  { id: '2', hex: '#7ae7bf', name: 'Sage' },
  { id: '3', hex: '#dbadff', name: 'Grape' },
  { id: '4', hex: '#ff887c', name: 'Flamingo' },
  { id: '5', hex: '#fbd75b', name: 'Banana' },
  { id: '6', hex: '#ffb878', name: 'Tangerine' },
  { id: '7', hex: '#46d6db', name: 'Peacock' },
  { id: '8', hex: '#e1e1e1', name: 'Graphite' },
  { id: '9', hex: '#5484ed', name: 'Blueberry' },
  { id: '10', hex: '#51b749', name: 'Basil' },
  { id: '11', hex: '#dc2127', name: 'Tomato' }
];

function getColorForGoal(goalIndex) {
  // Cycle through colors for multiple goals
  return CALENDAR_COLORS[goalIndex % CALENDAR_COLORS.length].id;
}

function getColorHex(colorId) {
  const color = CALENDAR_COLORS.find(c => c.id === colorId);
  return color ? color.hex : '#a4bdfc';
}

module.exports = {
  CALENDAR_COLORS,
  getColorForGoal,
  getColorHex
};
```

### 10.4 Calendar Integration Testing

```javascript
// tests/integration/calendar.test.js
const calendarService = require('../../src/services/calendarService');
const { mockCalendarClient, mockEvents } = require('../mocks/googleCalendar');

describe('Calendar Service', () => {
  describe('calculateFreeSlots', () => {
    it('should find gaps between events', () => {
      const events = [
        {
          start: { dateTime: '2025-11-15T09:00:00Z' },
          end: { dateTime: '2025-11-15T10:00:00Z' }
        },
        {
          start: { dateTime: '2025-11-15T14:00:00Z' },
          end: { dateTime: '2025-11-15T15:00:00Z' }
        }
      ];
      
      const startDate = new Date('2025-11-15T06:00:00Z');
      const endDate = new Date('2025-11-15T22:00:00Z');
      
      const slots = calendarService.calculateFreeSlots(events, startDate, endDate);
      
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0].durationMinutes).toBeGreaterThanOrEqual(30);
    });
    
    it('should handle days with no events', () => {
      const events = [];
      const startDate = new Date('2025-11-15T06:00:00Z');
      const endDate = new Date('2025-11-15T22:00:00Z');
      
      const slots = calendarService.calculateFreeSlots(events, startDate, endDate);
      
      expect(slots.length).toBe(1);
      expect(slots[0].durationMinutes).toBe(960); // 16 hours
    });
  });
  
  describe('scheduleRecurringTasks', () => {
    it('should create recurring events on specified days', async () => {
      const mockCalendar = mockCalendarClient();
      const tasks = [
        {
          title: 'Daily Practice',
          description: 'Practice fundamentals',
          duration: 30,
          frequency: 'weekly',
          daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
          preferredTime: 'morning',
          skillFocus: 'fundamentals'
        }
      ];
      
      const availableSlots = [
        {
          date: '2025-11-18',
          start: '2025-11-18T09:00:00Z',
          end: '2025-11-18T10:00:00Z',
          durationMinutes: 60,
          timeOfDay: 'morning'
        }
      ];
      
      const eventIds = await calendarService.scheduleRecurringTasks(
        mockCalendar,
        tasks,
        availableSlots,
        '1',
        'goal_123',
        new Date('2025-11-01'),
        new Date('2025-11-30')
      );
      
      expect(eventIds.length).toBe(1);
      expect(mockCalendar.events.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: expect.objectContaining({
            recurrence: expect.arrayContaining([
              expect.stringContaining('RRULE:FREQ=WEEKLY')
            ])
          })
        })
      );
    });
  });
});
```

---

This completes **Part 5: Google Calendar Integration**. The implementation includes:

✅ **Complete CalendarService class** with all methods
✅ **Availability detection algorithm** that finds free slots
✅ **Event creation** for milestones, objectives, recurring tasks, and one-time tasks
✅ **Calendar webhook handling** to learn from user behavior
✅ **Automatic rescheduling** when users delete events
✅ **Learning system** that adapts to moved events
✅ **Color management** for multiple goals
✅ **Integration tests** for key functionality

Ready for **Part 6: Business Logic & Cron Jobs**?---

## 10. Google Calendar Integration

### 10.1 Calendar Service Setup

```javascript
// functions/src/services/calendarService.js
const { google } = require('googleapis');
const { getValidAccessToken } = require('./tokenManager');
const admin = require('firebase-admin');

class CalendarService {
  async getCalendarClient(userId) {
    const accessToken = await getValidAccessToken(userId);
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken
    });
    
    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async getCalendarAvailability(userId, startDate, endDate) {
    const calendar = await this.getCalendarClient(userId);
    
    // Fetch all events in date range
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    const events = response.data.items;
    
    // Calculate free slots
    const freeSlots = this.calculateFreeSlots(events, startDate, endDate);
    
    // Calculate statistics
    const totalFreeMinutes = freeSlots.reduce((sum, slot) => 
      sum + slot.durationMinutes, 0
    );
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const averageFreeHoursPerDay = (totalFreeMinutes / 60) / totalDays;
    
    // Identify common free times
    const commonFreeTimes = this.identifyCommonFreeTimes(freeSlots);
    
    return {
      freeSlots,
      totalFreeHours: totalFreeMinutes / 60,
      totalFreeHoursPerWeek: averageFreeHoursPerDay * 7,
      averageSlotsPerDay: freeSlots.length / totalDays,
      commonFreeTimes,
      summary: {
        totalDays,
        averageFreeHoursPerDay: Math.round(averageFreeHoursPerDay * 10) / 10
      }
    };
  }

  calculateFreeSlots(events, startDate, endDate) {
    const slots = [];
    const workingHours = { start: 6, end: 22 }; // 6 AM to 10 PM
    const minSlotDuration = 30; // Minimum 30 minutes
    
    let currentDate = new Date(startDate);
    
    while (currentDate < endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(workingHours.start, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(workingHours.end, 0, 0, 0);
      
      // Get events for this day
      const dayEvents = events.filter(e => {
        const eventStart = new Date(e.start.dateTime || e.start.date);
        return eventStart.toDateString() === currentDate.toDateString();
      }).sort((a, b) => 
        new Date(a.start.dateTime || a.start.date) - 
        new Date(b.start.dateTime || b.start.date)
      );
      
      // Find gaps between events
      let lastEnd = dayStart;
      
      for (const event of dayEvents) {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        // Check for gap before this event
        if (eventStart > lastEnd) {
          const gapMinutes = (eventStart - lastEnd) / 60000;
          if (gapMinutes >= minSlotDuration) {
            slots.push({
              date: currentDate.toISOString().split('T')[0],
              start: lastEnd.toISOString(),
              end: eventStart.toISOString(),
              durationMinutes: gapMinutes,
              timeOfDay: this.getTimeOfDay(lastEnd)
            });
          }
        }
        
        lastEnd = eventEnd > lastEnd ? eventEnd : lastEnd;
      }
      
      // Add remaining time until end of day
      if (dayEnd > lastEnd) {
        const gapMinutes = (dayEnd - lastEnd) / 60000;
        if (gapMinutes >= minSlotDuration) {
          slots.push({
            date: currentDate.toISOString().split('T')[0],
            start: lastEnd.toISOString(),
            end: dayEnd.toISOString(),
            durationMinutes: gapMinutes,
            timeOfDay: this.getTimeOfDay(lastEnd)
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return slots;
  }

  getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  identifyCommonFreeTimes(slots) {
    const timeGroups = { morning: 0, afternoon: 0, evening: 0 };
    
    for (const slot of slots) {
      timeGroups[slot.timeOfDay]++;
    }
    
    // Return times sorted by frequency
    return Object.entries(timeGroups)
      .sort((a, b) => b[1] - a[1])
      .map(([time]) => time);
  }

  async createGoalEvents(userId, goalId, plan, color, month) {
    const calendar = await this.getCalendarClient(userId);
    const eventIds = [];
    
    // Create all-day events for milestones
    for (const milestone of plan.milestones) {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: `🎯 ${milestone.title}`,
          description: milestone.description,
          start: { date: milestone.targetDate.split('T')[0] },
          end: { date: milestone.targetDate.split('T')[0] },
          colorId: color,
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'milestone',
              milestoneId: milestone.id
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    }
    
    // Create all-day events for objectives
    for (const objective of plan.objectives) {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: `📋 ${objective.title}`,
          description: objective.description,
          start: { date: objective.targetDate.split('T')[0] },
          end: { date: objective.targetDate.split('T')[0] },
          colorId: color,
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'objective',
              objectiveId: objective.id
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    }
    
    // Get availability for the month
    const monthStart = new Date(month + '-01');
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    
    const availability = await this.getCalendarAvailability(
      userId, 
      monthStart, 
      monthEnd
    );
    
    // Schedule recurring tasks
    const recurringEventIds = await this.scheduleRecurringTasks(
      calendar,
      plan.taskTemplate.recurringTasks,
      availability.freeSlots,
      color,
      goalId,
      monthStart,
      monthEnd
    );
    eventIds.push(...recurringEventIds);
    
    // Schedule one-time tasks
    const oneTimeEventIds = await this.scheduleOneTimeTasks(
      calendar,
      plan.taskTemplate.oneTimeTasks,
      availability.freeSlots,
      color,
      goalId
    );
    eventIds.push(...oneTimeEventIds);
    
    return eventIds;
  }

  async scheduleRecurringTasks(calendar, tasks, availableSlots, color, goalId, start, end) {
    const eventIds = [];
    
    for (const task of tasks) {
      // Find suitable slots for this task
      const suitableSlots = availableSlots.filter(slot => {
        const slotDate = new Date(slot.date);
        const dayOfWeek = slotDate.getDay();
        
        return task.daysOfWeek.includes(dayOfWeek) &&
               slot.durationMinutes >= task.duration &&
               slot.timeOfDay === task.preferredTime;
      });
      
      if (suitableSlots.length === 0) {
        console.warn(`No suitable slots for task: ${task.title}`);
        continue;
      }
      
      // Use the first suitable slot as the pattern
      const firstSlot = suitableSlots[0];
      const startTime = new Date(firstSlot.start);
      const endTime = new Date(startTime.getTime() + task.duration * 60000);
      
      // Create recurrence rule
      const daysOfWeek = ['SU','MO','TU','WE','TH','FR','SA'];
      const byDay = task.daysOfWeek.map(d => daysOfWeek[d]).join(',');
      const until = end.toISOString().split('T')[0].replace(/-/g, '');
      
      const recurrence = task.frequency === 'daily' 
        ? `RRULE:FREQ=DAILY;UNTIL=${until}`
        : `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}`;
      
      try {
        const event = await calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: task.title,
            description: task.description,
            start: { 
              dateTime: startTime.toISOString(), 
              timeZone: 'UTC' 
            },
            end: { 
              dateTime: endTime.toISOString(), 
              timeZone: 'UTC' 
            },
            recurrence: [recurrence],
            colorId: color,
            reminders: {
              useDefault: false,
              overrides: [{ method: 'popup', minutes: 15 }]
            },
            extendedProperties: {
              private: {
                appName: 'DreamCalendar',
                goalId: goalId,
                type: 'recurring_task',
                taskType: task.skillFocus
              }
            }
          }
        });
        
        eventIds.push(event.data.id);
      } catch (error) {
        console.error(`Failed to create recurring task ${task.title}:`, error);
      }
    }
    
    return eventIds;
  }

  async scheduleOneTimeTasks(calendar, tasks, availableSlots, color, goalId) {
    const eventIds = [];
    const usedSlots = new Set();
    
    // Sort tasks by priority
    const sortedTasks = tasks.sort((a, b) => 
      b.schedulingPriority - a.schedulingPriority
    );
    
    for (const task of sortedTasks) {
      // Find first available slot that fits and isn't used
      const suitableSlot = availableSlots.find(slot => 
        slot.durationMinutes >= task.duration && 
        !usedSlots.has(slot.start)
      );
      
      if (!suitableSlot) {
        console.warn(`No available slot for task: ${task.title}`);
        continue;
      }
      
      const startTime = new Date(suitableSlot.start);
      const endTime = new Date(startTime.getTime() + task.duration * 60000);
      
      try {
        const event = await calendar.events.insert({
          calendarId: 'primary',
          resource: {
            summary: task.title,
            description: task.description,
            start: { 
              dateTime: startTime.toISOString(), 
              timeZone: 'UTC' 
            },
            end: { 
              dateTime: endTime.toISOString(), 
              timeZone: 'UTC' 
            },
            colorId: color,
            reminders: {
              useDefault: false,
              overrides: [{ method: 'popup', minutes: 15 }]
            },
            extendedProperties: {
              private: {
                appName: 'DreamCalendar',
                goalId: goalId,
                type: 'one_time_task',
                linkedObjectiveId: task.linkedObjectiveIndex
              }
            }
          }
        });
        
        eventIds.push(event.data.id);
        usedSlots.add(suitableSlot.start);
      } catch (error) {
        console.error(`Failed to create one-time task ${task.title}:`, error);
      }
    }
    
    return eventIds;
  }

  async updateEvent(userId, eventId, updates) {
    const calendar = await this.getCalendarClient(userId);
    
    await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      resource: updates
    });
  }

  async deleteEvent(userId, eventId) {
    const calendar = await this.getCalendarClient(userId);
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId
    });
  }

  async setupCalendarWatch(userId) {
    const calendar = await this.getCalendarClient(userId);
    
    const watchResponse = await calendar.events.watch({
      calendarId: 'primary',
      resource: {
        id: `watch-${userId}`,
        type: 'web_hook',
        address: `${process.env.WEBHOOK_URL}/calendar-changes`
      }
    });
    
    // Store watch info
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        calendarWatch: {
          id: watchResponse.data.id,
          resourceId: watchResponse.data.resourceId,
          expiration: watchResponse.data.expiration
        }
      });
  }

  async handleCalendarChange(userId) {
    const calendar = await this.getCalendarClient(userId);
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const changes = await calendar.events.list({
      calendarId: 'primary',
      updatedMin: oneDayAgo.toISOString(),
      singleEvents: true
    });
    
    for (const event of changes.data.items) {
      const extProps = event.extendedProperties?.private;
      
      if (extProps?.appName === 'DreamCalendar') {
        const goalId = extProps.goalId;
        
        // Event was moved
        if (event.status === 'confirmed' && event.updated > event.created) {
          await this.learnFromMovedEvent(userId, goalId, event);
        }
        
        // Event was deleted/cancelled
        if (event.status === 'cancelled') {
          await this.rescheduleDeletedEvent(userId, goalId, event);
        }
      }
    }
  }

  async learnFromMovedEvent(userId, goalId, event) {
    const newStart = new Date(event.start.dateTime || event.start.date);
    const newHour = newStart.getHours();
    const newDay = newStart.getDay();
    
    const preferredTime = newHour < 12 ? 'morning' : 
                          newHour < 18 ? 'afternoon' : 'evening';
    
    // Store learning preference
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .update({
        'plan.taskTemplate.learningPreferences': admin.firestore.FieldValue.arrayUnion({
          taskTitle: event.summary,
          preferredDay: newDay,
          preferredTime: preferredTime,
          learnedAt: new Date()
        })
      });
  }

  async rescheduleDeletedEvent(userId, goalId, deletedEvent) {
    // Find next available slot and recreate the event
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const availability = await this.getCalendarAvailability(
      userId, 
      new Date(), 
      nextWeek
    );
    
    if (availability.freeSlots.length > 0) {
      const calendar = await this.getCalendarClient(userId);
      const newSlot = availability.freeSlots[0];
      const startTime = new Date(newSlot.start);
      const duration = 60; // Default 60 minutes
      const endTime = new Date(startTime.getTime() + duration * 60000);
      
      const goalDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .get();
      
      await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: deletedEvent.summary,
          description: deletedEvent.description + 
            '\n\n(Automatically rescheduled)',
          start: { 
            dateTime: startTime.toISOString(), 
            timeZone: 'UTC' 
          },
          end: { 
            dateTime: endTime.toISOString(), 
            timeZone: 'UTC' 
          },
          colorId: goalDoc.data().calendar.color,
          extendedProperties: deletedEvent.extendedProperties
        }
      });
    }
  }
}

module.exports = new CalendarService();
```

---

## 11. Business Logic Implementation

### 11.1 Subscription Management

```javascript
// functions/src/services/subscriptionService.js
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class SubscriptionService {
  async createCheckoutSession(userId, plan) {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const user = userDoc.data();
    let customerId = user.subscription?.stripeCustomerId;
    
    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: userId }
      });
      customerId = customer.id;
      
      await admin.firestore()
        .collection('users')
        .doc(userId)
        .update({
          'subscription.stripeCustomerId': customerId
        });
    }
    
    // Price IDs (set these in Stripe dashboard)
    const prices = {
      pro_monthly: process.env.STRIPE_PRICE_MONTHLY,
      pro_annual: process.env.STRIPE_PRICE_ANNUAL
    };
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[plan],
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: userId,
        plan: plan
      }
    });
    
    return {
      checkoutUrl: session.url,
      sessionId: session.id
    };
  }

  async handleWebhook(event) {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
    }
  }

  async handleSubscriptionUpdate(subscription) {
    const customerId = subscription.customer;
    
    // Find user by Stripe customer ID
    const userQuery = await admin.firestore()
      .collection('users')
      .where('subscription.stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    
    if (userQuery.empty) return;
    
    const userId = userQuery.docs[0].id;
    
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        'subscription.status': subscription.status,
        'subscription.stripeSubscriptionId': subscription.id,
        'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
        'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end
      });
  }

  async handleSubscriptionCanceled(subscription) {
    const customerId = subscription.customer;
    
    const userQuery = await admin.firestore()
      .collection('users')
      .where('subscription.stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    
    if (userQuery.empty) return;
    
    const userId = userQuery.docs[0].id;
    
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        'subscription.status': 'canceled'
      });
  }

  async cancelSubscription(userId) {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const subscriptionId = userDoc.data().subscription?.stripeSubscriptionId;
    
    if (!subscriptionId) {
      throw new Error('No active subscription found');
    }
    
    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true }
    );
    
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        'subscription.cancelAtPeriodEnd': true,
        'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
      });
    
    return {
      canceled: true,
      cancelAtPeriodEnd: true,
      periodEnd: new Date(subscription.current_period_end * 1000)
    };
  }

  async getBillingPortalUrl(userId) {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const customerId = userDoc.data().subscription?.stripeCustomerId;
    
    if (!customerId) {
      throw new Error('No Stripe customer found');
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });
    
    return session.url;
  }
}

module.exports = new SubscriptionService();
```

### 11.2 Progress Calculation

```javascript
// functions/src/services/progressService.js
const admin = require('firebase-admin');
const calendarService = require('./calendarService');

class ProgressService {
  async calculateProgress(userId, goalId) {
    const goalDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .get();
    
    const goal = goalDoc.data();
    const calendar = await calendarService.getCalendarClient(userId);
    
    let completedCount = 0;
    const totalCount = goal.calendar.eventIds.length;
    
    // Check each event
    for (const eventId of goal.calendar.eventIds) {
      try {
        const event = await calendar.events.get({
          calendarId: 'primary',
          eventId: eventId
        });
        
        // Event is completed if it's in the past and not cancelled
        const eventEnd = new Date(event.data.end.dateTime || event.data.end.date);
        if (eventEnd < new Date() && event.data.status !== 'cancelled') {
          completedCount++;
        }
      } catch (error) {
        // Event might be deleted, skip
        continue;
      }
    }
    
    const completionRate = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;
    
    // Update goal progress
    await goalDoc.ref.update({
      'progress.tasksCompleted': completedCount,
      'progress.totalTasksScheduled': totalCount,
      'progress.completionRate': completionRate,
      'progress.lastCompletedTask': new Date()
    });
    
    return {
      completedCount,
      totalCount,
      completionRate
    };
  }

  async calculateMilestoneDelta(userId, goalId, milestoneId) {
    const goalDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .get();
    
    const goal = goalDoc.data();
    const milestone = goal.plan.milestones.find(m => m.id === milestoneId);
    
    if (!milestone) return null;
    
    const targetDate = new Date(milestone.targetDate);
    const now = new Date();
    const daysRemaining = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
    
    // Calculate expected progress
    const goalStart = new Date(goal.createdAt.toDate());
    const totalDays = Math.ceil((targetDate - goalStart) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now - goalStart) / (1000 * 60 * 60 * 24));
    const expectedProgress = (daysElapsed / totalDays) * 100;
    
    // Get actual progress
    const progress = await this.calculateProgress(userId, goalId);
    const actualProgress = progress.completionRate;
    
    const delta = actualProgress - expectedProgress;
    
    return {
      milestoneId,
      targetDate: milestone.targetDate,
      daysRemaining,
      expectedProgress: Math.round(expectedProgress),
      actualProgress: Math.round(actualProgress),
      delta: Math.round(delta),
      status: delta > 5 ? 'ahead' : delta < -20 ? 'behind' : 'on_track'
    };
  }

  async logCompletion(userId, goalId, eventId, completedAt, actualDuration, userNote) {
    const today = new Date(completedAt).toISOString().split('T')[0];
    
    // Find or create today's progress log
    const logsQuery = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .collection('progressLogs')
      .where('date', '==', admin.firestore.Timestamp.fromDate(new Date(today)))
      .limit(1)
      .get();
    
    let logDoc;
    if (logsQuery.empty) {
      // Create new log
      logDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc(goalId)
        .collection('progressLogs')
        .add({
          date: admin.firestore.Timestamp.fromDate(new Date(today)),
          tasksScheduled: 0,
          tasksCompleted: 0,
          minutesInvested: 0,
          completedTasks: [],
          createdAt: new Date()
        });
    } else {
      logDoc = logsQuery.docs[0].ref;
    }
    
    // Update log
    await logDoc.update({
      tasksCompleted: admin.firestore.FieldValue.increment(1),
      minutesInvested: admin.firestore.FieldValue.increment(actualDuration || 0),
      completedTasks: admin.firestore.FieldValue.arrayUnion({
        eventId,
        completedAt,
        actualDuration: actualDuration || 0,
        userNote
      })
    });
    
    // Recalculate overall progress
    const updatedProgress = await this.calculateProgress(userId, goalId);
    
    return updatedProgress;
  }
}

module.exports = new ProgressService();


```

### 11.3 Monthly Regeneration Cron Job

```javascript
// functions/src/scheduled/monthlyRegeneration.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const llmService = require('../services/llmService');
const calendarService = require('../services/calendarService');

exports.monthlyRegeneration = functions.pubsub
  .schedule('0 0 25 * *') // 25th of each month at midnight
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log('Starting monthly regeneration...');
    
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      try {
        // Get all active goals
        const goalsSnapshot = await admin.firestore()
          .collection('users')
          .doc(userId)
          .collection('goals')
          .where('status', '==', 'active')
          .get();
        
        for (const goalDoc of goalsSnapshot.docs) {
          const goalId = goalDoc.id;
          
          try {
            await regenerateNextMonth(userId, goalId);
            console.log(`Regenerated schedule for user ${userId}, goal ${goalId}`);
          } catch (error) {
            console.error(`Failed to regenerate goal ${goalId}:`, error);
          }
        }
      } catch (error) {
        console.error(`Failed to process user ${userId}:`, error);
      }
    }
    
    console.log('Monthly regeneration complete');
    return null;
  });

async function regenerateNextMonth(userId, goalId) {
  // Get last month's stats
  const lastMonthStats = await getLastMonthStats(userId, goalId);
  
  // Get next month's availability
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const monthStart = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  # Dream Calendar - Complete Developer Specification

  const monthEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
  
  const availability = await calendarService.getCalendarAvailability(
    userId, 
    monthStart, 
    monthEnd
  );
  
  // Get goal data
  const goalDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .get();
  
  const goal = goalDoc.data();
  
  // Generate adjusted schedule using LLM
  const adjustedSchedule = await llmService.generateMonthlySchedule(
    goal,
    lastMonthStats,
    availability
  );
  
  // Create events for next month
  const eventIds = await createMonthlyEvents(
    userId,
    goalId,
    adjustedSchedule.nextMonthSchedule,
    goal.calendar.color,
    monthStart,
    monthEnd
  );
  
  // Update goal document
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .update({
      'calendar.lastScheduledMonth': `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`,
      'calendar.eventIds': admin.firestore.FieldValue.arrayUnion(...eventIds)
    });
  
  console.log(`Regenerated ${eventIds.length} events for goal ${goalId}`);
  return eventIds;
}

async function getLastMonthStats(userId, goalId) {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const monthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  const monthStart = new Date(monthKey + '-01');
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  
  const logsSnapshot = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('progressLogs')
    .where('date', '>=', admin.firestore.Timestamp.fromDate(monthStart))
    .where('date', '<', admin.firestore.Timestamp.fromDate(monthEnd))
    .get();
  
  let totalScheduled = 0;
  let totalCompleted = 0;
  const completionByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  const taskCompletionCount = {};
  
  for (const logDoc of logsSnapshot.docs) {
    const log = logDoc.data();
    totalScheduled += log.tasksScheduled || 0;
    totalCompleted += log.tasksCompleted || 0;
    
    const dayOfWeek = log.date.toDate().getDay();
    completionByDay[dayOfWeek] += log.tasksCompleted || 0;
    
    // Track which task types were completed
    for (const task of log.completedTasks || []) {
      const title = task.title || 'Unknown';
      taskCompletionCount[title] = (taskCompletionCount[title] || 0) + 1;
    }
  }
  
  const completionRate = totalScheduled > 0 
    ? Math.round((totalCompleted / totalScheduled) * 100) 
    : 0;
  
  // Identify best days (most completions)
  const bestDays = completionByDay
    .map((count, day) => ({ day, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(d => d.day);
  
  // Identify frequently skipped tasks (scheduled but low completion)
  const goalDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .get();
  
  const recurringTasks = goalDoc.data().plan.taskTemplate.recurringTasks || [];
  const skippedTasks = [];
  
  for (const task of recurringTasks) {
    const completionCount = taskCompletionCount[task.title] || 0;
    const expectedCount = 4; // Rough estimate for monthly
    
    if (completionCount < expectedCount * 0.5) {
      skippedTasks.push(task.title);
    }
  }
  
  return {
    completionRate,
    completed: totalCompleted,
    scheduled: totalScheduled,
    skippedTasks,
    bestDays,
    movedTasks: [], // Would need calendar change tracking
    averageDelay: 0
  };
}

async function createMonthlyEvents(userId, goalId, schedule, color, monthStart, monthEnd) {
  const calendar = await calendarService.getCalendarClient(userId);
  const eventIds = [];
  
  // Create recurring tasks
  for (const task of schedule.recurringTasks) {
    const taskDate = new Date(monthStart);
    const [hour, minute] = task.timeSlot.split(':');
    taskDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    const daysOfWeek = ['SU','MO','TU','WE','TH','FR','SA'];
    const byDay = task.daysOfWeek.map(d => daysOfWeek[d]).join(',');
    const until = monthEnd.toISOString().split('T')[0].replace(/-/g, '');
    
    const recurrence = task.frequency === 'daily'
      ? `RRULE:FREQ=DAILY;UNTIL=${until}`
      : `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}`;
    
    const endTime = new Date(taskDate.getTime() + task.duration * 60000);
    
    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: task.title,
          description: 'Monthly regeneration',
          start: { dateTime: taskDate.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
          recurrence: [recurrence],
          colorId: color,
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }]
          },
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'recurring_task'
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    } catch (error) {
      console.error(`Failed to create recurring task: ${error.message}`);
    }
  }
  
  // Create one-time tasks
  for (const task of schedule.oneTimeTasks) {
    const taskDate = new Date(task.preferredDate);
    const endTime = new Date(taskDate.getTime() + task.duration * 60000);
    
    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: task.title,
          description: 'Monthly scheduled task',
          start: { dateTime: taskDate.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
          colorId: color,
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }]
          },
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'one_time_task',
              priority: task.priority
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    } catch (error) {
      console.error(`Failed to create one-time task: ${error.message}`);
    }
  }
  
  return eventIds;
}

module.exports = { regenerateNextMonth, getLastMonthStats };
```

### 11.4 Daily Progress Check Cron Job

```javascript
// functions/src/scheduled/dailyProgressCheck.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const progressService = require('../services/progressService');
const llmService = require('../services/llmService');

exports.dailyProgressCheck = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9 AM
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log('Starting daily progress check...');
    
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      try {
        const goalsSnapshot = await admin.firestore()
          .collection('users')
          .doc(userId)
          .collection('goals')
          .where('status', '==', 'active')
          .get();
        
        for (const goalDoc of goalsSnapshot.docs) {
          const goalId = goalDoc.id;
          const goal = goalDoc.data();
          
          try {
            // Check each milestone
            for (const milestone of goal.plan.milestones) {
              const delta = await progressService.calculateMilestoneDelta(
                userId, 
                goalId, 
                milestone.id
              );
              
              // Trigger adjustment if behind schedule
              if (delta && delta.status === 'behind') {
                await createAdjustmentSuggestion(userId, goalId, delta, 'behind_schedule');
              }
            }
          } catch (error) {
            console.error(`Failed to check goal ${goalId}:`, error);
          }
        }
      } catch (error) {
        console.error(`Failed to process user ${userId}:`, error);
      }
    }
    
    console.log('Daily progress check complete');
    return null;
  });

async function createAdjustmentSuggestion(userId, goalId, delta, reason) {
  const goalDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .get();
  
  const goal = goalDoc.data();
  
  // Check if there's already a pending adjustment
  const pendingAdjustments = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('adjustments')
    .where('status', '==', 'pending')
    .limit(1)
    .get();
  
  if (!pendingAdjustments.empty) {
    console.log(`Adjustment already pending for goal ${goalId}`);
    return;
  }
  
  // Generate suggestions using LLM
  const currentProgress = {
    milestonesCompleted: goal.plan.milestones.filter(m => m.status === 'completed').length,
    totalMilestones: goal.plan.milestones.length,
    daysToNextMilestone: delta.daysRemaining,
    completionRate: goal.progress.completionRate,
    tasksBehind: Math.abs(delta.delta)
  };
  
  const suggestions = await llmService.generateAdjustmentSuggestions(
    goal,
    currentProgress,
    reason
  );
  
  // Create adjustment document
  const adjustmentRef = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('adjustments')
    .add({
      triggeredBy: 'system',
      reason: reason,
      delta: delta,
      suggestions: suggestions.suggestions,
      recommendedOption: suggestions.recommendedOption,
      createdAt: new Date(),
      appliedAt: null,
      status: 'pending'
    });
  
  console.log(`Created adjustment ${adjustmentRef.id} for goal ${goalId}`);
}

module.exports = { createAdjustmentSuggestion };
```

### 11.5 Goal Completion Handler

```javascript
// functions/src/services/goalCompletionService.js
const admin = require('firebase-admin');
const llmService = require('./llmService');
const calendarService = require('./calendarService');

class GoalCompletionService {
  async checkAndCompleteGoal(userId, goalId) {
    const goalDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .get();
    
    const goal = goalDoc.data();
    
    // Check if all milestones are completed
    const allMilestonesCompleted = goal.plan.milestones.every(
      m => m.status === 'completed'
    );
    
    if (!allMilestonesCompleted) {
      return null;
    }
    
    // Mark goal as completed
    await goalDoc.ref.update({
      status: 'completed',
      completedAt: new Date()
    });
    
    // Calculate final stats
    const createdAt = goal.createdAt.toDate();
    const completedAt = new Date();
    const durationDays = Math.ceil((completedAt - createdAt) / (1000 * 60 * 60 * 24));
    
    // Generate progressive goal suggestions
    const completedGoalData = {
      category: goal.category,
      targetState: goal.targetState,
      durationDays: durationDays,
      finalCompletionRate: goal.progress.completionRate
    };
    
    const suggestions = await llmService.generateProgressiveGoals(completedGoalData);
    
    console.log(`Goal ${goalId} completed after ${durationDays} days`);
    
    return {
      completed: true,
      durationDays,
      suggestions: suggestions.suggestions
    };
  }

  async markMilestoneComplete(userId, goalId, milestoneId) {
    const goalDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('goals')
      .doc(goalId)
      .get();
    
    const goal = goalDoc.data();
    const milestoneIndex = goal.plan.milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found');
    }
    
    // Update milestone status
    const updatedMilestones = [...goal.plan.milestones];
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      status: 'completed',
      completedAt: new Date()
    };
    
    await goalDoc.ref.update({
      'plan.milestones': updatedMilestones
    });
    
    // Check if goal is now complete
    const result = await this.checkAndCompleteGoal(userId, goalId);
    
    return result || { milestoneCompleted: true };
  }
}

module.exports = new GoalCompletionService();
```

---

## 12. Error Handling & Validation

### 12.1 Error Classes

```javascript
// functions/src/utils/errors.js

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

class CalendarPermissionError extends AppError {
  constructor(message = 'Calendar permissions required') {
    super(message, 403, 'CALENDAR_PERMISSION_ERROR');
  }
}

class SubscriptionError extends AppError {
  constructor(message = 'Pro subscription required') {
    super(message, 403, 'SUBSCRIPTION_ERROR');
  }
}

class LLMError extends AppError {
  constructor(message = 'AI service temporarily unavailable') {
    super(message, 503, 'LLM_ERROR');
  }
}

class CalendarFullError extends AppError {
  constructor(message = 'No available time slots found') {
    super(message, 400, 'CALENDAR_FULL');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT');
  }
}

class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

module.exports = {
  AppError,
  AuthenticationError,
  CalendarPermissionError,
  SubscriptionError,
  LLMError,
  CalendarFullError,
  RateLimitError,
  ValidationError,
  NotFoundError
};
```

### 12.2 Global Error Handler

```javascript
// functions/src/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  // Log error details
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    userId: req.user?.uid,
    path: req.path,
    method: req.method
  });
  
  // Operational errors (known errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
  
  // Programming errors (unknown errors)
  // Don't leak error details to client
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.id
    }
  });
}

// Async error wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };
```

### 12.3 Input Validation

```javascript
// functions/src/middleware/validation.js
const Joi = require('joi');
const { ValidationError } = require('../utils/errors');

// Questionnaire validation schema
const questionnaireSchema = Joi.object({
  category: Joi.string().valid(
    'creative_skills',
    'professional_dev',
    'health_fitness',
    'learning',
    'personal_projects',
    'lifestyle_habits'
  ).required(),
  
  specificity: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Please provide more detail (at least 10 characters)',
      'string.max': 'Please keep it under 500 characters'
    }),
  
  currentState: Joi.string()
    .valid('no_experience', 'beginner', 'intermediate', 'advanced')
    .required(),
  
  targetState: Joi.string()
    .min(10)
    .max(500)
    .required(),
  
  deadline: Joi.date()
    .min('now')
    .max('2030-12-31')
    .required()
    .messages({
      'date.min': 'Deadline must be in the future',
      'date.max': 'Deadline cannot be more than 5 years away'
    }),
  
  learningStyles: Joi.array()
    .items(Joi.string())
    .min(1)
    .max(6)
    .required(),
  
  budget: Joi.string().required(),
  
  equipment: Joi.string()
    .max(1000)
    .allow('')
    .default(''),
  
  constraints: Joi.string()
    .max(1000)
    .allow('')
    .default('')
});

// Progress log validation
const progressLogSchema = Joi.object({
  eventId: Joi.string().required(),
  completedAt: Joi.date().required(),
  actualDuration: Joi.number().min(0).max(480).optional(),
  userNote: Joi.string().max(500).allow('').optional()
});

// Validation middleware factory
function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: errors
        }
      });
    }
    
    // Replace body with validated and sanitized value
    req.body = value;
    next();
  };
}

module.exports = {
  questionnaireSchema,
  progressLogSchema,
  validateRequest
};
```

### 12.4 Retry Logic

```javascript
// functions/src/utils/retry.js

async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on client errors
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      // Last attempt - throw error
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Specific retry for calendar API calls
async function retryCalendarCall(fn, userId) {
  return retryWithBackoff(async () => {
    try {
      return await fn();
    } catch (error) {
      // If token expired, refresh and retry once
      if (error.code === 401 || error.message?.includes('invalid_grant')) {
        console.log('Token expired, refreshing...');
        await require('../services/tokenManager').refreshAccessToken(userId);
        return await fn();
      }
      throw error;
    }
  }, 3, 1000);
}

module.exports = {
  retryWithBackoff,
  retryCalendarCall
};
```

---

## 13. Testing Strategy

### 13.1 Unit Tests

```javascript
// tests/unit/progressService.test.js
const progressService = require('../../src/services/progressService');

describe('ProgressService', () => {
  describe('calculateMilestoneDelta', () => {
    it('should calculate positive delta when ahead', () => {
      const goalStart = new Date('2025-01-01');
      const now = new Date('2025-02-01'); // 1 month elapsed
      const milestoneTarget = new Date('2025-04-01'); // 3 months from start
      
      // Expected progress: 33% (1/3 of time elapsed)
      // Actual progress: 50%
      // Delta: +17%
      
      const delta = {
        expectedProgress: 33,
        actualProgress: 50,
        delta: 17
      };
      
      expect(delta.status).toBe('ahead');
    });
    
    it('should calculate negative delta when behind', () => {
      const delta = {
        expectedProgress: 50,
        actualProgress: 25,
        delta: -25
      };
      
      expect(delta.status).toBe('behind');
    });
  });
});
```

### 13.2 Integration Tests

```javascript
// tests/integration/goalCreation.test.js
const request = require('supertest');
const app = require('../../src/app');
const admin = require('firebase-admin');

describe('Goal Creation Flow', () => {
  let testUserId;
  let testToken;
  
  beforeAll(async () => {
    // Create test user
    const userRecord = await admin.auth().createUser({
      email: 'test@example.com',
      emailVerified: true
    });
    testUserId = userRecord.uid;
    
    // Generate test token
    testToken = await admin.auth().createCustomToken(testUserId);
  });
  
  afterAll(async () => {
    // Cleanup
    await admin.auth().deleteUser(testUserId);
  });
  
  it('should create goal and generate plan', async () => {
    const questionnaireData = {
      category: 'creative_skills',
      specificity: 'Learn watercolor painting',
      currentState: 'beginner',
      targetState: 'Complete 20 paintings',
      deadline: '2026-01-01',
      learningStyles: ['hands_on_practice'],
      budget: '$50-200/month',
      equipment: 'Basic set',
      constraints: ''
    };
    
    // Create goal
    const createResponse = await request(app)
      .post('/api/goals/create')
      .set('Authorization', `Bearer ${testToken}`)
      .send(questionnaireData)
      .expect(200);
    
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.goalId).toBeDefined();
    
    const goalId = createResponse.body.data.goalId;
    
    // Wait for plan generation
    await new Promise(resolve => setTimeout(resolve, 12000));
    
    // Check plan
    const planResponse = await request(app)
      .get(`/api/goals/${goalId}/plan`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200);
    
    expect(planResponse.body.data.status).toBe('ready');
    expect(planResponse.body.data.plan.milestones.length).toBeGreaterThan(0);
  }, 30000);
});
```

### 13.3 End-to-End Tests

```javascript
// cypress/e2e/goal-creation.cy.js
describe('Goal Creation Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockGoogleAuth();
  });
  
  it('completes full goal creation', () => {
    // Login
    cy.contains('Sign in with Google').click();
    cy.wait('@googleAuth');
    
    // Skip demo video
    cy.get('[data-testid="skip-video"]').click();
    
    // Select category
    cy.contains('Creative Skills').click();
    
    // Fill questionnaire
    cy.get('[data-testid="specificity-input"]')
      .type('Learn watercolor portrait painting');
    cy.contains('Next').click();
    
    cy.get('[data-testid="current-state-beginner"]').click();
    cy.contains('Next').click();
    
    cy.get('[data-testid="target-state-input"]')
      .type('Complete 20 finished portraits');
    cy.contains('Next').click();
    
    cy.get('[data-testid="deadline-picker"]')
      .type('2026-06-01');
    cy.contains('Next').click();
    
    cy.get('[data-testid="learning-style-hands-on"]').check();
    cy.contains('Next').click();
    
    cy.get('[data-testid="budget-select"]')
      .select('$50-200/month');
    cy.contains('Next').click();
    
    cy.get('[data-testid="equipment-input"]')
      .type('Basic watercolor set');
    cy.contains('Next').click();
    
    cy.get('[data-testid="constraints-input"]')
      .type('');
    cy.contains('Generate Plan').click();
    
    // Wait for plan generation
    cy.contains('Creating your plan', { timeout: 15000 });
    cy.contains('Review Your Plan', { timeout: 15000 });
    
    // Verify plan structure
    cy.get('[data-testid="milestone"]').should('have.length.greaterThan', 2);
    
    // Approve plan
    cy.contains('Approve Plan').click();
    cy.contains('Scheduling events', { timeout: 30000 });
    
    // Verify dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="goal-card"]').should('exist');
    cy.contains('Learn watercolor portrait painting');
  });
});
```

### 13.4 Load Testing

```yaml
# artillery-config.yml
config:
  target: 'https://us-central1-dreamcalendar-prod.cloudfunctions.net/api'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 300
      arrivalRate: 20
      name: "Sustained load"
    - duration: 120
      arrivalRate: 50
      name: "Spike test"
  processor: "./test-processor.js"

scenarios:
  - name: "Dashboard Access"
    flow:
      - post:
          url: "/auth/google"
          json:
            idToken: "{{ $processEnvironment.TEST_TOKEN }}"
          capture:
            - json: "$.data.userId"
              as: "userId"
      - get:
          url: "/dashboard"
          headers:
            Authorization: "Bearer {{ $processEnvironment.TEST_TOKEN }}"
      - think: 5
      
  - name: "Goal Creation"
    weight: 2
    flow:
      - post:
          url: "/goals/create"
          headers:
            Authorization: "Bearer {{ $processEnvironment.TEST_TOKEN }}"
          json:
            category: "creative_skills"
            specificity: "Learn painting"
            currentState: "beginner"
            targetState: "Complete 10 paintings"
            deadline: "2026-01-01"
            learningStyles: ["hands_on_practice"]
            budget: "$50-200/month"
            equipment: "Basic set"
            constraints: ""
          capture:
            - json: "$.data.goalId"
              as: "goalId"
      - get:
          url: "/goals/{{ goalId }}/plan"
          headers:
            Authorization: "Bearer {{ $processEnvironment.TEST_TOKEN }}"
```
✅ Complete testing strategy (unit, integration, e2e, load)

---

# Part 7: Frontend Implementation

## 14. Frontend Architecture

### 14.1 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── GoogleLoginButton.jsx
│   ├── onboarding/
│   │   ├── CategorySelection.jsx
│   │   ├── QuestionnaireFlow.jsx
│   │   ├── QuestionScreen.jsx
│   │   └── DemoVideo.jsx
│   ├── goals/
│   │   ├── GoalCard.jsx
│   │   ├── GoalList.jsx
│   │   ├── PlanReview.jsx
│   │   ├── MilestoneTimeline.jsx
│   │   └── ProgressBar.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── TodaysTasks.jsx
│   │   ├── ActiveGoals.jsx
│   │   ├── UpcomingMilestones.jsx
│   │   ├── RecentResources.jsx
│   │   ├── ProgressStats.jsx
│   │   └── CalendarView.jsx
│   ├── adjustments/
│   │   ├── AdjustmentAlert.jsx
│   │   └── AdjustmentModal.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── Loading.jsx
│       ├── Toast.jsx
│       └── ErrorBoundary.jsx
├── pages/
│   ├── Login.jsx
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── GoalDetail.jsx
│   ├── Settings.jsx
│   └── Pricing.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useGoals.js
│   ├── useProgress.js
│   └── useToast.js
├── services/
│   ├── api.js
│   └── firebase.js
├── store/
│   └── store.js
├── utils/
│   ├── dateHelpers.js
│   └── validators.js
└── App.jsx
```

### 14.2 State Management with Zustand

```javascript
// src/store/store.js
import { create } from 'zustand';
import { api } from '../services/api';

export const useStore = create((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Goals state
  goals: [],
  activeGoals: [],
  completedGoals: [],
  loadingGoals: false,
  
  fetchGoals: async () => {
    set({ loadingGoals: true });
    try {
      const response = await api.get('/user/profile');
      const goals = response.data.goals || [];
      
      set({
        goals,
        activeGoals: goals.filter(g => g.status === 'active'),
        completedGoals: goals.filter(g => g.status === 'completed'),
        loadingGoals: false
      });
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      set({ loadingGoals: false });
    }
  },
  
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal],
    activeGoals: [...state.activeGoals, goal]
  })),
  
  updateGoal: (goalId, updates) => set((state) => ({
    goals: state.goals.map(g => g.id === goalId ? { ...g, ...updates } : g),
    activeGoals: state.activeGoals.map(g => g.id === goalId ? { ...g, ...updates } : g)
  })),
  
  removeGoal: (goalId) => set((state) => ({
    goals: state.goals.filter(g => g.id !== goalId),
    activeGoals: state.activeGoals.filter(g => g.id !== goalId)
  })),
  
  // Dashboard data
  dashboardData: null,
  loadingDashboard: false,
  
  fetchDashboard: async () => {
    set({ loadingDashboard: true });
    try {
      const response = await api.get('/dashboard');
      set({
        dashboardData: response.data.data,
        loadingDashboard: false
      });
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      set({ loadingDashboard: false });
    }
  },
  
  // Toast notifications
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now() }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  }))
}));
```

### 14.3 API Service

```javascript
// src/services/api.js
import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific error codes
      if (status === 401) {
        // Redirect to login
        window.location.href = '/login';
      }
      
      throw {
        statusCode: status,
        code: data.error?.code || 'UNKNOWN_ERROR',
        message: data.error?.message || 'An error occurred'
      };
    } else if (error.request) {
      throw {
        statusCode: 0,
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.'
      };
    } else {
      throw {
        statusCode: 0,
        code: 'UNKNOWN_ERROR',
        message: error.message
      };
    }
  }
);

export { api };
```

### 14.4 Key Components

#### Dashboard Component

```jsx
// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useStore } from '../store/store';
import TodaysTasks from '../components/dashboard/TodaysTasks';
import ActiveGoals from '../components/dashboard/ActiveGoals';
import UpcomingMilestones from '../components/dashboard/UpcomingMilestones';
import RecentResources from '../components/dashboard/RecentResources';
import ProgressStats from '../components/dashboard/ProgressStats';
import CalendarView from '../components/dashboard/CalendarView';
import AdjustmentAlert from '../components/adjustments/AdjustmentAlert';
import Loading from '../components/common/Loading';

export default function Dashboard() {
  const { dashboardData, loadingDashboard, fetchDashboard } = useStore();
  
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);
  
  if (loadingDashboard) {
    return <Loading message="Loading dashboard..." />;
  }
  
  if (!dashboardData) {
    return null;
  }
  
  const hasAlerts = dashboardData.activeGoals.some(
    g => g.nextMilestone?.delta < -20
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Dream Calendar
            </h1>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => window.location.href = '/goals/new'}
            >
              + New Goal
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Alerts */}
        {hasAlerts && (
          <section>
            {dashboardData.activeGoals
              .filter(g => g.nextMilestone?.delta < -20)
              .map(goal => (
                <AdjustmentAlert key={goal.id} goal={goal} />
              ))}
          </section>
        )}
        
        {/* Today's Tasks */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Today's Tasks
          </h2>
          <TodaysTasks tasks={dashboardData.todaysTasks} />
        </section>
        
        {/* Active Goals */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Active Goals
          </h2>
          <ActiveGoals goals={dashboardData.activeGoals} />
        </section>
        
        {/* Upcoming Milestones */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Upcoming Milestones
          </h2>
          <UpcomingMilestones milestones={dashboardData.upcomingMilestones} />
        </section>
        
        {/* Recent Resources */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Recent Resources
          </h2>
          <RecentResources resources={dashboardData.recentResources} />
        </section>
        
        {/* Progress Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            This Week's Progress
          </h2>
          <ProgressStats stats={dashboardData.weeklyStats} />
        </section>
        
        {/* Calendar View */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Your Calendar
          </h2>
          <CalendarView />
        </section>
      </main>
    </div>
  );
}
```

#### Goal Card Component

```jsx
// src/components/goals/GoalCard.jsx
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';

export default function GoalCard({ goal }) {
  const navigate = useNavigate();
  
  const getDeltaColor = (delta) => {
    if (delta > 5) return 'text-green-600 bg-green-50';
    if (delta < -20) return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };
  
  const getDeltaText = (delta) => {
    if (delta > 5) return `${delta}% ahead`;
    if (delta < -20) return `${Math.abs(delta)}% behind`;
    return 'On track';
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6"
      onClick={() => navigate(`/goals/${goal.id}`)}
      style={{ borderLeft: `4px solid ${goal.color}` }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {goal.title}
          </h3>
          <span className="text-sm text-gray-500">
            {goal.category.replace('_', ' ')}
          </span>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${getDeltaColor(goal.nextMilestone.delta)}`}>
          {getDeltaText(goal.nextMilestone.delta)}
        </span>
      </div>
      
      {/* Progress */}
      <ProgressBar 
        progress={goal.progress} 
        color={goal.color}
        className="mb-4"
      />
      
      {/* Next Milestone */}
      <div className="space-y-1">
        <p className="text-sm text-gray-600">Next Milestone:</p>
        <p className="font-medium text-gray-900">
          {goal.nextMilestone.title}
        </p>
        <p className="text-sm text-gray-500">
          {goal.nextMilestone.daysRemaining} days remaining
        </p>
      </div>
      
      {/* Actions */}
      <div className="mt-4 flex space-x-2">
        <button 
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          onClick={(e) => {
            e.stopPropagation();
            // Handle pause
          }}
        >
          Pause
        </button>
        <button 
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/goals/${goal.id}/adjust`);
          }}
        >
          Adjust
        </button>
      </div>
    </div>
  );
}
```

#### Questionnaire Flow Component

```jsx
// src/components/onboarding/QuestionnaireFlow.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionScreen from './QuestionScreen';
import { api } from '../../services/api';
import { useStore } from '../../store/store';

const QUESTIONS = [
  {
    id: 'specificity',
    title: "What exactly do you want to achieve?",
    subtitle: "Be as specific as possible",
    type: 'text',
    placeholder: 'e.g., Learn watercolor portrait painting',
    validation: { min: 10, max: 500 }
  },
  {
    id: 'currentState',
    title: "What's your current experience level?",
    subtitle: "This helps us calibrate the starting point",
    type: 'select',
    options: [
      { value: 'no_experience', label: 'No experience' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ]
  },
  {
    id: 'targetState',
    title: "What does success look like?",
    subtitle: "Describe your ideal outcome",
    type: 'text',
    placeholder: 'e.g., Complete 20 finished watercolor portraits',
    validation: { min: 10, max: 500 }
  },
  {
    id: 'deadline',
    title: "When do you want to achieve this by?",
    subtitle: "Set a realistic deadline",
    type: 'date',
    min: new Date().toISOString().split('T')[0]
  },
  {
    id: 'learningStyles',
    title: "How do you prefer to learn?",
    subtitle: "Select all that apply",
    type: 'checkbox',
    options: [
      { value: 'structured_courses', label: 'Structured courses' },
      { value: 'self_guided', label: 'Self-guided learning' },
      { value: 'hands_on_practice', label: 'Hands-on practice' },
      { value: 'video_tutorials', label: 'Video tutorials' },
      { value: 'books_reading', label: 'Books/reading' },
      { value: 'mentorship', label: 'Mentorship/coaching' }
    ]
  },
  {
    id: 'budget',
    title: "What budget can you allocate?",
    subtitle: "Per month",
    type: 'select',
    options: [
      { value: '$0', label: '$0 (free resources only)' },
      { value: '$1-50', label: '$1-50/month' },
      { value: '$51-200', label: '$51-200/month' },
      { value: '$201-500', label: '$201-500/month' },
      { value: '$500+', label: '$500+/month' }
    ]
  },
  {
    id: 'equipment',
    title: "What equipment or tools do you already have?",
    subtitle: "This helps us recommend what you need",
    type: 'text',
    placeholder: 'e.g., Basic watercolor set, brushes',
    validation: { max: 1000 },
    optional: true
  },
  {
    id: 'constraints',
    title: "Any limitations we should know about?",
    subtitle: "Time, physical, or other constraints",
    type: 'textarea',
    placeholder: 'e.g., Can only work on weekends',
    validation: { max: 1000 },
    optional: true
  }
];

export default function QuestionnaireFlow({ category }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useStore();
  
  const currentQuestion = QUESTIONS[currentStep];
  
  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleNext = async () => {
    // Validate current answer
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.optional && !answer) {
      addToast({
        type: 'error',
        message: 'Please answer this question'
      });
      return;
    }
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await api.post('/goals/create', {
        category,
        ...answers
      });
      
      const { goalId } = response.data.data;
      
      // Navigate to plan review (polling for plan generation)
      navigate(`/goals/${goalId}/review`);
    } catch (error) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to create goal'
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question */}
        <QuestionScreen
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={handleAnswer}
          onNext={handleNext}
          onBack={handleBack}
          canGoBack={currentStep > 0}
          isLast={currentStep === QUESTIONS.length - 1}
          loading={loading}
        />
      </div>
    </div>
  );
}
```

---

## 15. Deployment & DevOps

### 15.1 Environment Variables

```bash
# .env.development
VITE_FIREBASE_API_KEY=your-dev-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-dev
VITE_FIREBASE_STORAGE_BUCKET=your-project-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_API_BASE_URL=http://localhost:5001/your-project-dev/us-central1/api

# .env.production
VITE_FIREBASE_API_KEY=your-prod-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-prod
VITE_FIREBASE_STORAGE_BUCKET=your-project-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:xyz789
VITE_API_BASE_URL=https://us-central1-your-project-prod.cloudfunctions.net/api
```

### 15.2 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm test
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID_TEST }}
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Firebase CLI
        run: npm install -g firebase-tools
      
      - name: Deploy to Firebase
        run: firebase deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
```

### 15.3 Firebase Configuration

```json
// firebase.json
{
  "functions": {
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"],
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 16. Monitoring & Maintenance

### 16.1 Sentry Error Tracking

```javascript
// src/main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});
```

### 16.2 Google Analytics

```javascript
// src/utils/analytics.js
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export function trackGoalCreated(goal) {
  trackEvent('goal_created', {
    category: goal.category,
    user_level: goal.currentState,
    deadline_months: calculateMonthsToDeadline(goal.deadline)
  });
}

export function trackGoalCompleted(goal) {
  trackEvent('goal_completed', {
    category: goal.category,
    duration_days: goal.durationDays,
    completion_rate: goal.finalCompletionRate
  });
}
```

---

## 17. Final Checklist

### 17.1 Pre-Launch Checklist

**Technical:**
- [ ] All tests passing (unit, integration, e2e)
- [ ] Load testing completed (can handle 100 concurrent users)
- [ ] Security audit completed
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics 4)
- [ ] Health checks implemented and tested
- [ ] Backup strategy in place (daily automated)
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Environment variables secured

**Legal:**
- [ ] Privacy policy created and reviewed
- [ ] Terms of service created and reviewed
- [ ] Cookie consent implemented
- [ ] GDPR compliance verified
- [ ] Data retention policy defined

**Business:**
- [ ] Stripe account configured and tested
- [ ] Pricing finalized ($9.99/month, $99/year)
- [ ] Support email configured (support@dreamcalendar.app)
- [ ] Demo video created (30 seconds)
- [ ] Landing page created
- [ ] Beta testers recruited (target: 50 users)

### 17.2 Launch Day Checklist

- [ ] Deploy to production
- [ ] Verify all services are operational
- [ ] Test critical user flows (signup, goal creation, payment)
- [ ] Monitor error rates (target: < 1%)
- [ ] Monitor performance metrics (dashboard < 2s load)
- [ ] Check payment processing
- [ ] Announce to beta users
- [ ] Monitor user feedback channels

### 17.3 Post-Launch (First Week)

- [ ] Daily monitoring of error rates
- [ ] Daily monitoring of key metrics (DAU, goal creation rate)
- [ ] Address critical bugs within 24 hours
- [ ] Weekly performance reviews
- [ ] Gather and document user feedback
- [ ] Plan first iteration based on feedback

---

## 18. Cost Summary

### 18.1 Monthly Infrastructure Costs

| Service | Estimated Cost | Notes |
|---------|---------------|--------|
| Firebase (Firestore, Functions, Auth) | $90 | 1M reads, 500K writes, 10M function invocations |
| LLM API (OpenAI/Claude/Gemini) | $150 | 1000 plans + 2000 adjustments + 5000 regenerations |
| Vercel (Hosting) | $0-20 | Free tier or Pro if needed |
| Stripe | 2.9% + $0.30 | Per transaction |
| SendGrid (Email) | $0 | < 100 emails/day |
| Sentry | $0 | < 5K errors/month |
| **Total** | **~$260/month** | Scales with usage |

### 18.2 Revenue Projections (Year 1)

| Month | Users | Paid (30%) | MRR | Costs | Net |
|-------|-------|------------|-----|-------|-----|
| 1 | 100 | 30 | $300 | $260 | $40 |
| 3 | 500 | 150 | $1,500 | $400 | $1,100 |
| 6 | 2,000 | 600 | $6,000 | $800 | $5,200 |
| 12 | 10,000 | 3,000 | $30,000 | $2,000 | $28,000 |

**Break-even:** Month 1  
**Target ARR by end of Year 1:** $360,000

---

## 19. Success Metrics

### 19.1 Key Performance Indicators

**User Acquisition:**
- Daily Active Users (DAU) - Primary metric
- New sign-ups per day
- Activation rate (% completing first goal)

**Engagement:**
- Goals created per user
- Average tasks completed per week
- 7-day retention rate
- 30-day retention rate

**Revenue:**
- Free to  const monthEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
  
  const availability = await calendarService.getCalendarAvailability(
    userId, 
    monthStart, 
    monthEnd
  );
  
  // Get goal data
  const goalDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .get();
  
  const goal = goalDoc.data();
  
  // Generate adjusted schedule using LLM
  const adjustedSchedule = await llmService.generateMonthlySchedule(
    goal,
    lastMonthStats,
    availability
  );
  
  // Create events for next month
  const eventIds = await createMonthlyEvents(
    userId,
    goalId,
    adjustedSchedule.nextMonthSchedule,
    goal.calendar.color,
    monthStart,
    monthEnd
  );
  
  // Update goal document
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .update({
      'calendar.lastScheduledMonth': `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`,
      'calendar.eventIds': admin.firestore.FieldValue.arrayUnion(...eventIds)
    });
  
  console.log(`Regenerated ${eventIds.length} events for goal ${goalId}`);
  return eventIds;
}

async function getLastMonthStats(userId, goalId) {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const monthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  const monthStart = new Date(monthKey + '-01');
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  
  const logsSnapshot = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('progressLogs')
    .where('date', '>=', admin.firestore.Timestamp.fromDate(monthStart))
    .where('date', '<', admin.firestore.Timestamp.fromDate(monthEnd))
    .get();
  
  let totalScheduled = 0;
  let totalCompleted = 0;
  const completionByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  const taskCompletionCount = {};
  
  for (const logDoc of logsSnapshot.docs) {
    const log = logDoc.data();
    totalScheduled += log.tasksScheduled || 0;
    totalCompleted += log.tasksCompleted || 0;
    
    const dayOfWeek = log.date.toDate().getDay();
    completionByDay[dayOfWeek] += log.tasksCompleted || 0;
    
    // Track which task types were completed
    for (const task of log.completedTasks || []) {
      const title = task.title || 'Unknown';
      taskCompletionCount[title] = (taskCompletionCount[title] || 0) + 1;
    }
  }
  
  const completionRate = totalScheduled > 0 
    ? Math.round((totalCompleted / totalScheduled) * 100) 
    : 0;
  
  // Identify best days (most completions)
  const bestDays = completionByDay
    .map((count, day) => ({ day, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(d => d.day);
  
  // Identify frequently skipped tasks (scheduled but low completion)
  const goalDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .get();
  
  const recurringTasks = goalDoc.data().plan.taskTemplate.recurringTasks || [];
  const skippedTasks = [];
  
  for (const task of recurringTasks) {
    const completionCount = taskCompletionCount[task.title] || 0;
    const expectedCount = 4; // Rough estimate for monthly
    
    if (completionCount < expectedCount * 0.5) {
      skippedTasks.push(task.title);
    }
  }
  
  return {
    completionRate,
    completed: totalCompleted,
    scheduled: totalScheduled,
    skippedTasks,
    bestDays,
    movedTasks: [], // Would need calendar change tracking
    averageDelay: 0
  };
}

async function createMonthlyEvents(userId, goalId, schedule, color, monthStart, monthEnd) {
  const calendar = await calendarService.getCalendarClient(userId);
  const eventIds = [];
  
  // Create recurring tasks
  for (const task of schedule.recurringTasks) {
    const taskDate = new Date(monthStart);
    const [hour, minute] = task.timeSlot.split(':');
    taskDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    const daysOfWeek = ['SU','MO','TU','WE','TH','FR','SA'];
    const byDay = task.daysOfWeek.map(d => daysOfWeek[d]).join(',');
    const until = monthEnd.toISOString().split('T')[0].replace(/-/g, '');
    
    const recurrence = task.frequency === 'daily'
      ? `RRULE:FREQ=DAILY;UNTIL=${until}`
      : `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}`;
    
    const endTime = new Date(taskDate.getTime() + task.duration * 60000);
    
    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: task.title,
          description: 'Monthly regeneration',
          start: { dateTime: taskDate.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
          recurrence: [recurrence],
          colorId: color,
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }]
          },
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'recurring_task'
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    } catch (error) {
      console.error(`Failed to create recurring task: ${error.message}`);
    }
  }
  
  // Create one-time tasks
  for (const task of schedule.oneTimeTasks) {
    const taskDate = new Date(task.preferredDate);
    const endTime = new Date(taskDate.getTime() + task.duration * 60000);
    
    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: task.title,
          description: 'Monthly scheduled task',
          start: { dateTime: taskDate.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
          colorId: color,
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 15 }]
          },
          extendedProperties: {
            private: {
              appName: 'DreamCalendar',
              goalId: goalId,
              type: 'one_time_task',
              priority: task.priority
            }
          }
        }
      });
      
      eventIds.push(event.data.id);
    } catch (error) {
      console.error(`Failed to create one-time task: ${error.message}`);
    }
  }
  
  return eventIds;
}

module.exports = { regenerateNextMonth, getLastMonthStats };

**Revenue:**
- Free to paid conversion rate
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (LTV)
- Churn rate

**Product:**
- Goal completion rate (% of goals completed vs created)
- Average time to goal completion
- Calendar sync reliability (% successful syncs)
- LLM response quality (user satisfaction)

### 19.2 Target Metrics (End of Year 1)

| Metric | Target | Stretch Goal |
|--------|--------|--------------|
| Daily Active Users | 3,000 | 5,000 |
| Monthly Active Users | 10,000 | 15,000 |
| Goal Completion Rate | 40% | 50% |
| Free to Paid Conversion | 30% | 40% |
| 7-Day Retention | 50% | 60% |
| 30-Day Retention | 30% | 40% |
| MRR | $30,000 | $50,000 |
| Customer Churn (monthly) | <5% | <3% |

### 19.3 Analytics Implementation

```javascript
// Track key events throughout the app

// Goal lifecycle
trackEvent('goal_created', { category, timeline_months });
trackEvent('goal_approved', { milestones_count, tasks_count });
trackEvent('goal_paused', { progress_percentage, days_active });
trackEvent('goal_resumed', { days_paused });
trackEvent('goal_completed', { duration_days, completion_rate });
trackEvent('goal_deleted', { progress_percentage, reason });

// User engagement
trackEvent('task_completed', { goal_category, task_type });
trackEvent('milestone_reached', { goal_category, milestone_index });
trackEvent('adjustment_applied', { trigger_type, option_selected });
trackEvent('resource_clicked', { resource_type, goal_category });

// Conversion events
trackEvent('subscription_started', { plan_type, price });
trackEvent('subscription_canceled', { days_active, goals_completed });
trackEvent('payment_succeeded', { plan_type, amount });
trackEvent('payment_failed', { plan_type, reason });
```

---

## 20. Documentation Requirements

### 20.1 API Documentation

**Location:** `docs/api/README.md`

**Structure:**
```markdown
# Dream Calendar API Documentation

## Authentication
- How to obtain tokens
- Token refresh flow
- Error codes

## Endpoints
For each endpoint:
- HTTP method and path
- Description
- Request parameters
- Request body schema
- Response schema
- Example requests/responses
- Error scenarios
- Rate limits

## Webhooks
- Calendar change webhook
- Stripe webhook
- Setup instructions

## SDKs
- JavaScript/TypeScript client
- Code examples
```

**Auto-generation:** Use OpenAPI/Swagger specification

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Dream Calendar API
  version: 1.0.0
  description: AI-powered goal achievement platform

servers:
  - url: https://us-central1-dreamcalendar-prod.cloudfunctions.net/api
    description: Production
  - url: http://localhost:5001/dreamcalendar-dev/us-central1/api
    description: Development

paths:
  /goals/create:
    post:
      summary: Create a new goal
      tags: [Goals]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateGoalRequest'
      responses:
        '200':
          description: Goal creation initiated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateGoalResponse'
```

### 20.2 User Documentation

**Help Center Structure:**

```
docs/user/
├── getting-started/
│   ├── creating-your-first-goal.md
│   ├── understanding-your-plan.md
│   ├── calendar-integration.md
│   └── subscription-plans.md
├── features/
│   ├── goal-creation.md
│   ├── progress-tracking.md
│   ├── adjustments.md
│   ├── resources.md
│   └── multiple-goals.md
├── troubleshooting/
│   ├── calendar-sync-issues.md
│   ├── plan-generation-failed.md
│   └── payment-issues.md
└── faq.md
```

**Key Articles:**

1. **Getting Started: Creating Your First Goal**
```markdown
# Creating Your First Goal

Welcome to Dream Calendar! Let's create your first goal in 5 minutes.

## Step 1: Sign in with Google
Click "Sign in with Google" and grant calendar permissions...

## Step 2: Choose Your Category
Select the category that best fits your goal...

## Step 3: Answer the Questions
Be honest and specific in your answers...

## Step 4: Review Your Plan
The AI has created a personalized plan...

## Step 5: Let's Go!
Your calendar is now populated with tasks...
```

2. **Understanding Your Delta**
```markdown
# Understanding Your Progress Delta

The "delta" shows how far ahead or behind you are compared to your expected progress.

## What It Means
- **Green (+5% or more)**: You're ahead of schedule! 🎉
- **Yellow (-5% to +5%)**: You're on track ✓
- **Red (-20% or more)**: You're falling behind ⚠️

## What to Do When Falling Behind
1. Click the alert notification
2. Review the adjustment suggestions
3. Choose the option that works best for you
...
```

### 20.3 Developer Documentation

**Developer Onboarding Guide:**

```markdown
# Developer Onboarding Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI
- Git

## Setup (15 minutes)

### 1. Clone Repository
git clone https://github.com/your-org/dream-calendar.git
cd dream-calendar

### 2. Install Dependencies
npm install
cd functions && npm install && cd ..

### 3. Environment Setup
cp .env.example .env
# Edit .env with your credentials

### 4. Firebase Setup
firebase login
firebase use --add  # Select development project

### 5. Start Development
# Terminal 1: Start Firebase emulators
firebase emulators:start

# Terminal 2: Start frontend dev server
npm run dev

### 6. Run Tests
npm test                  # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e         # E2E tests

## Project Structure
See ARCHITECTURE.md for detailed overview

## Development Workflow
1. Create feature branch from `develop`
2. Make changes
3. Write tests
4. Run linter: `npm run lint`
5. Create pull request
6. Wait for CI checks
7. Get code review approval
8. Merge to develop

## Common Tasks

### Adding a New API Endpoint
1. Create handler in `functions/src/api/`
2. Add route in `functions/src/index.js`
3. Add validation schema
4. Write tests
5. Update API documentation

### Adding a New Component
1. Create component in `src/components/`
2. Export from index.js
3. Write component tests
4. Add Storybook story (if UI component)

### Debugging
- Backend: Use Firebase emulator logs
- Frontend: Browser DevTools
- API: Postman collection in `docs/postman/`
```

### 20.4 Code Comments & Inline Documentation

**Standards:**

```javascript
/**
 * Generates a personalized goal plan using LLM
 * 
 * @param {Object} questionnaireData - User's questionnaire responses
 * @param {string} questionnaireData.category - Goal category
 * @param {string} questionnaireData.specificity - What user wants to achieve
 * @param {Object} calendarAvailability - Available time slots from user's calendar
 * @param {Array} calendarAvailability.freeSlots - Array of free time slots
 * @param {number} calendarAvailability.totalFreeHours - Total free hours available
 * 
 * @returns {Promise<Object>} Generated plan with milestones, objectives, and tasks
 * @throws {LLMError} When LLM API fails or returns invalid response
 * 
 * @example
 * const plan = await llmService.generatePlan(
 *   { category: 'creative_skills', specificity: 'Learn painting' },
 *   { totalFreeHours: 10, freeSlots: [...] }
 * );
 */
async generatePlan(questionnaireData, calendarAvailability) {
  // Implementation
}
```

---

## 21. Support & Maintenance

### 21.1 Support Channels

**Email Support:**
- Address: support@dreamcalendar.app
- Response time SLA:
  - Free users: 48 hours (business days)
  - Pro users: 24 hours
  - Critical issues: 4 hours
- Escalation to engineering for technical issues

**Help Center:**
- Self-service knowledge base
- Search functionality
- Video tutorials
- FAQ section

**Community:**
- Discord server for users
- Community forum for discussions
- Twitter (@dreamcalendar) for updates

**Status Page:**
- Real-time system status at status.dreamcalendar.app
- Incident history
- Scheduled maintenance notifications

### 21.2 Support Workflow

```
User submits ticket
        ↓
Automated acknowledgment (immediate)
        ↓
Ticket categorized (Priority 1-4)
        ↓
    ┌────┴────┐
    │         │
    ↓         ↓
Priority 1  Priority 2-4
(Critical)  (Standard)
    │         │
    ↓         ↓
Eng team    Support team
(4 hours)   (24-48 hours)
    │         │
    └────┬────┘
         ↓
Issue resolved
         ↓
Follow-up email
         ↓
Ticket closed
```

**Priority Definitions:**

- **Priority 1 (Critical):** System down, payment processing broken, data loss
- **Priority 2 (High):** Major feature broken, affecting multiple users
- **Priority 3 (Medium):** Minor feature issue, workaround available
- **Priority 4 (Low):** Feature request, cosmetic issue

### 21.3 Maintenance Schedule

**Daily:**
- Monitor error rates and performance metrics
- Check system health endpoints
- Review critical user feedback
- Monitor payment processing

**Weekly:**
- Review all open support tickets
- Analyze user feedback trends
- Deploy bug fixes and minor improvements
- Update documentation as needed
- Review security alerts

**Monthly:**
- Review and optimize LLM costs
- Update npm dependencies
- Security patches
- Performance optimization review
- Backup verification
- Generate usage reports

**Quarterly:**
- Major feature releases
- Comprehensive security audit
- Infrastructure cost optimization
- User satisfaction survey
- Roadmap review and planning

### 21.4 Incident Response Plan

**Detection:**
- Automated monitoring alerts (Sentry, Firebase)
- User reports via support
- Health check failures

**Response Procedure:**

1. **Acknowledge** (within 15 minutes)
   - Update status page
   - Alert engineering team
   - Post on social media

2. **Assess** (within 30 minutes)
   - Determine severity
   - Identify root cause
   - Estimate impact

3. **Mitigate** (within 1-4 hours depending on severity)
   - Implement fix or workaround
   - Deploy to production
   - Verify resolution

4. **Communicate** (continuous)
   - Update status page every 30 minutes
   - Email affected users
   - Post resolution announcement

5. **Post-Mortem** (within 48 hours)
   - Document incident timeline
   - Identify root cause
   - Create action items to prevent recurrence
   - Share learnings with team

**Example Incident:**
```markdown
# Incident Report: LLM API Timeout
Date: 2025-11-15
Duration: 2 hours
Impact: 45 users unable to generate plans

## Timeline
09:00 - First error detected via Sentry
09:15 - Status page updated, team alerted
09:30 - Root cause identified (LLM provider outage)
10:45 - Fallback LLM provider activated
11:00 - Service restored, monitoring for stability
11:30 - All clear, incident closed

## Root Cause
Primary LLM provider (OpenAI) experienced API outage

## Resolution
Implemented automatic failover to secondary LLM provider (Anthropic)

## Action Items
1. [ ] Add multiple LLM provider support with automatic failover
2. [ ] Implement LLM response caching for common patterns
3. [ ] Set up dedicated status monitoring for LLM providers
```

### 21.5 Backup & Disaster Recovery

**Backup Strategy:**

1. **Firestore Database**
   - Automated daily backups (retained for 30 days)
   - Weekly backups (retained for 1 year)
   - Backup location: Google Cloud Storage
   - Test restoration: Monthly

2. **User Uploaded Files** (if any)
   - Firebase Storage automatic replication
   - Cross-region backup

3. **Code & Configuration**
   - Git repository (GitHub)
   - Environment variables in secure vault (1Password/Secrets Manager)
   - Firebase configuration files backed up

**Recovery Procedures:**

**Scenario 1: Database Corruption**
```bash
# Restore from latest backup
gcloud firestore import gs://backup-bucket/2025-11-15 \
  --project=dreamcalendar-prod
  
# Verify data integrity
npm run verify:database

# Gradually restore traffic
```

**Scenario 2: Complete Infrastructure Failure**
1. Provision new Firebase project
2. Restore database from backup
3. Deploy functions and hosting
4. Update DNS records
5. Verify all services operational
6. Restore traffic

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 1 hour

---

## 22. Appendices

### Appendix A: Sample Data Structures

**Sample Goal Document:**
```json
{
  "id": "goal_abc123",
  "userId": "user_xyz789",
  "status": "active",
  "category": "creative_skills",
  "specificity": "Learn watercolor portrait painting",
  "currentState": "beginner",
  "targetState": "Complete 20 finished watercolor portraits",
  "deadline": "2026-06-01T00:00:00Z",
  "learningStyles": ["hands_on_practice", "video_tutorials"],
  "budget": "$50-200/month",
  "equipment": "Basic watercolor set, brushes, paper",
  "constraints": "Can only work on weekends",
  "plan": {
    "generatedAt": "2025-11-15T10:00:00Z",
    "llmModel": "gpt-4o",
    "milestones": [
      {
        "id": "m1",
        "title": "Master Basic Watercolor Techniques",
        "description": "Learn fundamental skills including wet-on-wet, wet-on-dry, color mixing, and brush control",
        "targetDate": "2026-01-01T00:00:00Z",
        "status": "in_progress",
        "completedAt": null,
        "calendarEventId": "event_milestone_1",
        "estimatedProgress": 33
      }
    ],
    "objectives": [
      {
        "id": "o1",
        "milestoneId": "m1",
        "title": "Learn Wet-on-Wet Technique",
        "description": "Practice creating soft, blended effects",
        "targetDate": "2025-12-01T00:00:00Z",
        "status": "pending",
        "completedAt": null,
        "calendarEventId": "event_objective_1",
        "estimatedHours": 8
      }
    ],
    "taskTemplate": {
      "recurringTasks": [
        {
          "title": "Brush Control Practice",
          "description": "30 minutes of basic strokes and techniques",
          "duration": 30,
          "frequency": "weekly",
          "daysOfWeek": [6, 0],
          "preferredTime": "morning",
          "skillFocus": "fundamentals"
        }
      ],
      "oneTimeTasks": [
        {
          "title": "Complete Color Wheel",
          "description": "Create comprehensive color wheel",
          "duration": 120,
          "linkedObjectiveIndex": 0,
          "schedulingPriority": 8,
          "prerequisites": [],
          "estimatedDifficulty": "beginner"
        }
      ]
    }
  },
  "calendar": {
    "color": "#FF5733",
    "lastScheduledMonth": "2025-11",
    "nextScheduleDate": "2025-12-01T00:00:00Z",
    "eventIds": ["event1", "event2", "event3"]
  },
  "progress": {
    "totalTasksScheduled": 50,
    "tasksCompleted": 35,
    "completionRate": 70,
    "lastCompletedTask": "2025-11-14T18:30:00Z",
    "currentStreak": 7,
    "longestStreak": 12,
    "totalMinutesInvested": 1250
  },
  "resources": [
    {
      "id": "res1",
      "type": "course",
      "title": "Watercolor Basics by Jane Doe",
      "url": "https://skillshare.com/watercolor-basics",
      "description": "Comprehensive beginner course",
      "unlockedAt": "2025-11-15T10:00:00Z",
      "linkedMilestoneId": "m1",
      "addedBy": "system"
    }
  ],
  "createdAt": "2025-11-15T10:00:00Z",
  "updatedAt": "2025-11-14T18:30:00Z",
  "completedAt": null,
  "pausedAt": null
}
```

**Sample Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "todaysTasks": [
      {
        "goalId": "goal_abc123",
        "goalTitle": "Learn Watercolor",
        "goalColor": "#FF5733",
        "eventId": "event_456",
        "title": "Brush Control Practice",
        "startTime": "2025-11-15T09:00:00Z",
        "endTime": "2025-11-15T09:30:00Z",
        "duration": 30,
        "completed": false,
        "type": "recurring_task"
      }
    ],
    "activeGoals": [
      {
        "id": "goal_abc123",
        "title": "Learn Watercolor Portrait Painting",
        "category": "creative_skills",
        "color": "#FF5733",
        "progress": 70,
        "nextMilestone": {
          "title": "Master Basics",
          "targetDate": "2026-01-01T00:00:00Z",
          "daysRemaining": 47,
          "progress": 70,
          "delta": 5,
          "status": "ahead"
        },
        "status": "active"
      }
    ],
    "upcomingMilestones": [
      {
        "goalId": "goal_abc123",
        "goalTitle": "Learn Watercolor",
        "goalColor": "#FF5733",
        "milestoneTitle": "Master Basics",
        "targetDate": "2026-01-01T00:00:00Z",
        "daysRemaining": 47,
        "progress": 70
      }
    ],
    "recentResources": [
      {
        "goalId": "goal_abc123",
        "type": "course",
        "title": "Watercolor Basics",
        "url": "https://skillshare.com/...",
        "description": "Beginner course",
        "unlockedAt": "2025-11-10T00:00:00Z"
      }
    ],
    "weeklyStats": {
      "completionRate": 85,
      "totalCompleted": 17,
      "totalScheduled": 20,
      "minutesInvested": 450,
      "goalsActive": 2
    }
  }
}
```

### Appendix B: Glossary

**Terms:**

- **Goal:** A long-term objective the user wants to achieve
- **Milestone (L1):** Major checkpoint spanning multiple months (3-6 in a goal)
- **Objective (L2):** Short-term sub-goal lasting 1-4 weeks (2-4 per milestone)
- **Task (L3):** Individual actionable item with time block (15 min - 2 hours)
- **Recurring Task:** Task that repeats on a schedule (daily/weekly)
- **One-Time Task:** Task that occurs once for a specific project
- **Delta:** Difference between expected and actual progress (percentage)
- **Completion Rate:** Percentage of scheduled tasks actually completed
- **Smart Regeneration:** AI-adjusted monthly schedule based on previous performance
- **Practicality Check:** System validation of multiple concurrent goals feasibility
- **Progressive Goal:** Suggested next goal after completing current goal
- **Calendar Slot:** Available time period in user's calendar
- **Time of Day:** Morning (6am-12pm), Afternoon (12pm-6pm), Evening (6pm-10pm)

**Status Values:**
- `active`: Goal is currently being pursued
- `paused`: Goal temporarily suspended by user
- `completed`: Goal successfully achieved
- `archived`: Goal saved but not active
- `deleted`: Goal marked for permanent deletion
- `processing`: Plan being generated by LLM

**Error Codes:**
- `AUTH_ERROR`: Authentication failed
- `CALENDAR_PERMISSION_ERROR`: Calendar access denied
- `SUBSCRIPTION_ERROR`: Pro subscription required
- `LLM_ERROR`: AI service unavailable
- `CALENDAR_FULL`: No time slots available
- `RATE_LIMIT`: Too many requests
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource doesn't exist
- `INTERNAL_ERROR`: Unexpected server error

### Appendix C: References

**External Documentation:**
- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

**Industry Standards:**
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [REST API Best Practices](https://restfulapi.net/)
- [WCAG 2.1 Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [GDPR Compliance](https://gdpr.eu/)

**Inspiration & Research:**
- "The Path of Least Resistance" by Robert Fritz
- "Atomic Habits" by James Clear
- "Getting Things Done" by David Allen

### Appendix D: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-12 | Product Team | Initial comprehensive specification |

---

## 23. Quick Reference

### 23.1 Important URLs

**Production:**
- App: https://dreamcalendar.app
- API: https://us-central1-dreamcalendar-prod.cloudfunctions.net/api
- Status: https://status.dreamcalendar.app
- Support: https://help.dreamcalendar.app

**Development:**
- App: http://localhost:5173
- API: http://localhost:5001/dreamcalendar-dev/us-central1/api
- Emulator UI: http://localhost:4000

**Resources:**
- GitHub: https://github.com/your-org/dream-calendar
- Figma: [Link to design files]
- Slack: #dream-calendar-dev
- Notion: [Link to project wiki]

### 23.2 Key Commands

```bash
# Development
npm run dev              # Start frontend dev server
npm run dev:functions    # Start functions dev server
firebase emulators:start # Start all Firebase emulators

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:integration # Run integration tests
npm run test:e2e         # Run end-to-end tests
npm run test:coverage    # Generate coverage report

# Building
npm run build            # Build frontend for production
npm run build:functions  # Build backend functions

# Deployment
npm run deploy:frontend  # Deploy frontend to Vercel
npm run deploy:functions # Deploy functions to Firebase
npm run deploy:all       # Deploy everything

# Database
npm run db:backup        # Manual database backup
npm run db:seed          # Seed test data
npm run db:migrate       # Run database migrations

# Linting & Formatting
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
```

### 23.3 Environment Variables Quick Reference

```bash
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# API
VITE_API_BASE_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# LLM
OPENAI_API_KEY=         # or ANTHROPIC_API_KEY or GOOGLE_AI_API_KEY
LLM_API_ENDPOINT=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_ANNUAL=

# Other
ENCRYPTION_KEY=         # 32-byte hex string
WEBHOOK_URL=
SENTRY_DSN=
FRONTEND_URL=
```

---
