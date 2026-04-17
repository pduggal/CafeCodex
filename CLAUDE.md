# Café Codex — Project Context for Claude

> This file is the portable brain for this project. Always read this first before making any changes.
> Keep this file updated every time a meaningful change is made.

---

## What This App Is

**Café Codex** is a curated coffee and matcha cafe discovery app for iOS and Android.
Built by Pallavi Duggal (@honestcoffeestop).

The concept: a codex — an ancient handwritten manuscript — is Pallavi's personal record of every great cafe she's visited around the world. Not crowd-sourced noise. Editorial curation from a trusted firsthand voice.

**Tagline:** Your personal record of the world's best cups.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (managed workflow — never eject) |
| Navigation | React Navigation — bottom tabs + native stack |
| State | Context API + AsyncStorage |
| Backend | Supabase (Postgres, Auth, Storage) — not yet wired up |
| Maps | react-native-maps + Google Maps API — placeholder for now |
| Icons | @expo/vector-icons (Ionicons) |

**Node version:** v25.9.0
**Expo SDK:** 54
**React:** 19.1.0
**React Native:** 0.81.5

---

## Folder Structure

```
CafeCodex/
├── App.js                  # Root — NavigationContainer + CafeProvider + bottom tabs
├── app.json                # Expo config (slug: cafecodex, bundle: com.honestcoffeestop.cafecodex)
├── package.json
├── babel.config.js
├── assets/                 # Icon, splash (placeholders for now)
├── constants/
│   └── colors.js           # Full brand palette
├── context/
│   └── CafeContext.js      # Global state: saved, visited, selectedCity — persisted via AsyncStorage
├── data/
│   └── cafes.js            # Seed data: 7 cafes, 3 city guides, 8 vibe tags
├── components/
│   └── CafeCard.js         # Reusable cafe card with photo, badges, vibe tags, heart save
└── screens/
    ├── DiscoverScreen.js    # Search + city filter + vibe chips + filtered cafe list
    ├── CafeDetailScreen.js  # Full detail: curator notes, actions, vibe tags, map placeholder
    ├── MapScreen.js         # Map placeholder (react-native-maps not yet wired)
    ├── CityGuidesScreen.js  # Ranked city guides (Seattle + NYC)
    ├── TrendingScreen.js    # Trending Now + Pallavi's All-Time Picks
    └── MySipsScreen.js      # Stats + Visited + Want to Try lists
```

---

## Brand Palette

| Token | Value |
|---|---|
| background | #1A0F0A |
| primary (gold) | #C9973A |
| cream | #FDF6EC |
| white | #FFFFFF |
| textMuted | #A89080 |
| cardBackground | #2A1A12 |
| cardBorder | #3D2415 |
| tabBarBackground | #120A06 |
| tabBarInactive | #6B4F3A |
| success | #6B9E6B |

---

## Navigation Structure

```
Bottom Tabs
├── Discover (stack)
│   ├── DiscoverHome
│   └── CafeDetail
├── Map (single screen — placeholder)
├── City Guides (stack)
│   ├── CityGuidesHome
│   └── CafeDetail
├── Trending (stack)
│   ├── TrendingHome
│   └── CafeDetail
└── My Sips (stack)
    ├── MySipsHome
    └── CafeDetail
```

---

## Data Shape — Cafe Object

```js
{
  id, name, city, country, neighborhood,
  coordinates: { lat, lng },
  vibe_tags: [],         // see vibe tags below
  curator_pick: boolean,
  curator_rating: 1-5,
  curator_notes: {
    what_to_order,
    what_to_skip,
    best_time,
    content_tips,
  },
  photos: [],
  instagram_handle: string,
  is_active: boolean,
  trending: boolean,
}
```

## Vibe Tags (8)

`viral_aesthetic` | `matcha_specialist` | `specialty_coffee` | `pour_over` | `creative_drinks` | `cozy_quiet` | `hidden_gem` | `collab_worthy`

---

## Seed Data (data/cafes.js)

**Seattle:** Elm Coffee Roasters, Koda Cafe, Broadcast Coffee, Ichi-ni-san
**New York:** Stoneground Matcha, Blue Bottle Coffee (Chelsea), Tandem Coffee (Williamsburg)

**City Guides:** Top 5 Matcha Seattle, Best Pour-Over Seattle, Top Matcha NYC

---

## Current State (last updated: April 2026)

### Working
- All 5 tabs navigate correctly
- Discover: search, city filter, vibe filter chips, live filtering
- Cafe Detail: curator notes, save/visited toggle, Instagram link
- Trending: trending + all-time picks sections
- City Guides: ranked lists per city
- My Sips: stats row (visited/saved/cities) + lists
- Save + Visited state persists via AsyncStorage

### Placeholder / Not Yet Built
- Map screen: shows placeholder UI, no real map pins yet (react-native-maps needs Google Maps API key)
- Photos: all cafe photo areas show emoji placeholder (no real images)
- Supabase: not connected — all data is local in data/cafes.js
- Auth: no user accounts yet
- Community submissions: not built
- Real assets: icon.png / splash.png are 1px placeholders

### Known Issues / To Fix
- [ ] App not yet tested on real device — fix any runtime errors first
- [ ] react-native-maps removed from dependencies (incompatible with Expo Go) — add back when using dev build
- [ ] Asset files are placeholder 1px PNGs

---

## Rules for Claude (always follow these)

- One task at a time — one file or one feature per response
- Always show full file contents, never partial snippets with "// rest of code here"
- Expo managed workflow only — never eject
- Keep components in /screens and /components
- Use colors from constants/colors.js — never hardcode hex values
- No TypeScript for now — plain JS
- When adding a new screen that navigates to CafeDetail, add it as a stack in App.js

---

## Roadmap

### Phase 1 — MVP (current)
- Fix runtime errors, get running on device
- Wire up real cafe photos
- Add Google Maps API key + real map pins
- Connect Supabase for data

### Phase 2 — Features
- Community submission form
- User auth (Supabase)
- Pro tier (Freemium — $3.99/mo)

### Phase 3 — Growth
- India cities (Bangalore, Mumbai, Delhi)
- Europe cities (London, Paris, Amsterdam)
- Japan (Tokyo, Kyoto)
- Brand collab booking

---

## Launch Cities Plan

1. Seattle / Bellevue (richest data — Pallavi's home base)
2. New York City
3. Los Angeles, Chicago
4. India — Bangalore, Mumbai, Delhi, Hyderabad
5. Europe — London, Paris, Amsterdam, Copenhagen
6. Japan — Tokyo, Kyoto
