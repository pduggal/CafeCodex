# Cafe Codex — Project Context

> This file is the single source of truth for this project. Read this first before making any changes.
> Keep this file updated every time a meaningful change is made.
> Last updated: July 11, 2026

---

## Quick Start (Local Development)

```bash
git clone https://github.com/pduggal/CafeCodex.git
cd CafeCodex
npm install
```

### Create `.env` file

The `.env` file is gitignored. Create it at the project root:

```
# Telegram bot for nomination notifications (ask Pallavi for the token)
EXPO_PUBLIC_TELEGRAM_BOT_TOKEN=<ask-pallavi>
EXPO_PUBLIC_TELEGRAM_CHAT_ID=<ask-pallavi>

# Supabase service role key — only needed for scripts/, not for the app
# SUPABASE_SERVICE_KEY=<ask-pallavi>
```

The Supabase **anon key** is in `lib/supabase.js` — this is intentionally public (RLS controls access).

The Telegram env vars are optional for local dev. Without them, nominations save to Supabase but skip the Telegram notification.

### Run the app

```bash
npx expo start --clear
```

- Scan QR code with **Expo Go** on your phone (iOS or Android)
- Press `w` for web version in browser
- Press `i` for iOS Simulator / `a` for Android Emulator

### Run tests

```bash
npm test              # 174 tests across 18 suites — all must pass
npm run test:watch    # Watch mode for development
npm run lint          # ESLint check
```

### Test account for the app

```
Email: cafecodex.tester1@gmail.com
Password: testpass123
```

---

## What This App Is

**Cafe Codex** is a curated coffee and matcha cafe discovery app for iOS and Android + a webapp.
Built by Pallavi Duggal (@honestcoffeestop).

The concept: a codex — an ancient handwritten manuscript — is Pallavi's personal record of every great cafe she's visited around the world. Not crowd-sourced noise. Editorial curation from a trusted firsthand voice.

**Tagline:** Your personal record of the world's best cups.

---

## Release Status

- **iOS**: Live on App Store. Build 1.0.0 (3). Apple ID 6778603314.
- **Android**: Production release in review on Google Play. Build 1.0.0 (7). Bundle ID: com.honestcoffeestop.cafecodex.
- **Webapp**: Live at https://pduggal.github.io/CafeCodex/
- **Support page**: https://pduggal.github.io/CafeCodex/support.html
- **Privacy policy**: https://pduggal.github.io/CafeCodex/privacy.html

### Building for stores

```bash
# iOS
eas build --platform ios --profile production --non-interactive
eas submit --platform ios --latest

# Android
eas build --platform android --profile production --non-interactive
# Then upload .aab to Google Play Console manually
```

EAS config is in `eas.json`. Expo project ID and credentials are managed via `expo.dev`.

---

## Tech Stack

### React Native App
| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 + Expo SDK 54 (managed workflow — never eject) |
| Navigation | React Navigation — bottom tabs + native stack |
| Gestures | react-native-gesture-handler + react-native-reanimated (native UI thread) |
| State | Context API + AsyncStorage (with Supabase cache fallback) |
| Location | expo-location (foreground permission, one-shot GPS) |
| Backend | Supabase (Postgres, Auth, Storage) |
| Icons | @expo/vector-icons (Ionicons) |
| React | 19.1.0 |

### Webapp
| Layer | Technology |
|---|---|
| Framework | Single-file HTML/CSS/JS (index.html) |
| Hosting | GitHub Pages (gh-pages branch) |
| Backend | Supabase (same instance as RN app) |
| Analytics | GoatCounter (cafecodex.goatcounter.com) |
| Nominations | Web3Forms email (browser-only) |

---

## Folder Structure

