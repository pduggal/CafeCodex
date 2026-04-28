# Add a city to a country in CafeCodex

Add a new city to an existing country's `cities` array in the Supabase `countries` table, or create a new country entry.

## Steps
1. Ask the user: which city and which country?
2. Query Supabase to check if the country already exists in the `countries` table
3. If the country exists:
   - Fetch its current `cities` array
   - Append the new city (avoid duplicates)
   - Update the row with the new cities array
   - If the country has `visited: false`, ask if it should be set to `true` (meaning Pallavi has now explored it)
4. If the country does NOT exist:
   - Ask for: flag emoji, aliases (common search terms), and whether it's visited
   - Insert a new row with the city in the `cities` array
5. Confirm success

## Supabase connection
```js
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://slwymfjwjhklgbijgixc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd3ltZmp3amhrbGdiaWpnaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTQ1MzUsImV4cCI6MjA5MjI5MDUzNX0.uluPL86awSIie7Hu70P72v3qi4rCIucKr2y4HhYwnOQ'
);
```

## Country row shape
```js
{
  name: 'India',
  flag: '🇮🇳',
  visited: true,
  aliases: ['india', 'indian', 'bangalore', ...],
  cities: ['Delhi', 'Gurgaon', 'Bangalore', ...],
  planned_cities: [],
  message: null  // shown when visited=false, e.g. "Seoul's café scene is..."
}
```

## Important
- `cities` is a Postgres text array
- `aliases` should include lowercase city names, country name variants, and common abbreviations
- When adding a city, also add it as an alias (lowercase) so location search finds it
