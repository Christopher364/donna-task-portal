# Donna API Integration Guide

## Overview

The Donna Task Portal is now live at:
- **Production URL:** https://donna-task-portal.netlify.app
- **Custom Domain:** (pending DNS configuration at donnascott.ai)

## Quick Start - Creating Tasks

Use the Supabase service role key to create tasks via REST API:

```bash
SERVICE_KEY="<service-role-key-from-memory/supabase-credentials.md>"
URL="https://foehgncetptjwennwtif.supabase.co"
```

### Get User IDs

```bash
curl "$URL/rest/v1/task_portal_users?select=id,username,display_name" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY"
```

**Current Users:**
- `brittany` → Brittani Hernandez (Sales) → `a255b7b0-dcf6-44a1-8196-a45feacc8861`
- `alison` → Alison (VP) → `d0cb3297-279f-4cff-9ec3-65d11c298d24`
- `chris` → Chris (Founder) → `454530d4-910f-4a9a-b1bb-c396833c65a0`
- `dayana` → Dayana (Operations) → `915eced7-3ea9-4485-a9b9-1ff3cc150bac`
- `naldo` → Naldo (Contractor) → `173761a0-b884-43a8-a630-6ddbe9d87fac`

### Create a Task

```bash
curl -X POST "$URL/rest/v1/task_portal_tasks" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "user_id": "915eced7-3ea9-4485-a9b9-1ff3cc150bac",
    "title": "Review morning schedule",
    "description": "Check installations and crew assignments",
    "instructions": "Look at BC-crew-schedule in memory",
    "priority": "high",
    "status": "pending",
    "due_date": "2026-02-14T09:00:00Z",
    "category": "admin",
    "source": "api"
  }'
```

### Priority Levels
- `urgent` → Red badge (🔴)
- `high` → Orange badge (🟠)
- `medium` → Blue badge (🔵)
- `low` → Gray badge (⚪)

### Status Values
- `pending` → Task not started
- `in_progress` → User clicked "Start Working"
- `blocked` → User clicked "Need Help"
- `done` → Task completed
- `cancelled` → Task cancelled by Donna

### Categories
Use for filtering/organization:
- `sales` - Sales tasks
- `admin` - Administrative tasks
- `repair` - Repair/contractor tasks
- `follow_up` - Follow-up reminders
- Custom categories as needed

## JavaScript Integration

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://foehgncetptjwennwtif.supabase.co',
  process.env.SUPABASE_SERVICE_KEY // Service role key
)

// Create a task
async function createTask(username, taskData) {
  // Get user
  const { data: user } = await supabase
    .from('task_portal_users')
    .select('id')
    .eq('username', username)
    .single()

  // Create task
  const { data: task, error } = await supabase
    .from('task_portal_tasks')
    .insert({
      user_id: user.id,
      ...taskData,
      source: 'api'
    })
    .select()
    .single()

  return task
}

// Example usage
await createTask('dayana', {
  title: 'Check crew schedule',
  description: 'Verify tomorrow installations',
  priority: 'high',
  due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  category: 'admin'
})
```

## Viewing Tasks

Each user has their own URL:
- https://donna-task-portal.netlify.app/brittany
- https://donna-task-portal.netlify.app/alison
- https://donna-task-portal.netlify.app/chris
- https://donna-task-portal.netlify.app/dayana
- https://donna-task-portal.netlify.app/naldo

Share these links via WhatsApp when creating tasks!

## Querying Tasks

### Get all pending tasks
```bash
curl "$URL/rest/v1/task_portal_tasks?status=eq.pending&order=due_date.asc" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY"
```

### Get overdue tasks
```bash
curl "$URL/rest/v1/task_portal_tasks?status=eq.pending&due_date=lt.$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY"
```

### Get tasks for specific user
```bash
curl "$URL/rest/v1/task_portal_tasks?user_id=eq.915eced7-3ea9-4485-a9b9-1ff3cc150bac" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY"
```

## Updating Tasks

### Mark task complete (from Donna's side)
```bash
curl -X PATCH "$URL/rest/v1/task_portal_tasks?id=eq.<task-id>" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "done",
    "completed_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "completed_by": "donna"
  }'
```

### Record a follow-up
```bash
curl -X POST "$URL/rest/v1/task_portal_followups" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "<task-id>",
    "user_id": "<user-id>",
    "follow_up_type": "whatsapp",
    "message_content": "Hey, just checking on that task..."
  }'

# Update task follow-up tracking
curl -X PATCH "$URL/rest/v1/task_portal_tasks?id=eq.<task-id>" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "follow_up_count": <current+1>,
    "last_follow_up_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

## Follow-Up Strategy

Based on user notification preferences:

**Minimal (chris):**
- Max 1 follow-up
- Wait 48+ hours before follow-up

**Normal (brittany, alison, dayana):**
- Up to 3 follow-ups
- Wait 24 hours between follow-ups

**Micromanaged (naldo):**
- Unlimited follow-ups
- Can follow up every 12-24 hours
- More detailed instructions

## Security Notes

⚠️ **CRITICAL:** Never commit the service role key to git!
- Store in environment variables
- Reference from `memory/supabase-credentials.md`
- Only use service role key in secure backend/Donna environment
- Frontend uses anon key (safe to expose)

## Testing

Run the test script:
```bash
cd /Users/dayanalanza/.openclaw/workspace/donna-task-portal
./test_task_creation.sh
```

This creates a test task for Dayana and returns the URL to view it.

## DNS Configuration (To Do)

To set up donnascott.ai:

1. In Netlify dashboard for `donna-task-portal`:
   - Settings → Domain management → Add custom domain
   - Enter: `donnascott.ai`

2. Configure DNS records (wherever donnascott.ai is hosted):
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify load balancer)

   Type: CNAME
   Name: www
   Value: donna-task-portal.netlify.app
   ```

3. Wait for DNS propagation (up to 24 hours)
4. Netlify will auto-provision SSL certificate

## Support

- **GitHub Repo:** https://github.com/Christopher364/donna-task-portal
- **Live Site:** https://donna-task-portal.netlify.app
- **Admin:** https://app.netlify.com/projects/donna-task-portal
- **Database:** Supabase project `foehgncetptjwennwtif`
