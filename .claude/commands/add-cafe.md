# Add a cafe to CafeCodex

Add a new cafe to the Supabase database. Prompt the user for each field, then insert.

## Required fields (ask for all)
- `name` — cafe name
- `city` — city name
- `country` — country name
- `drink` — "coffee" or "matcha"

## Optional fields (ask for these too, allow blank)
- `neighborhood`
- `photo_url`
- `vibe_tags` — array from: viral_aesthetic, matcha_specialist, specialty_coffee, pour_over, creative_drinks, cozy_quiet, hidden_gem, collab_worthy
- `curator_pick` — boolean (default false)
- `curator_rating` — 1-5
- `curator_notes` — JSON: { what_to_order, best_time, content_tips }
- `must_try` — JSON: { drink, note }
- `instagram_handle`
- `is_active` — boolean (default true)
- `trending` — boolean (default false)
- `press_mention` — string

## Steps
1. Ask the user for the cafe details (can be a single message or interactive)
2. Show a summary of what will be inserted and ask for confirmation
3. Insert into Supabase using the supabase client from `lib/supabase.js`
4. Do NOT use `.select()` on the insert (RLS will block it)
5. Check the response status is 201
6. Report success with the cafe name and city

## Supabase connection
Use the client from `lib/supabase.js` — the anon key and URL are already configured there.
```js
const { supabase } = require('../lib/supabase');
// Or for a standalone Node script, read the URL and key from lib/supabase.js
```

## Important
- Table name is `cafes`
- `vibe_tags` is a Postgres array, pass as JS array
- `curator_notes` and `must_try` are JSONB columns
- Do NOT use `.select()` after insert