```
CafeCodex/
├── App.js                  # Root — AuthProvider + CafeProvider + auth gate + NavigationContainer
├── app.json                # Expo config (slug: cafecodex, bundle: com.honestcoffeestop.cafecodex)
├── package.json
├── babel.config.js         # Expo preset + reanimated plugin (must be last)
├── eas.json                # EAS Build profiles (development, preview, production)
├── index.html              # Webapp (HTML + CSS + JS all inline, hosted on GitHub Pages)
├── .env                    # Secrets — gitignored, see Quick Start above
├── assets/
│   ├── icon.png            # App icon (golden star on dark brown)
│   ├── splash.png          # Splash screen
│   └── author.jpg          # Pallavi's author photo
├── constants/
│   └── colors.js           # Full brand palette — always import from here, never hardcode hex
├── context/
│   ├── AuthContext.js      # Auth state: session, user, profile, signIn/signUp/signOut/deleteAccount, isAdmin
│   └── CafeContext.js      # Global state: cafes, countries, saved, visited, favorites, userLocation
│                           # Supabase fetch with AsyncStorage cache fallback + GPS location
├── lib/
│   └── supabase.js         # Supabase client init (anon key is public by design)
├── data/
│   ├── cafes.js            # Vibe tag definitions, getVibeLabel(), timeAgo(), photo fallback helpers
│   ├── distance.js         # Haversine distance calc + formatDistance (auto miles/km by country)
│   └── world-countries.js  # 195 countries with flags + major cities (used by NominateScreen)
├── components/
│   ├── CafeCard.js         # Reusable cafe card with photo, badges, vibe tags, distance
│   └── FeedCard.js         # Feed post card (cafe/city/recipe/update types)
├── screens/
│   ├── LoginScreen.js      # Email + password login form
│   ├── SignupScreen.js     # Name, email, phone, password signup with validations
│   ├── FeedScreen.js       # What's New feed — Supabase posts with pull-to-refresh
│   ├── OnboardingScreen.js # 2-step: drink preference + location + vibe selection
│   ├── SwipeScreen.js      # Native gesture swipe cards + list/browse toggle + city filter
│   ├── CafeDetailScreen.js # Full detail: curator notes, must-try, rating, directions
│   ├── MyListScreen.js     # 3 tabs: Want to Go, Been There, Saved
│   ├── AuthorScreen.js     # Author story, photo, stats, World's Best list, sign out + delete account
│   └── NominateScreen.js   # Nomination form + country/city dropdowns + Supabase insert + Telegram
├── __tests__/              # Jest test suite — 174 tests across 18 suites
│   ├── components/         # CafeCard, FeedCard tests
│   ├── context/            # AuthContext, CafeContext tests
│   ├── data/               # getVibeLabel, getCafePhoto, timeAgo, distance tests
│   ├── screens/            # Smoke tests + interaction tests for all screens
│   └── webapp/             # index.html tests
├── .maestro/               # Maestro E2E flow files (9 YAML flows for iOS Simulator)
├── QA_TEST_PLAN.md         # 246 test cases across 3 streams (Android, iOS, Functional)
├── support.html            # App Store support page (deployed to GitHub Pages)
├── privacy.html            # Privacy policy page
└── scripts/
    ├── seed-supabase.js    # Seeds Supabase from inline data
    ├── geocode-cafes.js    # Batch geocode cafes via Nominatim → Supabase coordinates
    └── generate-icon.js    # Generate app icon variants using sharp
```

---

## Navigation Structure

```
Auth Gate (no session → AuthStack, session → Tabs)
├── AuthStack (unauthenticated)
│   ├── Login (LoginScreen)
│   └── Signup (SignupScreen)
└── Bottom Tabs (authenticated)
    ├── Discover (stack)
    │   ├── OnboardingHome (OnboardingScreen)
    │   ├── SwipeHome (SwipeScreen)
    │   └── CafeDetail (CafeDetailScreen)
    ├── Feed (stack)
    │   ├── FeedHome (FeedScreen)
    │   └── CafeDetail (CafeDetailScreen)
    ├── My List (stack)
    │   ├── MyListHome (MyListScreen)
    │   └── CafeDetail (CafeDetailScreen)
    ├── Author (single screen: AuthorScreen)
    └── Recommend (single screen: NominateScreen)
```

---

## Brand Palette

| Token | Value | Usage |
|---|---|---|
| background | #1A0F0A | Dark coffee-brown base |
| primary | #C9973A | Gold accents, active states |
| cream | #FDF6EC | Primary text |
| white | #FFFFFF | Headings |
| textMuted | #A89080 | Secondary text |
| cardBackground | #2A1A12 | Card surfaces |
| cardBorder | #3D2415 | Card borders |
| tabBarBackground | #120A06 | Bottom nav |
| tabBarInactive | #6B4F3A | Inactive tab icons |
| success | #6B9E6B | "Want to Go" actions |

