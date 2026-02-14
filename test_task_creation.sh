#!/bin/bash

SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZWhnbmNldHB0andlbm53dGlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY5OTAyOCwiZXhwIjoyMDcyMjc1MDI4fQ.1DfihzkRjIoytD47OCWQ6aib0_szoFd5rYsIHDLKJdw"
URL="https://foehgncetptjwennwtif.supabase.co"

# Get Dayana's user ID
USER_ID=$(curl -s "$URL/rest/v1/task_portal_users?username=eq.dayana&select=id" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" | jq -r '.[0].id')

echo "Creating test task for Dayana (ID: $USER_ID)..."

# Create a test task
TOMORROW=$(date -v+1d '+%Y-%m-%dT09:00:00Z' 2>/dev/null || date -d '+1 day' '+%Y-%m-%dT09:00:00Z' 2>/dev/null)

curl -X POST "$URL/rest/v1/task_portal_tasks" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"title\": \"Test Task: Review Morning Schedule\",
    \"description\": \"Check tomorrow's installations and confirm crew assignments\",
    \"instructions\": \"Look at the crew schedule in memory/BC-crew-schedule and verify all materials are ready\",
    \"priority\": \"high\",
    \"status\": \"pending\",
    \"due_date\": \"$TOMORROW\",
    \"category\": \"admin\",
    \"source\": \"api\",
    \"source_id\": \"test-task-001\"
  }" | jq '.'

echo ""
echo "Task created! View at: https://donna-task-portal.netlify.app/dayana"

