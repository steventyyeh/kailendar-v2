# Kailendar API Documentation

**Base URL**: `https://kailendar-v2-acr6d7mw4-steventyyehs-projects.vercel.app`
**Local Dev**: `http://localhost:3000`

All API endpoints require authentication via NextAuth session cookies.

---

## Authentication

### Session Validation
All endpoints check for valid session using `auth()` from NextAuth.

**Headers Required**: Session cookie (automatically handled by browser)

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You must be signed in"
  }
}
```

---

## User Endpoints

### GET /api/user/profile
Get current user profile and settings.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "uid": "user@example.com",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "subscription": {
      "status": "free",
      "plan": "free"
    },
    "settings": {
      "emailNotifications": true,
      "weekStartsOn": 0,
      "defaultReminderMinutes": 15
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "lastLoginAt": "2025-01-15T12:00:00.000Z"
  }
}
```

### PATCH /api/user/profile
Update user profile settings.

**Request Body**:
```json
{
  "displayName": "Jane Doe",
  "settings": {
    "emailNotifications": false,
    "weekStartsOn": 1,
    "defaultReminderMinutes": 30
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully",
    "updated": {
      "displayName": "Jane Doe",
      "settings": { ... }
    }
  }
}
```

**Validation Error** (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "No valid fields to update"
  }
}
```

---

## Goals Endpoints

### GET /api/goals
List all goals for the current user.

**Query Parameters**:
- `status` (optional): Filter by status (`active`, `paused`, `completed`)

**Example**: `/api/goals?status=active`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "goal-123",
        "userId": "user@example.com",
        "status": "active",
        "category": "learning",
        "specificity": "Learn React and Next.js",
        "currentState": "beginner",
        "targetState": "Build production apps",
        "deadline": "2025-06-30T00:00:00.000Z",
        "plan": { ... },
        "progress": {
          "completionRate": 45,
          "tasksCompleted": 12,
          "totalTasksScheduled": 27
        },
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  },
  "meta": {
    "timestamp": "2025-01-15T12:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

### POST /api/goals/create
Create a new goal (already implemented).

### GET /api/goals/[id]
Get a specific goal by ID.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "goal-123",
    "userId": "user@example.com",
    "status": "active",
    "category": "learning",
    "specificity": "Learn React",
    "plan": {
      "milestones": [...],
      "objectives": [...],
      "taskTemplate": {...}
    },
    "progress": {...},
    "resources": [...]
  }
}
```

**Not Found** (404):
```json
{
  "success": false,
  "error": {
    "message": "Goal not found"
  }
}
```

**Forbidden** (403):
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized"
  }
}
```

### PATCH /api/goals/[id]
Update goal data (progress, status, etc).

**Request Body**:
```json
{
  "status": "paused",
  "progress": {
    "tasksCompleted": 15,
    "completionRate": 55
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "goal-123",
    ...updated goal data
  }
}
```

### POST /api/goals/[id]/approve
Activate a goal (change status from 'ready' to 'active').

---

## Resources Endpoints

### POST /api/resources/add
Add a custom learning resource.

**Request Body**:
```json
{
  "type": "course",
  "title": "Advanced React Patterns",
  "description": "Learn advanced React patterns and best practices",
  "url": "https://example.com/course",
  "goalId": "goal-123",
  "cost": "$49"
}
```

**Required Fields**: `type`, `title`, `description`

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "resource-456",
    "message": "Resource added successfully"
  }
}
```

