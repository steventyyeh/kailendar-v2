# Goal Deletion UI Documentation

## Overview

The Goal Deletion UI provides a user-friendly way to delete goals directly from the dashboard, with proper confirmation and feedback.

## Features

### 1. **Dropdown Menu on Goal Cards**
- Three-dot menu button in the top-right corner of each goal card
- Appears on hover with smooth transitions
- Non-intrusive design that doesn't interfere with goal card clicking

### 2. **Confirmation Dialog**
- Native browser confirm dialog for simplicity and reliability
- Clear warning message:
  ```
  Delete goal "Your Goal Name"?

  This will also remove all associated tasks from your calendar.

  This action cannot be undone.
  ```
- User must explicitly confirm before deletion proceeds

### 3. **Toast Notifications**
- Success toast: Shows number of tasks and calendar events deleted
- Error toast: Shows specific error message if deletion fails
- Auto-dismisses after 3 seconds
- Can be manually dismissed by clicking X button
- Positioned at bottom-right corner

### 4. **Loading States**
- "Deleting..." text shown during deletion
- Menu button disabled during deletion
- Delete button disabled during deletion
- Prevents accidental double-clicks

### 5. **Automatic Refresh**
- Dashboard automatically refreshes after successful deletion
- Shows updated goal list without full page reload
- 1-second delay to show success toast before refresh

## User Flow

```
1. User hovers over goal card
   ↓
2. User clicks three-dot menu button
   ↓
3. Dropdown menu appears with options:
   - View Details
   - Delete Goal (red text)
   ↓
4. User clicks "Delete Goal"
   ↓
5. Confirmation dialog appears
   ↓
6. User confirms deletion
   ↓
7. DELETE API request sent to /api/goals/[id]
   ↓
8. Loading state shown ("Deleting...")
   ↓
9. Success/Error toast appears
   ↓
10. Dashboard refreshes (success only)
```

## Component Structure

### GoalCard Component (`/components/ui/GoalCard.tsx`)

**Props:**
```typescript
interface GoalCardProps {
  goal: Goal           // Goal data to display
  onDelete?: () => void // Optional callback to refresh parent
}
```

**State:**
```typescript
const [isDeleting, setIsDeleting] = useState(false)      // Deletion in progress
const [showMenu, setShowMenu] = useState(false)          // Menu visibility
const [toast, setToast] = useState<ToastProps | null>(null) // Toast notification
```

**Key Functions:**

1. **handleMenuClick** - Opens/closes dropdown menu
   - Prevents event propagation
   - Toggles menu visibility

2. **handleDelete** - Executes deletion
   - Shows confirmation dialog
   - Sends DELETE request
   - Shows toast notification
   - Triggers parent refresh
   - Handles errors gracefully

### Toast Component (`/components/ui/Toast.tsx`)

**Props:**
```typescript
interface ToastProps {
  message: string                      // Toast message
  type?: 'success' | 'error' | 'info' // Toast type (default: success)
  duration?: number                    // Auto-dismiss duration (default: 3000ms)
  onClose: () => void                 // Callback when toast closes
}
```

**Features:**
- Auto-dismiss after specified duration
- Manual dismiss via X button
- Smooth fade-in/fade-out animations
- Color-coded by type (green/red/blue)
- Icon indicators (✓/✕/ℹ)

## UI Components

### Dropdown Menu
```tsx
<div className="absolute right-6 top-16 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
  <Link href={`/goals/${goal.id}`}>View Details</Link>
  <button onClick={handleDelete}>Delete Goal</button>
</div>
```

### Menu Button (Three Dots)
```tsx
<button onClick={handleMenuClick} className="p-1 hover:bg-gray-100 rounded-md">
  <svg><!-- Three vertical dots icon --></svg>
</button>
```

### Toast Notification
```tsx
<Toast
  message="Goal deleted successfully! 15 tasks and 12 calendar events removed."
  type="success"
  onClose={() => setToast(null)}
/>
```

## Integration with Dashboard

The dashboard page passes the `fetchDashboard` function as the `onDelete` callback:

```tsx
<GoalCard
  key={goal.id}
  goal={goal}
  onDelete={fetchDashboard} // Refresh dashboard after deletion
/>
```

This ensures the goal list updates immediately after deletion without requiring a full page reload.

## API Integration

### Request
```typescript
const response = await fetch(`/api/goals/${goal.id}`, {
  method: 'DELETE',
})
```

### Response (Success)
```json
{
  "success": true,
  "deletedGoalId": "abc123",
  "deletedTasks": 15,
  "deletedCalendarEvents": 12
}
```

### Response (Error)
```json
{
  "success": false,
  "error": {
    "message": "Failed to delete goal",
    "details": "Specific error details"
  }
}
```

## Error Handling

### Client-Side Errors
- Network failures
- API errors
- Invalid responses

**Handling:**
- Shows error toast with specific message
- Keeps UI in deletable state (re-enables buttons)
- Logs error to console for debugging

### Server-Side Errors
- Handled by API endpoint
- Returns structured error response
- See `GOAL_DELETION_API.md` for details

## Styling

### Theme
- Follows Tailwind CSS utility classes
- Consistent with existing dashboard design
- Red color for delete actions (warning)
- Gray for neutral actions

### Responsive
- Works on mobile and desktop
- Menu positioned appropriately on all screen sizes
- Toast always visible in bottom-right corner

### Accessibility
- Disabled state prevents interaction during deletion
- Title attributes for icon buttons
- Color-blind friendly (uses text + icons)
- Keyboard accessible (native confirm dialog)

## Testing Checklist

- [x] Menu button appears on goal card
- [x] Menu opens/closes correctly
- [x] Confirmation dialog shows before deletion
- [x] Deletion can be canceled
- [x] DELETE API called with correct goal ID
- [x] Success toast shows with correct counts
- [x] Error toast shows on failure
- [x] Dashboard refreshes after successful deletion
- [x] Goal disappears from dashboard
- [x] Loading states prevent double-clicks
- [x] Works with multiple goals on dashboard
- [x] Graceful handling of API errors

## Future Enhancements

1. **Undo Functionality**
   - Keep deleted goals for 30 days
   - "Undo" button in success toast
   - Soft delete with `status: 'deleted'`

2. **Batch Deletion**
   - Checkbox to select multiple goals
   - "Delete Selected" button
   - Bulk delete API endpoint

3. **Confirmation Modal**
   - Replace native confirm with custom modal
   - Show preview of what will be deleted
   - More styling options

4. **Archive Instead of Delete**
   - "Archive Goal" option
   - Archived goals section
   - Restore archived goals

5. **Animation**
   - Fade-out animation when goal removed
   - Slide-in for remaining goals
   - Using Framer Motion

## Related Files

- `/components/ui/GoalCard.tsx` - Goal card with delete functionality
- `/components/ui/Toast.tsx` - Toast notification component
- `/app/(dashboard)/dashboard/page.tsx` - Dashboard with goal cards
- `/app/api/goals/[id]/route.ts` - DELETE endpoint
- `GOAL_DELETION_API.md` - Backend API documentation

## Status

✅ **Complete** - Full deletion UI implemented
✅ **Tested** - Build passes, no errors
✅ **Integrated** - Works with existing dashboard
✅ **Documented** - Full documentation provided
🚀 **Ready for Production** - Can be deployed immediately