All colors defined in `constants/colors.js`. Import from there — never hardcode hex values.

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
  coordinates: { lat: number, lng: number } | null,
}
```

### Vibe Tags (8)

`viral_aesthetic` | `matcha_specialist` | `specialty_coffee` | `pour_over` | `creative_drinks` | `cozy_quiet` | `hidden_gem` | `collab_worthy`

---

## Supabase

**Project ref:** `slwymfjwjhklgbijgixc`
**Anon key:** public (in `lib/supabase.js`) — safe by design, RLS controls access

### Tables
| Table | RLS | Access |
|---|---|---|
| `cafes` | SELECT only | Anon: read all cafes |
| `countries` | SELECT only | Anon: read country list (visited, aliases, cities) |
| `nominations` | INSERT only (no SELECT) | Anon + Authenticated: insert nominations, cannot read back |
| `profiles` | SELECT/INSERT/UPDATE/DELETE own row | Authenticated: read/write/delete own profile only |
| `posts` | SELECT active only | Anon: read active feed posts |

### Profiles table shape
```js
{ id: uuid (FK → auth.users), name: text, phone: text, role: 'user'|'admin', created_at: timestamptz }
```

### Key RLS gotcha
The `nominations` table has an INSERT policy but NO SELECT policy. This means:
- `supabase.from('nominations').insert({...})` → works (returns 201)
- `supabase.from('nominations').insert({...}).select()` → **fails with 401** (RLS blocks RETURNING *)
- Never add `.select()` to nomination inserts

### Account deletion
There is a Supabase RPC function `delete_own_account()` (SECURITY DEFINER) that deletes the user from `auth.users`. The app calls it from `AuthContext.deleteAccount()` after first deleting the profile row.

---

## Key Features & Implementation Notes

### Authentication
- Supabase Auth with email/password (no email verification — auto login on signup)
- `AuthContext.js` manages session state, provides `signIn`, `signUp`, `signOut`, `deleteAccount`, `isAdmin`
- Auth gate in `App.js`: no session → LoginScreen/SignupScreen, session → Tab.Navigator
- Account deletion: AuthorScreen has Delete Account button → confirms via Alert → deletes profile + auth user → signs out
- Admin role set manually in Supabase SQL: `UPDATE profiles SET role = 'admin' WHERE id = '<user-id>'`

### Swipe Cards (SwipeScreen)
- Native gesture handling: Gesture.Race(tap, pan) for simultaneous tap-to-detail and swipe-to-save
- Stable card order between swipes (shuffle separated from filter)
- Deferred translateX reset to prevent card flash on swipe
- List/browse view toggle with search by name, city, neighborhood

### Distance Feature
- expo-location for foreground GPS permission (one-shot, no tracking)
- Haversine formula in `data/distance.js`
- Auto-format: miles for US cafes, km for international
- Graceful degradation: if GPS denied or coordinates null, distance simply doesn't show

### Nominations
- **App**: Supabase insert + Telegram bot notification (env var for token)
- **Webapp**: Supabase insert + Web3Forms email (browser-only, blocked from React Native)
- Country/city searchable dropdowns with auto-complete from 195-country world data
- **Important**: Do NOT add `.select()` to the nominations insert — it will fail

### What's New Feed
- 4 post types: cafe, city, recipe, update
- Supabase `posts` table with JSONB metadata
- Pull-to-refresh, AsyncStorage cache fallback for offline
- Pallavi manages content via Supabase Table Editor

---

## Rules (always follow these)

1. **Expo managed workflow only** — never eject
2. **Plain JavaScript** — no TypeScript
3. **Colors from constants/colors.js** — never hardcode hex values
4. **Screens go in /screens, reusable components in /components**
5. **New screen with CafeDetail navigation** → add it as a stack in App.js
6. **Run `npm test` before pushing** — all 174 tests must pass
7. **Push to BOTH main and gh-pages branches** when deploying
8. **Do NOT touch the webapp (index.html)** unless specifically asked — it's stable and deployed
9. **Nomination inserts must NOT use `.select()`** — Supabase RLS blocks it
10. **Telegram token is in env vars** — never hardcode secrets in source files
11. **Verify nothing was lost** from previous enhancements after making changes

---

## Roadmap

### Phase 1 — MVP (complete)
- ✅ Core app working (swipe, list, detail, save, nominate)
- ✅ Webapp deployed and mobile-responsive
- ✅ Supabase backend with 450+ cafes across 30+ cities
- ✅ Nomination notifications (Telegram for app, Web3Forms for webapp)
- ✅ Analytics (GoatCounter)
- ✅ Native gesture handling (react-native-gesture-handler + reanimated)
- ✅ Location search from live cafe data
- ✅ 174 tests across 18 suites, QA test plan, Maestro E2E flows
- ✅ Nomination form with country/city searchable dropdowns
- ✅ What's New feed with 4 post types
- ✅ App icon (golden star on dark brown)

### Phase 2 — Features (in progress)
- ✅ User auth (Supabase — email/password, login/signup, admin role, account deletion)
- ✅ Distance feature (GPS-based, Haversine, auto miles/km, Nominatim geocoding)
- ✅ iOS App Store launch
- ✅ Google Play production access
- Nomination approval pipeline (Google Places + Instagram validation)
- Pro tier (Freemium — $3.99/mo)

### Phase 3 — Growth
- India cities (Bangalore, Mumbai, Delhi, Hyderabad — partially live)
- Europe cities (London, Paris, Amsterdam)
- Japan (Tokyo, Kyoto — live)
- Brand collab booking

---

## Launch Cities

1. Seattle / Bellevue (richest data — Pallavi's home base)
2. New York City
3. Los Angeles, Chicago
4. India — Bangalore, Mumbai, Delhi, Hyderabad
5. Europe — London, Paris, Amsterdam, Copenhagen
6. Japan — Tokyo, Kyoto
