# CafeCodex Project Status

Show a quick dashboard of the project's current state.

## Run these checks (all in parallel where possible)

1. **Git status**: `git status` — uncommitted changes, current branch
2. **Unpushed commits**: `git log origin/main..HEAD --oneline` — commits not yet pushed
3. **Test results**: `npm test` from `/Users/pduggal/Desktop/CafeCodex-main` — pass/fail count
4. **Cafe count**: Query Supabase for total active cafes and breakdown by country

## Supabase query for cafe count
Use the Supabase URL and anon key from `lib/supabase.js` to query cafe counts by country and city.

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
