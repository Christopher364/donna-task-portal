# Donna Task Portal

Personal task management portal for Donna AI's team members.

## Features

- Individual task boards for each team member
- Task prioritization (urgent, high, medium, low)
- Status tracking (pending, in progress, blocked, done)
- Mobile-responsive design
- Real-time updates via Supabase

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Supabase (PostgreSQL + REST API)
- React Router v6
- Netlify (hosting)

## Team Members

- `/brittany` - Brittani Hernandez (Sales)
- `/alison` - Alison (VP)
- `/chris` - Chris (Founder)
- `/dayana` - Dayana (Operations)
- `/naldo` - Naldo (Contractor)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Deployed to: https://donnascott.ai

Netlify auto-deploys from the `main` branch.

## Environment Variables

Required in Netlify:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

## API Integration

Donna can create and manage tasks via Supabase service role key:

```javascript
const { data, error } = await supabase
  .from('task_portal_tasks')
  .insert({
    user_id: '<user-uuid>',
    title: 'Task title',
    description: 'Description',
    priority: 'high',
    due_date: '2026-02-14T09:00:00Z',
    category: 'admin'
  })
```

## Database Schema

- `task_portal_users` - User profiles
- `task_portal_tasks` - Tasks with priority, status, due dates
- `task_portal_followups` - Follow-up history

See `migrations/001_create_tables.sql` for full schema.
