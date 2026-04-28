# CafeCodex Project Status

Show a quick dashboard of the project's current state.

## Run these checks (all in parallel where possible)

1. **Git status**: `git status` — uncommitted changes, current branch
2. **Unpushed commits**: `git log origin/main..HEAD --oneline` — commits not yet pushed
3. **Test results**: `npm test` from `/Users/pduggal/Desktop/CafeCodex-main` — pass/fail count
4. **Cafe count**: Query Supabase for total active cafes and breakdown by country

## Supabase query for cafe count
```js
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://slwymfjwjhklgbijgixc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd3ltZmp3amhrbGdiaWpnaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTQ1MzUsImV4cCI6MjA5MjI5MDUzNX0.uluPL86awSIie7Hu70P72v3qi4rCIucKr2y4HhYwnOQ'
);
// Get counts by country
const { data } = await sb.from('cafes').select('country, city');
```

## Output format
Report as a clean summary:
```
## CafeCodex Status

**Branch:** main (clean / X files modified)
**Unpushed:** 0 commits (or list them)
**Tests:** 57/57 passing
**Cafes:** 362 active across 36 cities, 6 countries
  - USA: 250 (Seattle, NYC, LA, ...)
  - India: 15 (Bangalore, Hyderabad, Delhi, ...)
  - Japan: 30 (Tokyo, Kyoto, Osaka)
  - ...
```
