# CafeCodex Database Check

Query the Supabase database and report on cafes, countries, and nominations.

## What to report

### Cafes
- Total count (active vs inactive)
- Count by country
- Count by city (top 10)
- Count by drink type (coffee vs matcha)
- Curator picks count
- Trending cafes count

### Countries
- List all countries with `visited` status
- Show cities array for each visited country
- Show planned_cities for wishlist countries

### Nominations
- Note: Cannot read nominations (no SELECT RLS policy for anon)
- Just mention this limitation

## Supabase connection
```js
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://slwymfjwjhklgbijgixc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd3ltZmp3amhrbGdiaWpnaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTQ1MzUsImV4cCI6MjA5MjI5MDUzNX0.uluPL86awSIie7Hu70P72v3qi4rCIucKr2y4HhYwnOQ'
);
```

## Queries
```js
// All cafes
const { data: cafes } = await sb.from('cafes').select('*');

// All countries
const { data: countries } = await sb.from('countries').select('*').order('name');
```

## Output format
Present as a clean, scannable report with counts and tables.