**Validation Error** (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required field: title"
  }
}
```

---

## Progress Endpoints

### GET /api/progress/[goalId]
Get detailed progress analytics for a specific goal.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "goalId": "goal-123",
    "goalTitle": "Learn React and Next.js",
    "progress": {
      "completionRate": 45,
      "totalTasksScheduled": 27,
      "tasksCompleted": 12,
      "currentStreak": 5,
      "longestStreak": 12,
      "totalMinutesInvested": 840
    },
    "milestones": [
      {
        "id": "m1",
        "title": "Master React Fundamentals",
        "status": "in_progress",
        "targetDate": "2025-02-15T00:00:00.000Z"
      }
    ],
    "recentLogs": [
      {
        "id": "log-1",
        "date": "2025-01-14T00:00:00.000Z",
        "tasksCompleted": 3,
        "minutesInvested": 90
      }
    ],
    "stats": {
      "hoursInvested": 14.0,
      "completionRate": 45,
      "currentStreak": 5
    },
    "timeline": {
      "createdAt": "2025-01-01T00:00:00.000Z",
      "deadline": "2025-06-30T00:00:00.000Z",
      "daysRemaining": 167,
      "daysElapsed": 14
    }
  }
}
```

---

## Dashboard Endpoint

### GET /api/dashboard
Get aggregated dashboard data (already implemented).

**Response includes**:
- User profile
- Active goals
- Today's tasks
- Upcoming milestones
- Recent resources
- Weekly statistics

---

## Mock Endpoints (For Testing)

### GET /api/mock/user
Returns mock user data with calculated stats from real Firestore data.

### GET /api/mock/resources
Returns resources aggregated from all user goals.

### GET /api/mock/progress
Returns progress analytics across all active goals.

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Access denied to resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

Currently no rate limiting implemented.

**Future**: Implement rate limiting via Vercel Edge Config or Upstash Redis.

---

## Testing APIs

### Using cURL

```bash
# Get user profile (requires authenticated session)
curl -X GET https://kailendar-v2.vercel.app/api/user/profile \
  --cookie "next-auth.session-token=your-session-token"

# Create a goal
curl -X POST https://kailendar-v2.vercel.app/api/goals/create \
  -H "Content-Type: application/json" \
  --cookie "next-auth.session-token=your-session-token" \
  -d '{
    "category": "learning",
    "specificity": "Learn TypeScript",
    "currentState": "beginner",
    "targetState": "Build type-safe applications",
    "deadline": "2025-12-31"
  }'
```

### Using fetch (in browser console)

```javascript
// Get goals
fetch('/api/goals?status=active')
  .then(r => r.json())
  .then(console.log)

// Update user profile
fetch('/api/user/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    settings: { emailNotifications: false }
  })
}).then(r => r.json()).then(console.log)
```

---

## Firestore Collections

### users/{userId}
```typescript
{
  uid: string
  email: string
  displayName: string
  photoURL: string
  subscription: {
    status: 'free' | 'active' | 'canceled'
    plan: 'free' | 'pro_monthly' | 'pro_annual'
  }
  settings: {
    emailNotifications: boolean
    weekStartsOn: number  // 0-6
    defaultReminderMinutes: number
  }
  createdAt: Timestamp
  lastLoginAt: Timestamp
}
```

### goals/{goalId}
```typescript
{
  id: string
  userId: string
  status: 'processing' | 'ready' | 'active' | 'paused' | 'completed'
  category: string
  specificity: string
  plan: GoalPlan
  progress: ProgressStats
  resources: Resource[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### progressLogs/{logId}
```typescript
{
  id: string
  goalId: string
  userId: string
  date: Timestamp
  tasksCompleted: number
  minutesInvested: number
  createdAt: Timestamp
}
```

### resources/{resourceId}
```typescript
{
  id: string
  userId: string
  goalId?: string
  type: 'course' | 'book' | 'video' | 'tool' | 'community'
  title: string
  description: string
  url?: string
  addedBy: 'system' | 'user'
  addedAt: Timestamp
}
```

---

## Next Steps

### Upcoming Features
- [ ] POST /api/llm/plan - Claude API integration for plan generation
- [ ] POST /api/calendar/sync - Google Calendar integration
- [ ] POST /api/stripe/checkout - Stripe billing
- [ ] GET /api/analytics - Advanced analytics
- [ ] WebSocket /api/ws - Real-time updates

---

**Last Updated**: October 27, 2025
**Version**: 1.0.0
**Build Status**: ✅ All endpoints operational
