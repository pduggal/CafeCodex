# Café Codex — Project Context for Claude

> This file is the portable brain for this project. Always read this first before making any changes.
> Keep this file updated every time a meaningful change is made.

---

## What This App Is

**Café Codex** is a curated coffee and matcha cafe discovery app for iOS and Android + a webapp.
Built by Pallavi Duggal (@honestcoffeestop).

The concept: a codex — an ancient handwritten manuscript — is Pallavi's personal record of every great cafe she's visited around the world. Not crowd-sourced noise. Editorial curation from a trusted firsthand voice.

**Tagline:** Your personal record of the world's best cups.

---

## Tech Stack

### React Native App
| Layer | Technology |
|---|---|
| Framework | React Native + Expo (managed workflow — never eject) |
| Navigation | React Navigation — bottom tabs + native stack |
| Gestures | react-native-gesture-handler + react-native-reanimated (native UI thread) |
| State | Context API + AsyncStorage (with Supabase cache fallback) |
| Backend | Supabase (Postgres, Auth, Storage) |
| Icons | @expo/vector-icons (Ionicons) |

### Webapp
| Layer | Technology |
|---|---|
| Framework | Single-file HTML/CSS/JS |
| Hosting | GitHub Pages (gh-pages branch) |
| Backend | Supabase (same instance as RN app) |
| Analytics | GoatCounter (cafecodex.goatcounter.com) |
| Email | Web3Forms (nomination notifications) |

**Node version:** v25.9.0
**Expo SDK:** 54
**React:** 19.1.0
**React Native:** 0.81.5

---

## Folder Structure

```
CafeCodex/
├── index.html              # Webapp (HTML + CSS + JS all inline, hosted on GitHub Pages)
├── App.js                  # RN root — GestureHandlerRootView + NavigationContainer + CafeProvider
├── app.json                # Expo config (slug: cafecodex, bundle: com.honestcoffeestop.cafecodex)
├── package.json
├── babel.config.js         # Expo preset + reanimated plugin (must be last)
├── assets/
│   ├── icon.png            # App icon (placeholder)
│   ├── splash.png          # Splash screen (placeholder)
│   └── author.jpg          # Pallavi's author photo
├── constants/
│   └── colors.js           # Full brand palette
├── context/
│   └── CafeContext.js      # Global state: cafes, countries, saved, visited, favorites
│                           # Supabase fetch with AsyncStorage cache fallback
├── lib/
│   └── supabase.js         # Supabase client init
├── data/
│   └── cafes.js            # Vibe tag definitions, getVibeLabel(), photo fallback helpers
├── components/
│   └── CafeCard.js         # Reusable cafe card with photo, badges, vibe tags
├── screens/
│   ├── OnboardingScreen.js # 2-step: drink preference + location + vibe selection
│   ├── SwipeScreen.js      # Native gesture swipe cards + list/browse toggle + city filter
│   ├── CafeDetailScreen.js # Full detail: curator notes, must-try, rating, actions
│   ├── MyListScreen.js     # 3 tabs: Want to Go, Been There, Saved
│   ├── AuthorScreen.js     # Author story, photo, stats, World's Best list
│   └── NominateScreen.js   # Nomination form + email notification + share
├── __tests__/              # Jest test suite (57 tests across 8 suites)
│   ├── components/         # CafeCard tests
│   ├── context/            # CafeContext tests (save/visit/favorite/cache fallback)
│   ├── data/               # getVibeLabel tests
│   ├── screens/            # SwipeScreen, AuthorScreen, NominateScreen, smoke tests
│   └── webapp/             # index.html tests
└── scripts/
    └── seed-supabase.js    # Seeds Supabase from inline data
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

## Navigation Structure (RN App)

```
Bottom Tabs
├── Discover (stack)
│   ├── OnboardingHome (OnboardingScreen)
│   ├── SwipeHome (SwipeScreen)
│   └── CafeDetail (CafeDetailScreen)
├── My List (stack)
│   ├── MyListHome (MyListScreen)
│   └── CafeDetail (CafeDetailScreen)
├── Author (single screen: AuthorScreen)
└── Recommend (single screen: NominateScreen)
```

---

## Data Shape — Cafe Object

```js
{
  id, name, city, country, neighborhood, drink,
  photo_url: string,
  vibe_tags: [],         // see vibe tags below
  curator_pick: boolean,
  curator_rating: 1-5,
  curator_notes: {
    what_to_order,
    best_time,
    content_tips,
  },
  must_try: { drink, note },
  instagram_handle: string,
  is_active: boolean,
  trending: boolean,
  press_mention: string,
}
```

## Vibe Tags (8)

`viral_aesthetic` | `matcha_specialist` | `specialty_coffee` | `pour_over` | `creative_drinks` | `cozy_quiet` | `hidden_gem` | `collab_worthy`

---

## Current State (last updated: April 2026)

### Webapp (index.html)
- All features working and deployed to GitHub Pages
- Supabase backend with 362+ cafes (inline fallback data)
- Mobile responsive (480px + 375px breakpoints)
- App shell (430px max-width, centered on desktop)
- Apple PWA meta tags
- GoatCounter analytics
- Web3Forms email on nominations
- Author page: real photo, story, stats, collapsible World's Best list
- iOS auto-zoom prevention (16px inputs)
- Android swipe fix (touch-action: none)

### React Native App
- All 4 tabs working: Discover, My List, Author, Recommend
- Supabase live data with AsyncStorage cache fallback
- Native gesture swipe cards (react-native-gesture-handler + reanimated on UI thread)
- Gesture.Race(tap, pan) for simultaneous tap-to-detail and swipe-to-save
- Stable card order between swipes (shuffle separated from filter)
- Deferred translateX reset to prevent card flash on swipe
- List/browse view toggle with search by name, city, neighborhood
- Save/visited/favorites with AsyncStorage persistence (mutually exclusive lists)
- Author page: real photo, story, stats, World's Best 2026 collapsible list
- Nomination form with Supabase insert + Web3Forms email
- City filter, vibe filter, search
- Shared utility: getVibeLabel() in data/cafes.js (used by SwipeScreen, CafeCard, CafeDetailScreen)
- 57 tests across 8 suites (npm test)

### Placeholder / Not Yet Built
- Real assets: icon.png / splash.png are placeholders
- Nomination approval pipeline (validate via Google Places + Instagram, approve from email)
- User auth (Supabase)
- Community submissions review workflow

---

## Rules for Claude (always follow these)

- One task at a time — one file or one feature per response
- Always show full file contents, never partial snippets with "// rest of code here"
- Expo managed workflow only — never eject
- Keep components in /screens and /components
- Use colors from constants/colors.js — never hardcode hex values
- No TypeScript for now — plain JS
- When adding a new screen that navigates to CafeDetail, add it as a stack in App.js
- When pushing changes, always push to BOTH main and gh-pages branches
- After making changes, verify nothing was lost from previous enhancements

---

## Roadmap

### Phase 1 — MVP (current)
- ✅ Core app working (swipe, list, detail, save, nominate)
- ✅ Webapp deployed and mobile-responsive
- ✅ Supabase backend with 362+ cafes
- ✅ Email notifications on nominations
- ✅ Analytics (GoatCounter)
- ✅ Native gesture handling (react-native-gesture-handler + reanimated)
- ✅ 57 tests, comprehensive README/PRD
- [ ] Real app icon and splash screen

### Phase 2 — Features
- Nomination approval pipeline (Google Places + Instagram validation)
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
